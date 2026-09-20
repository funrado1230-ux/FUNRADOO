import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:/Users/Dell/Documents/images/tricycle/cycle bg.png';
const outputPath = 'c:/Users/Dell/Documents/kiddigo/public/images/cycles_showcase/baby_cycle.png';

async function processCleanCutout() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    // Corner background pixel sampling (top-left corner)
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Image dimensions: ${width}x${height}, Corner BG: R=${bgR}, G=${bgG}, B=${bgB}`);

    // Flood fill from outer edges (0,0) to turn outer dark teal background transparent
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Push all border pixels to queue if they match corner BG color closely
    function isBgPixel(idx) {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      return diff < 45 || (r < 35 && g < 75 && b < 85);
    }

    // Add top & bottom edge
    for (let x = 0; x < width; x++) {
      const topIdx = (0 * width + x) * 4;
      const bottomIdx = ((height - 1) * width + x) * 4;
      if (isBgPixel(topIdx)) {
        queue.push(0 * width + x);
        visited[0 * width + x] = 1;
      }
      if (isBgPixel(bottomIdx)) {
        queue.push((height - 1) * width + x);
        visited[(height - 1) * width + x] = 1;
      }
    }

    // Add left & right edge
    for (let y = 0; y < height; y++) {
      const leftIdx = (y * width + 0) * 4;
      const rightIdx = (y * width + (width - 1)) * 4;
      if (isBgPixel(leftIdx) && !visited[y * width + 0]) {
        queue.push(y * width + 0);
        visited[y * width + 0] = 1;
      }
      if (isBgPixel(rightIdx) && !visited[y * width + (width - 1)]) {
        queue.push(y * width + (width - 1));
        visited[y * width + (width - 1)] = 1;
      }
    }

    // BFS Flood Fill from outer edges
    let head = 0;
    while (head < queue.length) {
      const p = queue[head++];
      const px = p % width;
      const py = Math.floor(p / width);
      const dataIdx = p * 4;

      // Set alpha to 0 for outer background
      data[dataIdx + 3] = 0;

      // Check 4 neighbors
      const neighbors = [
        { x: px + 1, y: py },
        { x: px - 1, y: py },
        { x: px, y: py + 1 },
        { x: px, y: py - 1 }
      ];

      for (const n of neighbors) {
        if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
          const nPos = n.y * width + n.x;
          if (!visited[nPos]) {
            visited[nPos] = 1;
            const nDataIdx = nPos * 4;
            if (isBgPixel(nDataIdx)) {
              queue.push(nPos);
            }
          }
        }
      }
    }

    await sharp(data, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log(`Flood fill complete! Turned ${queue.length} outer background pixels transparent. Saved to: ${outputPath}`);
  } catch (err) {
    console.error('Error processing clean cutout:', err);
  }
}

processCleanCutout();
