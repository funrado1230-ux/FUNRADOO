import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png';
const inputPathBlue = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_neon_blue.png';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png';
const outputPathHero = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_scooter.png';

async function removeScooterBackground(filePath) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Sample top-left corner background color
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Processing ${filePath}: ${info.width}x${info.height}`);
    console.log(`Corner background color: R=${bgR}, G=${bgG}, B=${bgB}`);

    const width = info.width;
    const height = info.height;

    // Remove dark studio background pixels while keeping the glowing scooter intact
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Distance from top-left corner background color
      const diffCorner = Math.sqrt(
        Math.pow(r - bgR, 2) +
        Math.pow(g - bgG, 2) +
        Math.pow(b - bgB, 2)
      );

      // Dark background pixels (R < 35, G < 35, B < 35 or close to dark corner color)
      // Note: Do not make bright cyan/blue neon glowing parts transparent! (cyan/blue has high B and G values)
      const isGlowingGlow = (b > 60 || g > 60 || r > 60);

      if (diffCorner < 45 && !isGlowingGlow) {
        data[i + 3] = 0; // Make transparent
      } else if (r < 25 && g < 25 && b < 25 && !isGlowingGlow) {
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

    fs.copyFileSync(outputPath, outputPathHero);

    console.log('Successfully removed background and created transparent PNG at:', outputPath);
  } catch (err) {
    console.error('Error removing scooter background:', err);
  }
}

removeScooterBackground(inputPath);
