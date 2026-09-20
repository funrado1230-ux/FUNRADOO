const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Dell\\Documents\\kiddigo\\src\\data\\products.js', 'utf8');

const categoryCount = {};
const regex = /category:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const cat = match[1];
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
}

console.log('Existing product counts per category in src/data/products.js:');
console.log(categoryCount);
