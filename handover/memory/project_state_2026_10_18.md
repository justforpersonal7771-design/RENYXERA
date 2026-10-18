---
name: project-state-2026-10-18
description: Where RENYXERA stood on 18 Oct 2026 (branches live, CS verified, Telegram/Instagram/film/cards state, what is open)
metadata:
  type: project
---

Live branches: CS, EC, EE, ME, CE, DA (CE 780 questions, 12 papers). No more branches for now (user decision, 18 Oct).
CS bank (data/Aggregated_Output.json) fully verified against the official papers 2017-2026: keys and wording. Fixes are applied through scripts/pyq/patch-cs.py.
Telegram: hub channel (updates only, no questions) + 6 branch channels (renyxera_gate_cs/_ece/_ee/_me/_ce/_da) post one PYQ daily with the answer as a tap-to-reveal spoiler; discussion group has topics; folder link https://t.me/addlist/fY_dvTl36FA3ZTQ1. Workflows: telegram-daily.yml (branches), telegram-hub.yml (GATE 2027 updates, countdown, mock reminder), social-publish.yml (calendar), social-check.yml.
Instagram: publisher built, user still has to do docs/instagram/01-SETUP.md.
Film v8: 4K landscape rendered (video/out/renyxera-film-v8-4k.mp4); vertical 1080 and 4K were rendering; Remotion project in video/.
Social cards: scripts/make-og.py generates public/og/* and public/brand/branch/*; final style approved: Bricolage ExtraBold title, DM Serif branch name, Sora chips, JetBrains Mono URL; custom share card = glass sender bar with Playfair italic tagline (components/growth/share-card.tsx).
Study materials: planning docs in docs/study-materials (00-12); waiting for user decisions (pricing, order, sources, reviewer, language, Phase 0 sample).
**Why:** the next session (new PC) must know the state without the old transcript.
**How to apply:** read checklist.md for open items; handover/HANDOVER.md for setup and state.
