---
name: project-hmr-already-works
description: GATE OS already has working Fast Refresh/HMR via Next.js — do not suggest or attempt migrating it to Vite
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-17T18:55:17.215Z
---

GATE OS is Next.js 15 (App Router), not Create React App — it already ships React Fast Refresh (Next's HMR implementation) via `npm run dev`. This was directly verified on 2026-09-17/18: the dev server ran continuously through dozens of file edits across ~20+ components with zero manual restarts, and a live before/after screenshot test (edit a component's visible text while the server kept running, no restart) confirmed the change appeared automatically.

**Why this matters:** the user asked to migrate the dev workflow to "Vite + React + HMR" because they'd been experiencing a stop/restart/edit/stop/restart cycle. Investigation found no technical HMR limitation — `DISABLE_HMR` (the one thing in `next.config.ts` that can disable file-watching) was not set anywhere in this checkout. Migrating to Vite would have been actively destructive: this app has a server-side API route (`app/api/ai/generate/route.ts`, added to fix a Gemini API key leak — see the AI Tutor/Mentor security work from this session), Next.js App Router file-based routing used pervasively (`next/navigation` hooks across 15+ pages), `next-themes`, and `next/dynamic` code-splitting — none of which Vite provides natively; a real migration would mean rewriting routing with React Router and standing up a separate backend for the API route, contradicting nearly every "preserve existing X" requirement in the user's own request.

**How to apply:** if asked again about slow dev workflow, restart-heavy iteration, or "switching to Vite," start from "this project already has working Fast Refresh, let's find the actual friction" rather than proposing a framework migration. Only reconsider if a *new*, concretely reproduced restart-is-required case shows up (e.g., editing `next.config.ts`, adding a new dependency, or changing `.env.local` — all of which legitimately require a restart in any bundler, Vite included, since they change server/build config rather than component code).
