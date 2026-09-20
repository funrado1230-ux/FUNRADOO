import sharp from 'sharp';
import fs from 'fs';

async function processAllScooterImages() {
  const images = [
    'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png',
    'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_neon_blue.png',
    'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_pink_unicorn.png',
    'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_cyber_red.png',
    'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_emerald_green.png'
  ];

  for (const imgPath of images) {
    if (!fs.existsSync(imgPath)) continue;
    try {
      const image = sharp(imgPath);
      const metadata = await image.metadata();

      const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      console.log(`Processing ${imgPath} (${info.width}x${info.height}), Corner: R=${bgR}, G=${bgG}, B=${bgB}`);

      const width = info.width;
      const height = info.height;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Corner background color distance
        const diffCorner = Math.sqrt(
          Math.pow(r - bgR, 2) +
          Math.pow(g - bgG, 2) +
          Math.pow(b - bgB, 2)
        );

        // Check if pixel is dark background or white background
        const isDarkBg = (r < 30 && g < 30 && b < 30);
        const isWhiteBg = (r > 220 && g > 220 && b > 220);
        const isNeonGlow = (r > 60 || g > 60 || b > 60);

        if (diffCorner < 45 && !isNeonGlow) {
          data[i + 3] = 0; // Transparent
        } else if (isDarkBg && !isNeonGlow) {
          data[i + 3] = 0; // Transparent
        } else if (isWhiteBg) {
          data[i + 3] = 0; // Transparent
        }
      }

      const tempPath = imgPath + '.tmp.png';
      await sharp(data, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4
        }
      })
      .png()
      .toFile(tempPath);

      fs.copyFileSync(tempPath, imgPath);
      fs.unlinkSync(tempPath);

      console.log(`Updated ${imgPath} with clean transparent background!`);
    } catch (err) {
      console.error(`Error processing ${imgPath}:`, err);
    }
  }

  // Also copy to hero_scooter.png
  fs.copyFileSync('c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png', 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_scooter.png');
}

processAllScooterImages();
