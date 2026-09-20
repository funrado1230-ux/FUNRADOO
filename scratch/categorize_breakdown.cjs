const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Dell\\Documents\\images';

function getFiles(dir) {
  let subdirs = fs.readdirSync(dir);
  let files = [];
  subdirs.forEach(file => {
    let full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(getFiles(full));
    } else {
      files.push(full);
    }
  });
  return files;
}

const allFiles = getFiles(srcDir);
const categoryMapping = {
  'bikes': 'Electric Bikes',
  'cars': 'Kids Cars',
  'cycles': 'Cycles',
  'drifter': 'Kids Cars',
  'hoverboard': 'Hoverboards',
  'leg walkers': 'Baby Walkers',
  'scooter': 'Scooters',
  'scraller': 'Strollers',
  'swing': 'Toys',
  'tractors': 'Kids Cars',
  'tricycle': 'Cycles',
  'vespa': 'Vespa',
  'wespa': 'Vespa',
  'walkers': 'Baby Walkers'
};

const categorizedFiles = {};
allFiles.forEach(f => {
  const rel = path.relative(srcDir, f).replace(/\\/g, '/');
  const parts = rel.split('/');
  let folder = parts.length > 1 ? parts[0] : 'root';
  let catName = categoryMapping[folder] || 'Kids Cars';
  if (!categorizedFiles[catName]) categorizedFiles[catName] = [];
  categorizedFiles[catName].push({ rel, full: f, ext: path.extname(f).toLowerCase() });
});

console.log('Summary of files per product category:');
Object.keys(categorizedFiles).forEach(cat => {
  const imgs = categorizedFiles[cat].filter(x => ['.jpg', '.jpeg', '.png', '.webp'].includes(x.ext));
  const vids = categorizedFiles[cat].filter(x => ['.mp4', '.mov'].includes(x.ext));
  console.log(`- ${cat}: ${imgs.length} images, ${vids.length} videos (Total ${categorizedFiles[cat].length})`);
});
