const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  { dir: path.join(__dirname, '../public/images/banner'), minWidth: 1920 },
  { dir: path.join(__dirname, '../public/images/categories'), minWidth: 600 },
  { dir: path.join(__dirname, '../public/images/scooters'), minWidth: 1200 }
];

async function enhanceImage(filePath, minWidth) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return;

    console.log(`Processing: ${path.basename(filePath)}...`);
    const inputBuffer = fs.readFileSync(filePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    let pipeline = sharp(inputBuffer);

    // Upscale if smaller than target resolution for crisp Retina display
    const targetW = Math.max(metadata.width || 0, minWidth);
    if (metadata.width && metadata.width < minWidth) {
      pipeline = pipeline.resize(targetW, null, {
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: false
      });
    }

    // Apply sharpening, modulation & contrast enhancement for maximum clarity
    pipeline = pipeline
      .sharpen({
        sigma: 1.3,
        m1: 1.8,
        m2: 0.7
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.05
      })
      .normalise();

    let outputBuffer;
    if (ext === '.png') {
      outputBuffer = await pipeline.png({ compressionLevel: 9, quality: 100, force: false }).toBuffer();
    } else if (ext === '.jpg' || ext === '.jpeg') {
      outputBuffer = await pipeline.jpeg({ quality: 98, mozjpeg: true, force: false }).toBuffer();
    } else if (ext === '.webp') {
      outputBuffer = await pipeline.webp({ quality: 98, lossless: false, force: false }).toBuffer();
    }

    if (outputBuffer) {
      fs.writeFileSync(filePath, outputBuffer);
      console.log(`✓ Successfully enhanced: ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

async function run() {
  for (const { dir, minWidth } of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) {
        await enhanceImage(fullPath, minWidth);
      }
    }
  }
  console.log('Finished enhancing all images with HD clarity!');
}

run();
