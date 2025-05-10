const fs = require('fs');
const path = require('path');

const placeholderPattern = /<([A-Z0-9_]+)>/g;
const filesToCheck = [
  '.env',
  'placeholder.env',
  'config/constants.js',
  'config/dotenv.js',
  'package.json',
  'server.js',
];

function checkFile(filePath) {
  const absPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(absPath)) {
    console.warn(`Datei nicht gefunden: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(absPath, 'utf-8');
  const matches = [...content.matchAll(placeholderPattern)];

  if (matches.length > 0) {
    console.log(`\nPlatzhalter in ${filePath}:`);
    matches.forEach(match => console.log(` - ${match[0]}`));
  }
}

console.log('Überprüfung auf verbleibende Platzhalter...\n');
filesToCheck.forEach(checkFile);
console.log('\nFertig!');
