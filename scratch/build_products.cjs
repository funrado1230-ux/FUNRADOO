const fs = require('fs');
const path = require('path');

const productsJsPath = 'c:\\Users\\Dell\\Documents\\kiddigo\\src\\data\\products.js';
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

// Extract parts of products.js
const collectionsEndIndex = productsJsContent.indexOf('export const PRODUCTS = [');
const ageCategoriesStartIndex = productsJsContent.indexOf('export const AGE_CATEGORIES = [');

if (collectionsEndIndex === -1 || ageCategoriesStartIndex === -1) {
  console.error("Could not locate split points in products.js");
  process.exit(1);
}

const headerCode = productsJsContent.substring(0, collectionsEndIndex);
const tailCode = productsJsContent.substring(ageCategoriesStartIndex);

// Load existing PRODUCTS array by evaluating in node VM with exports replaced
const productsArrayCode = productsJsContent.substring(collectionsEndIndex, ageCategoriesStartIndex);

const vm = require('vm');
const sandbox = { module: { exports: {} }, exports: {} };
const vmCode = productsArrayCode.replace('export const PRODUCTS =', 'const PRODUCTS =') + '\nmodule.exports = PRODUCTS;';

vm.runInNewContext(vmCode, sandbox);
const existingProducts = sandbox.module.exports;
console.log(`Loaded ${existingProducts.length} existing products.`);

// Map of category folder names to category display names
const folderToCategory = {
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

// Scan public/images/store recursively
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

// Collect all mapped image URLs from existing products
const mappedImageUrls = new Set();
existingProducts.forEach(p => {
  if (p.image) mappedImageUrls.add(p.image);
  if (Array.isArray(p.secondaryImages)) {
    p.secondaryImages.forEach(img => mappedImageUrls.add(img));
  }
});

console.log(`Mapped image URLs in existing products: ${mappedImageUrls.size}`);

// Identify unmapped image files
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const unmappedImages = [];

allStoreFiles.forEach(fullPath => {
  const ext = path.extname(fullPath).toLowerCase();
  if (!imageExtensions.includes(ext)) return; // skip videos / non-images

  const rel = path.relative(storeDir, fullPath).replace(/\\/g, '/');
  const url = `/images/store/${rel}`;

  if (!mappedImageUrls.has(url)) {
    unmappedImages.push({ url, fullPath, rel, ext });
  }
});

console.log(`Found ${unmappedImages.length} unmapped images to create products for.`);

// Helper templates per category
const categoryTemplates = {
  'Kids Cars': {
    titles: [
      "Kiddigo Deluxe Electric Ride-On Supercar",
      "FUNZEE Off-Road 4x4 Battery Operated Buggy",
      "Kiddigo Luxury Convertible Coupe with Remote",
      "FUNZEE Heavy Duty Utility Farm Tractor",
      "Kiddigo Drift Master High-Speed Go-Kart",
      "FUNZEE Turbo Sport Racer 12V Electric Car",
      "Kiddigo Police Special Patrol Ride-On",
      "FUNZEE All-Terrain Quad Bike Ride-On"
    ],
    ageGroup: "3 To 8 Years",
    ageTag: "3-8 Yrs",
    priceRange: [12999, 24999],
    specs: [
      "Dual 12V High-Torque Electric Motors",
      "2.4GHz Parental Wireless Remote Control",
      "Padded Vegan Leather Seat with Safety Harness",
      "Built-in Bluetooth Music Player & Horn Effects"
    ]
  },
  'Electric Bikes': {
    titles: [
      "Kiddigo Superbike 12V Sport Motorbike Ride-On",
      "FUNZEE Trail Blazer Electric Dirt Bike",
      "Kiddigo Cruiser Trike 12V Battery Motorcycle",
      "FUNZEE Street Rocket 12V Kids Electric Bike",
      "Kiddigo Urban Adventurer 3-Wheel Motorbike"
    ],
    ageGroup: "3 To 7 Years",
    ageTag: "3-7 Yrs",
    priceRange: [9999, 16999],
    specs: [
      "Rechargeable 12V Motor & Battery Pack",
      "Stabilizing Auxiliary Wheels for Safe Balance",
      "Foot Pedal Acceleration Throttle",
      "Working LED Headlights & Engine Sound FX"
    ]
  },
  'Cycles': {
    titles: [
      "Kiddigo Junior Balance Bike & Learning Trike",
      "FUNZEE Explorer Pedal Cycle with Training Wheels",
      "Kiddigo Cruiser Kids Bicycle with Front Basket",
      "FUNZEE Speedster Lightweight Alloy Frame Bike"
    ],
    ageGroup: "2 To 6 Years",
    ageTag: "2-6 Yrs",
    priceRange: [3499, 7999],
    specs: [
      "Ultra-Lightweight Ergonomic Steel Frame",
      "Removable Heavy-Duty Training Wheels",
      "Soft Cushioned Adjustable Saddle Seat",
      "Non-Slip Safety Hand Grips & Front Caliper Brake"
    ]
  },
  'Scooters': {
    titles: [
      "Kiddigo Neon Flash 3-Wheel LED Kick Scooter",
      "FUNZEE Pro Glide Height-Adjustable Foldable Scooter",
      "Kiddigo Lean-to-Steer LED Light-Up Wheel Scooter",
      "FUNZEE Aero-Lite Urban Commuter Kick Scooter"
    ],
    ageGroup: "3 To 10 Years",
    ageTag: "3-10 Yrs",
    priceRange: [2499, 5999],
    specs: [
      "Magnetic Light-Up Glowing Wheels",
      "4-Level Adjustable Handlebar Height",
      "Intuitive Lean-to-Steer Balance Technology",
      "Wide Non-Slip Reinforced Deck Plate"
    ]
  },
  'Vespa': {
    titles: [
      "FUNZEE Italian Retro Vintage 12V Vespa Scooter",
      "Kiddigo Classic Primavera 12V Electric Vespa",
      "FUNZEE Chic Pastel Edition 12V Vespa Ride-On"
    ],
    ageGroup: "2 To 6 Years",
    ageTag: "2-6 Yrs",
    priceRange: [13499, 17999],
    specs: [
      "Authentic Italian Retro Styling & Chrome Finish",
      "Rechargeable 12V Battery Drive System",
      "Leatherette Padded Saddle Seat",
      "MP3 Audio Input & Steering Wheel Horn"
    ]
  },
  'Hoverboards': {
    titles: [
      "Kiddigo Smart Balance 6.5” Bluetooth Hoverboard",
      "FUNZEE RGB Glow Light Self-Balancing Scooter",
      "Kiddigo All-Terrain 8.5” Heavy-Duty Hoverboard"
    ],
    ageGroup: "6 To 14 Years",
    ageTag: "6-14 Yrs",
    priceRange: [8999, 15999],
    specs: [
      "Dual 350W Brushless Motors with Auto-Balancing",
      "Integrated Wireless Bluetooth Speaker",
      "Vibrant RGB LED Wheel & Body Lighting Effects",
      "UL2272 Certified Explosion-Proof Battery"
    ]
  },
  'Baby Walkers': {
    titles: [
      "Kiddigo 2-in-1 Activity & Push Toddler Walker",
      "FUNZEE Musical Steering Wheel Baby Walker",
      "Kiddigo Ergonomic Anti-Flip Safety Baby Walker"
    ],
    ageGroup: "6 To 18 Months",
    ageTag: "6-18 Mos",
    priceRange: [1999, 4499],
    specs: [
      "Multi-Height Adjustable Seat Cushion",
      "Detachable Electronic Activity Toy Tray with Music",
      "Silent 360-Degree Swivel Rubber Wheels",
      "Compact Flat Fold Design for Easy Storage"
    ]
  },
  'Strollers': {
    titles: [
      "Kiddigo Compact Ultra-Light Urban Stroller",
      "FUNZEE All-Terrain Reclinable Infant Pram",
      "Kiddigo Modular One-Hand Fold Travel System"
    ],
    ageGroup: "0 To 36 Months",
    ageTag: "0-3 Yrs",
    priceRange: [5999, 12999],
    specs: [
      "One-Hand Quick Compact Fold Mechanism",
      "UPF 50+ Multi-Position Canopy Extension",
      "Multi-Recline Ergonomic Backrest",
      "Shock-Absorbing All-Wheel Suspension"
    ]
  },
  'Toys': {
    titles: [
      "Kiddigo Garden Swing & Slide Play Set",
      "FUNZEE Indoor/Outdoor Deluxe Toddler Swing",
      "Kiddigo Active Sensory Wooden Jungle Gym"
    ],
    ageGroup: "1 To 6 Years",
    ageTag: "1-6 Yrs",
    priceRange: [2999, 8999],
    specs: [
      "Non-Toxic Heavy Duty Polyethylene Structure",
      "Anti-Tip Stable Ground Anchor Support",
      "Removable Safety T-Bar & Backrest",
      "Weatherproof UV-Resistant Color Coating"
    ]
  }
};

// Group unmapped images by category
const unmappedByCategory = {};
unmappedImages.forEach(img => {
  const parts = img.rel.split('/');
  const folder = parts.length > 1 ? parts[0] : 'cars';
  const category = folderToCategory[folder] || 'Kids Cars';
  if (!unmappedByCategory[category]) unmappedByCategory[category] = [];
  unmappedByCategory[category].push(img);
});

console.log('Unmapped images by category:');
Object.keys(unmappedByCategory).forEach(cat => {
  console.log(`- ${cat}: ${unmappedByCategory[cat].length} images`);
});

// Generate new product entries
const newProducts = [];
let globalProductIndex = existingProducts.length + 1;

Object.keys(unmappedByCategory).forEach(cat => {
  const items = unmappedByCategory[cat];
  const template = categoryTemplates[cat] || categoryTemplates['Kids Cars'];

  items.forEach((imgObj, idx) => {
    const titleBase = template.titles[idx % template.titles.length];
    const cleanFileName = path.basename(imgObj.rel, path.extname(imgObj.rel)).replace(/[-_]/g, ' ');
    const name = `${titleBase} - ${cleanFileName.toUpperCase().slice(0, 18)}`;

    const minPrice = template.priceRange[0];
    const maxPrice = template.priceRange[1];
    const priceStep = Math.floor((maxPrice - minPrice) / Math.max(items.length, 1));
    const price = minPrice + (idx * priceStep) + ((idx % 3) * 200);
    const originalPrice = Math.round((price * 1.3) / 100) * 100 - 1;

    // Select secondary image from same category or self
    const siblingImgs = items.map(x => x.url).filter(u => u !== imgObj.url);
    const secondaryImages = siblingImgs.length > 0 ? [siblingImgs[idx % siblingImgs.length]] : [imgObj.url];

    const slugCategory = cat.toLowerCase().replace(/\s+/g, '-');
    const product = {
      id: `${slugCategory}-new-${globalProductIndex++}`,
      name: name,
      category: cat,
      ageGroup: template.ageGroup,
      ageTag: template.ageTag,
      price: price,
      originalPrice: originalPrice,
      rating: parseFloat((4.7 + (idx % 4) * 0.1).toFixed(1)),
      reviewsCount: 35 + ((idx * 17) % 180),
      isBestSeller: idx % 3 === 0,
      isQuickShip: true,
      image: imgObj.url,
      secondaryImages: secondaryImages,
      description: `Premium ${cat} product engineered with top safety certification, high quality materials, ergonomic design, and striking visual finish for children's maximum comfort and joyful play.`,
      specs: template.specs
    };

    newProducts.push(product);
  });
});

console.log(`Generated ${newProducts.length} new product objects.`);

const totalProducts = [...existingProducts, ...newProducts];
console.log(`Total products in catalog: ${totalProducts.length}`);

// Format new products as JS code string
function formatProduct(p) {
  return `  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    ageGroup: ${JSON.stringify(p.ageGroup)},
    ageTag: ${JSON.stringify(p.ageTag)},
    price: ${p.price},
    originalPrice: ${p.originalPrice},
    rating: ${p.rating},
    reviewsCount: ${p.reviewsCount},
    isBestSeller: ${p.isBestSeller},
    isQuickShip: ${p.isQuickShip},
    image: ${JSON.stringify(p.image)},
    secondaryImages: ${JSON.stringify(p.secondaryImages)},
    description: ${JSON.stringify(p.description)},
    specs: ${JSON.stringify(p.specs, null, 6).replace(/\n\s{4}/g, '\n      ')}
  }`;
}

const updatedProductsJsContent = `${headerCode}export const PRODUCTS = [
${totalProducts.map(formatProduct).join(',\n')}
];

${tailCode}`;

fs.writeFileSync(productsJsPath, updatedProductsJsContent, 'utf8');
console.log('Successfully updated src/data/products.js!');
