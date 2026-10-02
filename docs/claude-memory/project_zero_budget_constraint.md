---
name: project-zero-budget-constraint
description: "GATE OS must be built, hosted, and run entirely on free tiers — user has zero budget to spend"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-28T16:25:59.136Z
---

The user cannot spend any money on GATE OS for now — every dependency, service, hosting choice, and API must run on a genuinely free tier (not a trial that later requires billing). The app must still be deployable, usable, and accessible from anywhere (i.e. a real public URL, not just localhost).

**Why:** User stated explicitly on 2026-09-17: "Make sure all of these things should be completely free... I won't be able to invest a single rupee for now.. this app needs to be deployed, used and be accessible from anywhere."

**How to apply:**
- Hosting: prefer Vercel/Netlify/Cloudflare Pages free tier for the Next.js app.
- AI: Gemini API free tier (`@google/genai`) — watch rate limits, keep usage client-triggered/on-demand rather than background-heavy to avoid quota exhaustion.
- Data/storage: the app already leans on client-side IndexedDB (no Supabase/Postgres cost) — avoid introducing a paid backend; if a backend is ever needed, pick a free tier (e.g. Supabase free project) and flag the tradeoffs (row limits, pausing on inactivity) before adopting it.
- Before recommending or adding any new dependency/service, explicitly check whether it has a no-cost usage path for a single-user app, and say so.
- Flag any point where a "premium" feature from the product spec (e.g. heavy AI usage, export engines, PWA infra) risks paid-tier costs, so the user can decide before it's built.
- **Spending rule (2026-09-28):** anything costing money — beyond a one-time total of at most ₹100 across everything (never monthly) — goes to checklist.md's 🟡 Backlog, to be done once the app earns income. Includes services that need a payment card on file even for a free tier (Firebase Blaze OTP, Cloudflare R2, custom domain, custom SMTP, Play Store).
- **Custom domain: deliberately deferred until the app earns revenue** (user, 2026-09-25: "i will only buy with the revenue i get from the app"). Don't push buying one. Things blocked on it live in checklist.md's 🟡 Backlog: Google OAuth brand verification (needs DNS-level Domain property, impossible on workers.dev) and branded confirmation emails (custom SMTP). Site stays on gate.renyxera.workers.dev.
