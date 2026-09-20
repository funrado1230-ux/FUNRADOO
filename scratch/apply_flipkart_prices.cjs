const fs = require('fs');
const path = require('path');
const vm = require('vm');

const productsJsPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
const content = fs.readFileSync(productsJsPath, 'utf8');

const collectionsEndIndex = content.indexOf('export const PRODUCTS = [');
const ageCategoriesStartIndex = content.indexOf('export const AGE_CATEGORIES = [');

if (collectionsEndIndex === -1 || ageCategoriesStartIndex === -1) {
  console.error("Split points not found!");
  process.exit(1);
}

const headerCode = content.substring(0, collectionsEndIndex);
const tailCode = content.substring(ageCategoriesStartIndex);
const productsArrayCode = content.substring(collectionsEndIndex, ageCategoriesStartIndex);

const sandbox = { module: { exports: {} }, exports: {} };
const vmCode = productsArrayCode.replace('export const PRODUCTS =', 'const PRODUCTS =') + '\nmodule.exports = PRODUCTS;';
vm.runInNewContext(vmCode, sandbox);
const products = sandbox.module.exports;

console.log(`Loaded ${products.length} products to update.`);

const EDITION_NAMES = [
  "Special Edition",
  "Midnight Sport Edition",
  "Pastel Breeze Edition",
  "Trailblazer Edition",
  "Royal Gold Edition",
  "Supercharged Edition",
  "Classic Retro Edition",
  "Turbo Racing Edition",
  "Urban Cruiser Edition",
  "Adventure Pro Edition",
  "Signature Series Edition",
  "Neon Glow Edition",
  "Grand Touring Edition",
  "Desert Safari Edition",
  "Speedway Champion Edition"
];

function cleanTitle(name, index) {
  let cleaned = name;
  const match = cleaned.match(/^(.*?)\s+-\s+(IMG[\s\-_0-9]|WA[\d\-_]|WHATSAPP|SFD\b|LOGO\b|CYCLE BG|GEMINI|[A-Z]\b|\d{1,3}\b).*$/i);
  if (match && match[1]) {
    const base = match[1].trim();
    const edition = EDITION_NAMES[index % EDITION_NAMES.length];
    return `${base} - ${edition}`;
  }
  return cleaned;
}

function calculateFlipkartPrices(p, idx) {
  const cat = p.category;
  const name = p.name.toLowerCase();
  const desc = (p.description || '').toLowerCase();
  let price = p.price;
  let originalPrice = p.originalPrice;

  const mod = idx % 5;

  if (cat === 'Baby Walkers') {
    if (name.includes('wooden') || desc.includes('wooden') || name.includes('360')) {
      price = 2999 + mod * 200; // 2999 - 3799
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1;
    } else if (name.includes('rocking') || name.includes('2-in-1') || name.includes('musical') || name.includes('tray') || name.includes('push')) {
      price = 1999 + mod * 150; // 1999 - 2599
      originalPrice = Math.round((price * 1.6) / 100) * 100 - 1;
    } else {
      price = 1499 + mod * 100; // 1499 - 1899
      originalPrice = Math.round((price * 1.7) / 100) * 100 - 1;
    }
  } else if (cat === 'Scooters') {
    if (name.includes('xiaomi') || desc.includes('electric') || name.includes('folding kick scooter pro')) {
      price = 16999;
      originalPrice = 24999;
    } else if (name.includes('pro glide') || name.includes('commuter') || name.includes('urban')) {
      price = 2899 + mod * 200; // 2899 - 3699
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1;
    } else if (name.includes('lean-to-steer') || name.includes('neon') || name.includes('light-up')) {
      price = 1999 + mod * 150; // 1999 - 2599
      originalPrice = Math.round((price * 1.65) / 100) * 100 - 1;
    } else {
      price = 1399 + mod * 100; // 1399 - 1799
      originalPrice = Math.round((price * 1.75) / 100) * 100 - 1;
    }
  } else if (cat === 'Cycles') {
    if (name.includes('balance') || name.includes('trike') || name.includes('learning')) {
      price = 2199 + mod * 150; // 2199 - 2799
      originalPrice = Math.round((price * 1.6) / 100) * 100 - 1;
    } else if (name.includes('16"') || name.includes('cruiser') || name.includes('sport')) {
      price = 5199 + mod * 250; // 5199 - 6199
      originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
    } else {
      price = 3499 + mod * 200; // 3499 - 4299
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1;
    }
  } else if (cat === 'Vespa') {
    price = 11499 + (mod % 4) * 500; // 11499, 11999, 12499, 12999
    originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
  } else if (cat === 'Kids Cars') {
    if (name.includes('4x4') || name.includes('buggy') || name.includes('jeep') || name.includes('tractor') || name.includes('rolls-royce')) {
      price = 17999 + mod * 800; // 17999 - 21199
      originalPrice = Math.round((price * 1.45) / 100) * 100 - 1;
    } else if (name.includes('ferrari') || name.includes('supercar') || name.includes('lamborghini') || name.includes('coupe') || name.includes('luxury')) {
      price = 13999 + mod * 600; // 13999 - 16399
      originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
    } else {
      price = 9999 + mod * 500; // 9999 - 11999
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1;
    }
  } else if (cat === 'Electric Bikes') {
    if (name.includes('superbike') || name.includes('adventure') || name.includes('ducati') || name.includes('r1250')) {
      price = 10499 + mod * 400; // 10499 - 12099
      originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
    } else if (name.includes('dirt') || name.includes('street') || name.includes('blazer')) {
      price = 8499 + mod * 300; // 8499 - 9699
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1;
    } else {
      price = 6499 + mod * 300; // 6499 - 7699
      originalPrice = Math.round((price * 1.6) / 100) * 100 - 1;
    }
  } else if (cat === 'Hoverboards') {
    if (name.includes('8.5') || name.includes('monster') || name.includes('hummer') || name.includes('all-terrain')) {
      price = 11499 + mod * 300; // 11499 - 12699
      originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
    } else {
      price = 8499 + mod * 300; // 8499 - 9699
      originalPrice = Math.round((price * 1.6) / 100) * 100 - 1;
    }
  } else if (cat === 'Strollers') {
    if (name.includes('veloce') || name.includes('modular') || name.includes('3-in-1')) {
      price = 18999 + mod * 800; // 18999 - 22199
      originalPrice = Math.round((price * 1.45) / 100) * 100 - 1;
    } else if (name.includes('featherlight') || name.includes('cabin') || name.includes('travel') || name.includes('compact')) {
      price = 4499 + mod * 300; // 4499 - 5699
      originalPrice = Math.round((price * 1.65) / 100) * 100 - 1;
    } else {
      price = 7999 + mod * 500; // 7999 - 9999
      originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
    }
  } else if (cat === 'High Chairs') {
    if (name.includes('hot mom') || name.includes('automatic') || name.includes('cradle')) {
      price = 12999 + mod * 500; // 12999 - 14999
      originalPrice = Math.round((price * 1.5) / 100) * 100 - 1;
    } else if (name.includes('6-in-1') || name.includes('recliner')) {
      price = 5999 + mod * 300; // 5999 - 7199
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1;
    } else {
      price = 2999 + mod * 200; // 2999 - 3799
      originalPrice = Math.round((price * 1.65) / 100) * 100 - 1;
    }
  } else if (cat === 'Toys') {
    if (name.includes('jungle gym') || name.includes('wooden')) {
      price = 18999 + mod * 600; // 18999 - 21399
      originalPrice = Math.round((price * 1.45) / 100) * 100 - 1;
    } else if (name.includes('swing') || name.includes('slide') || name.includes('outdoor')) {
      price = 2499 + mod * 200; // 2499 - 3299
      originalPrice = Math.round((price * 1.6) / 100) * 100 - 1;
    } else {
      price = 1499 + mod * 150; // 1499 - 2099
      originalPrice = Math.round((price * 1.7) / 100) * 100 - 1;
    }
  }

  // Ensure price ends in 99 or 49
  let finalPrice = Math.round(price / 50) * 50 - 1;
  if (finalPrice % 100 !== 99 && finalPrice % 100 !== 49) {
    finalPrice = Math.round(finalPrice / 100) * 100 - 1;
  }
  let finalMrp = Math.round(originalPrice / 100) * 100 - 1;
  if (finalMrp <= finalPrice) {
    finalMrp = Math.round((finalPrice * 1.4) / 100) * 100 - 1;
  }

  return { price: finalPrice, originalPrice: finalMrp };
}

const updatedProducts = products.map((p, index) => {
  const cleanName = cleanTitle(p.name, index);
  const { price, originalPrice } = calculateFlipkartPrices(p, index);
  return {
    ...p,
    name: cleanName,
    price,
    originalPrice
  };
});

// Format products back to formatted JS code
function serializeProducts(arr) {
  let out = 'export const PRODUCTS = [\n';
  arr.forEach((item, idx) => {
    out += '  {\n';
    out += `    id: ${JSON.stringify(item.id)},\n`;
    out += `    name: ${JSON.stringify(item.name)},\n`;
    out += `    category: ${JSON.stringify(item.category)},\n`;
    out += `    ageGroup: ${JSON.stringify(item.ageGroup)},\n`;
    out += `    ageTag: ${JSON.stringify(item.ageTag)},\n`;
    out += `    price: ${item.price},\n`;
    out += `    originalPrice: ${item.originalPrice},\n`;
    out += `    rating: ${item.rating},\n`;
    out += `    reviewsCount: ${item.reviewsCount},\n`;
    out += `    isBestSeller: ${item.isBestSeller},\n`;
    out += `    isQuickShip: ${item.isQuickShip},\n`;
    out += `    image: ${JSON.stringify(item.image)},\n`;
    out += `    secondaryImages: ${JSON.stringify(item.secondaryImages || [])},\n`;
    out += `    description: ${JSON.stringify(item.description)},\n`;
    out += `    specs: ${JSON.stringify(item.specs || [], null, 8).replace(/^ {8}/gm, '      ').replace(/\n\s*\]$/, '\n    ]')}\n`;
    out += '  }' + (idx < arr.length - 1 ? ',\n' : '\n');
  });
  out += '];\n\n';
  return out;
}

const newProductsCode = serializeProducts(updatedProducts);
const newFullContent = headerCode + newProductsCode + tailCode;

// Backup first
fs.writeFileSync(productsJsPath + '.bak', content, 'utf8');
// Write new file
fs.writeFileSync(productsJsPath, newFullContent, 'utf8');

console.log('Successfully updated products.js with Flipkart benchmark prices!');
