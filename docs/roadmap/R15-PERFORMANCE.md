# Release 15 — Performance optimisation (without losing quality)

*Audit 22 Oct 2026 by reading the code and data. Nothing here removes features, lowers image/maths quality, or changes behaviour; every change is measured before and after.*

## Targets (budgets)

| Metric | Target (phone, 4G, mid-range Android) | How measured |
|---|---|---|
| LCP | ≤ 2.0 s public pages, ≤ 2.5 s app pages | `scripts/check-cwv.mjs` (extend), Lighthouse CI |
| INP | ≤ 200 ms (exam palette, option click, next question) | Web Vitals in Cloudflare Web Analytics / Playwright trace |
| CLS | ≤ 0.05 | same |
| First-load JS per route | ≤ 180 KB gzip (app), ≤ 120 KB (public pages) | bundle analyser report in CI |
| Question image weight | −50 % or more vs today | script report |
| Worker CPU | < 10 ms p95 per request (free plan limit) | Cloudflare Worker analytics |

## Findings from the audit

1. **Images:** `public/images` holds **1,280 PNG files, 79 MB**; zero WebP/AVIF. Diagrams are the heaviest thing a student downloads.
2. **recharts on every app page:** `components/layout/topbar.tsx` imports `GoalSliderPanel` statically, which imports `recharts`. The top bar is on every dashboard page, so every page ships the chart library even if the panel is never opened.
3. **Full Prism highlighter:** `components/ui/code-block.tsx` imports `Prism` from `react-syntax-highlighter` (all languages) and is used by `components/exam/ast-node-renderer.tsx`, which renders every question (exam, review, public PYQ pages).
4. **Seven font families in the root layout** (`app/layout.tsx`: Manrope, Sora, Fraunces, JetBrains Mono, Playball, Cinzel, Bruno Ace SC). `next/font` preloads them on every route; Playball and Cinzel are used only in the dashboard hero.
5. **Question banks:** CS `questions.json` 824 KB, `public/data/shared` 3.5 MB; loaded as whole files.
6. **motion** imported in 81 files with full `motion` components (no `LazyMotion`).
7. **MathJax** loads from jsDelivr on demand (preconnect exists); typesetting runs on whole pages.
8. **Leftovers in `next.config.ts`:** `picsum.photos` remote pattern (unused), no `optimizePackageImports`.
9. **Third-party scripts:** Razorpay loads only on Plans (good); Turnstile only on auth (good); Sentry lazy (good); Cloudflare beacon deferred (good).

## Tasks

### R15-A · Quick wins (one batch, P1)

#### A1 · Lazy-load the goal slider panel (recharts off the critical path)
What: load `GoalSliderPanel` only when the user opens it.
How: in `components/layout/topbar.tsx` replace the static import with `const GoalSliderPanel = dynamic(() => import("./goal-slider-panel").then(m => m.GoalSliderPanel), { ssr: false, loading: () => <PanelSkeleton/> })`; keep the open/close animation by rendering the skeleton inside the same container.
Done when: recharts no longer appears in the shared/app-layout chunk in the bundle report; the panel opens with no visible delay (skeleton < 150 ms on 4G); analytics page charts unchanged.
Refs: `components/layout/topbar.tsx`, `components/layout/goal-slider-panel.tsx`.

#### A2 · Light syntax highlighter, loaded only when a question has code
How: switch to `PrismLight` and register only the languages present in the banks (c, cpp, java, python, sql, plus plain text); wrap `CodeBlock` in `next/dynamic` so pages without code blocks never download it; keep the `vscDarkPlus` look (import the style object only).
Done when: identical rendering on 10 code questions (C, SQL, Python) in light/dark; highlighter chunk ≥ 70 % smaller; public PYQ pages without code load no highlighter code.
Refs: `components/ui/code-block.tsx`, `components/exam/ast-node-renderer.tsx`.

#### A3 · Fonts: preload only what the first paint needs
How: in `app/layout.tsx` keep `preload: true` for Manrope (body), Sora (display) and Bruno Ace SC (wordmark); set `preload: false` for Fraunces, JetBrains Mono, Playball, Cinzel; restrict weights to the ones used (audit `font-*` classes); move Playball/Cinzel to the dashboard hero via a small font module so public pages never request them.
Done when: font requests on `/about` drop to ≤ 3 files; no layout shift from late fonts (`display: swap` + `adjustFontFallback`); visual diff of hero unchanged.

#### A4 · next.config hygiene
How: remove the `picsum.photos` pattern; add `experimental.optimizePackageImports: ["lucide-react", "recharts", "motion"]`; `compiler.removeConsole` for production with `exclude: ["error", "warn"]`.
Done when: build passes, bundle report shows smaller icon chunks.

#### A5 · Bundle analyser + CI budget
How: add `@next/bundle-analyzer` (dev, free) behind `ANALYZE=true`; a script `scripts/check-bundle.mjs` reading `.next` build stats and failing CI if a route's first-load JS exceeds the budget.
Done when: CI prints a per-route size table; budgets enforced.

### R15-B · Images (P1–P3)

#### B1 · Convert question images to WebP (lossless for line art), keep PNG fallback
How: `scripts/optimise-images.mjs` using `sharp` (update to ≥ 0.35.5 first, see R16-A1): for each PNG write `.webp` (lossless or near-lossless q 90 for diagrams; check text crispness), skip if WebP is not smaller; keep originals for the pipeline; update the image manifest with both; render with `<picture><source type="image/webp">` in `PremiumImageGallery`.
Done when: total images ≥ 50 % smaller; a side-by-side check of 30 diagrams (thin lines, subscripts) at 1× and 2× shows no visible loss in light and dark (dark-mode inversion filter still correct).
Refs: `components/exam/*gallery*`, `data/image-manifest.json`, `scripts/generate-manifest.ts`.

#### B2 · Responsive sizes and lazy loading
How: width/height attributes from the manifest (no CLS), `loading="lazy"` except the first image of the current question, `decoding="async"`, `fetchpriority="high"` on the current question's first image.
Done when: CLS 0 on question navigation; offscreen images not requested on public PYQ list pages.

#### B3 · Brand/OG/branch images
How: export `public/brand/*` and `public/og/*` as WebP alongside PNG (OG stays PNG for Telegram/WhatsApp compatibility); promo poster as WebP.
Done when: brand assets on app pages ≥ 40 % smaller.

### R15-C · Data loading (P2)

#### C1 · Split banks per paper and lazy-load
How: `copy-static-data.mjs` also writes `public/data/<CODE>/papers/<paper>.json` + an index; the repository loads the index first and fetches papers on demand (full-paper test, browse); keep the full file for offline download.
Done when: first visit to Practice downloads < 150 KB of bank data; offline mode still works after "download for offline".

#### C2 · Content-hashed filenames + long cache
How: name generated files with a short content hash (`questions.<hash>.json`) referenced from the manifest; set `Cache-Control: public, max-age=31536000, immutable` for hashed files (Cloudflare static assets honour `_headers`).
Done when: repeat visits fetch 0 bytes of bank data until the bank changes.

#### C3 · Shared pool on demand
How: load `public/data/shared/*` only when a test includes shared questions (it is 3.5 MB).
Done when: branch practice without shared questions never fetches the shared pool.

### R15-D · Runtime (P2)

#### D1 · LazyMotion
How: wrap the app in `<LazyMotion features={domAnimation}>` and replace `motion.div` with `m.div` progressively (codemod); keep reduced-motion behaviour.
Done when: motion's share of the main bundle drops ~25–30 KB gzip; animations identical.

#### D2 · Exam session render profile
How: React Profiler on `app/(dashboard)/exam/session`; isolate the timer (own component reading the store with a selector), memoise palette cells, avoid re-rendering the question body on every tick.
Done when: INP on option click ≤ 100 ms on a mid phone; no re-render of the question body per second.

#### D3 · MathJax scope
How: typeset only the question container that changed; cache typeset output per question id in memory; keep CHTML output (quality).
Done when: navigating between questions does not re-typeset the whole page (measured by MathJax timing logs).

#### D4 · Virtualise long lists
How: PYQ browse, mistakes, bookmarks, leaderboard and history lists > 100 rows use windowing.
Done when: scrolling 1,000 mistakes stays at 60 fps on desktop and ≥ 45 fps on phone.

### R15-E · Server and network (P2–P3)

#### E1 · Edge caching for public pages
How: make sure public marketing/PYQ pages are prerendered or cached at Cloudflare (`Cache-Control: public, s-maxage=86400, stale-while-revalidate`) and purged on deploy.
Done when: repeat requests are cache HITs (cf-cache-status) and Worker CPU per public request is near 0.

#### E2 · Database query review
How: run Supabase Performance Advisor; add missing indexes for leaderboards, attempts by user/date, mock_events, events; select only needed columns.
Done when: Advisor shows no "missing index"/"unused index" warnings on hot tables; leaderboard query < 50 ms.

#### E3 · Service worker strategy
How: precache app shell; stale-while-revalidate for hashed data; network-first for HTML with fast fallback; prefetch the next likely route (Practice → Exam).
Done when: second visit to the dashboard renders offline-capable in < 1 s on 4G.

### R15-F · Measurement (continuous)

#### F1 · Lighthouse CI + extended CWV script
How: add a GitHub Action running Lighthouse CI (free) on 8 public + 4 app pages (signed-in via the magic-link helper) on every push to main; extend `check-cwv.mjs` with INP and app pages.
Done when: CI shows scores and fails on budget regressions.

#### F2 · Real-user monitoring
How: send web-vitals (LCP/INP/CLS) to `/api/events` (sampled 10 %) and chart them in the admin dashboard (R10).
Done when: weekly p75 values visible per page.

## Order
A1–A5 → B1–B2 → C1–C3 → D1–D4 → E1–E3 → B3 → F1–F2.
