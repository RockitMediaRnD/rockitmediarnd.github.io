/* Dedicated worker used by the Storage page. */
self.onmessage = function (e) {
  var n = e.data && e.data.n ? e.data.n : 5000000;
  var t0 = Date.now();
  var acc = 0;
  for (var i = 0; i < n; i++) acc += Math.sqrt(i);
  self.postMessage({ n: n, result: Math.round(acc), ms: Date.now() - t0 });
};
