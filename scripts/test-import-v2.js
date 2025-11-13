const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Read Excel file and show structure
const excelPath = path.join(__dirname, '..', 'test_manual_database', 'Demolition Atlas Australia Content.xlsx');

if (!fs.existsSync(excelPath)) {
  console.error('Excel file not found:', excelPath);
  process.exit(1);
}

console.log('Reading Excel file...');
const workbook = XLSX.readFile(excelPath);
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

// Convert to JSON to see structure
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('\n=== Excel File Structure ===');
console.log('Sheet name:', firstSheetName);
console.log('Total rows:', jsonData.length);
console.log('\nFirst row (headers):');
console.log(jsonData[0]);

console.log('\nFirst 3 data rows:');
for (let i = 1; i < Math.min(4, jsonData.length); i++) {
  console.log(`Row ${i}:`, jsonData[i]);
}

// Test the import API
async function testImport(mode = 'preview') {
  console.log(`\n=== Testing Import API (${mode} mode) ===`);
  
  const formData = new FormData();
  formData.append('file', fs.createReadStream(excelPath));
  formData.append('config', JSON.stringify({ mode }));

  try {
    const response = await fetch('http://localhost:3000/api/import-v2', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Success!');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Error:', result.error);
      if (result.missingFields) {
        console.log('Missing fields:', result.missingFields);
      }
      if (result.mappings) {
        console.log('Detected mappings:', result.mappings);
      }
      if (result.unmappedColumns) {
        console.log('Unmapped columns:', result.unmappedColumns);
      }
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    console.log('\nMake sure the dev server is running: npm run dev');
  }
}

// Run tests
if (require.main === module) {
  const mode = process.argv[2] || 'preview';
  testImport(mode).catch(console.error);
}

module.exports = { testImport };

