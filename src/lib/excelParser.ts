/**
 * Excel file parsing utilities
 * Handles parsing of .xlsx and .xls files (first sheet only)
 */

import * as XLSX from 'xlsx';

export interface ParsedRow {
  [columnName: string]: string | number | undefined;
}

export interface ParsedData {
  headers: string[];
  rows: ParsedRow[];
}

/**
 * Parse Excel file buffer and return data from first sheet
 */
export function parseExcelFile(buffer: Buffer): ParsedData {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  // Get first sheet
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('Excel file has no sheets');
  }

  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON with header row
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1, // Use first row as headers
    defval: '', // Default value for empty cells
    raw: false, // Convert all values to strings
  }) as Array<Array<string | number>>;

  if (jsonData.length === 0) {
    throw new Error('Excel file is empty');
  }

  // First row is headers
  const headers = (jsonData[0] as Array<string | number>).map((h) =>
    String(h).trim(),
  );

  // Remaining rows are data
  const rows: ParsedRow[] = [];
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i] as Array<string | number>;
    const rowData: ParsedRow = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = row[j];
      // Convert to string, but preserve numbers
      if (value !== undefined && value !== null && value !== '') {
        rowData[header] = typeof value === 'number' ? value : String(value);
      }
    }

    // Only add row if it has at least one non-empty value
    if (Object.keys(rowData).length > 0) {
      rows.push(rowData);
    }
  }

  return {
    headers,
    rows,
  };
}

/**
 * Check if a file is an Excel file based on its extension or content
 */
export function isExcelFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop();
  return ext === 'xlsx' || ext === 'xls';
}

