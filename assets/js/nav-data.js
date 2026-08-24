/* Single source of truth for every page in the testbed.
   The header, sidebar, prev/next links and the index grid are all generated from this. */
window.TESTBED_PAGES = [
  { id: 'home', title: 'Overview', file: 'index.html', section: 'Start', root: true,
    desc: 'Hub with every section of the testbed.' },

  { id: 'forms-text', title: 'Text input', file: 'pages/forms-text.html', section: 'Forms',
    desc: 'Every text input type, inputmode, autocomplete token, textarea and contenteditable.' },
  { id: 'forms-selection', title: 'Selection controls', file: 'pages/forms-selection.html', section: 'Forms',
    desc: 'Checkbox, radio, switch, select, datalist, range, color, custom combobox.' },
  { id: 'forms-pickers', title: 'Pickers & calendars', file: 'pages/forms-pickers.html', section: 'Forms',
    desc: 'Native date/time pickers plus a custom calendar with range selection.' },
  { id: 'forms-validation', title: 'Validation & submit', file: 'pages/forms-validation.html', section: 'Forms',
    desc: 'Constraint validation, GET/POST submits, FormData, autofill-ready address and card form.' },

  { id: 'files', title: 'Files & drag-drop', file: 'pages/files.html', section: 'Media & files',
    desc: 'File inputs, directory upload, drop zone, paste, File System Access, downloads.' },
  { id: 'camera', title: 'Camera & microphone', file: 'pages/camera.html', section: 'Media & files',
    desc: 'capture attribute, getUserMedia, device switching, snapshots, screen capture, recording.' },
  { id: 'media', title: 'Audio, video & graphics', file: 'pages/media.html', section: 'Media & files',
    desc: 'video/audio elements, PiP, fullscreen, canvas, WebGL, SVG, responsive images.' },

  { id: 'navigation', title: 'Navigation & history', file: 'pages/navigation.html', section: 'Navigation',
    desc: 'Links, hashes, History API, routers, iframes, popups, redirects, beforeunload.' },
  { id: 'nav-step-1', title: 'Multi-page flow', file: 'pages/nav-step-1.html', section: 'Navigation',
    desc: 'Three real documents chained for back/forward and bfcache checks.' },
  { id: 'navigation-ui', title: 'Navigation UI', file: 'pages/navigation-ui.html', section: 'Navigation',
    desc: 'Navbar, drawer, mega menu, tabs, accordion, pagination, infinite scroll.' },
  { id: 'overlays', title: 'Overlays & dialogs', file: 'pages/overlays.html', section: 'Navigation',
    desc: 'dialog, popover, native prompts, toasts, tooltips, context menu, focus trap.' },

  { id: 'interactions', title: 'Pointer & keyboard', file: 'pages/interactions.html', section: 'Interaction',
    desc: 'Drag & drop, gestures, resize, clipboard, shortcuts, focus order, observers, animations.' },
  { id: 'data', title: 'Tables & data display', file: 'pages/data.html', section: 'Interaction',
    desc: 'Sortable/editable tables, tree grid, charts, loading and error states.' },
  { id: 'text', title: 'Typography & i18n', file: 'pages/text.html', section: 'Interaction',
    desc: 'Type scale, RTL and bidi, CJK, emoji, web fonts, overflow, print styles.' },

  { id: 'storage', title: 'Storage, network & permissions', file: 'pages/storage.html', section: 'Platform',
    desc: 'Cookies, localStorage, IndexedDB, service worker, workers, fetch, notifications, geolocation.' },
  { id: 'rendering', title: 'CSS & rendering', file: 'pages/rendering.html', section: 'Platform',
    desc: 'Grid, container queries, transforms, filters, blend modes, viewport units, zoom.' },
  { id: 'a11y', title: 'Accessibility', file: 'pages/a11y.html', section: 'Platform',
    desc: 'Landmarks, roles, live regions, keyboard-only flow, contrast and motion preferences.' },
  { id: 'features', title: 'Feature detection', file: 'pages/features.html', section: 'Platform',
    desc: 'Support report for ~70 web APIs, copyable as JSON.' },
  { id: 'stress', title: 'Performance stress', file: 'pages/stress.html', section: 'Platform',
    desc: 'Opt-in heavy DOM, huge tables, many animations, deep nesting, FPS meter.' }
];
