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
| 10 | Admin console | Admin-lite built (R30); full console ON HOLD until the non-negotiable set is done | P6 | `R09-R10-DEPTH-AND-ADMIN.md`, `R10-ADMIN-SPEC.md`, `R30-ADMIN-CONSOLE.md` |
| **11** | **Forge** (original GATE-level questions and mocks) | Live: 329 CS questions (6 Nov); launch pieces and other branches open | **P1** | `R11-FORGE.md`, `../FORGE_GENERATOR_LOCAL.md`, `../FORGE_AUDIT_2026-11-06.md` |
| **12** | **Study materials** (separate paid product) | Planned | **P2** | `R12-STUDY-MATERIALS.md` |
| **13** | **Monetisation III** (conversion, new revenue) | Open | **P3** | `R13-MONETISATION.md` |
| **14** | **Marketing and growth** | Open | **P4** | `R14-MARKETING-GROWTH.md` |
| **15** | **Performance optimisation** (no quality loss) | Audited 22 Oct | **P1 (quick wins) / P3 (rest)** | `R15-PERFORMANCE.md` |
| **16** | **Security hardening** | Audited 22 Oct | **P1 (critical fixes) / P3 (rest)** | `R16-SECURITY.md` |
| **17** | **Microsoft Store app** (Windows, via PWA) | Planned | P4 | `R17-MICROSOFT-STORE.md` |
| **18** | **UI refresh** (dashboard first) | Planned 26 Oct | **P0** | `R18-UI-REFRESH.md` |
| 19 | Battles (live Beat my score) | Built (see R29 for the game layer) | P1 | `R19-BATTLES.md` |
| 20 | Solutions for every question | Planned; AI pre-gen status inside | P2 (after Forge) | `R20-SOLUTIONS.md` |
| 21 | AI Mentor | Built; backlog in R27 | — | `R21-AI-MENTOR.md` |
| 22 | Test Centre | Routes merged; leftovers open | — | `R22-TEST-CENTRE.md` |
| 24 | Mobile app (PWA first) | Plan only | — | `R24-MOBILE-APP.md` |
| 25 | Battle Arena (live rooms) | Design only, ON HOLD | — | `R25-BATTLE-ARENA.md`, `R25-ARENA-UX-DESIGN.md` |
| 26 | Design Studio and Looks | 5 Pro Looks live; the rest ON HOLD | — | `R26-DESIGN-STUDIO.md` |
| 27 | Mentor chat features | Backlog | — | `R27-MENTOR-CHAT-FEATURES.md` |
| 28 | Performance toolkit | Partly done | — | `R28-PERFORMANCE-TOOLKIT.md` |
| 29 | Battles as a game | Steps 1 to 4 built; seasons and badges open | — | `R29-BATTLES-AS-A-GAME.md` |
| 30 | Admin-lite (first slice of R10) | Built | — | `R30-ADMIN-CONSOLE.md` |

**All open work, grouped and prioritised: `../OPEN-ITEMS-2026-11-06.md`.**
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
