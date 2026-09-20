const fs = require('fs');
const path = require('path');
const vm = require('vm');

const productsJsPath = 'c:\\Users\\Dell\\Documents\\kiddigo\\src\\data\\products.js';
const content = fs.readFileSync(productsJsPath, 'utf8');

// Replace export const with const for vm run
const cjsCode = content.replace(/export const /g, 'const ') + '\nmodule.exports = { PRODUCTS, CATEGORY_COLLECTIONS, AGE_CATEGORIES, PRODUCT_CATEGORIES };';
const sandbox = { module: { exports: {} }, exports: {} };

try {
  vm.runInNewContext(cjsCode, sandbox);
  console.log('✅ products.js syntax is valid!');
} catch (e) {
  console.error('❌ Syntax error in products.js:', e);
  process.exit(1);
}

const { PRODUCTS, CATEGORY_COLLECTIONS } = sandbox.module.exports;
console.log(`Total PRODUCTS: ${PRODUCTS.length}`);

// Check unique IDs
const ids = new Set();
let duplicates = 0;
PRODUCTS.forEach(p => {
  if (ids.has(p.id)) {
    console.error(`Duplicate product ID: ${p.id}`);
    duplicates++;
  }
  ids.add(p.id);
});

if (duplicates === 0) {
  console.log('✅ All product IDs are unique!');
}

// Check physical existence of image files in public directory
const publicDir = 'c:\\Users\\Dell\\Documents\\kiddigo\\public';
let missingImages = 0;

PRODUCTS.forEach(p => {
  if (!p.image) {
    console.error(`Missing main image for product ${p.id}`);
    missingImages++;
    return;
  }
  const fullPath = path.join(publicDir, p.image.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing image file on disk: ${p.image} for product ${p.id}`);
    missingImages++;
  }

  if (Array.isArray(p.secondaryImages)) {
    p.secondaryImages.forEach(secImg => {
      const secFullPath = path.join(publicDir, secImg.replace(/^\//, ''));
      if (!fs.existsSync(secFullPath)) {
        console.error(`Missing secondary image file on disk: ${secImg} for product ${p.id}`);
        missingImages++;
      }
    });
  }
});

if (missingImages === 0) {
  console.log('✅ All referenced product images exist on disk!');
} else {
  console.log(`⚠️ Found ${missingImages} missing image references.`);
}
