import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:/Users/Dell/.gemini/antigravity-ide/brain/6f4e6636-99ed-471b-8414-73b79b543fc6/media__1786203071516.jpg';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_cycle.png';
const outputPathGlow = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/baby_cycle_glow.png';

async function removeBackground() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Corner background color (outer dark teal canvas)
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    const width = info.width;
    const height = info.height;

    // Process pixels to remove outer dark teal border & light background around subject
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // 1. Check distance from corner background color
        const distCorner = Math.sqrt(
          Math.pow(r - bgR, 2) +
          Math.pow(g - bgG, 2) +
          Math.pow(b - bgB, 2)
        );

        // 2. Light blue room background (wall and slide behind child):
        // Walls are soft cyan/sky blue (high blue & green relative to red, e.g. R ~ 110-180, G ~ 200-240, B ~ 210-250)
        const isWallBlue = (b > 170 && g > 170 && r < 190 && b > r + 30);
        
        // 3. Check distance from center of image (child & bike are centered around x: 512, y: 450)
        const dx = (x - width * 0.52) / (width * 0.35);
        const dy = (y - height * 0.52) / (height * 0.42);
        const distCenterSq = dx * dx + dy * dy;

        if (distCorner < 40 || distCenterSq > 1.0 || (isWallBlue && distCenterSq > 0.35)) {
          // Calculate smooth alpha falloff for clean anti-aliased edge
          let alpha = 0;
          if (distCenterSq > 0.85 && distCenterSq <= 1.0 && !isWallBlue && distCorner >= 40) {
            alpha = Math.floor(255 * (1.0 - distCenterSq) / 0.15);
          }
          data[idx + 3] = Math.max(0, Math.min(255, alpha));
        }
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

    fs.copyFileSync(outputPath, outputPathGlow);

    console.log('Successfully created subject cutout PNG at:', outputPath);
  } catch (err) {
    console.error('Error:', err);
  }
}

removeBackground();
