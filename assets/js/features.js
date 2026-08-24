/* Feature detection table used by pages/features.html and window.__testbed.features().
   Every check is a function returning true / false / a string note. Checks must never throw. */
(function () {
  'use strict';

  function has(obj, prop) { return !!obj && (prop in obj); }
  function css(prop, value) { try { return CSS.supports(prop, value); } catch (e) { return false; } }

  var CHECKS = [
    ['Documents & scripting', [
      ['ES2020 optional chaining', function () { try { return eval('({a:1})?.a === 1'); } catch (e) { return false; } }],
      ['ES modules (dynamic import)', function () { try { return new Function('return typeof import'); } catch (e) { return false; } }],
      ['BigInt', function () { return typeof BigInt === 'function'; }],
      ['WeakRef', function () { return typeof WeakRef === 'function'; }],
      ['structuredClone', function () { return typeof structuredClone === 'function'; }],
      ['Array.prototype.at', function () { return typeof [].at === 'function'; }],
      ['Object.groupBy', function () { return typeof Object.groupBy === 'function'; }],
      ['Promise.withResolvers', function () { return typeof Promise.withResolvers === 'function'; }],
      ['Temporal', function () { return typeof Temporal !== 'undefined'; }],
      ['WebAssembly', function () { return typeof WebAssembly === 'object'; }]
    ]],
    ['Forms & input', [
      ['input type=date', function () { var i = document.createElement('input'); i.type = 'date'; return i.type === 'date'; }],
      ['input type=color', function () { var i = document.createElement('input'); i.type = 'color'; return i.type === 'color'; }],
      ['input type=week', function () { var i = document.createElement('input'); i.type = 'week'; return i.type === 'week'; }],
      ['showPicker()', function () { return typeof HTMLInputElement.prototype.showPicker === 'function'; }],
      ['Constraint validation', function () { return typeof HTMLInputElement.prototype.checkValidity === 'function'; }],
      ['inputmode attribute', function () { return 'inputMode' in document.createElement('input'); }],
      ['datalist', function () { return 'options' in document.createElement('datalist'); }],
      ['contenteditable=plaintext-only', function () {
        var d = document.createElement('div');
        try { d.contentEditable = 'plaintext-only'; return d.contentEditable === 'plaintext-only'; }
        catch (e) { return false; }
      }],
      ['beforeinput event', function () { return 'onbeforeinput' in document.createElement('input'); }],
      ['FormData iteration', function () { return typeof FormData === 'function' && 'entries' in FormData.prototype; }]
    ]],
    ['Files & clipboard', [
      ['File System Access', function () { return typeof window.showOpenFilePicker === 'function'; }],
      ['webkitdirectory', function () { return 'webkitdirectory' in document.createElement('input'); }],
      ['DataTransferItem.webkitGetAsEntry', function () {
        return typeof DataTransferItem !== 'undefined' && 'webkitGetAsEntry' in DataTransferItem.prototype;
      }],
      ['Clipboard.writeText', function () { return !!(navigator.clipboard && navigator.clipboard.writeText); }],
      ['Clipboard.read (rich)', function () { return !!(navigator.clipboard && navigator.clipboard.read); }],
      ['ClipboardItem', function () { return typeof ClipboardItem === 'function'; }],
      ['Blob.stream()', function () { return typeof Blob === 'function' && 'stream' in Blob.prototype; }],
      ['URL.createObjectURL', function () { return typeof URL.createObjectURL === 'function'; }],
      ['CompressionStream', function () { return typeof CompressionStream === 'function'; }]
    ]],
    ['Media & capture', [
      ['getUserMedia', function () { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); }],
      ['getDisplayMedia', function () { return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia); }],
      ['MediaRecorder', function () { return typeof MediaRecorder === 'function'; }],
      ['ImageCapture', function () { return typeof ImageCapture === 'function'; }],
      ['capture attribute', function () { return 'capture' in document.createElement('input'); }],
      ['Picture-in-picture', function () { return typeof document.exitPictureInPicture === 'function'; }],
      ['Media Session', function () { return !!navigator.mediaSession; }],
      ['H.264 (MP4)', function () { return document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"') || 'no'; }],
      ['VP9 (WebM)', function () { return document.createElement('video').canPlayType('video/webm; codecs="vp9"') || 'no'; }],
      ['AV1', function () { return document.createElement('video').canPlayType('video/mp4; codecs="av01.0.05M.08"') || 'no'; }],
      ['HEVC', function () { return document.createElement('video').canPlayType('video/mp4; codecs="hvc1"') || 'no'; }],
      ['Ogg Vorbis', function () { return document.createElement('audio').canPlayType('audio/ogg; codecs="vorbis"') || 'no'; }],
      ['AAC', function () { return document.createElement('audio').canPlayType('audio/mp4; codecs="mp4a.40.2"') || 'no'; }],
      ['Web Audio', function () { return !!(window.AudioContext || window.webkitAudioContext); }],
      ['Web Speech (synthesis)', function () { return 'speechSynthesis' in window; }],
      ['Web Speech (recognition)', function () { return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window; }]
    ]],
    ['Graphics', [
      ['Canvas 2D', function () { return !!document.createElement('canvas').getContext('2d'); }],
      ['OffscreenCanvas', function () { return typeof OffscreenCanvas === 'function'; }],
      ['WebGL', function () { try { return !!document.createElement('canvas').getContext('webgl'); } catch (e) { return false; } }],
      ['WebGL 2', function () { try { return !!document.createElement('canvas').getContext('webgl2'); } catch (e) { return false; } }],
      ['WebGPU', function () { return 'gpu' in navigator; }],
      ['createImageBitmap', function () { return typeof createImageBitmap === 'function'; }],
      ['AVIF decoding', function () { return 'probe'; }],
      ['WebP decoding', function () { return 'probe'; }]
    ]],
    ['CSS', [
      ['Grid', function () { return css('display', 'grid'); }],
      ['Subgrid', function () { return css('grid-template-rows', 'subgrid'); }],
      ['Container queries', function () { return css('container-type', 'inline-size'); }],
      [':has()', function () { try { document.querySelector(':has(a)'); return true; } catch (e) { return false; } }],
      ['backdrop-filter', function () { return css('backdrop-filter', 'blur(2px)') || css('-webkit-backdrop-filter', 'blur(2px)'); }],
      ['dvh units', function () { return css('height', '100dvh'); }],
      ['oklch() colour', function () { return css('color', 'oklch(0.7 0.1 200)'); }],
      ['color-mix()', function () { return css('color', 'color-mix(in oklab, red, blue)'); }],
      ['display-p3', function () { return css('color', 'color(display-p3 1 0 0)'); }],
      ['text-wrap: balance', function () { return css('text-wrap', 'balance'); }],
      ['anchor positioning', function () { return css('anchor-name', '--a'); }],
      ['View transitions', function () { return typeof document.startViewTransition === 'function'; }],
      ['scrollbar-width', function () { return css('scrollbar-width', 'thin'); }],
      ['field-sizing', function () { return css('field-sizing', 'content'); }]
    ]],
    ['DOM & UI', [
      ['<dialog>', function () { return typeof HTMLDialogElement === 'function'; }],
      ['Popover API', function () { return HTMLElement.prototype.hasOwnProperty('popover'); }],
      ['<details name> (exclusive)', function () { return 'name' in document.createElement('details'); }],
      ['Custom elements', function () { return !!window.customElements; }],
      ['Shadow DOM', function () { return 'attachShadow' in Element.prototype; }],
      ['Declarative shadow DOM', function () { return 'shadowRootMode' in HTMLTemplateElement.prototype; }],
      ['IntersectionObserver', function () { return typeof IntersectionObserver === 'function'; }],
      ['ResizeObserver', function () { return typeof ResizeObserver === 'function'; }],
      ['MutationObserver', function () { return typeof MutationObserver === 'function'; }],
      ['Web Animations API', function () { return typeof Element.prototype.animate === 'function'; }],
      ['Pointer Events', function () { return 'onpointerdown' in window; }],
      ['Touch Events', function () { return 'ontouchstart' in window; }],
      ['visualViewport', function () { return !!window.visualViewport; }],
      ['Navigation API', function () { return 'navigation' in window; }],
      ['inert attribute', function () { return 'inert' in HTMLElement.prototype; }]
    ]],
    ['Storage & workers', [
      ['localStorage', function () { try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return true; } catch (e) { return 'blocked'; } }],
      ['sessionStorage', function () { try { sessionStorage.setItem('_t', '1'); sessionStorage.removeItem('_t'); return true; } catch (e) { return 'blocked'; } }],
      ['IndexedDB', function () { return !!window.indexedDB; }],
      ['Cache Storage', function () { return !!window.caches; }],
      ['StorageManager.estimate', function () { return !!(navigator.storage && navigator.storage.estimate); }],
      ['Service workers', function () { return 'serviceWorker' in navigator; }],
      ['Web workers', function () { return typeof Worker === 'function'; }],
      ['SharedWorker', function () { return typeof SharedWorker === 'function'; }],
      ['BroadcastChannel', function () { return typeof BroadcastChannel === 'function'; }],
      ['SharedArrayBuffer', function () { return typeof SharedArrayBuffer === 'function'; }],
      ['crossOriginIsolated', function () { return !!window.crossOriginIsolated; }]
    ]],
    ['Network', [
      ['fetch', function () { return typeof fetch === 'function'; }],
      ['AbortController', function () { return typeof AbortController === 'function'; }],
      ['Streams (ReadableStream)', function () { return typeof ReadableStream === 'function'; }],
      ['WebSocket', function () { return typeof WebSocket === 'function'; }],
      ['EventSource (SSE)', function () { return typeof EventSource === 'function'; }],
      ['sendBeacon', function () { return typeof navigator.sendBeacon === 'function'; }],
      ['WebRTC (RTCPeerConnection)', function () { return typeof RTCPeerConnection === 'function'; }],
      ['Network Information', function () { return !!navigator.connection; }],
      ['WebTransport', function () { return typeof WebTransport === 'function'; }]
    ]],
    ['Device & permissions', [
      ['Permissions API', function () { return !!navigator.permissions; }],
      ['Geolocation', function () { return !!navigator.geolocation; }],
      ['Notifications', function () { return 'Notification' in window; }],
      ['Push API', function () { return 'PushManager' in window; }],
      ['Vibration', function () { return typeof navigator.vibrate === 'function'; }],
      ['Wake Lock', function () { return !!navigator.wakeLock; }],
      ['Web Share', function () { return typeof navigator.share === 'function'; }],
      ['Web Share (files)', function () { return typeof navigator.canShare === 'function'; }],
      ['Battery Status', function () { return typeof navigator.getBattery === 'function'; }],
      ['Device orientation', function () { return typeof DeviceOrientationEvent !== 'undefined'; }],
      ['Gamepad', function () { return typeof navigator.getGamepads === 'function'; }],
      ['WebHID', function () { return 'hid' in navigator; }],
      ['Web Serial', function () { return 'serial' in navigator; }],
      ['Web USB', function () { return 'usb' in navigator; }],
      ['Web Bluetooth', function () { return 'bluetooth' in navigator; }],
      ['WebNFC', function () { return 'NDEFReader' in window; }],
      ['WebAuthn', function () { return !!(window.PublicKeyCredential); }],
      ['Payment Request', function () { return typeof PaymentRequest === 'function'; }],
      ['Credential Management', function () { return !!navigator.credentials; }],
      ['Idle Detection', function () { return typeof IdleDetector !== 'undefined'; }],
      ['Screen Wake / getScreenDetails', function () { return typeof window.getScreenDetails === 'function'; }],
      ['EyeDropper', function () { return typeof EyeDropper === 'function'; }]
    ]]
  ];

  function decodeProbe(name) {
    // 1×1 images: used to detect decoder support asynchronously
    var data = {
      'AVIF decoding': 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAABoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=',
      'WebP decoding': 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
    }[name];
    return new Promise(function (res) {
      if (!data) { res(false); return; }
      var img = new Image();
      img.onload = function () { res(img.width > 0); };
      img.onerror = function () { res(false); };
      img.src = data;
    });
  }

  window.TESTBED_FEATURES = {
    groups: CHECKS,
    /* Synchronous run: probe-based checks come back as the string "probe". */
    run: function () {
      var out = {};
      CHECKS.forEach(function (group) {
        out[group[0]] = {};
        group[1].forEach(function (item) {
          var v;
          try { v = item[1](); } catch (e) { v = 'threw ' + e.name; }
          out[group[0]][item[0]] = v;
        });
      });
      return out;
    },
    /* Async run: resolves the image-decoder probes too. */
    runAsync: function () {
      var report = this.run();
      var pending = [];
      Object.keys(report).forEach(function (g) {
        Object.keys(report[g]).forEach(function (k) {
          if (report[g][k] === 'probe') {
            pending.push(decodeProbe(k).then(function (v) { report[g][k] = v; }));
          }
        });
      });
      return Promise.all(pending).then(function () { return report; });
    }
  };
})();
