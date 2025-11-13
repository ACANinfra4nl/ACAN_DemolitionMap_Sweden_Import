const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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
if (jsonData[0]) {
  jsonData[0].forEach((header, index) => {
    console.log(`  Column ${index + 1}: "${header}"`);
  });
}

console.log('\nFirst 3 data rows:');
for (let i = 1; i < Math.min(4, jsonData.length); i++) {
  console.log(`\nRow ${i}:`);
  if (jsonData[0] && jsonData[i]) {
    jsonData[0].forEach((header, index) => {
      const value = jsonData[i][index];
      if (value !== undefined && value !== '') {
        console.log(`  ${header}: ${value}`);
      }
    });
  }
}

// Try to detect potential mappings
console.log('\n=== Potential Column Mappings ===');
const headers = jsonData[0] || [];
const locationFields = { lat: null, lng: null };

headers.forEach((header, index) => {
  const lower = String(header).toLowerCase().trim();
  
  if (lower.includes('lat') && (lower.includes('latitude') || lower.length < 10)) {
    locationFields.lat = header;
  } else if ((lower.includes('lng') || lower.includes('long') || lower.includes('lon')) && 
             (lower.includes('longitude') || lower.length < 10)) {
    locationFields.lng = header;
  }
});

console.log('Location fields detected:');
console.log('  Latitude:', locationFields.lat || 'NOT FOUND');
console.log('  Longitude:', locationFields.lng || 'NOT FOUND');

console.log('\nAll column names:');
headers.forEach((header, index) => {
  console.log(`  ${index + 1}. "${header}"`);
});

