# Roadmap — release-wise detailed plan

*22 October 2026. The tracker is `../../checklist.md` (one line per task with its key sub-steps). These files hold the full detail of every open task: what, why, how, the files touched, "done when" (acceptance), dependencies and references.*

## Release map

| Release | Name | Status | Priority | Detail |
|---|---|---|---|---|
| 1–5 | Core, premium UI, AI, foundation, exam integrity | Done (small leftovers) | — | `../../archive/COMPLETED.md` |
| 6 | Monetisation I: SEO engine, legal, ads | Mostly done | — | `R13-MONETISATION.md` (ads), `R14-MARKETING-GROWTH.md` (SEO) |
| 7 | Monetisation II: payments, anti-misuse | Mostly done | — | `R13-MONETISATION.md`, `R16-SECURITY.md` |
| 8 | Multi-branch + revenue lines | Branches done; revenue lines open | — | `R13-MONETISATION.md` |
| 9 | Product depth and community | Not started | P5 | `R09-R10-DEPTH-AND-ADMIN.md` |
| 10 | Admin console | Not started | P6 | `R09-R10-DEPTH-AND-ADMIN.md` |
| **11** | **Forge** (original GATE-level questions and mocks) | Designed | **P1** | `R11-FORGE.md` |
| **12** | **Study materials** (separate paid product) | Planned | **P2** | `R12-STUDY-MATERIALS.md` |
| **13** | **Monetisation III** (conversion, new revenue) | Open | **P3** | `R13-MONETISATION.md` |
| **14** | **Marketing and growth** | Open | **P4** | `R14-MARKETING-GROWTH.md` |
| **15** | **Performance optimisation** (no quality loss) | Audited 22 Oct | **P1 (quick wins) / P3 (rest)** | `R15-PERFORMANCE.md` |
| **16** | **Security hardening** | Audited 22 Oct | **P1 (critical fixes) / P3 (rest)** | `R16-SECURITY.md` |
| **17** | **Microsoft Store app** (Windows, via PWA) | Planned | P4 | `R17-MICROSOFT-STORE.md` |
| **18** | **UI refresh** (dashboard first) | Planned 26 Oct | **P0** | `R18-UI-REFRESH.md` |
| 19 | Battles (live Beat my score) | Planned | P1 | `R19-BATTLES.md` |
| 20 | Solutions for every question | Planned; AI pre-gen status inside | P2 (after Forge) | `R20-SOLUTIONS.md` |
| — | Competitors (Swaseekh, Hatchable) | 26 Oct | — | `../competitors/COMPETITORS_2026-10.md` |
| — | Feature catalogue (proposals) | Ideas | owner picks | `FEATURES.md` |

## Task format used in every file

```
### ID · Title
What: one paragraph.
Why: the benefit (student, business, cost).
How: numbered steps, with files.
Done when: measurable acceptance checks.
Depends on: other tasks or owner decisions.
Refs: docs and code.
```

## Order of work across releases (recommended)

1. R16-A (dependency vulnerabilities, security headers) and R15-A (quick performance wins) — small, high impact, protect everything else.
2. R11 Forge foundation and first CS batch.
3. R12 Phase 0 (after decisions S1, S4).
4. R14 film/Instagram/Telegram items that only wait on the owner.
5. R13 conversion work alongside Forge launch.
6. R15/R16 remaining items, R17 Microsoft Store.
7. R9, R10.
