import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanityClient';
import * as papa from 'papaparse';
import { notFound } from 'next/navigation';
import { GeopointValue } from 'sanity';
import { parseExcelFile, isExcelFile, type ParsedRow } from '@/lib/excelParser';
import {
  autoDetectMappings,
  getUnmappedColumns,
  validateRequiredMappings,
} from '@/lib/columnMapper';
import { csvDataToSanityBuilding_v2 } from '@/lib/csvDataToSanityBuilding_v2';
import {
  DEFAULT_IMPORT_CONFIG,
  type ImportConfig,
  type ImportResult,
} from '@/lib/importConfig';
import { wait } from '@/lib/wait';
import {
  getRequestId,
  logEvent,
  mapWithConcurrency,
  withRequestId,
} from '@/lib/server/ops';

const ensureDevImportAccess = (request: NextRequest, requestId: string) => {
  if (process.env.NODE_ENV !== 'development') notFound();
  const adminSecret =
    process.env.IMPORT_ADMIN_SECRET || process.env.SANITY_REVALIDATE_SECRET;
  const provided = request.headers.get('x-import-secret');
  if (!adminSecret || provided !== adminSecret) {
    logEvent('warn', 'import-v2.unauthorized', { requestId });
    return withRequestId(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      requestId,
    );
  }
  return null;
};

export async function GET() {
  return NextResponse.json({
    message: 'Import V2 API',
    usage: 'Use POST method with form-data containing "file" and optional "config"',
    example: {
      method: 'POST',
      url: '/api/import-v2',
      body: {
        file: 'File (CSV or Excel)',
        config: 'JSON string with mode: "preview" | "dry-run" | "import"',
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const denial = ensureDevImportAccess(request, requestId);
  if (denial) return denial;

  try {
    // Parse request body
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const configJson = formData.get('config') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 },
      );
    }

    // Parse config
    const config: ImportConfig = configJson
      ? { ...DEFAULT_IMPORT_CONFIG, ...JSON.parse(configJson) }
      : DEFAULT_IMPORT_CONFIG;

    // Read file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;

    // Parse file (CSV or Excel)
    let headers: string[] = [];
    let rows: ParsedRow[] = [];

    if (isExcelFile(filename)) {
      const parsed = parseExcelFile(buffer);
      headers = parsed.headers;
      rows = parsed.rows;
    } else {
      // CSV file
      const text = buffer.toString('utf-8');
      const parsed = papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (parsed.data.length === 0) {
        return NextResponse.json(
          { error: 'CSV file is empty or has no data rows' },
          { status: 400 },
        );
      }

      headers = Object.keys(parsed.data[0]);
      rows = parsed.data.map((row) => {
        const parsedRow: ParsedRow = {};
        for (const key of headers) {
          const value = row[key];
          if (value !== undefined && value !== null && value !== '') {
            parsedRow[key] = value;
          }
        }
        return parsedRow;
      });
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'File has no data rows' },
        { status: 400 },
      );
    }

    // Auto-detect mappings
    const mappings = autoDetectMappings(headers, config.mapping);
    const unmappedColumns = getUnmappedColumns(headers, mappings);

    // Validate required mappings
    const missingRequired = validateRequiredMappings(mappings);
    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required field mappings',
          missingFields: missingRequired,
          mappings,
          unmappedColumns,
        },
        { status: 400 },
      );
    }

    // Preview mode
    if (config.mode === 'preview') {
      const previewRows = rows.slice(0, config.previewRows || 5);
      const sampleRows = previewRows.map((row) => {
        const sample: Record<string, unknown> = {};
        for (const [field, column] of Object.entries(mappings)) {
          sample[field] = row[column];
        }
        return sample;
      });

      return NextResponse.json({
        success: true,
        totalRows: rows.length,
        successful: 0,
        failed: 0,
        errors: [],
        preview: {
          sampleRows,
          mappings,
          unmappedColumns,
        },
      } as ImportResult);
    }

    // Process all rows
    const result: ImportResult = {
      success: true,
      totalRows: rows.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    const validBuildings: Array<{
      building: Omit<SanityBuilding<GeopointValue>, '_id' | 'images'> & {
        _type: 'building';
      };
      rowIndex: number;
    }> = [];

    // Convert rows to buildings
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const { building, errors } = await csvDataToSanityBuilding_v2(
        row,
        mappings,
        unmappedColumns,
        config,
      );
      
      // Small delay to avoid rate limiting on geocoding API
      // Only delay if we're not on the last row
      if (i < rows.length - 1) {
        await wait(200); // 200ms delay between rows (5 requests per second max)
      }

      if (building) {
        validBuildings.push({ building, rowIndex: i + 1 });
      } else {
        result.failed++;
        result.errors.push({
          row: i + 1,
          message: errors.join('; '),
          data: row,
        });
      }
    }

    result.successful = validBuildings.length;

    // Dry-run mode
    if (config.mode === 'dry-run') {
      return NextResponse.json({
        ...result,
        dryRun: {
          validRows: validBuildings.map((vb) => vb.building),
          invalidRows: result.errors.map((err) => ({
            row: err.row,
            errors: [err.message],
          })),
        },
      } as ImportResult);
    }

    // Import mode - create documents
    const createResults = await mapWithConcurrency(
      validBuildings,
      3,
      async ({ building, rowIndex }) => {
        try {
          const doc = await client.create(building);
          return { doc, rowIndex, building, error: null as null | Error };
        } catch (error) {
          return {
            doc: null,
            rowIndex,
            building,
            error: error as Error,
          };
        }
      },
    );

    const created = [];
    for (const createResult of createResults) {
      if (createResult.doc) {
        created.push(createResult.doc);
        continue;
      }
      result.failed++;
      result.successful--;
      result.errors.push({
        row: createResult.rowIndex,
        message: `Failed to create document: ${
          createResult.error?.message || 'Unknown error'
        }`,
        data: createResult.building,
      });
    }

    result.created = created;

    return withRequestId(NextResponse.json(result), requestId);
  } catch (error) {
    logEvent('error', 'import-v2.failed', {
      requestId,
      message: error instanceof Error ? error.message : 'unknown_error',
    });
    return withRequestId(
      NextResponse.json(
      {
        success: false,
        error: 'Import failed',
      },
      { status: 500 },
      ),
      requestId,
    );
  }
}

