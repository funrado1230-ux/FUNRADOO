import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/baby_cycle.jpg';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_cycle.png';
const outputPathPng = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/baby_cycle.png';

async function restoreYesterdayImage() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Corner background color
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    const width = info.width;
    const height = info.height;

    // Remove outer background color matching top-left corner
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diffCorner = Math.sqrt(
        Math.pow(r - bgR, 2) +
        Math.pow(g - bgG, 2) +
        Math.pow(b - bgB, 2)
      );

      if (diffCorner < 40) {
        data[i + 3] = 0; // Make transparent
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    fs.copyFileSync(inputPath, 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/yesterday_baby_cycle.jpg');
    fs.copyFileSync(outputPath, outputPathPng);

    console.log('Successfully restored yesterday baby cycle image to hero_cycle.png & baby_cycle.png!');
  } catch (err) {
    console.error('Error:', err);
  }
}

restoreYesterdayImage();
