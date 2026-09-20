import sharp from 'sharp';
import path from 'path';

const inputPath = 'C:/Users/Dell/Documents/images/scraller/sta.jpeg';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/store/scraller/sta.png';

async function removeBlackBackground() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Top-left pixel sample
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Image Size: ${info.width}x${info.height}`);
    console.log(`Corner Pixel RGB: (${bgR}, ${bgG}, ${bgB})`);

    // Remove black background (where R, G, B are all dark / close to 0 or close to corner pixel)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Black background condition: dark pixels where r, g, b < 40
      // OR close to corner background pixel
      const maxVal = Math.max(r, g, b);
      const isBlackBg = maxVal < 45 || (Math.abs(r - bgR) < 30 && Math.abs(g - bgG) < 30 && Math.abs(b - bgB) < 30);

      if (isBlackBg) {
        data[i + 3] = 0; // Make transparent
      } else {
        // Soft edge anti-aliasing for smooth cutout
        if (maxVal < 60) {
          const alphaFactor = (maxVal - 45) / 15;
          data[i + 3] = Math.floor(255 * Math.max(0, Math.min(1, alphaFactor)));
        }
      }
    }

    // Trim surrounding transparent padding
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .trim() // trim extra transparent padding around the object
    .png()
    .toFile(outputPath);

    console.log('Successfully removed black background and saved transparent PNG to:', outputPath);
  } catch (err) {
    console.error('Error in removeBlackBackground:', err);
  }
}

removeBlackBackground();
