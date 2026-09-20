const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Dell\\Documents\\images';
const destDir = 'c:\\Users\\Dell\\Documents\\kiddigo\\public\\images\\store';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else if (exists) {
    const destFolder = path.dirname(dest);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    // Only copy if file doesn't exist or size differs
    if (!fs.existsSync(dest) || fs.statSync(src).size !== fs.statSync(dest).size) {
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${path.relative(srcDir, src)} -> ${path.relative(destDir, dest)}`);
    }
  }
}

copyRecursiveSync(srcDir, destDir);
console.log('Copy/Sync complete.');
