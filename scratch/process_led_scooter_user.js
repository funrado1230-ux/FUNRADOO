import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:/Users/Dell/.gemini/antigravity-ide/brain/6f4e6636-99ed-471b-8414-73b79b543fc6/media__1786204258240.png';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/led_scooter_glow.png';
const outputPath2 = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/hero_scooter.png';

async function processLedScooterImage() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

    // Crop to the image container area (remove Canva header/toolbars)
    // The image of the child on the scooter starts around y: 15% and goes down to 95%
    const cropTop = Math.floor(metadata.height * 0.14);
    const cropHeight = Math.floor(metadata.height * 0.84);
    const cropLeft = Math.floor(metadata.width * 0.02);
    const cropWidth = Math.floor(metadata.width * 0.96);

    const croppedBuffer = await image
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .toBuffer();

    // Now convert white background pixels to transparent alpha
    const croppedImage = sharp(croppedBuffer);
    const { data, info } = await croppedImage
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Remove white background (canvas background behind the organic blob)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // White or near-white background pixels (R > 235, G > 235, B > 235)
      if (r > 230 && g > 230 && b > 230) {
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

    fs.copyFileSync(outputPath, outputPath2);

    console.log(`Successfully processed user's LED scooter image to ${outputPath}!`);
  } catch (err) {
    console.error('Error processing LED scooter image:', err);
  }
}

processLedScooterImage();
