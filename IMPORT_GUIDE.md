# CSV/Excel Import Guide

This guide explains how to import building data from CSV or Excel files into the Demolition Atlas system.

## Prerequisites

- Your data file (CSV or Excel format)
- Column headers in the first row
- Required data: latitude, longitude, category, and state for each building

### Local / development only

`/api/import`, `/api/import-v2`, and bulk delete are **development-only** (`NODE_ENV=development`). Requests must include:

```http
x-import-secret: <IMPORT_ADMIN_SECRET>
```

Set `IMPORT_ADMIN_SECRET` in `.env.local` (fallback: same value as `SANITY_REVALIDATE_SECRET` if unset). Add this header to every `curl` below.

## Supported File Formats

- **CSV files** (.csv) - Comma-separated values
- **Excel files** (.xlsx, .xls) - First sheet will be used automatically

## Required Columns

Your file must include these columns (column names can vary - see "Column Name Matching" below):

1. **Location** - Two columns needed:
   - Latitude (e.g., "lat", "latitude")
   - Longitude (e.g., "lng", "long", "longitude")

2. **Category** - Building category (e.g., "category", "type", "building type")
   - Valid values: residence, office, commercial, community, industry, other

3. **State** - Demolition status (e.g., "state", "status", "condition")
   - Valid values: demolished, threatened, saved

## Optional Columns

These columns are optional but will be imported if present:

- **name** - Building name
- **address** - Street address
- **postcode** - Postal/ZIP code
- **city** - City name
- **blockName** - Neighborhood/area name
- **propertyDesignation** - Property identifier
- **size** - Size in square meters (m²)
- **architect** - Architect name
- **propertyOwner** - Owner name
- **buildYear** - Year of construction
- **demolitionYear** - Year of demolition
- **description** - Building description/story
- **demolitionCause** - Reason for demolition
- **sources** - Source references

## Column Name Matching

The system automatically matches your column names to the correct fields. It recognizes common variations:

- **Location**: "lat"/"latitude", "lng"/"long"/"longitude"
- **Category**: "category", "type", "building type"
- **State**: "state", "status", "condition"
- **Address**: "address", "street", "street address"
- **Postcode**: "postcode", "postal code", "zip"
- And many more...

If a column doesn't match automatically, you can manually map it (see "Manual Column Mapping" below).

## Unmapped Columns

Any columns that don't match known fields will be automatically added to the building description with a separator, so no information is lost.

## Import Modes

### 1. Preview Mode

Preview mode shows you how your data will be mapped before importing:

- Shows first 5 rows of your data
- Displays which columns map to which fields
- Lists any unmapped columns
- **Does not create any documents**

**Use this first** to verify your column mappings are correct.

### 2. Dry-Run Mode

Dry-run mode validates your entire file without creating documents:

- Processes all rows
- Shows which rows are valid and which have errors
- Reports all validation errors
- **Does not create any documents**

**Use this** to check for errors before importing.

### 3. Import Mode

Import mode actually creates the building documents:

- Creates documents for all valid rows
- Skips rows with errors
- Reports success/failure for each row
- **Creates documents in the system**

**Use this** when you're ready to import your data.

## How to Import

### Using cURL (Command Line)

#### 1. Preview Your Data

```bash
curl -X POST http://localhost:3000/api/import-v2 \
  -H "x-import-secret: YOUR_IMPORT_ADMIN_SECRET" \
  -F "file=@your-data.csv" \
  -F 'config={"mode":"preview"}'
```

#### 2. Test Import (Dry-Run)

```bash
curl -X POST http://localhost:3000/api/import-v2 \
  -H "x-import-secret: YOUR_IMPORT_ADMIN_SECRET" \
  -F "file=@your-data.csv" \
  -F 'config={"mode":"dry-run"}'
```

#### 3. Import Data

```bash
curl -X POST http://localhost:3000/api/import-v2 \
  -H "x-import-secret: YOUR_IMPORT_ADMIN_SECRET" \
  -F "file=@your-data.csv" \
  -F 'config={"mode":"import"}'
```

### Manual Column Mapping

If you need to manually map columns, include a mapping in the config:

```bash
curl -X POST http://localhost:3000/api/import-v2 \
  -H "x-import-secret: YOUR_IMPORT_ADMIN_SECRET" \
  -F "file=@your-data.csv" \
  -F 'config={
    "mode":"import",
    "mapping": {
      "location.lat": "Latitude",
      "location.lng": "Longitude",
      "category": "Building Type",
      "state": "Status",
      "name": "Building Name"
    }
  }'
```

### Configuration Options

You can customize the import behavior:

```json
{
  "mode": "import",
  "mapping": {},
  "appendUnmappedToDescription": true,
  "descriptionSeparator": "\n--- Additional Data ---\n",
  "skipEmptyFields": true,
  "previewRows": 5
}
```

- **mode**: "preview" | "dry-run" | "import"
- **mapping**: Manual column mappings (optional)
- **appendUnmappedToDescription**: Add unmapped columns to description (default: true)
- **descriptionSeparator**: Separator text for additional data (default: "\n--- Additional Data ---\n")
- **skipEmptyFields**: Don't set empty values (default: true)
- **previewRows**: Number of rows to show in preview (default: 5)

## Response Format

### Preview Response

```json
{
  "success": true,
  "preview": true,
  "totalRows": 100,
  "sampleRows": [...],
  "mappings": {
    "location.lat": "Latitude",
    "location.lng": "Longitude",
    ...
  },
  "unmappedColumns": ["Extra Column 1", "Extra Column 2"]
}
```

### Dry-Run Response

```json
{
  "success": true,
  "dryRun": true,
  "totalRows": 100,
  "successful": 95,
  "failed": 5,
  "validRows": [...],
  "errors": [
    {
      "row": 10,
      "message": "Missing required location",
      "data": {...}
    }
  ]
}
```

### Import Response

```json
{
  "success": true,
  "totalRows": 100,
  "successful": 95,
  "failed": 5,
  "created": [...],
  "errors": [
    {
      "row": 10,
      "message": "Missing required location",
      "data": {...}
    }
  ]
}
```

## Common Issues

### "Missing required field mappings"

**Problem**: Required columns (latitude, longitude, category, state) are not found or mapped.

**Solution**: 
- Check that your column names match common patterns (see "Column Name Matching")
- Use manual mapping to specify exact column names
- Ensure column names are in the first row

### "Invalid location coordinates"

**Problem**: Latitude or longitude values are not valid numbers.

**Solution**:
- Ensure coordinates are numeric (can use comma or period as decimal separator)
- Check that latitude is between -90 and 90
- Check that longitude is between -180 and 180

### "Missing or invalid category"

**Problem**: Category value doesn't match known categories.

**Solution**:
- Use one of: residence, office, commercial, community, industry, other
- Values are case-insensitive
- Partial matches are accepted (e.g., "residential" matches "residence")

### "Missing or invalid state"

**Problem**: State value doesn't match known states.

**Solution**:
- Use one of: demolished, threatened, saved
- Values are case-insensitive
- Partial matches are accepted

## Tips

1. **Always preview first**: Use preview mode to check your column mappings before importing
2. **Test with dry-run**: Use dry-run mode to validate your entire file before importing
3. **Check errors**: Review error messages to fix data issues
4. **Keep backups**: Keep a copy of your original file
5. **Review imported data**: Check the imported buildings in Sanity Studio after importing

## Example CSV File

```csv
Latitude,Longitude,Category,State,Building Name,Address,City,Build Year
-33.8688,151.2093,office,demolished,Old Office Building,123 Main St,Sydney,1980
-37.8136,144.9631,residence,threatened,Historic House,456 Oak Ave,Melbourne,1920
```

## Example Excel File

Create an Excel file with:
- Headers in row 1
- Data starting from row 2
- Same column structure as CSV example above

## Need Help?

If you encounter issues:
1. Check the error messages in the response
2. Verify your column names match the patterns
3. Use preview mode to see how columns are mapped
4. Use dry-run mode to validate your data
5. Contact technical support if problems persist

