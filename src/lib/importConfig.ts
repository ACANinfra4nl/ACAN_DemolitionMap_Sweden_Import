/**
 * Configuration types and defaults for CSV/Excel import v2
 */

export interface ColumnMapping {
  // Sanity field name -> CSV column name (exact match)
  [sanityField: string]: string;
}

export interface ImportConfig {
  /** Manual column mapping override (optional) */
  mapping?: ColumnMapping;
  /** Append unmapped columns to description field */
  appendUnmappedToDescription?: boolean;
  /** Separator for additional data in description */
  descriptionSeparator?: string;
  /** Skip empty fields instead of setting empty strings/zeros */
  skipEmptyFields?: boolean;
  /** Import mode: preview, dry-run, or import */
  mode?: 'preview' | 'dry-run' | 'import';
  /** Number of rows to show in preview mode */
  previewRows?: number;
}

export const DEFAULT_IMPORT_CONFIG: Required<ImportConfig> = {
  mapping: {},
  appendUnmappedToDescription: true,
  descriptionSeparator: ' & ',
  skipEmptyFields: true,
  mode: 'import',
  previewRows: 5,
};

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
    data?: Record<string, unknown>;
  }>;
  created?: Array<{ _id: string; [key: string]: unknown }>;
  preview?: {
    sampleRows: Array<Record<string, unknown>>;
    mappings: ColumnMapping;
    unmappedColumns: string[];
  };
  dryRun?: {
    validRows: Array<Record<string, unknown>>;
    invalidRows: Array<{ row: number; errors: string[] }>;
  };
}

