import sharp from 'sharp';

const inputPath = 'C:/Users/Dell/.gemini/antigravity-ide/brain/4b62aee6-c4a1-4990-9e4f-97b0613fa716/media__1786120935887.jpg';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/baby_cycle.png';

async function removeOuterBackground() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Sample top-left corner pixel color (background color)
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Corner background color: R=${bgR}, G=${bgG}, B=${bgB}`);

    const colorThreshold = 35; // Color distance tolerance

    // Flood fill / color distance check to remove outer background
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diff = Math.sqrt(
        Math.pow(r - bgR, 2) +
        Math.pow(g - bgG, 2) +
        Math.pow(b - bgB, 2)
      );

      // If pixel color is very close to corner background color
      if (diff < colorThreshold) {
        data[i + 3] = 0; // Make transparent alpha
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

    console.log('Successfully removed outer background and created organic blob cutout at:', outputPath);
  } catch (err) {
    console.error('Error processing background removal:', err);
  }
}

removeOuterBackground();
