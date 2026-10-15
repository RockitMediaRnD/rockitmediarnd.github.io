# Ad landings

Test landings for the insider ads that OrbitTap Portal shows. They are standalone pages: no
testbed shell and no entry in `assets/js/nav-data.js`. Each page is self-contained (inline CSS,
JavaScript and SVG; one local image, `img/coast.svg`), has no trackers and no external fonts, and
sends nothing anywhere. Every name on them is invented, and every footer says
"Test content — RockitMedia R&D".

`/getData` at the site root (a file with no extension) is the config answer: its `offer` key
carries the three landing links below, in this order.

## Landings

A landing has one call to action (CTA): the first link or form the user activates. Each landing
has more than one button, as real landings do; all of them lead to the same final page.

| File | Style | What it tests |
|---|---|---|
| `lp-game.html` | App promo, dark | Dark gradient on `body` with no `background-color`, so the page gives the web view no background colour for the strip above it. Inline SVG hero, horizontal screenshot carousel, pulsing CTA. CTAs: a plain link (`final-app.html?from=lp-game`) and, at the bottom, a `target="_blank"` link (`?from=lp-game-blank`) |
| `lp-sweeps.html` | Sweepstakes, photo | Full-bleed `background-size: cover` image with `background-attachment: fixed`, a `backdrop-filter` card, and a red sticky top bar whose colour differs from the page colour (`#0b4f6c`). CTAs: a "Spin the wheel" button that sets `window.location` after a 1.9 s animation (`final-offer.html?from=lp-sweeps-js`), and a plain "Claim" link in the top bar that goes through `redirect.html` |
| `lp-quiz.html` | Lead-gen quiz, light | `<meta name="theme-color">`, `viewport-fit=cover` with `env(safe-area-inset-*)` padding, a looping countdown, a fixed bottom CTA bar, and a 3-step quiz. The CTA is the GET form submit from the bottom bar (`final-signup.html?from=lp-quiz&goal=…&level=…&time=…`). The "How does it work?" `#how` anchor on the same page must not count as the CTA |

## Final pages

Each final page is long enough to scroll, has a fixed bottom bar, tabs that link to `?p=2` and
`?p=3` of the same file (real navigations, for Back and Home), a same-page `#anchor` link, one
`target="_blank"` link, and a two-column layout in landscape. A "Test info" box shows the page
URL and its query parameters, so `sub1`–`sub4` on the stored final link can be read on screen.
The bottom bar buttons only show a toast.

| File | Style | Reached from |
|---|---|---|
| `final-app.html` | Dark, app-store-like product page | `lp-game.html` |
| `final-offer.html` | White, red sticky header, offer with FAQ and terms; no `viewport-fit=cover` | `lp-sweeps.html` |
| `final-signup.html` | Gradient top, registration-like; shows the quiz answers. Its form has no `action`, no named text field and cancels its own submit | `lp-quiz.html` |

## The client-side redirect

GitHub Pages cannot answer with an HTTP `302`. `redirect.html` stands in for a tracker that
redirects in the page instead: 300 ms after its `load` event it calls
`location.replace('final-offer.html' + location.search)`.

Portal stores the first page that finishes loading after the CTA. So for the "Claim" link the
stored final link is `redirect.html?from=lp-sweeps-bar&sub1=…&sub4=…`, not `final-offer.html`.
The redirect starts within 1.5 s of that page, so Portal reports it as
`portal_ad_land_client_redirect`; the stored link does not change. Each later open of the
stored link runs the redirect again.

## Expected results from the Portal code

These follow from reading `AdLandViewController` on OrbitTap `next/2.0`. They are not verified
on a device.

- A plain link, a `target="_blank"` link and a GET form submit are the CTA: the request gets
  `sub1`–`sub4`, and the final page shows Back, Home, Reload and Close.
- The `window.location` button on `lp-sweeps.html` starts a navigation of type `.other`. Portal
  counts only `.linkActivated`, `.formSubmitted` and new-window requests as the CTA, so this
  button leaves the landing without the CTA: no `sub1`–`sub4`, no final page controls, and the
  next link the user taps on `final-offer.html` becomes the CTA and its target the stored link.
- A `target="_blank"` link on a final page opens in the same web view.
- The strip above the web view takes the web view's `underPageBackgroundColor`. Expected: no
  page colour on `lp-game.html` (the system colour shows above a dark page), `#0b4f6c` on
  `lp-sweeps.html` (not the red bar), and the page colour on the others.

## Old pages

`land-1.html` … `land-3.html` and `final.html` are the first samples. They are no longer in
`/getData` but stay in place and unchanged, so a stored final link `final.html?from=land-N&…`
from an earlier install still opens. The changed `/getData` list makes Portal drop that link at
the next launch and open `lp-game.html` after the preloader.

## Run

Point a debug build of the app at the config to become an insider with these landings. The
override exists only in debug builds:

```bash
SIMCTL_CHILD_ORBITTAP_CONFIGURATION_URL=https://rockitmediarnd.github.io/getData xcrun simctl launch booted com.portal.test.ios
```

Launch a clean install this way: an outsider from an earlier launch is never scanned again.
Keep the variable on later launches too; without it the app asks the real backend.
