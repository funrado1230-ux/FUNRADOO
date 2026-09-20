const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\Dell\\Documents\\kiddigo\\src\\data\\products.js', 'utf8');

// We can parse or evaluate PRODUCTS by creating a temporary script or regex
const categoryMatches = content.match(/category:\s*"([^"]+)"/g);
const categoriesInProducts = new Set();
if (categoryMatches) {
  categoryMatches.forEach(m => {
    const cat = m.replace(/category:\s*"/, '').replace(/"/, '');
    categoriesInProducts.add(cat);
  });
}

console.log('Categories currently present in PRODUCTS array:');
console.log(Array.from(categoriesInProducts));
