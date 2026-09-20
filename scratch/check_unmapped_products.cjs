const fs = require('fs');
const path = require('path');

// Read products.js as string to parse image references
const productsJsContent = fs.readFileSync('c:\\Users\\Dell\\Documents\\kiddigo\\src\\data\\products.js', 'utf8');

// Find all image URLs referenced in products.js
const imageRegex = /\/images\/store\/[^"'\s`]+/g;
const referencedImages = new Set();
let match;
while ((match = imageRegex.exec(productsJsContent)) !== null) {
  referencedImages.add(match[0]);
}

console.log('Total referenced image URLs in products.js:', referencedImages.size);

const storeDir = 'c:\\Users\\Dell\\Documents\\kiddigo\\public\\images\\store';

function scanFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(item => {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(scanFiles(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const allStoreFiles = scanFiles(storeDir);

const unmapped = [];
const mapped = [];

allStoreFiles.forEach(fullPath => {
  const rel = path.relative(storeDir, fullPath).replace(/\\/g, '/');
  // ignore videos if preferred, or include them
  const url = `/images/store/${rel}`;
  if (referencedImages.has(url)) {
    mapped.push(url);
  } else {
    unmapped.push(url);
  }
});

console.log(`\nTotal files in public/images/store: ${allStoreFiles.length}`);
console.log(`Mapped files: ${mapped.length}`);
console.log(`Unmapped files: ${unmapped.length}`);

console.log('\n--- UNMAPPED FILES BY CATEGORY ---');
const unmappedByCat = {};
unmapped.forEach(url => {
  const parts = url.split('/'); // ["", "images", "store", "category", "file"]
  const cat = parts[3] || 'root';
  if (!unmappedByCat[cat]) unmappedByCat[cat] = [];
  unmappedByCat[cat].push(url);
});

Object.keys(unmappedByCat).forEach(cat => {
  console.log(`\nCategory [${cat}] (${unmappedByCat[cat].length} unmapped):`);
  unmappedByCat[cat].forEach(u => console.log('  ' + u));
});
