---
name: project-data-content-foundation
description: "User-mandated data/content roadmap — calibration data (4J), practice bank (6D), study materials (6E), multi-branch acquisition (8C), annual March refresh"
metadata:
  node_type: memory
  type: project
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-25T19:33:58.470Z
---

The user requires (2026-09-26) that predictions and content rest on real, complete data. Recorded in the repo's master plan and checklist.md as:
- **4J · P0 Calibration Data** — official marks↔AIR, cut-offs, candidates, normalisation, schedule, syllabus; versioned `calibration/<branch>/<year>.json` + source ledger. Until it lands, `lib/goals/goal-engine.ts` uses an approximate RANK_MARKS curve that the UI labels as an estimate.
- **6D Practice bank** beyond PYQs — AI-draft → mandatory expert review; **Annual Trend Refresh every March** after new papers.
- **6E Study materials** per branch → section → subject → topic, original writing, linked to PYQs/practice, feeds SEO.
- **8C Multi-branch acquisition** — official papers + official answer keys + syllabus + calibration per branch; launch gate before a branch leaves "Coming Soon".

**Why:** accuracy of the predictor/goals and trustworthiness of content depend on complete data (user's words: "we need the data source and the complete data").

**How to apply:** Never present a prediction without its data vintage or an "estimate" label; when touching predictor/goals/readiness code, prefer wiring to calibration data. Keep the canonical plan in `RENYXERA_Master_Plan_Auth_Security_Monetization.md` (not the older GATE_OS Release-4 prompt file, which uses different numbering). Related: [[project-zero-budget-constraint]].
