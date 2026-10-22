# Release 16 — Security hardening

*Audit 22 Oct 2026. Strong already: private answer keys, RLS, server-side grading, Turnstile, origin checks, rate limits, signed Razorpay webhook, Telegram webhook secret, encrypted backups, device sessions, no secrets in git. Gaps found below. All fixes are free.*

## Findings

1. **No HTTP security headers** (no CSP, HSTS, X-Frame-Options/frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) in `middleware.ts`, `next.config.ts` or `public/_headers`.
2. **9 production dependency vulnerabilities** (`npm audit --omit=dev`, 22 Oct): critical `proxy-addr`; high `sharp`, `postcss`, `@xmldom/xmldom`, `source-map-js`, `@modelcontextprotocol/sdk`; moderate `next`, `hono`, `speech-rule-engine`. All have fixes.
3. **`html` AST nodes are injected with `dangerouslySetInnerHTML`** (`components/exam/ast-node-renderer.tsx`). Safe for our own bank, but the same node types are produced by `lib/ai/ai-response-parser.ts`, so AI output must never become raw HTML.
4. Rate limiting is per Worker isolate (best effort) for non-critical routes.
5. No `security.txt`, no dependency auto-updates, no documented key-rotation schedule.

## Tasks

### R16-A · Critical (P1, one batch)

#### A1 · Fix vulnerable dependencies
How: `npm audit fix` (no `--force`); upgrade `next` to the latest 15.x patch; `sharp` ≥ 0.35.5; re-run `npm audit --omit=dev`; full CI (type-check, build, checks, E2E).
Done when: 0 critical/high in production deps; app behaves identically (E2E green, desktop/mobile × light/dark).

#### A2 · Security headers
What: add headers for every response.
How: in `next.config.ts` `headers()` (and `public/_headers` for static assets):
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")`
- `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` (Google OAuth and Razorpay popups keep working)
- **CSP**, first as `Content-Security-Policy-Report-Only` for one week, then enforced: `default-src 'self'`; `script-src 'self' 'nonce-…' https://challenges.cloudflare.com https://checkout.razorpay.com https://static.cloudflareinsights.com https://cdn.jsdelivr.net` (+ EthicalAds when enabled); `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.ingest.sentry.io https://lumberjack.razorpay.com https://cloudflareinsights.com`; `img-src 'self' data: blob: https:`; `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`; `font-src 'self' data:`; `frame-src https://challenges.cloudflare.com https://api.razorpay.com https://www.youtube-nocookie.com`; `worker-src 'self' blob:`. Inline scripts in `app/layout.tsx` get a nonce from middleware.
Done when: securityheaders.com grade A; report-only week shows no legitimate violations; sign-in, Google OAuth, Turnstile, Razorpay checkout, MathJax, YouTube film, Sentry all work.

#### A3 · Sanitise HTML nodes
How: allow `html` nodes only from the question bank; the AI parser must emit text/markdown nodes only; add a tiny allow-list sanitiser (tags: sub, sup, br, b, i, u, span with class) before `dangerouslySetInnerHTML`; unit test with `<img onerror>` and `<script>` payloads.
Done when: XSS test payloads render as text; all 3,250 bank questions render unchanged (`scripts/validate-question-bank.mjs` + screenshot spot-check).

### R16-B · Accounts and secrets (P2)

- **B1 · 2FA on every owner account**: GitHub, Cloudflare, Supabase, Google, Razorpay, Meta, Telegram (owner action; click-by-click steps to be given).
- **B2 · Key-rotation runbook**: Supabase service role, Gemini, Razorpay, Telegram bot, PREGEN/REWARD secrets — rotate yearly or on suspicion; document in `docs/TECHNICAL_REFERENCE.md` §13.
- **B3 · GitHub protections**: enable secret scanning + push protection and Dependabot alerts/updates (free); branch protection on `main` requiring CI.
- **B4 · Optional student 2FA (TOTP)** via Supabase MFA (free) for Plus/Pro accounts; prompt after purchase.

### R16-C · Abuse and traffic (P2)

- **C1 · Shared rate limits** for login-adjacent and expensive routes using Postgres counters (like `consume_ai_call`) or Cloudflare's free rate-limiting rule for `/api/*`.
- **C2 · Turnstile on more forms**: waitlist, report-question, contact.
- **C3 · Bot Fight Mode / WAF free managed rules** on the zone once a custom domain exists (workers.dev has limited controls).
- **C4 · Webhook replay protection**: store processed Razorpay event ids; reject duplicates (verify current reconcile logic).

### R16-D · Data protection and privacy (P2)

- **D1 · Supabase Security Advisor** run and clear all warnings (RLS disabled, security-definer search_path, exposed views).
- **D2 · RLS review table by table** with a script that tries anon/auth reads of every private table (`scripts/check-security.mjs` extension).
- **D3 · DPDP retention policy**: events, AI logs, device sessions — automatic deletion after N days; consent records for marketing messages; minors' data handling (no behavioural ads to under-18s).
- **D4 · Privacy policy update** for Forge, study materials, share cards, Telegram channels, Instagram.

### R16-E · Monitoring and response (P3)

- **E1 · Sentry alert rules** (new issue, spike) to the owner's email/Telegram.
- **E2 · Security event log** (sign-ins from new devices, password changes, payment failures) visible to the user in Profile → Devices.
- **E3 · `/.well-known/security.txt`** with a contact and a responsible-disclosure page.
- **E4 · Quarterly restore drill** of the encrypted backup; incident-response checklist (rotate keys, rollback, notify users).

## Order
A1 → A3 → A2 (report-only → enforce) → B3 → D1–D2 → C1–C4 → B1–B2 → D3–D4 → E1–E4 → B4.
