import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter.png';

async function inspectAndClean() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`User image metadata: ${metadata.width}x${metadata.height}, format: ${metadata.format}, hasAlpha: ${metadata.hasAlpha}`);

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Corner color: R=${bgR}, G=${bgG}, B=${bgB}`);

    // If it has white or solid color background around corners, remove outer background if needed
    if (bgR > 220 && bgG > 220 && bgB > 220) {
      console.log('Removing white background around corners...');
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 220 && g > 220 && b > 220) {
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
      .toFile('c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png');

      fs.copyFileSync('c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png', 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_scooter.png');
    }
  } catch (err) {
    console.error('Error inspecting image:', err);
  }
}

inspectAndClean();
