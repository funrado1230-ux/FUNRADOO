import sharp from 'sharp';

const inputPath = 'C:/Users/Dell/Documents/images/tricycle/cycle bg.png';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/baby_cycle.png';

async function processCycleBg() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Processing image dimensions: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Corner background pixel sampling (top-left corner)
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Corner background color: R=${bgR}, G=${bgG}, B=${bgB}`);

    // If there is black outer background or corner dark color, convert to transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check distance from corner background color OR if pixel is near pure black (r<30 && g<30 && b<30)
      const diff = Math.sqrt(
        Math.pow(r - bgR, 2) +
        Math.pow(g - bgG, 2) +
        Math.pow(b - bgB, 2)
      );

      if (diff < 40 || (r < 30 && g < 30 && b < 30)) {
        data[i + 3] = 0; // Transparent alpha
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

    console.log('Successfully processed cycle bg.png cutout and saved to:', outputPath);
  } catch (err) {
    console.error('Error processing cycle bg image:', err);
  }
}

processCycleBg();
