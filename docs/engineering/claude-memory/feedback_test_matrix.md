---
name: feedback-test-matrix
description: "Every UI verification must cover desktop AND mobile widths, each in light AND dark mode"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-25T19:08:59.594Z
---

Whenever testing the app (Playwright screenshots/checks), always run the full matrix: desktop (e.g. 1440px) and mobile (e.g. 390px), each in both light and dark theme — four combinations minimum, and view the screenshots.

**Why:** User asked for this explicitly (2026-09-26) after the redesigned Focus Target panel looked perfect on desktop but had overlapping sections on mobile that a desktop-only check missed.

**How to apply:** Seed the theme with `localStorage.setItem('theme', ...)` in an init script and skip the splash with `sessionStorage.setItem('renyxera_intro_seen','1')`. Also check for horizontal scroll on mobile. Related: [[feedback-batch-deploys]].

**Screen padding rule (30 Sep 2026):** every dashboard screen uses ONLY the app shell's padding (client-layout `px-4 sm:px-6 md:px-8`) — page roots are `w-full` with no extra `p-*`, `max-w-*` or `mx-auto`. User flagged wasted side space on mocks/others.
