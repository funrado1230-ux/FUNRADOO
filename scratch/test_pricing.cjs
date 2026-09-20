const fs = require('fs');
const path = require('path');

const productsJsPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
let content = fs.readFileSync(productsJsPath, 'utf8');

// Use node VM to load PRODUCTS accurately
const collectionsEndIndex = content.indexOf('export const PRODUCTS = [');
const ageCategoriesStartIndex = content.indexOf('export const AGE_CATEGORIES = [');

const headerCode = content.substring(0, collectionsEndIndex);
const tailCode = content.substring(ageCategoriesStartIndex);
const productsArrayCode = content.substring(collectionsEndIndex, ageCategoriesStartIndex);

const vm = require('vm');
const sandbox = { module: { exports: {} }, exports: {} };
const vmCode = productsArrayCode.replace('export const PRODUCTS =', 'const PRODUCTS =') + '\nmodule.exports = PRODUCTS;';
vm.runInNewContext(vmCode, sandbox);
const products = sandbox.module.exports;

console.log(`Loaded ${products.length} products.`);

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
  // Match suffixes that are camera/file artifact strings:
  // e.g. " - IMG 20260828 WA044", " - WHATSAPP IMAGE 202", " - 11", " - SFD", " - LOGO"
  const match = cleaned.match(/^(.*?)\s+-\s+(IMG[\s\-_0-9]|WA[\d\-_]|WHATSAPP|SFD\b|LOGO\b|CYCLE BG|GEMINI|[A-Z]\b|\d{1,3}\b).*$/i);
  if (match && match[1]) {
    const base = match[1].trim();
    const edition = EDITION_NAMES[index % EDITION_NAMES.length];
    return `${base} - ${edition}`;
  }
  return cleaned;
}

// Category pricing rules
function calculateFlipkartPrices(p, idx) {
  const cat = p.category;
  const name = p.name.toLowerCase();
  const desc = (p.description || '').toLowerCase();
  let price = p.price;
  let originalPrice = p.originalPrice;

  // Modulo factor for realistic slight variations within category bands
  const mod = idx % 5;

  if (cat === 'Baby Walkers') {
    if (name.includes('wooden') || desc.includes('wooden') || name.includes('360')) {
      price = 2999 + mod * 200; // 2999 - 3799
      originalPrice = Math.round((price * 1.55) / 100) * 100 - 1; // ~40% discount
    } else if (name.includes('rocking') || name.includes('2-in-1') || name.includes('musical') || name.includes('tray')) {
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

console.log('Sample updated products:');
console.log(updatedProducts.slice(0, 5).map(p => ({
  name: p.name,
  category: p.category,
  price: p.price,
  mrp: p.originalPrice,
  discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) + '%'
})));

console.log('\nSample kids cars updated:');
console.log(updatedProducts.filter(p => p.category === 'Kids Cars').slice(0, 5).map(p => ({
  name: p.name,
  price: p.price,
  mrp: p.originalPrice,
  discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) + '%'
})));

console.log('\nSample baby walkers updated:');
console.log(updatedProducts.filter(p => p.category === 'Baby Walkers').slice(0, 5).map(p => ({
  name: p.name,
  price: p.price,
  mrp: p.originalPrice,
  discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) + '%'
})));
