/* Browser Testbed shell.
   Builds the chrome around each page (header, sidebar, prev/next), runs the event
   log dock, and exposes window.__testbed for automation. No dependencies. */
(function () {
  'use strict';

  var VERSION = '1.0.0';
  var PAGES = window.TESTBED_PAGES || [];
  var body = document.body;
  var pageId = body.getAttribute('data-page') || 'home';
  var page = PAGES.filter(function (p) { return p.id === pageId; })[0] ||
             { id: pageId, title: document.title, file: '', section: '', desc: '' };
  var atRoot = !!page.root;
  var base = atRoot ? './' : '../';

  function href(p) { return base + p.file; }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  /* ------------------------------------------------------------------ chrome */

  function buildHeader(sidebar) {
    var menuBtn = el('button', {
      class: 'tb-btn tb-btn--sm tb-menubtn', type: 'button',
      'data-testid': 'shell-menu-toggle', 'aria-label': 'Toggle section menu',
      'aria-expanded': 'false', text: '☰'
    });
    menuBtn.addEventListener('click', function () {
      var open = sidebar.getAttribute('data-open') !== 'true';
      sidebar.setAttribute('data-open', String(open));
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    var themeBtn = el('button', {
      class: 'tb-btn tb-btn--sm', type: 'button', 'data-testid': 'shell-theme-toggle',
      title: 'Cycle theme: system → light → dark'
    });
    function paintTheme() {
      var t = document.documentElement.getAttribute('data-theme') || 'system';
      var icon = t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '◐';
      themeBtn.innerHTML = '';
      themeBtn.appendChild(el('span', { text: icon }));
      themeBtn.appendChild(el('span', { class: 'tb-btnlabel', text: ' ' + t }));
    }
    themeBtn.addEventListener('click', function () {
      var order = ['system', 'light', 'dark'];
      var cur = document.documentElement.getAttribute('data-theme') || 'system';
      var next = order[(order.indexOf(cur) + 1) % order.length];
      if (next === 'system') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('tb:theme', next); } catch (e) { /* storage may be blocked */ }
      paintTheme();
    });
    try {
      var saved = localStorage.getItem('tb:theme');
      if (saved && saved !== 'system') document.documentElement.setAttribute('data-theme', saved);
    } catch (e) { /* ignore */ }
    paintTheme();

    var logBtn = el('button', {
      class: 'tb-btn tb-btn--sm tb-logbtn', type: 'button',
      'data-testid': 'shell-log-toggle',
      html: '▤<span class="tb-btnlabel"> Event log</span>',
      title: 'Toggle the event log (Alt+L)'
    });

    var header = el('header', { class: 'tb-header' }, [
      menuBtn,
      el('a', { class: 'tb-header__brand', href: base + 'index.html',
        'data-testid': 'shell-home-link', html: 'Browser <span>Testbed</span>' }),
      el('span', { class: 'tb-header__crumbs', 'data-testid': 'shell-breadcrumbs',
        text: atRoot ? 'All sections' : (page.section + ' / ' + page.title) }),
      el('span', { class: 'tb-header__spacer' }),
      themeBtn,
      logBtn
    ]);
    body.insertBefore(header, body.firstChild);
    return logBtn;
  }

  function buildSidebar() {
    var nav = el('nav', { class: 'tb-sidebar', 'aria-label': 'Sections' });
    var seen = {};
    PAGES.forEach(function (p) {
      if (!seen[p.section]) {
        seen[p.section] = true;
        nav.appendChild(el('h3', { text: p.section }));
      }
      var a = el('a', { href: href(p), text: p.title, 'data-testid': 'nav-' + p.id });
      if (p.id === page.id) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    return nav;
  }

  function buildPageNav() {
    var i = PAGES.map(function (p) { return p.id; }).indexOf(page.id);
    var prev = i > 0 ? PAGES[i - 1] : null;
    var next = i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : null;
    var wrap = el('div', { class: 'tb-pagenav' });
    if (prev) wrap.appendChild(el('a', { href: href(prev), 'data-testid': 'shell-prev-page',
      html: '<small>Previous</small>' + prev.title }));
    else wrap.appendChild(el('span'));
    if (next) wrap.appendChild(el('a', { href: href(next), 'data-testid': 'shell-next-page',
      html: '<small>Next</small>' + next.title }));
    return wrap;
  }

  function buildLayout() {
    var main = document.querySelector('.tb-main');
    if (!main) return;
    var sidebar = buildSidebar();
    var layout = el('div', { class: 'tb-layout' });
    main.parentNode.insertBefore(layout, main);
    layout.appendChild(sidebar);
    layout.appendChild(main);

    if (!atRoot && !main.querySelector('.tb-page-title')) {
      var lede = el('p', { class: 'tb-page-lede', text: page.desc || '' });
      main.insertBefore(lede, main.firstChild);
      main.insertBefore(el('h1', { class: 'tb-page-title', text: page.title,
        'data-testid': 'page-title' }), main.firstChild);
    }
    main.appendChild(buildPageNav());
    return { sidebar: sidebar, main: main };
  }

  /* --------------------------------------------------------------- event log */

  var LOG_KEY = 'tb:log';
  var LOG_MAX = 500;
  var GROUPS = {
    pointer: ['pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'contextmenu'],
    mouse: ['click', 'dblclick', 'mousedown', 'mouseup'],
    touch: ['touchstart', 'touchend', 'touchmove', 'touchcancel'],
    key: ['keydown', 'keyup'],
    input: ['input', 'change', 'beforeinput'],
    focus: ['focusin', 'focusout'],
    form: ['submit', 'reset', 'invalid'],
    drag: ['dragstart', 'dragover', 'drop', 'dragend'],
    clip: ['copy', 'cut', 'paste'],
    scroll: ['scroll', 'wheel'],
    nav: ['popstate', 'hashchange', 'pageshow', 'pagehide', 'visibilitychange']
  };
  var NOISY = { pointermove: 1, mousemove: 1, touchmove: 1, scroll: 1, wheel: 1, dragover: 1 };
  var log = { rows: [], paused: false, on: {}, subs: [] };

  try {
    var stored = sessionStorage.getItem(LOG_KEY);
    if (stored) log.rows = JSON.parse(stored);
  } catch (e) { /* ignore */ }

  function persist() {
    try { sessionStorage.setItem(LOG_KEY, JSON.stringify(log.rows.slice(-LOG_MAX))); }
    catch (e) { /* quota or disabled storage */ }
  }

  function testidOf(node) {
    while (node && node.nodeType === 1) {
      if (node.hasAttribute && node.hasAttribute('data-testid')) return node.getAttribute('data-testid');
      node = node.parentNode;
    }
    return '';
  }

  function describe(ev) {
    var t = ev.target || {};
    var bits = [];
    if (ev.key !== undefined) bits.push('key=' + ev.key + (ev.repeat ? ' (repeat)' : ''));
    if (ev.clientX !== undefined && ev.clientX !== null && !NOISY[ev.type]) {
      bits.push('at=' + Math.round(ev.clientX) + ',' + Math.round(ev.clientY));
    }
    if (ev.pointerType) bits.push('pointer=' + ev.pointerType);
    if (ev.deltaY !== undefined) bits.push('dy=' + Math.round(ev.deltaY));
    if (t.files && t.files.length) bits.push('files=' + t.files.length);
    else if (t.type === 'checkbox' || t.type === 'radio') bits.push('checked=' + t.checked);
    else if (t.value !== undefined && typeof t.value === 'string' && t.value !== '') {
      bits.push('value=' + JSON.stringify(t.value.slice(0, 40)));
    }
    if (ev.type === 'submit' && t.tagName === 'FORM') bits.push('action=' + (t.getAttribute('action') || '(self)'));
    if (ev.inputType) bits.push('inputType=' + ev.inputType);
    if (!bits.length && t.tagName) bits.push('<' + t.tagName.toLowerCase() + '>');
    return bits.join(' ');
  }

  function push(type, target, detail) {
    if (log.paused) return;
    var row = {
      t: new Date().toTimeString().slice(0, 8) + '.' +
         String(new Date().getMilliseconds()).padStart(3, '0'),
      page: page.id, type: type, target: target || '', detail: detail || ''
    };
    log.rows.push(row);
    if (log.rows.length > LOG_MAX) log.rows.shift();
    persist();
    if (log.render) log.render(row);
    log.subs.forEach(function (fn) { try { fn(row); } catch (e) { /* subscriber error */ } });
  }

  function buildLogDock(logBtn) {
    var list = el('div', { class: 'tb-log__list', 'data-testid': 'log-list', role: 'log' });
    var filters = el('div', { class: 'tb-log__filters' });
    var dock = el('aside', { class: 'tb-log', 'data-testid': 'log-dock', 'data-open': 'false',
      'aria-label': 'Event log' });

    function rowNode(r) {
      return el('div', { class: 'tb-log__row' }, [
        el('span', { class: 'tb-log__t', text: r.t }),
        el('span', { class: 'tb-log__type', text: r.type }),
        el('span', { class: 'tb-log__target', text: r.target || '—' }),
        el('span', { class: 'tb-log__detail', text: r.detail })
      ]);
    }
    log.render = function (r) {
      var atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 24;
      list.appendChild(rowNode(r));
      while (list.childNodes.length > LOG_MAX) list.removeChild(list.firstChild);
      if (atBottom) list.scrollTop = list.scrollHeight;
    };
    log.rows.forEach(function (r) { list.appendChild(rowNode(r)); });

    Object.keys(GROUPS).forEach(function (g) {
      var on = g !== 'scroll' && g !== 'pointer';
      log.on[g] = on;
      var cb = el('input', { type: 'checkbox', 'data-testid': 'log-filter-' + g });
      cb.checked = on;
      cb.addEventListener('change', function () { log.on[g] = cb.checked; });
      filters.appendChild(el('label', {}, [cb, el('span', { text: g })]));
    });

    var pauseBtn = el('button', { class: 'tb-btn tb-btn--sm', type: 'button',
      'data-testid': 'log-pause', text: 'Pause' });
    pauseBtn.addEventListener('click', function () {
      log.paused = !log.paused;
      pauseBtn.textContent = log.paused ? 'Resume' : 'Pause';
    });
    var clearBtn = el('button', { class: 'tb-btn tb-btn--sm', type: 'button',
      'data-testid': 'log-clear', text: 'Clear' });
    clearBtn.addEventListener('click', function () {
      log.rows = []; persist(); list.textContent = '';
    });
    var copyBtn = el('button', { class: 'tb-btn tb-btn--sm', type: 'button',
      'data-testid': 'log-copy', text: 'Copy JSON' });
    copyBtn.addEventListener('click', function () {
      var text = JSON.stringify(log.rows, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = 'Copied';
          setTimeout(function () { copyBtn.textContent = 'Copy JSON'; }, 1200);
        }, function () { copyBtn.textContent = 'Denied'; });
      } else {
        copyBtn.textContent = 'No clipboard API';
      }
    });
    var closeBtn = el('button', { class: 'tb-btn tb-btn--sm', type: 'button',
      'data-testid': 'log-close', text: '✕', 'aria-label': 'Close event log' });

    dock.appendChild(el('div', { class: 'tb-log__bar' }, [
      el('strong', { text: 'Event log' }), pauseBtn, clearBtn, copyBtn, closeBtn
    ]));
    dock.appendChild(filters);
    dock.appendChild(list);
    body.appendChild(dock);

    function setOpen(open) {
      dock.setAttribute('data-open', String(open));
      logBtn.setAttribute('data-active', String(open));
      if (open) list.scrollTop = list.scrollHeight;
      try { sessionStorage.setItem('tb:log-open', String(open)); } catch (e) { /* ignore */ }
    }
    logBtn.addEventListener('click', function () {
      setOpen(dock.getAttribute('data-open') !== 'true');
    });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.altKey && (ev.key === 'l' || ev.key === 'L')) {
        ev.preventDefault();
        setOpen(dock.getAttribute('data-open') !== 'true');
      }
    });
    try { if (sessionStorage.getItem('tb:log-open') === 'true') setOpen(true); } catch (e) { /* ignore */ }

    // one delegated listener per event type, capture phase so nothing is missed
    Object.keys(GROUPS).forEach(function (group) {
      GROUPS[group].forEach(function (type) {
        var target = (type === 'popstate' || type === 'hashchange' ||
                      type === 'pageshow' || type === 'pagehide') ? window : document;
        var last = 0;
        target.addEventListener(type, function (ev) {
          if (!log.on[group]) return;
          if (NOISY[type]) {
            var now = Date.now();
            if (now - last < 120) return;
            last = now;
          }
          push(type, testidOf(ev.target), describe(ev));
        }, true);
      });
    });
  }

  /* ------------------------------------------------------------ testbed API */

  function byId(id) { return document.querySelector('[data-testid="' + id + '"]'); }

  function valueOf(node) {
    if (!node) return null;
    if (node.type === 'checkbox' || node.type === 'radio') return node.checked;
    if (node.type === 'file') {
      return Array.prototype.map.call(node.files || [], function (f) {
        return { name: f.name, size: f.size, type: f.type };
      });
    }
    if (node.multiple && node.tagName === 'SELECT') {
      return Array.prototype.filter.call(node.options, function (o) { return o.selected; })
        .map(function (o) { return o.value; });
    }
    if ('value' in node) return node.value;
    if (node.isContentEditable) return node.textContent;
    return node.textContent;
  }

  window.__testbed = {
    version: VERSION,
    get page() { return page.id; },
    pages: function () { return PAGES.map(function (p) { return p.id; }); },
    ids: function () {
      return Array.prototype.map.call(document.querySelectorAll('[data-testid]'), function (n) {
        return n.getAttribute('data-testid');
      });
    },
    get: byId,
    value: function (id) { return valueOf(byId(id)); },
    setValue: function (id, v) {
      var n = byId(id);
      if (!n) throw new Error('no element with data-testid=' + id);
      if (n.type === 'checkbox' || n.type === 'radio') n.checked = !!v;
      else if (n.isContentEditable && !('value' in n)) n.textContent = v;
      else n.value = v;
      n.dispatchEvent(new Event('input', { bubbles: true }));
      n.dispatchEvent(new Event('change', { bubbles: true }));
      return valueOf(n);
    },
    click: function (id) {
      var n = byId(id);
      if (!n) throw new Error('no element with data-testid=' + id);
      n.click();
      return true;
    },
    focus: function (id) { var n = byId(id); if (n) n.focus(); return document.activeElement === n; },
    state: function () {
      var out = {};
      Array.prototype.forEach.call(
        document.querySelectorAll('input[data-testid], select[data-testid], textarea[data-testid], [contenteditable][data-testid]'),
        function (n) { out[n.getAttribute('data-testid')] = valueOf(n); });
      return out;
    },
    reset: function () {
      Array.prototype.forEach.call(document.forms, function (f) { f.reset(); });
      document.dispatchEvent(new CustomEvent('testbed:reset'));
      return true;
    },
    events: function () { return log.rows.slice(); },
    clearEvents: function () { log.rows = []; persist(); return true; },
    on: function (fn) { log.subs.push(fn); return function () {
      log.subs = log.subs.filter(function (f) { return f !== fn; }); }; },
    log: function (type, detail) { push(type, 'manual', detail || ''); },
    features: function () {
      return window.TESTBED_FEATURES ? window.TESTBED_FEATURES.run() : { error: 'features.js not loaded' };
    }
  };

  /* ------------------------------------------------------------------ start */

  var layout = buildLayout();
  if (layout) {
    var logBtn = buildHeader(layout.sidebar);
    buildLogDock(logBtn);
    document.addEventListener('click', function (ev) {
      if (window.innerWidth > 860) return;
      if (layout.sidebar.getAttribute('data-open') !== 'true') return;
      if (layout.sidebar.contains(ev.target) || ev.target.closest('.tb-menubtn')) return;
      layout.sidebar.setAttribute('data-open', 'false');
    });
  }
  document.documentElement.setAttribute('data-testbed-ready', 'true');
})();
