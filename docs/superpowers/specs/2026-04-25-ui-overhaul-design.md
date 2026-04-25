# StoryTiles UI Overhaul — Design Spec
**Date:** 2026-04-25
**Status:** Approved

## Goals

1. Mobile-friendly responsive layout
2. Faster, easier icon access
3. Fresh aesthetic — "Pop" direction: bold, joyful, comic-native

---

## Aesthetic Foundation

### Typography
- **Display / UI labels / buttons:** [Righteous](https://fonts.google.com/specimen/Righteous) — bold, geometric, characterful
- **Body / captions / inputs:** [Nunito](https://fonts.google.com/specimen/Nunito) — rounded, readable at small sizes

### Palette
```
--cobalt:    #1847d4   (New button, selected states)
--crimson:   #e63946   (Save button, destructive accents)
--sunshine:  #ffd60a   (Load button — black text on yellow)
--ink:       #111111   (borders, text, toolbar bg)
--page:      #f7f5f0   (app background)
--surface:   #ffffff   (panels, modals)
```

### Panel accent colors
Each panel gets a colored top band (8px) assigned by `panelIndex % 3`: index 0 = cobalt, 1 = crimson, 2 = sunshine, then repeats. Visually distinguishes panels and reinforces the comic-page feel.

### Visual style
- **Borders:** 2.5px solid `--ink` on all cards, inputs, buttons
- **Button shadow:** 3px offset shadow (`3px 3px 0 #111`) — sticker aesthetic, softer than current neo-brutalist stamp
- **Panels:** 16px border-radius, white background, colored 8px top stripe
- **Caption area:** Very light tint matching the panel's accent color (`rgba(accent, 0.07)`)
- **Buttons:** Pill-shaped (`border-radius: 999px`), filled with action color, Righteous font, 14px, uppercase

---

## Layout

### Overall structure (both breakpoints)
```
┌─────────────────────────────────────────┐
│  Toolbar (logo | story title | actions) │
├─────────────────────────────────────────┤
│                                         │
│  Panels area (scrollable)               │
│                                         │
├─────────────────────────────────────────┤
│  Icon tray (collapsible, bottom)        │
└─────────────────────────────────────────┘
```

### Desktop (≥768px)
- Panels area: horizontal scroll row, panels fixed at `320×460px`
- Add Panel: dashed-border card, same dimensions, centered `+` icon, at end of row
- Icon tray: `~200px` tall when open, slides up from bottom
- Tray toggle: floating pill button `🎨 Icons` anchored bottom-right

### Mobile (<768px)
- Panels area: vertical scroll, panels full-width (`calc(100vw - 32px)`)
- Add Panel: dashed-border card, full-width, below last panel
- Icon tray: slides up as a bottom sheet (full-width, up to `60vh`)
- Tray toggle: same floating pill, bottom-right

### Sidebar removal
The current 30%-width right sidebar is **removed entirely**. All icon/color/size controls move into the bottom tray.

---

## Toolbar

- Background: `--ink` (black), same as today
- **Left:** `STORYTILES` logotype in Righteous, neon cyan (`#00ccff`) — retained from current brand
- **Center:** Story title — inline editable `<input>`, white text, no visible border, Righteous font, placeholder `"Untitled"`. Clicking activates edit mode.
- **Right:** Three pill buttons — `NEW` (cobalt), `SAVE` (crimson), `LOAD` (yellow, black text)
- Dirty state indicator: small dot on `SAVE` button when unsaved changes exist

---

## Icon Tray

### Tray structure (open state, top to bottom)
1. **Controls strip:** Color swatches (12 presets) + size toggle (`S / M / L`) in a compact single row
2. **Search input:** Text filter for icon names, Nunito font, small, borderless dark input
3. **Icon grid:** 
   - Top row: "Recent" — last 8 used icons, stored in `useState` within `IconTray` (ephemeral, resets on page load), visually separated with a small label
   - Remaining rows: full icon grid, horizontally scrollable on desktop / standard grid on mobile

### Selected icon state
- Icon gets bold colored ring + subtle bounce animation on select
- Floating tray button changes to show selected icon name + colored dot: `● star` instead of `🎨 Icons`
- Deselect by tapping the same icon again

### Tray toggle button
- Position: `fixed`, bottom-right, above safe area
- Open: `✕ Close` label
- Closed: icon name if one selected, otherwise `🎨 Icons`

---

## Panel Component

### Structure
```
┌─────────────────────────────────┐  ← 2.5px ink border, 16px radius
│ ████ colored top stripe (8px)   │
├─────────────────────────────────┤
│                                 │
│  Icon zone (flex: 1)            │  ← tap/click to place, crosshair cursor
│                                 │
├─────────────────────────────────┤
│  Caption textarea               │  ← Nunito, lightly tinted bg
└─────────────────────────────────┘
```

### Remove button
- Small `×` badge, top-right corner of panel, overlapping the border
- Desktop: visible on hover only
- Mobile: always visible as a small pill badge

### Icon interaction
- **Desktop:** Click to place at cursor position; drag to move; right-click to remove (existing behavior)
- **Mobile:** Tap to place at tap position; double-tap placed icon to remove (no drag required)

---

## Modals

### Confirm modal
- Bold colored header stripe: crimson for destructive actions, cobalt for neutral, green for save confirmation
- Righteous font for title, Nunito for message body
- Two buttons: confirm (filled, action color) + cancel (ghost)
- Sharp corners (`border-radius: 0`) to distinguish from panels

### Load modal
- Story list items as cards: title in Righteous, small badge showing panel count
- Delete as a small `×` in card top-right corner
- Scrollable list with inner shadow hinting at overflow

---

## Responsive Breakpoints

| Feature | Mobile (<768px) | Desktop (≥768px) |
|---|---|---|
| Panel layout | Vertical scroll, full-width | Horizontal scroll, fixed size |
| Icon tray | Bottom sheet (full-width, 60vh max) | Drawer (200px, slides up) |
| Icon placement | Tap to place | Click to place |
| Icon removal | Double-tap | Right-click |
| Panel remove btn | Always visible badge | Hover-only |

---

## Files Affected

| File | Change |
|---|---|
| `src/index.css` | Full rewrite — new tokens, layout, component styles |
| `src/App.jsx` | Remove sidebar state; add tray open/close state; move title to toolbar |
| `src/components/Toolbar.jsx` | Add title input; update button styles |
| `src/components/StoryEditor.jsx` | Remove sidebar layout; mobile/desktop panel layout |
| `src/components/Panel.jsx` | Colored top stripe; updated remove button; mobile tap-to-place |
| `src/components/IconSidebar.jsx` | Rename/repurpose to `IconTray.jsx`; bottom tray layout; recent icons; search |
| `src/components/ConfirmModal.jsx` | Colored header stripe; updated styles |
| `src/components/LoadModal.jsx` | Card-style story list; panel count badge |
| `src/hooks/useStories.js` | No change |
| `src/data/icons.js` | No change |
| `package.json` | Add `@fontsource/righteous`, `@fontsource/nunito`; remove `@fontsource/bangers` |

---

## Out of Scope

- Export / print functionality
- Panel color picker (accent color is auto-assigned by position)
- Icon drag on mobile (tap-to-place is sufficient)
- Undo/redo
