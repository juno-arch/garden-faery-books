# Garden Faery Books — Developer Guide

This guide is for Taya (or any AI tool like Ollama/Codex) to understand and modify this app without needing Claude.

## What This App Is

A single-file Progressive Web App (PWA) for tracking income, expenses, mileage, clients, and visits for a solo garden care business. It runs entirely in the browser — no server needed. Data lives in `localStorage` and can be exported/imported as Excel or JSON.

**Live at:** https://app.gardenfaery.love (hosted on GitHub Pages)

## File Structure

```
garden-faery-books/
├── index.html          ← THE ENTIRE APP (HTML + CSS + JS in one file, ~5800 lines)
├── sw.js               ← Service worker for offline caching
├── manifest.json       ← PWA manifest (name, icons, theme)
├── icon-192.png        ← App icon (small)
├── icon-512.png        ← App icon (large)
├── GardenFaeryBooks.xlsx ← Template Excel workbook
└── DEVELOPER-GUIDE.md  ← This file
```

## Architecture

Everything is in `index.html`. The file has three sections:

1. **CSS** (lines ~17-592) — All styles, in a `<style>` tag. Uses CSS custom properties for theming.
2. **HTML** (lines ~594-1410) — The UI structure. Tab panes, modals, forms.
3. **JavaScript** (lines ~1414-end) — All logic. State management, NLP parser, Cal.com sync, Excel export/import.

### Key Concepts

**State**: A single JS object called `state` stored in localStorage under key `garden_faery_books`. Contains arrays for: `income`, `expenses`, `mileage`, `receipts`, `invoices`, `clients`, `cards`, `leads`, `adminTime`, `visits`, `calBookings`, `odometer`. Plus `learned` (NLP patterns) and `settings`.

**Tabs**: 3 bottom tabs (Home, Clients, Chat) + sidebar tabs (History, Reports, Vehicle, Manual, Settings, etc). Switching tabs shows/hides `<div class="tab-pane">` elements.

**Chat Parser**: The NLP engine in `handleQuery()` parses natural language like "Dena 3hrs weeding $75" into structured income/expense/mileage entries. It uses regex patterns, not AI.

**Cal.com Sync**: `syncFromCal()` fetches bookings from Cal.com API v2 and creates income + visit + mileage entries. Free consultations are detected by title and set to $0.

**Excel**: Uses SheetJS (xlsx.full.min.js from CDN) for browser-side Excel export/import. The `exportExcel()` and `importExcel()` functions handle round-tripping data.

## How to Make Changes

### Quick CSS Changes

All colors come from CSS custom properties at the top of `<style>`:
- `--text-primary: #4a1942` — Deep plum (brand color)
- `--accent-1` — Pink/mauve
- `--accent-2` — Sage green
- `--highlight` — Gold
- `--bg` — Page background
- These change seasonally via JS at the bottom of the file (`applySeasonalPalette`)

Font is Nunito, loaded from Google Fonts. Both `--font-heading` and `--font-body` use it.

### Adding a New Data Field

1. Add the field to the relevant `state` array items (e.g., add `priority` to income entries)
2. Update the parser in `handleQuery()` if it should be settable via chat
3. Update the render function (e.g., `renderHistory()`, `renderRecentEntries()`)
4. Update Excel export in `exportExcel()` — add the column to the header array and data rows
5. Update Excel import in `importExcel()` — read the new column

### Adding a New Tab

1. Add a `<div class="tab-pane" id="tab-yourname">` in the HTML
2. Add a sidebar button: `<button class="sidebar-item" onclick="openSidebarTab('yourname')">...</button>`
3. Or add to bottom tab bar if it should be a primary tab

### Modifying the Chat Parser

The parser lives in `handleQuery(text)`. It works through a series of regex tests:

1. Slash commands (`/clockin`, `/miles`, `/odo`, etc.)
2. Natural language patterns (client name + hours, expense keywords + amounts, questions)
3. Fallback response

Each pattern creates a `pendingEntry` object and shows a confirmation bubble. When confirmed, `confirmEntry()` saves it to state.

### Changing Business Settings

Default rate, goal, IRS mileage rate, etc. are in the `state.settings` object. The Settings tab has form inputs that update these.

## How to Deploy

1. Edit `index.html` (or any file)
2. Bump the cache version in `sw.js` (change `garden-faery-books-v21` to `v22`, etc.)
3. Commit and push to GitHub:
   ```bash
   cd garden-faery-books
   git add -A
   git commit -m "description of change"
   git push origin main
   ```
4. GitHub Pages auto-deploys. May take 1-2 minutes.
5. On your phone/browser: hard refresh or clear site data to pick up the new service worker.

## Using Ollama / Codex to Edit

### With Ollama (local AI)

Run a code-capable model locally:
```bash
ollama run codellama
# or
ollama run deepseek-coder
```

Then paste sections of the code you want to change and ask the model to modify them. Copy the output back into `index.html`.

**Tip**: Don't paste the whole 5800-line file. Instead, copy just the function or section you want to change, tell the model what to do, and paste the result back.

### With Codex / Copilot

Open `index.html` in VS Code with Copilot enabled. Write a comment describing what you want, and Copilot will suggest code. For example:

```javascript
// Add a new expense category called "Education" to the category list
```

### Common Tasks

**Change hourly rate**: Search for `rate: 25` in the settings object, or change it in the app's Settings tab.

**Add a new expense category**: Search for `EXPENSE_KEYWORDS` and add your category. Also update the `<select>` dropdown in the receipt scanner form and the `cats` array if you're using the Excel template.

**Change the app name/branding**: Search for "Garden Faery" to find all instances.

**Fix a bug**: Open browser DevTools (F12), check the Console for errors. The error will tell you the line number.

## Key Functions Reference

| Function | What it does |
|----------|-------------|
| `loadState()` | Reads localStorage into `state` |
| `saveState()` | Writes `state` to localStorage |
| `handleQuery(text)` | Main NLP parser for chat input |
| `confirmEntry()` | Saves pending entry to state |
| `syncFromCal()` | Fetches Cal.com bookings |
| `exportExcel()` | Exports all data as .xlsx |
| `importExcel(input)` | Imports data from .xlsx |
| `refreshAll()` | Re-renders every tab/section |
| `refreshDashboard()` | Updates Home tab stats |
| `renderHistory()` | Renders All Entries list |
| `renderCalMonth()` | Draws the calendar grid |
| `renderClientsList()` | Renders client cards |
| `renderReports()` | Renders P&L and tax estimates |
| `renderVehicleTab()` | Renders vehicle/odometer section |
| `switchTab(name, btn)` | Switches bottom tabs |
| `openSidebarTab(name)` | Opens a sidebar tab |
| `showToast(msg)` | Shows a brief notification |

## Data Backup Strategy

Your data exists in three places:
1. **Browser localStorage** — auto-saved on every change. Clears if you clear browser data.
2. **Excel export** — hit "Export Excel" in Settings. Save the .xlsx file somewhere safe.
3. **JSON export** — same idea, but as raw JSON. Useful for full state restore.
4. **PocketBase cloud sync** — if configured, syncs between devices.

**Recommendation**: Export to Excel weekly. It's a real file you can open in Excel/Google Sheets/LibreOffice and edit directly if the app ever breaks.
