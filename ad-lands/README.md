# Ad landings

Test landings for the insider ads that OrbitTap Portal shows. They are standalone pages: no
testbed shell and no entry in `assets/js/nav-data.js`.

| File | What it is |
|---|---|
| `land-1.html` … `land-3.html` | Three landings, one CTA each |
| `final.html` | The page the CTA leads to; has links to try back / forward / reload |

A CTA goes straight to `final.html?from=land-N`, the final link Portal saves. GitHub Pages
cannot answer with an HTTP 302, and Portal stores the first page that finishes loading after
the CTA, so a client-side redirect page in between would be stored in place of `final.html`.

`/getData` at the site root (a file with no extension) is the config answer: its `offer` key
carries the three landing links.

## Run

Point a debug build of the app at the config to become an insider with these landings. The
override exists only in debug builds:

```bash
SIMCTL_CHILD_ORBITTAP_CONFIGURATION_URL=https://rockitmediarnd.github.io/getData xcrun simctl launch booted com.portal.test.ios
```

Launch a clean install this way: an outsider from an earlier launch is never scanned again.
Keep the variable on later launches too; without it the app asks the real backend.
