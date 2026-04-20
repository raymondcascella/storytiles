# PWA Packaging Design

**Date:** 2026-04-20  
**Goal:** Make StoryTiles installable as a PWA and submittable to Google Play via PWABuilder.

---

## 1. Build Pipeline

Replace manual PWA artifacts with `vite-plugin-pwa`:

- **Remove**: `pwabuilder-adv-sw.js`, `manifest.json`, manual SW registration script and manifest link from `index.html`
- **Remove**: `workbox-precaching` from `dependencies` (plugin provides its own Workbox)
- **Add**: `vite-plugin-pwa` to `devDependencies`
- **Update**: `vite.config.js` with a `VitePWA({...})` block containing manifest and Workbox config

The plugin injects the manifest link and SW registration into the HTML output automatically, and regenerates the precache manifest from the actual build artifacts on every `vite build`.

---

## 2. Manifest

Configured inline in `vite.config.js` via the plugin (no static `manifest.json` file):

| Field | Value |
|---|---|
| `name` | Story Tiles |
| `short_name` | Story Tiles |
| `start_url` | `/storytiles/` |
| `scope` | `/storytiles/` |
| `display` | standalone |
| `theme_color` | #F5F0E8 |
| `background_color` | #F5F0E8 |
| `orientation` | portrait |

No `screenshots` or `shortcuts` — placeholder values would fail PWABuilder validation.

Icons referenced: `icons/icon-192.png` (any), `icons/icon-512.png` (any), `icons/icon-512-maskable.png` (maskable).

---

## 3. Icons

Generated programmatically via `scripts/generate-icons.js` using `sharp`. Output PNGs committed to `public/icons/`.

**Design spec:**
- Background: cream (`#F5F0E8`) with horizontal light-grey (`#D4CFC6`) ruled lines — notebook paper aesthetic
- Foreground: bold comic-style speech bubble, white fill, thick dark outline, centered
- Text inside bubble: `STORY` on line 1, `TILES` on line 2 — bold, uppercase, comic/display style
- Sizes: 192×192, 512×512 (standard), 512×512 maskable (extra padding so bubble isn't clipped on Android)

**Review gate:** Icons are rendered and shown to the user for approval before anything is committed.

---

## 4. Service Worker

`vite-plugin-pwa` uses Workbox `generateSW` strategy (no custom SW file):

- **Precache**: all build output (`js`, `css`, `html`) auto-precached
- **Runtime cache**: network-first for navigation; cache-first for static assets
- **Scope**: `/storytiles/` — matches GitHub Pages base path
- **Register type**: `autoUpdate` — silently replaces SW on new deploys, no user-facing reload prompt

---

## 5. Google Play Submission (Manual)

After the PWA is live on GitHub Pages:

1. Go to pwabuilder.com and enter the live URL
2. Validate — manifest, SW, and icons should all pass
3. Use "Package for stores" → Android to generate a signed `.aab`
4. Submit to Google Play Console (one-time $25 developer fee required)

Nothing in this step is automated; it runs after a successful deploy.

---

## Files Changed

| File | Action |
|---|---|
| `pwabuilder-adv-sw.js` | Delete |
| `manifest.json` | Delete |
| `index.html` | Remove manual SW registration and manifest link (also fix typo) |
| `vite.config.js` | Add `VitePWA` plugin config |
| `package.json` | Remove `workbox-precaching`; add `vite-plugin-pwa`, `sharp` |
| `scripts/generate-icons.js` | Create — generates icon PNGs |
| `public/icons/icon-192.png` | Create (generated) |
| `public/icons/icon-512.png` | Create (generated) |
| `public/icons/icon-512-maskable.png` | Create (generated) |
