# Where a new logo would go (ON HOLD: the owner decided on 7 Nov to keep the original logo)

[← Docs index](../README.md) · [Logo prompt](LOGO-MASTER-PROMPT.md) · [UI/UX plan](UIUX-OVERHAUL-PLAN.md)

Written 7 Nov 2026 from a search of the code and `public/`. When the owner has the new logo, **send Claude the files** (what to send is at the bottom). Claude updates everything in the repo; the owner updates the outside accounts listed in part B, which only the owner can log in to.

## Part A: Claude updates these (in the repo)

| Where | File(s) | Size or form | Note |
|---|---|---|---|
| Mark in the app (dock, top bar, intro, auth, share cards, receipts) | `public/brand/mark-light.png`, `mark-dark.png` (and `.webp` copies) | 626 × 840 | Used by `launch-intro`, `auth-modal`, `hero-section`, `profile-header`, `share-card`, `share-result-button`, `account-button`, `leaderboard-panel`. Will become one SVG so it is crisp at 16 to 512 px. |
| Full lockup | `public/brand/lockup-light.png`, `lockup-dark.png` | 1928 × 469 | Marketing pages, tier gates, plans, promo. |
| **Wordmark text in the interface** | `components/brand/wordmark.tsx` | **Live text, not an image** | Today: Bruno Ace SC with a cyan-violet-magenta gradient on "ERA". Change: "RENYX" in navy, "ERA" flowing from Powder Blue into Peach, to match the new logo; a code change, done as soon as the logo is final. |
| Wordmark images (legacy) | `public/brand/wordmark-light.png`, `wordmark-dark.png`, `tagline-light.png`, `tagline-dark.png` | 1523 × 157, 1565 × 44 | Replaced or retired depending on the new lockup. |
| Browser tab icons | `public/brand/favicon-16.png`, `favicon-32.png`, `app/icon.png` (192) | 16, 32, 192 | |
| iPhone home-screen icon | `public/brand/apple-touch-icon.png`, `app/apple-icon.png` | 180 | |
| App install icons (PWA) | `public/brand/icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png`, listed in `public/manifest.json` | 192, 512, maskable with the mark in the central 66 percent | Also used by the manifest shortcuts. |
| Google sign-in logo file | `public/brand/oauth-logo.png` | 512 × 512 | The file is replaced here; **the owner must also upload it** (part B). |
| Share and link-preview images | `public/og/default.png`, `gate-cse.png`, `gate-ece.png`, `gate-ee.png`, `gate-me.png`, `gate-ce.png`, `gate-da.png`, `custom-base.png`, `public/og/result/*`, `public/og/share/*` | 1200 × 630 | Regenerated from the new lockup and palette. |
| Phone and laptop install screenshots | `public/screenshots/*` (listed in the manifest) | 780 × 1688, 1280 × 720 | Retaken after the UI overhaul, not part of the logo. |
| Pro crown and Mentor mark | `components/brand/pro-crown.tsx`, `mentor-logo.tsx`, `mentor-mark.tsx` | Separate marks | The Mentor has its own mark; it gets the same palette, shape unchanged. |
| Branch images | `public/brand/branch/*`, `public/brand/mentor/*` | Various | Recoloured to the palette. |
| Telegram and Instagram generated posts | `scripts/telegram-*`, `scripts/social-*` card generators | | Header mark and colours. |
| Receipts, emails and legal headers | `app/(legal)/*`, receipt page | | Mark in the header. |
| The ad | `video/src/Ad.tsx` end card (currently the wordmark as plain text) | | Real lockup placed on the end card when the ad resumes. |
| Film assets | `video/public/mark-*.png`, `lockup-*.png` | | Same files as above. |

## Part B: the owner updates these (outside accounts; only the owner can log in)

| Where | What to upload | How |
|---|---|---|
| **Google sign-in screen** | `oauth-logo.png` (512 × 512, from part A) | Google Cloud Console, APIs and Services, OAuth consent screen, App logo. Google may re-review the app after a logo change. |
| **Razorpay checkout** | Logo (square, at least 256 × 256) | Razorpay Dashboard, Settings, Business details or Branding, upload the business logo (it shows on the payment window). |
| **Supabase sign-in emails** (if the templates show a logo) | Hosted logo URL | Supabase, Authentication, Email templates; use `https://gate.renyxera.workers.dev/brand/icon-192.png` after the deploy. |
| **Telegram** | Bot picture, hub channel and the six branch channels | BotFather `/setuserpic` for the bot; each channel: Edit, change the photo (use the 1024 app icon). |
| **Instagram** | Profile photo | Instagram, Edit profile (the 1024 icon, circle crop safe). |
| **YouTube channel** | Channel icon (800 × 800) and banner (2048 × 1152) | YouTube Studio, Customisation, Branding. |
| **GitHub** | Repository social preview (1280 × 640) and the owner avatar | Repository Settings, Social preview. |
| **Cloudflare** | None needed | The app is served from the Worker. |
| **Microsoft Store and Play Store** (later) | 300 × 300 and 512 × 512 icons plus screenshots | Partner Center and Play Console when those listings are made. |

## What to send Claude when the logo is ready

1. The mark and the lockups as **SVG** (best) or PNG at 2048 px: light background, dark background, one colour navy, one colour white.
2. The 1024 × 1024 app icon with the mark inside the central 66 percent.
3. The exact hex values the generator used if they differ from the palette (`#E9E8F8`, `#8DB9F0`, `#F5B69E`, `#1A1C29`, `#FFFFFF`).

Claude then renders every PNG size above from the SVG, replaces the files, updates the wordmark component, regenerates the share images, rebuilds, and checks the tab icon, the install icon, the share preview and the dark mode before reporting. The owner then goes through part B.
