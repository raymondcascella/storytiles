import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, normalize } from 'path';

mkdirSync('public/icons', { recursive: true });

const fontPath = normalize(resolve('scripts/bangers.ttf'));

function buildSvg(size, maskable) {
  const s = size / 512;
  const pad = maskable ? Math.round(76 * s) : 0;

  const lineGap = Math.round(24 * s);
  const lines = [];
  for (let y = lineGap; y < size; y += lineGap) {
    lines.push(
      `<line x1="0" y1="${y}" x2="${size}" y2="${y}" stroke="#D4CFC6" stroke-width="${Math.max(1, Math.round(1.5 * s))}"/>`
    );
  }

  const bx1 = Math.round((12 + pad) * s);
  const by1 = Math.round((12 + pad) * s);
  const bx2 = Math.round((500 - pad) * s);
  const by2 = maskable ? Math.round(size * 0.82 - pad * 0.5) : Math.round(size * 0.82);
  const br  = Math.round(44 * s);
  const sw  = Math.round(16 * s);
  const bw  = bx2 - bx1;

  const tx2  = Math.round(bx1 + bw * 0.33);
  const tx1  = Math.round(bx1 + bw * 0.14);
  const tipX = Math.max(sw, bx1 - Math.round(30 * s));
  const tipY = Math.min(size - sw, by2 + Math.round(size * 0.10));

  const bubblePath = [
    `M ${bx1 + br},${by1}`,
    `L ${bx2 - br},${by1}`,
    `Q ${bx2},${by1} ${bx2},${by1 + br}`,
    `L ${bx2},${by2 - br}`,
    `Q ${bx2},${by2} ${bx2 - br},${by2}`,
    `L ${tx2},${by2}`,
    `L ${tipX},${tipY}`,
    `L ${tx1},${by2}`,
    `L ${bx1 + br},${by2}`,
    `Q ${bx1},${by2} ${bx1},${by2 - br}`,
    `L ${bx1},${by1 + br}`,
    `Q ${bx1},${by1} ${bx1 + br},${by1}`,
    `Z`,
  ].join(' ');

  const bubbleMidY = (by1 + by2) / 2;
  const lineH = Math.round(120 * s);
  const cx = Math.round(size / 2);
  const storyY = Math.round(bubbleMidY - lineH * 0.18);
  const tilesY = Math.round(bubbleMidY + lineH * 0.82);
  const fontSize = Math.round(130 * s);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <style>@font-face { font-family: 'Bangers'; src: url('file://${fontPath.replace(/\\/g, '/')}') format('truetype'); }</style>
  </defs>
  <rect width="${size}" height="${size}" fill="#F5F0E8"/>
  ${lines.join('\n  ')}
  <path d="${bubblePath}" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${cx}" y="${storyY}" font-family="Bangers" font-size="${fontSize}" fill="#1A1A1A" text-anchor="middle" letter-spacing="${Math.round(6 * s)}">STORY</text>
  <text x="${cx}" y="${tilesY}" font-family="Bangers" font-size="${fontSize}" fill="#1A1A1A" text-anchor="middle" letter-spacing="${Math.round(6 * s)}">TILES</text>
</svg>`;
}

const icons = [
  { file: 'public/icons/icon-192.png',          size: 192, maskable: false },
  { file: 'public/icons/icon-512.png',          size: 512, maskable: false },
  { file: 'public/icons/icon-512-maskable.png', size: 512, maskable: true  },
];

for (const { file, size, maskable } of icons) {
  const resvg = new Resvg(buildSvg(size, maskable), {
    font: { loadSystemFonts: false, fontFiles: [fontPath] },
  });
  writeFileSync(file, resvg.render().asPng());
  console.log(`wrote ${file}`);
}
