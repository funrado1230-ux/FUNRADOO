import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:/Users/Dell/.gemini/antigravity-ide/brain/6f4e6636-99ed-471b-8414-73b79b543fc6/media__1786207767955.png';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hoverboard_flame.png';
const heroPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_hoverboard.png';

async function processHoverboard() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Input image: ${metadata.width}x${metadata.height}`);

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    // Flood-fill or threshold black background removal
    // Black background has very low R, G, B values (R < 35, G < 35, B < 35)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect dark background pixels
      // Note: check if pixel is pure/near black background (not part of dark tire tread if surrounded by subject)
      // Since background is solid pitch black:
      if (r < 30 && g < 30 && b < 30) {
        data[i + 3] = 0; // Make transparent
      } else if (r < 45 && g < 45 && b < 45) {
        // Soft edge anti-aliasing transition
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
    console.log('Successfully processed hoverboard cutout and saved to:', outputPath);
  } catch (err) {
    console.error('Error processing hoverboard cutout:', err);
  }
}

processHoverboard();
