import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:/Users/Dell/.gemini/antigravity-ide/brain/6f4e6636-99ed-471b-8414-73b79b543fc6/media__1786208573184.png';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/active_toy_rhino.png';
const heroPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_toy.png';

async function processActiveToy() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Input active toy image: ${metadata.width}x${metadata.height}`);

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    // Remove solid black background (R < 30, G < 30, B < 30)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r < 30 && g < 30 && b < 30) {
        data[i + 3] = 0; // Transparent
      } else if (r < 45 && g < 45 && b < 45) {
        const maxVal = Math.max(r, g, b);
        const alpha = Math.min(255, Math.max(0, Math.floor(((maxVal - 15) / 30) * 255)));
        data[i + 3] = alpha;
      }
    }

    await sharp(data, {
      raw: {
        width: width,
        height: height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    fs.copyFileSync(outputPath, heroPath);
    console.log('Successfully processed active toy cutout and saved to:', outputPath);
  } catch (err) {
    console.error('Error processing active toy cutout:', err);
  }
}

processActiveToy();
