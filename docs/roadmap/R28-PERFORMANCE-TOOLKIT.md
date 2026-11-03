# R28: Performance toolkit ("Release 28: Fast")

*2 Nov 2026. Source: the owner's Instagram screenshot and the video (transcribed: 31 items, the post says "33"), plus the second video on enterprise AI agents (cache, routing, guardrails, evals). Module: `scripts/check-perf.mjs` (`npm run check:perf`, `BASE=https://gate.renyxera.workers.dev` for the live site). It loads real pages in an emulated phone and measures what can be measured; the rest is a reviewed checklist below.*

**How many can we achieve?** Of 31 items: **13 done**, **10 partly done**, **4 to do (all free)**, **4 do not apply or do not pay off on our free stack** (Cloudflare Workers + Supabase free tier). So **27 of 31 (87%) are achievable at $0**; the four that are not (Redis, OpenTelemetry, connection pooling, load balancing) are covered by what Cloudflare and Supabase already do.

Legend: DONE, PART (partly), TODO, N/A.

| # | Item | Status | What we have / what is left |
|---|------|--------|-----------------------------|
| 1 | Skeleton loading screens | DONE | `app/(dashboard)/loading.tsx` is now a page-shaped shimmer (hero card, tiles, card grid) used by every dashboard route; the topic browser has its own |
| 2 | WebP or AVIF images | DONE | Brand marks 396 KB to 16 KB, mentor art 181 KB to 20 KB (this release). `check:perf` flags any PNG/JPG over 20 KB |
| 3 | Prevent duplicate API calls | DONE | `/api/version` was fetched twice per page load; the timer and navigation check now share one 30 s window. `check:perf` reports duplicates |
| 4 | Debounce search and autocomplete | DONE | Audited 3 Nov 2026: every search box filters a small in-memory list (topics, bookmarks, mistakes, command palette); the only server call, the username check, is debounced. Topic browser now uses a deferred value so typing never waits on the list |
| 5 | Paginate API results | PART | Battles and lists are capped; PYQ list is client-side from static JSON |
| 6 | Static files through a CDN | DONE | Cloudflare serves everything from its edge |
| 7 | Background job queue | PART | Supabase scheduled functions and Telegram reminders exist; no general queue (not needed yet) |
| 8 | Fix N+1 queries | PART | RPCs are used for batches; audit `battles` list and leaderboard when Arena grows |
| 9 | Brotli or Gzip | DONE | Cloudflare sends Brotli; `check:perf` confirms 0 uncompressed text files |
| 10 | Redis cache | N/A | Replaced by `ai_response_cache` table (hash of the prompt, hit counter) and the browser IndexedDB cache; Redis would cost money |
| 11 | Remove unused dependencies | DONE | `depcheck` found six unused (`react-markdown`, `remark-gfm`, `@hookform/resolvers`, `class-variance-authority`, `tw-animate-css`, `firebase-tools`); removed, lockfile about 10,000 lines smaller, npm audit 40 to 27 findings; `mathjax-full` now declared for the scripts |
| 12 | Timeouts on external API calls | DONE | Razorpay, receipts, Turnstile, Telegram, OpenRouter models now abort after 10 s; the Mentor call already has a deadline |
| 13 | Stream AI responses | TODO | Mentor replies arrive whole. Streaming needs the model route to return SSE and the chat UI to append tokens; plan in R27 |
| 14 | Optimistic UI | PART | Chat messages and checklist ticks are instant; add to battle accept/decline and friend requests (R29) |
| 15 | Lazy-load images | DONE | `check:perf` counts below-the-fold images that are not lazy |
| 16 | Parallel requests | DONE | Pages use `Promise.all` for independent calls |
| 17 | Database indexes | PART | Indexes exist on the hot tables; add on `battle_entries(battle_id)`, `battles(owner_id,status)` with R29 |
| 18 | OpenTelemetry tracing | N/A | Needs a paid collector; use Cloudflare Workers logs plus the slow-call check in `check:perf` |
| 19 | Servers near the database | DONE | Checked 3 Nov 2026: Supabase project `renyxera-prod` is in Southeast Asia (Singapore, ap-southeast-1), about 60 ms from Mumbai. The region cannot be edited on an existing project; moving would mean a new project and a data migration, not worth it for 60 ms. Latency from the dev PC is not usable (Cloudflare routes it via Marseille) |
| 20 | SSR or build-time rendering | DONE | Next.js App Router pre-renders public pages |
| 21 | Third-party scripts after the page | PART | Turnstile and MathJax load on demand; keep them out of the first paint (check list in `check:perf`) |
| 22 | Split JavaScript by page | DONE | Next.js splits per route; `check:perf` shows JS weight per page |
| 23 | Virtualize long lists | TODO | Question lists over 200 rows (PYQ browser, Forge) |
| 24 | Select only needed columns | PART | Most queries name columns; audit `select("*")` |
| 25 | Connection pooling | N/A | Supabase REST (PostgREST) pools connections for us |
| 26 | Prevent re-renders | PART | Zustand selectors in hot screens; profile the exam screen |
| 27 | Browser caching for static files | DONE | `public/_headers`: `/_next/static/*` immutable for a year, `/brand/*` for a week. Before: `max-age=0` on all 276 files |
| 28 | Load balancing | N/A | Workers scale per request on Cloudflare's network |
| 29 | Self-host fonts, limit weights | DONE | `next/font` self-hosts; Looks load only the chosen Look's faces; `check:perf` lists faces in use |
| 30 | Real-user monitoring | DONE | Cloudflare Web Analytics is on; add Core Web Vitals log from `web-vitals` if wanted (free) |
| 31 | Test on slow phones and networks | DONE | `check:perf` emulates a Moto G4; run before each release |

Count check: DONE 2, 3, 6, 9, 12, 15, 16, 20, 22, 27, 29, 30, 31 (13); PART 1, 4, 5, 7, 8, 14, 17, 21, 24, 26 (10); TODO 11, 13, 19, 23 (4); N/A 10, 18, 25, 28 (4).

## From the second video (enterprise AI agent), applied to the Mentor
| Idea | Status in RENYXERA |
|------|--------------------|
| Semantic caching | PART: exact-prompt cache is live (`ai_response_cache`); near-duplicate matching needs embeddings (later) |
| Model routing (simple questions to a small model) | DONE: `route.model` and `route.maxOutputTokens` per request kind in `/api/ai/generate` |
| Guardrails against prompt injection | DONE this release: `lib/ai/guard.ts` blocks "ignore previous instructions" style input before any model call |
| Output PII redaction | N/A: Mentor never receives other students' data; answers come from shared question text |
| Per-user identity on every tool call | DONE: Supabase RLS and the signed-in check on each API |
| Evals before swapping models | TODO: a small fixed question set run against each candidate model; spec in R27 |

## Measured on the live site (phone emulation, before this release)
Text compression OK. Static files had no long cache (276 files). Two 397 KB PNGs on every page. `/api/version` called twice. `/api/version` and `/api/billing/me` about 1.6 s. Third parties: Cloudflare Insights, Turnstile, jsDelivr (MathJax), Supabase.

## After this release (local production build, phone emulation)
0 duplicate API calls, 0 images over 150 KB, 0 PNG/JPG over 20 KB, 0 uncompressed text. Still high: JavaScript about 3 MB per page uncompressed (1.5 MB on /login). Next step is a bundle analysis (`@next/bundle-analyzer`, free) to find what the public pages load that they do not need (MathJax and the exam engine are the first suspects).

## Bundle analysis (3 Nov 2026, local production build, uncompressed)
Home page loads 3,372 KB of JavaScript in 55 files; /login loads 1,509 KB in 24 files. Largest chunks on the home page: the chart library (recharts, 338 KB), the Supabase client (252 KB), the Turnstile and auth code, React and Next runtime. Cloudflare compresses these with Brotli, so the real transfer is roughly a quarter of that.
- **Found:** the top bar prefetched the goal panel (which carries recharts) at idle on every page.
- **Fixed:** it now prefetches on idle only on a 4g, non-data-saver connection; otherwise it loads when the student points at or focuses the goal button. Measured with a simulated 3g phone: home page 3,372 KB to 2,976 KB, 8 fewer files, chart chunk gone.
- **Already fine:** Sentry loads on demand, avatar styles load one at a time, MathJax loads only on question screens.
- **Next candidates:** the Supabase client is needed for sign-in on every page; the 333 KB and 278 KB chunks on the home page are not yet identified (run `@next/bundle-analyzer`, free, to name them).

## Release plan
1. This release: items 2, 3, 12, 27 and the injection guard; `check:perf` module. 
2. Next: 1, 4, 11, 19, 23 (all small).
3. Later with Arena: 8, 14, 17 and streaming (13).
