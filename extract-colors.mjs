import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagePath = join(__dirname, 'assets', 'Modelo1.png');

const { data, info } = await sharp(imagePath)
  .raw()
  .toBuffer({ resolveWithObject: true });

const width = info.width;
const height = info.height;
const totalPixels = width * height;

// Sample pixels (every Nth pixel for speed)
const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 500)));

const pixels = [];
for (let i = 0; i < totalPixels; i += step) {
  const offset = i * 4;
  if (offset + 3 < data.length) {
    pixels.push([data[offset], data[offset + 1], data[offset + 2]]);
  }
}

function colorDist(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  );
}

// Simple k-means clustering with k=6
const k = 6;
let centroids = [];
for (let i = 0; i < k; i++) {
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
}

for (let iter = 0; iter < 20; iter++) {
  const clusters = Array.from({ length: k }, () => []);
  
  for (const p of pixels) {
    let minDist = Infinity;
    let best = 0;
    for (let i = 0; i < k; i++) {
      const d = colorDist(p, centroids[i]);
      if (d < minDist) { minDist = d; best = i; }
    }
    clusters[best].push(p);
  }

  for (let i = 0; i < k; i++) {
    if (clusters[i].length === 0) continue;
    const sum = [0, 0, 0];
    for (const p of clusters[i]) {
      sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2];
    }
    centroids[i] = [
      Math.round(sum[0] / clusters[i].length),
      Math.round(sum[1] / clusters[i].length),
      Math.round(sum[2] / clusters[i].length),
    ];
  }
}

// Sort by cluster size descending
const clusterSizes = centroids.map((c, i) => {
  let count = 0;
  for (const p of pixels) {
    let minDist = Infinity;
    let best = 0;
    for (let j = 0; j < k; j++) {
      const d = colorDist(p, centroids[j]);
      if (d < minDist) { minDist = d; best = j; }
    }
    if (best === i) count++;
  }
  return { index: i, count, color: c };
});

clusterSizes.sort((a, b) => b.count - a.count);

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

console.log('Colores dominantes de Modelo1.png:');
console.log('================================');
clusterSizes.forEach((c, i) => {
  const hex = rgbToHex(c.color[0], c.color[1], c.color[2]);
  const pct = ((c.count / pixels.length) * 100).toFixed(1);
  console.log(`${i + 1}. ${hex}  (${pct}%)  RGB(${c.color[0]}, ${c.color[1]}, ${c.color[2]})`);
});
