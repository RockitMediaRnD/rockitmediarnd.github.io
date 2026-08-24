# Browser Testbed

A dependency-free static site that exercises as much of the web platform as a real site would —
built to be pointed at a browser under development.

No build step, no npm, no CDN. Every page is plain HTML, CSS and ES5-compatible JavaScript, so the
only thing between a test and the browser's native behaviour is the markup itself.

## What is covered

| Page | What it exercises |
| --- | --- |
| [Text input](pages/forms-text.html) | Every input type, `inputmode`, `autocomplete` token, textarea, `contenteditable`, IME composition, selection APIs |
| [Selection controls](pages/forms-selection.html) | Checkbox (incl. indeterminate), radio, switch, `select` (multiple, optgroup, 500 options), datalist, range (incl. dual-thumb), color, progress, meter, ARIA combobox, chips |
| [Pickers & calendars](pages/forms-pickers.html) | Native `date`/`time`/`datetime-local`/`month`/`week`/`color`, `showPicker()`, a custom calendar with range selection and locale switching, time wheels, timezones |
| [Validation & submit](pages/forms-validation.html) | Constraint validation, `setCustomValidity`, `:user-invalid`, real GET and POST submits, `FormData`, a multi-step form, an autofill-ready checkout form |
| [Files & drag-drop](pages/files.html) | File inputs (multiple, `accept`, `webkitdirectory`), drop zone with `DataTransfer` items and directory entries, paste, File System Access, downloads (blob, data URI, 5 MB), drag-out, streaming fetch progress |
| [Camera & microphone](pages/camera.html) | `capture` attribute, `getUserMedia`, device enumeration and switching, canvas snapshots, audio level meter, `getDisplayMedia`, `MediaRecorder` |
| [Audio, video & graphics](pages/media.html) | `<video>` with captions, PiP, fullscreen, rates, autoplay-policy probes, `<audio>`, Web Audio + visualiser, Media Session, PNG/JPEG/AVIF/HEIC/`<picture>`/`srcset`/lazy images, canvas 2D, WebGL |
| [Navigation & history](pages/navigation.html) | Links (`_blank`, `noopener`, downloads, `mailto:`/`tel:`/custom schemes), fragments and `:target`, History API, hash and history routers, `window.open`, `postMessage`, `beforeunload`, six kinds of iframe |
| [Multi-page flow](pages/nav-step-1.html) | Three real documents for back/forward, bfcache (`pageshow.persisted`), scroll and form-state restoration |
| [Navigation UI](pages/navigation-ui.html) | Navbar, drawer, mega menu, breadcrumbs, ARIA tabs, `<details>` accordion (incl. exclusive `name`), pagination, infinite scroll, a 100 000-row virtualised list, sticky headers |
| [Overlays & dialogs](pages/overlays.html) | `<dialog>` modal/non-modal/nested/scrollable, `alert`/`confirm`/`prompt`, Popover API, tooltips, toasts, custom context menu, bottom sheet, lightbox, focus trap |
| [Pointer & keyboard](pages/interactions.html) | HTML5 drag & drop, pointer-based sorting, resizing, swipe/long-press/double-tap, pinch-zoom, key reporting and shortcuts, tab order, Clipboard API, selection ranges, scroll snap, observers, CSS/WAAPI/view transitions |
| [Tables & data](pages/data.html) | Sortable, filterable, editable, selectable table with sticky header, tree grid, canvas and SVG charts, sparklines, loading/skeleton/empty/error states |
| [Typography & i18n](pages/text.html) | Type scale, Cyrillic/Greek/CJK/Arabic/Hebrew, bidi, emoji ZWJ sequences, Unicode normalisation, vertical writing, overflow and clamping, font fallback, `Intl` formatting, print styles |
| [Storage, network & permissions](pages/storage.html) | Cookies, `localStorage`/`sessionStorage` (+ quota probe and `storage` events), IndexedDB, Cache Storage, service worker and offline, workers, fetch/XHR/CORS/abort/beacon/WebSocket, geolocation, notifications, wake lock, share, battery, orientation |
| [CSS & rendering](pages/rendering.html) | Grid, subgrid, container queries, flex, 3D transforms, filters, blend modes, `backdrop-filter`, `clip-path`, masks, gradients, styled scrollbars, `svh`/`lvh`/`dvh`, `aspect-ratio`, safe areas, `@supports`, preference media queries |
| [Accessibility](pages/a11y.html) | Landmarks, labelling variants (incl. deliberate defects), live regions, ARIA widget roles and state, contrast swatches, reduced motion, forced colours, a keyboard-only walkthrough with a focus readout and a self-audit |
| [Feature detection](pages/features.html) | ~130 checks across scripting, forms, files, media, graphics, CSS, DOM, storage, network and device APIs, with a copyable JSON report |
| [Performance stress](pages/stress.html) | Opt-in: 50 000 nodes, 36 000-cell table, 500-level nesting, 1 000 animated elements, forced layouts, 60 image requests, 12 iframes, 500 timers, 20 000 listeners, 200 MB allocation, main-thread blocking, FPS meter |

## Test hooks

**1. `data-testid` on everything.** Around 2 200 stable selectors across the site, named
`<page>-<control>[-<variant>]`, e.g. `text-type-email`, `pick-cal-range-day-2026-08-14`, `ov-dialog-modal`.

**2. Event log.** Press <kbd>Alt</kbd>+<kbd>L</kbd> or the header button. It logs pointer, mouse, touch,
key, input, focus, form, drag, clipboard, scroll and navigation events with the target's `data-testid`,
filters by group, and survives page navigation (it lives in `sessionStorage`), so multi-page flows stay
traceable. "Copy JSON" puts the whole log on the clipboard.

**3. `window.__testbed`.**

```js
__testbed.version            // "1.0.0"
__testbed.page               // current page id
__testbed.pages()            // all page ids
__testbed.ids()              // every data-testid on this page
__testbed.get(id)            // the element
__testbed.value(id)          // value / checked / selected options / file list
__testbed.setValue(id, v)    // sets and dispatches input + change
__testbed.click(id)
__testbed.focus(id)
__testbed.state()            // every form control on the page as JSON
__testbed.reset()            // resets all forms
__testbed.events()           // the event log as data
__testbed.clearEvents()
__testbed.on(fn)             // subscribe to new log rows; returns an unsubscribe fn
__testbed.features()         // the feature-detection report
```

**4. Feature detection page** — the same report rendered, with per-API pass/partial/fail.

## Running locally

```bash
python3 -m http.server 8099
```

Then open <http://localhost:8099/>. Camera, clipboard, File System Access and service workers need a
secure context — `localhost` counts as one, as does the deployed HTTPS site.

## Layout

```
index.html            hub with a card per page
404.html              custom not-found document (served by GitHub Pages)
sw.js                 service worker for the offline check
assets/css/           one stylesheet: tokens, light/dark, layout, components
assets/js/nav-data.js the page registry — header, sidebar, prev/next and the index are generated from it
assets/js/testbed.js  the shell: chrome, event log, window.__testbed
assets/js/features.js the feature-detection table
assets/js/worker.js   worker used by the Storage page
assets/media/         locally generated samples: PNG/JPEG/AVIF/HEIC, MP4, WAV, M4A, VTT, PDF, CSV, JSON, TXT
pages/                one document per topic
```

Adding a page means creating the HTML file and adding one entry to `assets/js/nav-data.js`; navigation
everywhere else follows.

## Deliberate defects

Some things fail on purpose, because a testbed should include the unhappy paths:

- `pages/media.html` requests a missing image (404) and a HEIC image most engines cannot decode.
- `pages/navigation.html` links to a non-existent page and frames a cross-origin site that refuses framing.
- `pages/a11y.html` contains an unlabelled input and an icon-only button with no accessible name.
- `pages/storage.html` opens a WebSocket that a static host cannot serve, and POSTs where only GET is allowed.

## Conventions

- Only relative paths (the site is served from a `/browser-testbed/` sub-path).
- Everything degrades: unsupported APIs report "not supported" instead of throwing.
- Nothing heavy runs on load — the stress page does nothing until a button is pressed.
- No data leaves the browser. Forms echo their values on the page; nothing is transmitted anywhere.
