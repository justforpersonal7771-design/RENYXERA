# Forge CS audit: all 249 questions read and rated (6 Nov 2026)

Per-question ratings: `data/forge/CS/reports/audit_2026-11-06.json` (n, id, subject, kind, type, tier). Every question was read by hand against this rubric; code length was tried first and rejected as a measure (long verify code often belongs to simple counting).

| Tier | Meaning | Count | Share |
|---|---|---|---|
| T1 Basic | One concept, direct formula, recall or one short trace | 124 | 50% |
| T2 Standard | GATE-typical medium: one topic, several steps | 93 | 37% |
| T3b Borderline | Upper standard, close to Forge-grade | 4 | 2% |
| T3 Forge-grade | Combines concepts or needs modelling and misconception-aware reasoning, 3+ steps | 8 | 3% |
| GA | General Aptitude (numeric/logic), judged on its own scale | 20 | 8% |

Forge-grade (T3): recurrence n/log n, LR(0)/SLR conflicts, semaphore deadlock set, graph-family claims, fragmentation across two MTUs, closed attribute subsets, MST and second-best MST, monotone plus self-dual Boolean functions. Borderline: LR(1) vs LR(0) state counts, conflict-serializable schedule count, MST count, candidate keys with cycles.

By subject (T1 / T2 / T3+T3b): OS 12/12/1, COA 15/8/0, CN 16/5/1, Algorithms 10/9/3, DBMS 8/11/3, TOC 4/14/0, Digital Logic 11/6/1, Compiler 5/10/2, Discrete 7/8/1, C 11/3/0, Data Structures 9/3/0, Probability 8/2/0, Linear Algebra 6/1/0, Calculus 2/1/0, GA 20.

Other findings
- Subject tags wrong on at least four items: FORGE_CS_000122 (FD decomposition, tagged Discrete, is DBMS), _000123 (tank and pipes, tagged CN, is Aptitude), _000125 (timestamp ordering, tagged Digital Logic, is DBMS), _000133 (monotone Boolean functions, tagged C, is Digital Logic).
- Cross-subject blends: none in the strict sense. "multi_concept" items are mostly one topic with several steps.
- Difficulty labels were inflated: 160 labelled H, none X, 3 labelled E (the design forbids E).
- Heavy repetition: fragmentation 5 times, minimal-DFA state counting about 10, spanning-tree counting 4, IEEE decode 2, round-robin 5, cache bit/trace 8.
- No question is set in a realistic engineering scenario that needs modelling; "application" items are textbook problems with a story sentence.
- Earlier estimate (about 20% Forge-grade from a 40-item sample) was too generous: the full read gives 8 strict, 12 with borderline.
