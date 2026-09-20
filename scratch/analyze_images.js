const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Dell\\Documents\\images';
const destDir = 'c:\\Users\\Dell\\Documents\\kiddigo\\public\\images\\store';

function scanDir(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(scanDir(fullPath));
      } else {
        results.push(fullPath);
      }
    });
  } catch (e) {
    console.error("Error reading dir", dir, e.message);
  }
  return results;
}

const categories = fs.readdirSync(srcDir).filter(f => {
  try { return fs.statSync(path.join(srcDir, f)).isDirectory(); } catch(e) { return false; }
});

console.log("=== SOURCE CATEGORY FOLDERS ===");
categories.forEach(cat => {
  const catPath = path.join(srcDir, cat);
  const files = scanDir(catPath);
  console.log(`\nCategory: ${cat} (${files.length} files)`);
  files.forEach(f => {
    const rel = path.relative(srcDir, f);
    console.log(`  ${rel}`);
  });
});
