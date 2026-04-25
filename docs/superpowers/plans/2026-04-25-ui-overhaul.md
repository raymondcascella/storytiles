# StoryTiles UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current neo-brutalist design with a bold "Pop" aesthetic — Righteous + Nunito fonts, cobalt/crimson/sunshine palette, sticker-shadow buttons — while making the app fully mobile-friendly by replacing the right sidebar with a slide-up icon tray.

**Architecture:** All CSS lives in `src/index.css`. Components are rewritten in place (no new routing or state management layers). `IconSidebar.jsx` is replaced by `IconTray.jsx`; all other components are modified in place. State that moved: story title management shifts to Toolbar; tray open/close state lives in App.

**Tech Stack:** React 19, Vite, Vitest + Testing Library, FontAwesome, `@fontsource/righteous`, `@fontsource/nunito`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Modify | Add Righteous + Nunito fonts, remove Bangers |
| `src/index.css` | Full rewrite | All CSS: tokens, layout, every component |
| `src/main.jsx` | Modify | Import new fonts instead of Bangers |
| `src/App.jsx` | Modify | Remove sidebar, add trayOpen state, update prop signatures, add confirmState.variant |
| `src/components/Toolbar.jsx` | Modify | Inline title input, colored pill buttons, dirty dot |
| `src/components/StoryEditor.jsx` | Modify | Remove title input, dashed add-panel card, responsive layout |
| `src/components/Panel.jsx` | Modify | Accent stripe, hover remove badge, right-click + double-tap remove |
| `src/components/IconTray.jsx` | Create | Bottom tray: recent icons, search, color/size controls, floating toggle |
| `src/components/IconSidebar.jsx` | Delete | Replaced by IconTray.jsx |
| `src/components/ConfirmModal.jsx` | Modify | Accept variant prop, render colored header stripe |
| `src/components/LoadModal.jsx` | Modify | Card-style story list with panel count badge |
| `src/components/Panel.test.jsx` | Create | Tests for icon placement and removal behaviors |
| `src/components/IconTray.test.jsx` | Create | Tests for recent icons tracking and search filtering |

---

## Task 1: Install fonts and rewrite CSS foundation

**Files:**
- Modify: `package.json`
- Modify: `src/main.jsx`
- Full rewrite: `src/index.css`

- [ ] **Step 1: Install font packages**

```bash
npm install @fontsource/righteous @fontsource/nunito
```

Expected: packages appear in `node_modules/@fontsource/righteous` and `node_modules/@fontsource/nunito`.

- [ ] **Step 2: Remove Bangers font package**

```bash
npm uninstall @fontsource/bangers
```

- [ ] **Step 3: Update font imports in src/index.css**

Replace the entire `src/index.css` with the following. This is the complete CSS for the finished app — all component styles are included here:

```css
@import '@fontsource/righteous';
@import '@fontsource/nunito';
@import '@fontsource/nunito/700.css';

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cobalt: #1847d4;
  --crimson: #e63946;
  --sunshine: #ffd60a;
  --ink: #111111;
  --page: #f7f5f0;
  --surface: #ffffff;
  --border: 2.5px solid var(--ink);
  --shadow: 3px 3px 0 var(--ink);
  --radius-panel: 16px;
  --radius-btn: 999px;
  --font-display: 'Righteous', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;
  --panel-width: 320px;
  --panel-height: 460px;
}

body {
  font-family: var(--font-body);
  background: var(--page);
  color: var(--ink);
  min-height: 100vh;
  min-height: 100svh;
}

#root {
  height: 100vh;
  height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── App ── */
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  min-height: 40px;
  border: var(--border);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow);
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.08s, box-shadow 0.08s;
  white-space: nowrap;
  background: var(--ink);
  color: #fff;
}

.btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--ink);
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--ink);
}

.btn:focus-visible {
  outline: 3px solid var(--cobalt);
  outline-offset: 2px;
}

.btn-new  { background: var(--cobalt);   border-color: var(--cobalt);   color: #fff; }
.btn-save { background: var(--crimson);  border-color: var(--crimson);  color: #fff; position: relative; }
.btn-load { background: var(--sunshine); border-color: var(--ink);      color: var(--ink); }
.btn-ghost { background: transparent; color: var(--ink); }
.btn-confirm { background: var(--cobalt); border-color: var(--cobalt); color: #fff; }

.btn-save.dirty::after {
  content: '';
  position: absolute;
  top: -4px; right: -4px;
  width: 10px; height: 10px;
  background: var(--sunshine);
  border: 2px solid var(--ink);
  border-radius: 50%;
}

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--ink);
  border-bottom: var(--border);
  flex-shrink: 0;
}

.toolbar-logo {
  font-family: var(--font-display);
  font-size: 20px;
  color: #00ccff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.toolbar-title {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.05em;
  text-align: center;
  min-width: 0;
  outline: none;
}

.toolbar-title::placeholder { color: rgba(255,255,255,0.35); }

.toolbar-title:focus {
  background: rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 4px 8px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.toolbar-actions .btn {
  padding: 6px 14px;
  min-height: 34px;
  font-size: 12px;
}

/* ── Editor layout (full-height below toolbar) ── */
.editor-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ── Story Editor ── */
.story-editor {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Desktop: horizontal scroll row */
.panels-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  align-items: flex-start;
}

/* Mobile: vertical scroll column */
@media (max-width: 767px) {
  .panels-container {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    align-items: stretch;
  }
}

/* ── Panel ── */
.panel {
  flex-shrink: 0;
  width: var(--panel-width);
  background: var(--surface);
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: var(--radius-panel);
  display: flex;
  flex-direction: column;
  overflow: visible;
  position: relative;
}

@media (max-width: 767px) {
  .panel { width: 100%; }
}

.panel-inner {
  border-radius: var(--radius-panel);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.panel-accent { height: 8px; flex-shrink: 0; }

.panel-remove-btn {
  position: absolute;
  top: -8px; right: -8px;
  width: 24px; height: 24px;
  background: var(--crimson);
  border: 2px solid var(--ink);
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.15s;
  padding: 0;
  line-height: 1;
}

.panel:hover .panel-remove-btn { opacity: 1; }

@media (max-width: 767px) {
  .panel-remove-btn { opacity: 1; }
}

.icon-zone {
  flex: 1;
  position: relative;
  background: var(--surface);
  cursor: crosshair;
  overflow: hidden;
  min-height: 280px;
}

.placed-icon {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  user-select: none;
  padding: 4px;
  line-height: 1;
}

.placed-icon:active { cursor: grabbing; }

.panel-caption {
  width: 100%;
  height: 88px;
  padding: 10px 14px;
  border: none;
  border-top: var(--border);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  flex-shrink: 0;
  background: var(--page);
}

.panel-caption:focus { outline: none; }
.panel-caption::placeholder { color: #aaa; }

/* ── Add Panel dashed card ── */
.add-panel-card {
  flex-shrink: 0;
  width: var(--panel-width);
  height: var(--panel-height);
  border: 2.5px dashed rgba(17,17,17,0.3);
  border-radius: var(--radius-panel);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 48px;
  color: rgba(17,17,17,0.25);
  background: transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  align-self: flex-start;
}

.add-panel-card:hover {
  background: rgba(17,17,17,0.04);
  color: rgba(17,17,17,0.5);
  border-color: rgba(17,17,17,0.5);
}

@media (max-width: 767px) {
  .add-panel-card {
    width: 100%;
    height: 80px;
    font-size: 28px;
    align-self: auto;
  }
}

/* ── Icon Tray (slide-up from bottom) ── */
.icon-tray {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #1a1a1a;
  border-top: var(--border);
  transform: translateY(100%);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.icon-tray.open { transform: translateY(0); }

@media (min-width: 768px) {
  .icon-tray { max-height: 220px; }
}

.tray-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.tray-search {
  padding: 5px 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 13px;
  width: 140px;
  outline: none;
  flex-shrink: 0;
}

.tray-search::placeholder { color: #555; }
.tray-search:focus { border-color: var(--cobalt); }

.tray-body {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 8px 72px;
  flex: 1;
}

.tray-section-label {
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555;
  padding: 4px 2px 6px;
}

/* ── Icon Grid ── */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
  gap: 2px;
  margin-bottom: 8px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
  color: #bbb;
  transition: background 0.1s, color 0.1s;
  user-select: none;
  font-size: 18px;
}

.icon-item svg { width: 18px; height: 18px; }
.icon-item:hover { background: #333; color: #fff; }

.icon-item.selected {
  background: var(--cobalt);
  color: #fff;
  animation: icon-bounce 0.22s ease;
}

@keyframes icon-bounce {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.2); }
}

.icon-item:focus-visible { outline: 2px solid #00ccff; outline-offset: 1px; }

/* ── Tray toggle (floating pill) ── */
.tray-toggle-btn {
  position: fixed;
  bottom: 16px; right: 16px;
  z-index: 200;
  background: var(--ink);
  color: #fff;
  border: var(--border);
  border-radius: var(--radius-btn);
  padding: 10px 18px;
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.08s, box-shadow 0.08s;
  white-space: nowrap;
}

.tray-toggle-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--ink);
}

.tray-toggle-btn.has-icon {
  background: var(--cobalt);
  border-color: var(--cobalt);
}

/* ── Size Picker ── */
.size-picker { display: flex; gap: 4px; flex-shrink: 0; }

.size-btn {
  width: 30px; height: 30px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #aaa;
  font-family: var(--font-display);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-btn.active { background: var(--cobalt); border-color: var(--cobalt); color: #fff; }
.size-btn:hover:not(.active) { color: #fff; }

/* ── Color Presets ── */
.color-presets { display: flex; gap: 4px; flex-wrap: wrap; }

.color-swatch {
  width: 22px; height: 22px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.color-swatch.active { border-color: #fff; }
.color-swatch:hover { border-color: rgba(255,255,255,0.5); }

/* ── Modals ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  background: var(--surface);
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 0;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-stripe { height: 8px; flex-shrink: 0; }

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.modal-message {
  font-family: var(--font-body);
  color: var(--ink);
  font-size: 16px;
  line-height: 1.5;
}

.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.modal-empty { color: #aaa; text-align: center; padding: 16px 0; font-family: var(--font-body); }

/* ── Load Modal list ── */
.story-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.story-card {
  display: flex;
  align-items: center;
  gap: 6px;
}

.story-card-load {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--page);
  border: var(--border);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  gap: 8px;
}

.story-card-load:hover { background: #e4e0d4; }

.story-card-title {
  font-family: var(--font-display);
  font-size: 15px;
  letter-spacing: 0.03em;
  color: var(--ink);
}

.story-card-meta {
  font-family: var(--font-body);
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.story-card-delete {
  flex-shrink: 0;
  width: 32px; height: 32px;
  background: transparent;
  border: none;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.story-card-delete:hover { color: var(--crimson); background: rgba(230,57,70,0.1); }

.modal-cancel { align-self: flex-end; }
```

- [ ] **Step 4: Verify dev server loads without crash**

```bash
npm run dev
```

Expected: Vite starts without errors. The app loads in the browser — fonts and base styles apply (the CSS imports Righteous/Nunito). Components may look unstyled/broken until later tasks update them — that is expected.

- [ ] **Step 5: Commit**

```bash
git add src/index.css package.json package-lock.json
git commit -m "feat: new CSS foundation — Righteous/Nunito fonts, Pop palette, full component styles"
```

---

## Task 2: Update Toolbar component

**Files:**
- Modify: `src/components/Toolbar.jsx`
- Modify: `src/App.jsx` (prop signature change for title handling)

- [ ] **Step 1: Write failing test**

Create `src/components/Toolbar.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar } from './Toolbar'

const noop = () => {}

it('renders the logo', () => {
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={noop} onSaveStory={noop} onLoadStory={noop} />)
  expect(screen.getByText(/storytiles/i)).toBeInTheDocument()
})

it('calls onTitleChange when title input changes', async () => {
  const user = userEvent.setup()
  const handler = vi.fn()
  render(<Toolbar title="My Story" isDirty={false} onTitleChange={handler} onCreateStory={noop} onSaveStory={noop} onLoadStory={noop} />)
  await user.clear(screen.getByPlaceholderText(/untitled/i))
  await user.type(screen.getByPlaceholderText(/untitled/i), 'X')
  expect(handler).toHaveBeenCalled()
})

it('save button has dirty class when isDirty is true', () => {
  render(<Toolbar title="" isDirty={true} onTitleChange={noop} onCreateStory={noop} onSaveStory={noop} onLoadStory={noop} />)
  expect(screen.getByRole('button', { name: /save/i })).toHaveClass('dirty')
})

it('calls onCreateStory, onSaveStory, onLoadStory on button clicks', async () => {
  const user = userEvent.setup()
  const onCreate = vi.fn(), onSave = vi.fn(), onLoad = vi.fn()
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={onCreate} onSaveStory={onSave} onLoadStory={onLoad} />)
  await user.click(screen.getByRole('button', { name: /new/i }))
  await user.click(screen.getByRole('button', { name: /save/i }))
  await user.click(screen.getByRole('button', { name: /load/i }))
  expect(onCreate).toHaveBeenCalledTimes(1)
  expect(onSave).toHaveBeenCalledTimes(1)
  expect(onLoad).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- Toolbar
```

Expected: FAIL — `Toolbar` does not accept `title`/`isDirty`/`onTitleChange` props yet.

- [ ] **Step 3: Rewrite Toolbar.jsx**

```jsx
export function Toolbar({ title, isDirty, onTitleChange, onCreateStory, onSaveStory, onLoadStory }) {
  return (
    <div className="toolbar">
      <span className="toolbar-logo">StoryTiles</span>
      <input
        className="toolbar-title"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="Untitled"
        aria-label="Story title"
      />
      <div className="toolbar-actions">
        <button className="btn btn-new" onClick={onCreateStory}>New</button>
        <button className={`btn btn-save${isDirty ? ' dirty' : ''}`} onClick={onSaveStory}>Save</button>
        <button className="btn btn-load" onClick={onLoadStory}>Load</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update App.jsx to pass new Toolbar props**

In `src/App.jsx`:

a) Change `handleTitleChange` — it previously received `(id, newTitle)` but Toolbar now just passes the string:

```js
function handleTitleChange(newTitle) {
  setCurrentStory(prev => ({ ...prev, title: newTitle }))
  setIsDirty(true)
}
```

b) Update the `<Toolbar>` JSX (remove old `onTitleChange` from `StoryEditor` props too — Step 4 in Task 4 handles `StoryEditor`, but Toolbar must work now):

```jsx
<Toolbar
  title={currentStory.title}
  isDirty={isDirty}
  onTitleChange={handleTitleChange}
  onCreateStory={handleCreateStory}
  onSaveStory={handleSaveStory}
  onLoadStory={handleLoadStory}
/>
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- Toolbar
```

Expected: PASS (4 tests).

- [ ] **Step 6: Check dev server — toolbar renders correctly**

```bash
npm run dev
```

Expected: black toolbar with "StoryTiles" logo (cyan), centered title input, three colored pill buttons (New=cobalt, Save=crimson, Load=yellow).

- [ ] **Step 7: Commit**

```bash
git add src/components/Toolbar.jsx src/components/Toolbar.test.jsx src/App.jsx
git commit -m "feat: Toolbar — inline title, colored pill buttons, dirty indicator"
```

---

## Task 3: Update Panel component

**Files:**
- Modify: `src/components/Panel.jsx`
- Modify: `src/components/StoryEditor.jsx` (pass `panelIndex` prop)
- Create: `src/components/Panel.test.jsx`

Panel changes:
- Add `panelIndex` prop → colored top accent stripe
- Remove button moves to a floating `×` badge (hover on desktop, always visible on mobile)
- Right-click placed icon → remove it (desktop)
- Click on placed icon stops propagation; double-click placed icon → remove it (mobile/both)

- [ ] **Step 1: Write failing tests**

Create `src/components/Panel.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Panel } from './Panel'

const basePanel = { id: 'p1', caption: '', icons: [] }
const noop = () => {}

function makePanel(overrides = {}) {
  return { ...basePanel, ...overrides }
}

it('renders caption textarea', () => {
  render(<Panel panel={makePanel()} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={noop} onIconMove={noop} onRemoveIcon={noop} onRemove={noop} />)
  expect(screen.getByPlaceholderText(/caption/i)).toBeInTheDocument()
})

it('calls onIconPlace when zone clicked with selectedIcon', () => {
  const onIconPlace = vi.fn()
  render(<Panel panel={makePanel()} panelIndex={0} selectedIcon="star" onCaptionChange={noop} onIconPlace={onIconPlace} onIconMove={noop} onRemoveIcon={noop} onRemove={noop} />)
  fireEvent.click(screen.getByTestId('icon-zone'))
  expect(onIconPlace).toHaveBeenCalledWith('p1', 'star', expect.any(Number), expect.any(Number))
})

it('does not call onIconPlace when zone clicked without selectedIcon', () => {
  const onIconPlace = vi.fn()
  render(<Panel panel={makePanel()} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={onIconPlace} onIconMove={noop} onRemoveIcon={noop} onRemove={noop} />)
  fireEvent.click(screen.getByTestId('icon-zone'))
  expect(onIconPlace).not.toHaveBeenCalled()
})

it('calls onRemoveIcon on context menu of placed icon', () => {
  const onRemoveIcon = vi.fn()
  const panel = makePanel({ icons: [{ id: 'i1', iconName: 'star', x: 50, y: 50, color: '#000', size: 'small' }] })
  render(<Panel panel={panel} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={noop} onIconMove={noop} onRemoveIcon={onRemoveIcon} onRemove={noop} />)
  fireEvent.contextMenu(screen.getByTitle('star'))
  expect(onRemoveIcon).toHaveBeenCalledWith('p1', 'i1')
})

it('calls onRemoveIcon on double-click of placed icon', () => {
  const onRemoveIcon = vi.fn()
  const panel = makePanel({ icons: [{ id: 'i1', iconName: 'star', x: 50, y: 50, color: '#000', size: 'small' }] })
  render(<Panel panel={panel} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={noop} onIconMove={noop} onRemoveIcon={onRemoveIcon} onRemove={noop} />)
  const iconEl = screen.getByTitle('star')
  vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1100)
  fireEvent.click(iconEl)
  fireEvent.click(iconEl)
  expect(onRemoveIcon).toHaveBeenCalledWith('p1', 'i1')
  vi.restoreAllMocks()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- Panel.test
```

Expected: FAIL — `panelIndex` prop does not exist yet; `data-testid="icon-zone"` attribute missing; double-click removal not implemented.

- [ ] **Step 3: Rewrite Panel.jsx**

```jsx
import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ACCENT_COLORS = ['#1847d4', '#e63946', '#ffd60a']
const SIZES = { small: '32px', medium: '48px', large: '64px' }

export function Panel({ panel, panelIndex, selectedIcon, onCaptionChange, onIconPlace, onIconMove, onRemoveIcon, onRemove }) {
  const zoneRef = useRef(null)
  const lastTapRef = useRef({})

  function getRelativeCoords(e) {
    const rect = zoneRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  function handleZoneClick(e) {
    if (!selectedIcon) return
    const { x, y } = getRelativeCoords(e)
    onIconPlace(panel.id, selectedIcon, x, y)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const data = JSON.parse(e.dataTransfer.getData('application/json'))
    const { x, y } = getRelativeCoords(e)
    if (data.type === 'sidebar-icon') {
      onIconPlace(panel.id, data.iconName, x, y)
    } else if (data.type === 'placed-icon') {
      onIconMove(data.fromPanelId, data.iconId, panel.id, x, y)
    }
  }

  function handleIconDragStart(e, icon) {
    e.stopPropagation()
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'placed-icon',
      fromPanelId: panel.id,
      iconId: icon.id,
    }))
  }

  function handleIconClick(e, icon) {
    e.stopPropagation()
    const now = Date.now()
    const last = lastTapRef.current[icon.id] ?? 0
    if (now - last < 300) {
      onRemoveIcon(panel.id, icon.id)
      lastTapRef.current[icon.id] = 0
    } else {
      lastTapRef.current[icon.id] = now
    }
  }

  function handleIconContextMenu(e, icon) {
    e.preventDefault()
    e.stopPropagation()
    onRemoveIcon(panel.id, icon.id)
  }

  const accentColor = ACCENT_COLORS[panelIndex % 3]

  return (
    <div className="panel">
      <button className="panel-remove-btn" onClick={() => onRemove(panel.id)} title="Remove panel">✕</button>
      <div className="panel-inner">
        <div className="panel-accent" style={{ background: accentColor }} />
        <div
          ref={zoneRef}
          className="icon-zone"
          data-testid="icon-zone"
          onClick={handleZoneClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {panel.icons.map(icon => (
            <span
              key={icon.id}
              className="placed-icon"
              title={icon.iconName}
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                color: icon.color ?? '#000000',
                fontSize: SIZES[icon.size] ?? '32px',
              }}
              draggable
              onDragStart={e => handleIconDragStart(e, icon)}
              onClick={e => handleIconClick(e, icon)}
              onContextMenu={e => handleIconContextMenu(e, icon)}
            >
              <FontAwesomeIcon icon={['fas', icon.iconName]} />
            </span>
          ))}
        </div>
        <textarea
          className="panel-caption"
          value={panel.caption}
          onChange={e => onCaptionChange(panel.id, e.target.value)}
          placeholder="Caption..."
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Pass panelIndex from StoryEditor**

In `src/components/StoryEditor.jsx`, update the `Panel` rendering inside the map:

```jsx
{story.panels.map((panel, idx) => (
  <Panel
    key={panel.id}
    panel={panel}
    panelIndex={idx}
    selectedIcon={selectedIcon}
    onCaptionChange={onCaptionChange}
    onIconPlace={onIconPlace}
    onIconMove={onIconMove}
    onRemoveIcon={onRemoveIcon}
    onRemove={onRemovePanel}
  />
))}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- Panel.test
```

Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/Panel.jsx src/components/Panel.test.jsx src/components/StoryEditor.jsx
git commit -m "feat: Panel — accent stripe, floating remove badge, right-click and double-tap removal"
```

---

## Task 4: Update StoryEditor — remove title input, dashed add-panel card

**Files:**
- Modify: `src/components/StoryEditor.jsx`

The title input moves to Toolbar (done in Task 2). The "Add Panel" button becomes a dashed card.

- [ ] **Step 1: Rewrite StoryEditor.jsx**

```jsx
import { Panel } from './Panel'

export function StoryEditor({ story, selectedIcon, onCaptionChange, onIconPlace, onIconMove, onRemoveIcon, onAddPanel, onRemovePanel }) {
  function handleContainerWheel(e) {
    e.preventDefault()
    e.currentTarget.scrollLeft += e.deltaY + e.deltaX
  }

  function handleContainerDrop(e) {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.type === 'placed-icon') onRemoveIcon(data.fromPanelId, data.iconId)
    } catch {}
  }

  return (
    <div className="story-editor">
      <div
        className="panels-container"
        onWheel={handleContainerWheel}
        onDragOver={e => e.preventDefault()}
        onDrop={handleContainerDrop}
      >
        {story.panels.map((panel, idx) => (
          <Panel
            key={panel.id}
            panel={panel}
            panelIndex={idx}
            selectedIcon={selectedIcon}
            onCaptionChange={onCaptionChange}
            onIconPlace={onIconPlace}
            onIconMove={onIconMove}
            onRemoveIcon={onRemoveIcon}
            onRemove={onRemovePanel}
          />
        ))}
        <button className="add-panel-card" onClick={onAddPanel} aria-label="Add panel">+</button>
      </div>
    </div>
  )
}
```

Note: `onTitleChange` prop removed entirely. `panelIndex` is now passed here (duplicating the Task 3 change — this is the canonical final state of the file).

- [ ] **Step 2: Remove onTitleChange from App.jsx's StoryEditor call**

In `src/App.jsx`, the `<StoryEditor>` JSX no longer needs `onTitleChange`:

```jsx
<StoryEditor
  story={currentStory}
  selectedIcon={selectedIcon}
  onCaptionChange={handleCaptionChange}
  onIconPlace={handleIconPlace}
  onIconMove={handleIconMove}
  onRemoveIcon={handleRemoveIcon}
  onAddPanel={handleAddPanel}
  onRemovePanel={handleRemovePanel}
/>
```

- [ ] **Step 3: Verify dev server — panels layout and add-panel card**

```bash
npm run dev
```

Expected: panels render in a horizontal row on desktop with a dashed `+` card at the end. No title input inside the panel area. Story title shows in the toolbar input.

- [ ] **Step 4: Commit**

```bash
git add src/components/StoryEditor.jsx src/App.jsx
git commit -m "feat: StoryEditor — remove title input, dashed add-panel card"
```

---

## Task 5: Create IconTray component

**Files:**
- Create: `src/components/IconTray.jsx`
- Create: `src/components/IconTray.test.jsx`

The tray replaces the sidebar. It renders as a fixed bottom panel that slides up/down. It is self-contained for recent icons and search state.

- [ ] **Step 1: Write failing tests**

Create `src/components/IconTray.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconTray } from './IconTray'

const noop = () => {}

function renderTray(overrides = {}) {
  return render(
    <IconTray
      isOpen={true}
      onToggle={noop}
      selectedIcon={null}
      onSelectIcon={noop}
      iconColor="#000000"
      onColorChange={noop}
      iconSize="small"
      onSizeChange={noop}
      {...overrides}
    />
  )
}

it('renders the tray toggle button', () => {
  renderTray({ isOpen: false })
  expect(screen.getByRole('button', { name: /icons/i })).toBeInTheDocument()
})

it('shows selected icon name in toggle button when an icon is selected', () => {
  renderTray({ isOpen: false, selectedIcon: 'star' })
  expect(screen.getByRole('button', { name: /star/i })).toBeInTheDocument()
})

it('calls onSelectIcon when an icon is clicked', async () => {
  const user = userEvent.setup()
  const onSelectIcon = vi.fn()
  renderTray({ onSelectIcon })
  const icons = screen.getAllByRole('button', { hidden: true })
  // Click the first icon item in the grid (not the toggle or size buttons)
  const iconItems = document.querySelectorAll('.icon-item')
  await user.click(iconItems[0])
  expect(onSelectIcon).toHaveBeenCalled()
})

it('adds a selected icon to the recent list', async () => {
  const user = userEvent.setup()
  renderTray({ onSelectIcon: noop })
  const iconItems = document.querySelectorAll('.icon-item')
  await user.click(iconItems[0])
  expect(screen.getByText(/recent/i)).toBeInTheDocument()
})

it('filters icons when search input changes', async () => {
  const user = userEvent.setup()
  renderTray()
  const search = screen.getByPlaceholderText(/search/i)
  const allBefore = document.querySelectorAll('.icon-item').length
  await user.type(search, 'zzzzzzzzz')
  const allAfter = document.querySelectorAll('.icon-item').length
  expect(allAfter).toBeLessThan(allBefore)
})

it('calls onSizeChange when size button clicked', async () => {
  const user = userEvent.setup()
  const onSizeChange = vi.fn()
  renderTray({ onSizeChange })
  await user.click(screen.getByRole('button', { name: /^m$/i }))
  expect(onSizeChange).toHaveBeenCalledWith('medium')
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- IconTray
```

Expected: FAIL — `IconTray.jsx` does not exist yet.

- [ ] **Step 3: Create src/components/IconTray.jsx**

```jsx
import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICONS } from '../data/icons'

const PRESET_COLORS = [
  '#111111', '#ffffff', '#e63946', '#f4a261',
  '#f9c74f', '#90be6d', '#43aa8b', '#4cc9f0',
  '#4361ee', '#7209b7', '#f72585', '#adb5bd',
]

const SIZES = [
  { key: 'small',  label: 'S' },
  { key: 'medium', label: 'M' },
  { key: 'large',  label: 'L' },
]

export function IconTray({ isOpen, onToggle, selectedIcon, onSelectIcon, iconColor, onColorChange, iconSize, onSizeChange }) {
  const [recentIconNames, setRecentIconNames] = useState([])
  const [search, setSearch] = useState('')

  const filteredIcons = useMemo(() =>
    search.trim()
      ? ICONS.filter(i => i.iconName.includes(search.trim().toLowerCase()))
      : ICONS,
    [search]
  )

  function handleSelect(iconName) {
    setRecentIconNames(prev => [iconName, ...prev.filter(n => n !== iconName)].slice(0, 8))
    onSelectIcon(iconName === selectedIcon ? null : iconName)
  }

  const recentSet = new Set(recentIconNames)
  const recentIconObjects = recentIconNames
    .filter(name => !search.trim() || name.includes(search.trim().toLowerCase()))
    .map(name => ICONS.find(i => i.iconName === name))
    .filter(Boolean)
  const mainIcons = filteredIcons.filter(i => !recentSet.has(i.iconName))

  const toggleLabel = isOpen
    ? '✕ Close'
    : selectedIcon
      ? `● ${selectedIcon}`
      : '🎨 Icons'

  return (
    <>
      <button
        className={`tray-toggle-btn${selectedIcon ? ' has-icon' : ''}`}
        onClick={onToggle}
        aria-label={toggleLabel}
      >
        {toggleLabel}
      </button>

      <div className={`icon-tray${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <div className="tray-controls">
          <div className="color-presets">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                className={`color-swatch${iconColor === color ? ' active' : ''}`}
                style={{ background: color }}
                onClick={() => onColorChange(color)}
                title={color}
              />
            ))}
          </div>
          <div className="size-picker">
            {SIZES.map(s => (
              <button
                key={s.key}
                className={`size-btn${iconSize === s.key ? ' active' : ''}`}
                onClick={() => onSizeChange(s.key)}
                aria-label={s.key}
              >{s.label}</button>
            ))}
          </div>
          <input
            className="tray-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search icons..."
            aria-label="Search icons"
          />
        </div>

        <div className="tray-body">
          {recentIconObjects.length > 0 && (
            <>
              <div className="tray-section-label">Recent</div>
              <div className="icon-grid">
                {recentIconObjects.map(icon => (
                  <span
                    key={icon.iconName}
                    className={`icon-item${icon.iconName === selectedIcon ? ' selected' : ''}`}
                    title={icon.iconName}
                    onClick={() => handleSelect(icon.iconName)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleSelect(icon.iconName)}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </span>
                ))}
              </div>
            </>
          )}

          {recentIconObjects.length > 0 && <div className="tray-section-label">All</div>}
          <div className="icon-grid">
            {mainIcons.map(icon => (
              <span
                key={icon.iconName}
                className={`icon-item${icon.iconName === selectedIcon ? ' selected' : ''}`}
                title={icon.iconName}
                draggable
                onClick={() => handleSelect(icon.iconName)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelect(icon.iconName)}
                onDragStart={e => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'sidebar-icon',
                    iconName: icon.iconName,
                  }))
                }}
              >
                <FontAwesomeIcon icon={icon} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- IconTray
```

Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/IconTray.jsx src/components/IconTray.test.jsx
git commit -m "feat: IconTray — bottom slide-up tray with recent icons, search, color/size controls"
```

---

## Task 6: Wire IconTray into App — remove sidebar

**Files:**
- Modify: `src/App.jsx`

This is the integration task: swap `IconSidebar` for `IconTray`, add `trayOpen` state, update the layout structure, and add `variant` to `confirmState`.

- [ ] **Step 1: Rewrite src/App.jsx**

```jsx
import { useState } from 'react'
import { useStories } from './hooks/useStories'
import { Toolbar } from './components/Toolbar'
import { ConfirmModal } from './components/ConfirmModal'
import { LoadModal } from './components/LoadModal'
import { IconTray } from './components/IconTray'
import { StoryEditor } from './components/StoryEditor'

function createPanel() {
  return { id: crypto.randomUUID(), title: '', caption: '', icons: [] }
}

function createNewStory() {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    panels: [createPanel(), createPanel(), createPanel()],
  }
}

export default function App() {
  const stories = useStories()
  const [currentStory, setCurrentStory] = useState(createNewStory)
  const [isDirty, setIsDirty] = useState(false)
  const [confirmState, setConfirmState] = useState(null)
  const [showLoad, setShowLoad] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [iconColor, setIconColor] = useState('#000000')
  const [iconSize, setIconSize] = useState('small')
  const [trayOpen, setTrayOpen] = useState(false)

  function withDirtyCheck(action) {
    if (!isDirty) { action(); return }
    setConfirmState({
      message: 'You have unsaved changes. Continue?',
      confirmLabel: 'Continue',
      variant: 'destructive',
      onConfirm: () => { setConfirmState(null); action() },
      onCancel: () => setConfirmState(null),
    })
  }

  function handleCreateStory() {
    withDirtyCheck(() => {
      setCurrentStory(createNewStory())
      setIsDirty(false)
      setSelectedIcon(null)
    })
  }

  function handleSaveStory() {
    const resolved = stories.resolveTitle(currentStory.title, stories.loadAll())
    setConfirmState({
      message: `Save as "${resolved}"?`,
      confirmLabel: 'Save',
      variant: 'save',
      onConfirm: () => {
        stories.save(currentStory)
        setIsDirty(false)
        setConfirmState(null)
      },
      onCancel: () => setConfirmState(null),
    })
  }

  function handleLoadStory() {
    withDirtyCheck(() => setShowLoad(true))
  }

  function handleLoad(story) {
    setCurrentStory(story)
    setIsDirty(false)
    setShowLoad(false)
    setSelectedIcon(null)
  }

  function handleTitleChange(newTitle) {
    setCurrentStory(prev => ({ ...prev, title: newTitle }))
    setIsDirty(true)
  }

  function handleCaptionChange(panelId, newCaption) {
    setCurrentStory(prev => ({
      ...prev,
      panels: prev.panels.map(p => p.id === panelId ? { ...p, caption: newCaption } : p),
    }))
    setIsDirty(true)
  }

  function handleIconPlace(panelId, iconName, x, y) {
    setCurrentStory(prev => ({
      ...prev,
      panels: prev.panels.map(p =>
        p.id === panelId
          ? { ...p, icons: [...p.icons, { id: crypto.randomUUID(), iconName, x, y, color: iconColor, size: iconSize }] }
          : p
      ),
    }))
    setIsDirty(true)
  }

  function handleIconMove(fromPanelId, iconId, toPanelId, x, y) {
    setCurrentStory(prev => {
      const icon = prev.panels.find(p => p.id === fromPanelId)?.icons.find(i => i.id === iconId)
      if (!icon) return prev
      return {
        ...prev,
        panels: prev.panels.map(p => {
          if (p.id === fromPanelId && p.id === toPanelId)
            return { ...p, icons: p.icons.map(i => i.id === iconId ? { ...i, x, y } : i) }
          if (p.id === fromPanelId) return { ...p, icons: p.icons.filter(i => i.id !== iconId) }
          if (p.id === toPanelId) return { ...p, icons: [...p.icons, { ...icon, x, y }] }
          return p
        }),
      }
    })
    setIsDirty(true)
  }

  function handleAddPanel() {
    setCurrentStory(prev => ({ ...prev, panels: [...prev.panels, createPanel()] }))
    setIsDirty(true)
  }

  function handleRemoveIcon(panelId, iconId) {
    setCurrentStory(prev => ({
      ...prev,
      panels: prev.panels.map(p =>
        p.id === panelId ? { ...p, icons: p.icons.filter(i => i.id !== iconId) } : p
      ),
    }))
    setIsDirty(true)
  }

  function handleRemovePanel(panelId) {
    setCurrentStory(prev => ({ ...prev, panels: prev.panels.filter(p => p.id !== panelId) }))
    setIsDirty(true)
  }

  function handleSelectIcon(iconName) {
    setSelectedIcon(iconName)
  }

  return (
    <div className="app">
      <Toolbar
        title={currentStory.title}
        isDirty={isDirty}
        onTitleChange={handleTitleChange}
        onCreateStory={handleCreateStory}
        onSaveStory={handleSaveStory}
        onLoadStory={handleLoadStory}
      />
      <div className="editor-layout">
        <StoryEditor
          story={currentStory}
          selectedIcon={selectedIcon}
          onCaptionChange={handleCaptionChange}
          onIconPlace={handleIconPlace}
          onIconMove={handleIconMove}
          onRemoveIcon={handleRemoveIcon}
          onAddPanel={handleAddPanel}
          onRemovePanel={handleRemovePanel}
        />
      </div>
      <IconTray
        isOpen={trayOpen}
        onToggle={() => setTrayOpen(o => !o)}
        selectedIcon={selectedIcon}
        onSelectIcon={handleSelectIcon}
        iconColor={iconColor}
        onColorChange={setIconColor}
        iconSize={iconSize}
        onSizeChange={setIconSize}
      />
      {showLoad && (
        <LoadModal
          stories={stories.loadAll()}
          onLoad={handleLoad}
          onDelete={title => stories.remove(title)}
          onClose={() => setShowLoad(false)}
        />
      )}
      <ConfirmModal
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        variant={confirmState?.variant ?? 'neutral'}
        onConfirm={confirmState?.onConfirm}
        onCancel={confirmState?.onCancel}
      />
    </div>
  )
}
```

- [ ] **Step 2: Delete the old sidebar file**

```bash
git rm src/components/IconSidebar.jsx
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: all tests pass. No import errors.

- [ ] **Step 4: Verify dev server — full layout check**

```bash
npm run dev
```

Expected:
- No sidebar on the right — panels fill the full width
- Floating "🎨 Icons" pill button in the bottom-right
- Clicking it slides up the icon tray from the bottom
- Selecting an icon updates the toggle button label to `● <iconname>`
- Clicking a panel zone with an icon selected places it

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/IconSidebar.jsx
git commit -m "feat: wire IconTray into App, remove sidebar, add tray open/close state"
```

---

## Task 7: Reskin ConfirmModal and LoadModal

**Files:**
- Modify: `src/components/ConfirmModal.jsx`
- Modify: `src/components/LoadModal.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/ConfirmModal.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { ConfirmModal } from './ConfirmModal'

const noop = () => {}

it('renders nothing when message is falsy', () => {
  const { container } = render(<ConfirmModal message={null} confirmLabel="OK" variant="neutral" onConfirm={noop} onCancel={noop} />)
  expect(container.firstChild).toBeNull()
})

it('renders message and confirm button', () => {
  render(<ConfirmModal message="Are you sure?" confirmLabel="Yes" variant="neutral" onConfirm={noop} onCancel={noop} />)
  expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument()
})

it('renders crimson stripe for destructive variant', () => {
  render(<ConfirmModal message="Delete?" confirmLabel="Delete" variant="destructive" onConfirm={noop} onCancel={noop} />)
  const stripe = document.querySelector('.modal-stripe')
  expect(stripe).toHaveStyle('background: #e63946')
})

it('renders green stripe for save variant', () => {
  render(<ConfirmModal message="Save?" confirmLabel="Save" variant="save" onConfirm={noop} onCancel={noop} />)
  const stripe = document.querySelector('.modal-stripe')
  expect(stripe).toHaveStyle('background: #2dc653')
})
```

Add to `src/components/LoadModal.test.jsx` (create it):

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoadModal } from './LoadModal'

const noop = () => {}

it('renders empty state when no stories', () => {
  render(<LoadModal stories={[]} onLoad={noop} onDelete={noop} onClose={noop} />)
  expect(screen.getByText(/no saved stories/i)).toBeInTheDocument()
})

it('renders story title and panel count', () => {
  const story = { id: '1', title: 'My Story', panels: [{ id: 'p1' }, { id: 'p2' }] }
  render(<LoadModal stories={[story]} onLoad={noop} onDelete={noop} onClose={noop} />)
  expect(screen.getByText('My Story')).toBeInTheDocument()
  expect(screen.getByText('2 panels')).toBeInTheDocument()
})

it('calls onDelete when delete button clicked', async () => {
  const user = userEvent.setup()
  const onDelete = vi.fn()
  const story = { id: '1', title: 'My Story', panels: [] }
  render(<LoadModal stories={[story]} onLoad={noop} onDelete={onDelete} onClose={noop} />)
  await user.click(screen.getByRole('button', { name: /✕/ }))
  expect(onDelete).toHaveBeenCalledWith('My Story')
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- ConfirmModal LoadModal
```

Expected: FAIL — `variant` prop not accepted; `.modal-stripe` not rendered; panel count not shown.

- [ ] **Step 3: Rewrite ConfirmModal.jsx**

```jsx
const STRIPE = {
  destructive: '#e63946',
  save:        '#2dc653',
  neutral:     '#1847d4',
}

export function ConfirmModal({ message, onConfirm, onCancel, confirmLabel, variant = 'neutral' }) {
  if (!message) return null
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-stripe" style={{ background: STRIPE[variant] ?? STRIPE.neutral }} />
        <div className="modal-body">
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn btn-confirm" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite LoadModal.jsx**

```jsx
import { useState } from 'react'

export function LoadModal({ stories: initial, onLoad, onDelete, onClose }) {
  const [stories, setStories] = useState(initial)

  function handleDelete(title) {
    onDelete(title)
    setStories(prev => prev.filter(s => s.title !== title))
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-stripe" style={{ background: '#1847d4' }} />
        <div className="modal-body">
          <h2 className="modal-title">Load Story</h2>
          {stories.length === 0 ? (
            <p className="modal-empty">No saved stories.</p>
          ) : (
            <ul className="story-list">
              {stories.map(story => (
                <li key={story.title} className="story-card">
                  <button className="story-card-load" onClick={() => onLoad(story)}>
                    <span className="story-card-title">{story.title}</span>
                    <span className="story-card-meta">{story.panels.length} panels</span>
                  </button>
                  <button className="story-card-delete" onClick={() => handleDelete(story.title)}>✕</button>
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn-ghost modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Verify modals look correct in dev server**

```bash
npm run dev
```

Expected:
- Save button triggers a confirm modal with a green stripe at the top
- New button (with unsaved changes) triggers a confirm modal with a crimson stripe
- Load modal shows story cards with panel count badge

- [ ] **Step 7: Commit**

```bash
git add src/components/ConfirmModal.jsx src/components/ConfirmModal.test.jsx src/components/LoadModal.jsx src/components/LoadModal.test.jsx
git commit -m "feat: ConfirmModal variant stripes, LoadModal card list with panel count"
```

---

## Task 8: Final visual pass — run the app, fix any rough edges

**Files:**
- Modify: `src/index.css` (targeted fixes only — no structural changes)

This task is a manual visual QA pass. Do not add new features.

- [ ] **Step 1: Start dev server and run through the golden path**

```bash
npm run dev
```

Checklist:
- [ ] Desktop: toolbar logo, title input, three buttons all visible and correctly colored
- [ ] Desktop: panels render in horizontal scroll row with accent stripe (cobalt/crimson/sunshine cycling)
- [ ] Desktop: dashed `+` card at the end of the panel row
- [ ] Desktop: panel remove badge appears on hover, disappears otherwise
- [ ] Desktop: floating `🎨 Icons` button in bottom-right
- [ ] Desktop: icon tray slides up smoothly, shows color swatches, size buttons, search, icon grid
- [ ] Desktop: selecting an icon updates toggle button label; placing icon in panel works
- [ ] Desktop: right-clicking a placed icon removes it
- [ ] Desktop: double-clicking a placed icon removes it
- [ ] Desktop: Save → confirm modal with green stripe; Continue (unsaved) → crimson stripe
- [ ] Desktop: Load → modal with card list, panel count, ✕ delete buttons
- [ ] Mobile (use DevTools responsive mode at 375px wide): panels stack vertically, full-width
- [ ] Mobile: add-panel card is short and full-width
- [ ] Mobile: panel remove badge is always visible (not hover-gated)
- [ ] Mobile: icon tray toggle still accessible and works correctly

- [ ] **Step 2: Fix any CSS issues found during QA**

If tray toggle button is hidden under tray when tray opens, add bottom offset to tray-body or position fix:

```css
/* In .tray-body — ensure content doesn't hide behind toggle button */
.tray-body {
  padding-bottom: 72px;
}
```

If mobile panels have too much padding eating screen space, reduce:

```css
@media (max-width: 767px) {
  .panels-container {
    padding: 16px;
    gap: 16px;
  }
}
```

If font doesn't load (Righteous/Nunito appear as fallback), verify `@fontsource` packages exist:

```bash
ls node_modules/@fontsource/righteous
ls node_modules/@fontsource/nunito
```

- [ ] **Step 3: Run full test suite one final time**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "fix: CSS polish from visual QA pass"
```

---

## Self-review checklist

- [x] **Spec coverage:**
  - Mobile-friendly layout → Tasks 1 (CSS breakpoints), 4 (vertical panels), 3 (always-visible remove badge)
  - Easier icon access → Task 5 (IconTray with recent + search), Task 6 (wired in App)
  - Righteous + Nunito fonts → Task 1
  - Cobalt/crimson/sunshine palette → Task 1 (CSS vars), Task 2 (toolbar buttons)
  - Panel accent stripes by index → Task 3
  - Dirty indicator on Save → Task 2 (`.btn-save.dirty::after`)
  - Floating tray toggle button → Task 5
  - Tap-to-place on mobile → already works via `onClick` (existing behavior, no special touch handling needed since click fires on tap)
  - Double-tap to remove → Task 3 (`handleIconClick` with `lastTapRef`)
  - Right-click to remove → Task 3 (`onContextMenu`)
  - ConfirmModal variant stripe → Task 7
  - LoadModal panel count → Task 7
  - Recent icons → Task 5
  - Search filter → Task 5

- [x] **No placeholders** — all steps contain complete code
- [x] **Type consistency** — `handleTitleChange(newTitle)` signature consistent across Task 2 and Task 6; `panelIndex` prop consistent across Task 3 and Task 4; `variant` prop consistent across Task 6 and Task 7
