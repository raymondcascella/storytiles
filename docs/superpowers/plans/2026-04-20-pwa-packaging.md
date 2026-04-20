# PWA Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make StoryTiles an installable PWA with a proper manifest, auto-updating service worker, and custom icons ready for Google Play submission via PWABuilder.

**Architecture:** Replace the stale manual PWA artifacts (`pwabuilder-adv-sw.js`, `manifest.json`) with `vite-plugin-pwa`, which auto-generates the service worker precache manifest from each build's output. Icons are generated programmatically via a Node script using `sharp` and committed to `public/icons/`. The plugin injects the manifest link and SW registration into the HTML output — no manual wiring needed.

**Tech Stack:** Vite 8, vite-plugin-pwa, Workbox (via plugin), sharp (icon generation), React 19, GitHub Pages (`base: /storytiles/`)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `scripts/generate-icons.js` | Create | Renders SVG icon design → PNG at 3 sizes |
| `public/icons/icon-192.png` | Create (generated) | 192×192 standard icon |
| `public/icons/icon-512.png` | Create (generated) | 512×512 standard icon |
| `public/icons/icon-512-maskable.png` | Create (generated) | 512×512 maskable (Android safe-zone padded) |
| `index.html` | Modify | Remove manual SW registration, manifest link, and typo |
| `vite.config.js` | Modify | Add VitePWA plugin with manifest + workbox config |
| `package.json` | Modify | Remove `workbox-precaching`; add `vite-plugin-pwa`, `sharp` |
| `pwabuilder-adv-sw.js` | Delete | Replaced by plugin-generated SW |
| `manifest.json` | Delete | Replaced by plugin-generated manifest |

---

## Task 1: Generate app icons

**Files:**
- Create: `scripts/generate-icons.js`
- Create: `public/icons/icon-192.png` (generated output)
- Create: `public/icons/icon-512.png` (generated output)
- Create: `public/icons/icon-512-maskable.png` (generated output)

- [ ] **Step 1: Install sharp**

```bash
npm install --save-dev sharp
```

Expected output: `added 1 package` (or similar — sharp has no sub-dependencies in its prebuilt form)

- [ ] **Step 2: Create the icon generation script**

Create `scripts/generate-icons.js`:

```javascript
import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

function buildSvg(size, maskable = false) {
  const s = size / 512;
  const pad = maskable ? Math.round(52 * s) : 0;

  const lineGap = Math.round(24 * s);
  const lines = [];
  for (let y = lineGap; y < size; y += lineGap) {
    lines.push(
      `<line x1="0" y1="${y}" x2="${size}" y2="${y}" stroke="#D4CFC6" stroke-width="${Math.max(1, Math.round(1.5 * s))}"/>`
    );
  }

  const bx1 = Math.round((60 + pad) * s);
  const by1 = Math.round((90 + pad) * s);
  const bx2 = Math.round((452 - pad) * s);
  const by2 = Math.round((320 - pad * 0.4) * s);
  const br  = Math.round(32 * s);
  const sw  = Math.round(14 * s);

  const tx2  = Math.round((170 - pad * 0.3) * s);
  const tx1  = Math.round((105 - pad * 0.3) * s);
  const tipX = Math.round((68  - pad * 0.3) * s);
  const tipY = Math.round((400 - pad * 0.5) * s);

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

  const cx  = Math.round(256 * s);
  const ty1 = Math.round(178 * s);
  const ty2 = Math.round(268 * s);
  const fs  = Math.round(90 * s);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#F5F0E8"/>
  ${lines.join('\n  ')}
  <path d="${bubblePath}" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${cx}" y="${ty1}" font-family="'Arial Black',Impact,sans-serif" font-weight="900" font-size="${fs}" fill="#1A1A1A" text-anchor="middle" dominant-baseline="middle">STORY</text>
  <text x="${cx}" y="${ty2}" font-family="'Arial Black',Impact,sans-serif" font-weight="900" font-size="${fs}" fill="#1A1A1A" text-anchor="middle" dominant-baseline="middle">TILES</text>
</svg>`;
}

const icons = [
  { file: 'public/icons/icon-192.png',          size: 192, maskable: false },
  { file: 'public/icons/icon-512.png',          size: 512, maskable: false },
  { file: 'public/icons/icon-512-maskable.png', size: 512, maskable: true  },
];

for (const { file, size, maskable } of icons) {
  await sharp(Buffer.from(buildSvg(size, maskable)))
    .png()
    .toFile(file);
  console.log(`wrote ${file}`);
}
```

- [ ] **Step 3: Run the script**

```bash
node scripts/generate-icons.js
```

Expected output:
```
wrote public/icons/icon-192.png
wrote public/icons/icon-512.png
wrote public/icons/icon-512-maskable.png
```

- [ ] **Step 4: Review the icons — STOP HERE**

Open the three PNG files in `public/icons/` and inspect them visually:

- `icon-192.png`: cream paper background with ruled lines, comic speech bubble, bold "STORY" / "TILES" text
- `icon-512.png`: same at higher resolution — check line crispness and text legibility
- `icon-512-maskable.png`: same design with extra padding — the bubble should sit comfortably within the center, away from edges

**Do not proceed to Step 5 until the user approves the icon design.**

- [ ] **Step 5: Commit icons and script**

```bash
git add scripts/generate-icons.js public/icons/
git commit -m "feat: add icon generation script and app icons"
```

---

## Task 2: Clean up stale PWA artifacts

**Files:**
- Delete: `pwabuilder-adv-sw.js`
- Delete: `manifest.json`
- Modify: `index.html`

- [ ] **Step 1: Delete stale files**

```bash
git rm pwabuilder-adv-sw.js manifest.json
```

Expected: both files staged for deletion.

- [ ] **Step 2: Fix index.html**

Replace the entire contents of `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Story Tiles</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

This removes the manual `<script>navigator.serviceWorker.register(...)` and the `<link rel="manifest">` (plus the `ging` typo). `vite-plugin-pwa` injects both automatically into the build output.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "chore: remove stale pwabuilder artifacts and fix index.html"
```

---

## Task 3: Install and configure vite-plugin-pwa

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Swap dependencies**

```bash
npm uninstall workbox-precaching
npm install --save-dev vite-plugin-pwa
```

Expected: `workbox-precaching` removed from `dependencies`, `vite-plugin-pwa` added to `devDependencies`.

- [ ] **Step 2: Update vite.config.js**

Replace the contents of `vite.config.js` with:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        navigateFallback: '/storytiles/index.html',
      },
      manifest: {
        name: 'Story Tiles',
        short_name: 'Story Tiles',
        description: 'A visual story planning tool',
        start_url: '/storytiles/',
        scope: '/storytiles/',
        display: 'standalone',
        theme_color: '#F5F0E8',
        background_color: '#F5F0E8',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  base: '/storytiles/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: build succeeds with no errors. Look for these lines in output:
```
PWA v...
mode      generateSW
...
```

- [ ] **Step 4: Verify build output contains SW and manifest**

```bash
ls dist/
```

Expected to see among the output files:
- `sw.js` — the generated service worker
- `workbox-*.js` — Workbox runtime chunk
- `manifest.webmanifest` — the generated manifest

Also verify the manifest references the correct paths:

```bash
cat dist/manifest.webmanifest
```

Expected: JSON with `"start_url": "/storytiles/"`, `"scope": "/storytiles/"`, and icons pointing to `icons/icon-192.png` etc.

- [ ] **Step 5: Commit**

```bash
git add vite.config.js package.json package-lock.json
git commit -m "feat: wire up vite-plugin-pwa with manifest and workbox config"
```

---

## Task 4: Smoke-test the built PWA

**Files:** none — verification only

- [ ] **Step 1: Serve the production build**

```bash
npm run preview
```

Expected: server starts, output shows URL like `http://localhost:4173/storytiles/`

- [ ] **Step 2: Check service worker in DevTools**

Open `http://localhost:4173/storytiles/` in Chrome.

Open DevTools → Application → Service Workers. Verify:
- A service worker is listed with source `sw.js`
- Status shows "activated and running"
- Scope is `/storytiles/`

- [ ] **Step 3: Check manifest in DevTools**

DevTools → Application → Manifest. Verify:
- Name: "Story Tiles"
- Icons: all three appear with correct sizes
- Start URL: `/storytiles/`

- [ ] **Step 4: Check installability**

In Chrome's address bar, look for the install icon (monitor with down arrow). Click it — an install prompt should appear for "Story Tiles".

If the install icon is absent, check DevTools → Application → Manifest for any validation errors and fix them before proceeding.

- [ ] **Step 5: Commit any fixes, then push to trigger GitHub Pages deploy**

If no fixes were needed:
```bash
git log --oneline -5
```

Confirm all four task commits are present, then push:
```bash
git push
```

Once GitHub Pages redeploys, visit the live URL and repeat Steps 2–4 against the production URL to confirm everything works end-to-end before submitting to PWABuilder.
