# Calibration sources

Where every number in `data/calibration/<branch>/<year>.json` comes from. Values are
facts (marks, ranks, counts) quoted from these pages; no text is copied. Recheck and
extend every March after results (checklist 4J "Annual recalibration").

| Key | Source | What we took |
|---|---|---|
| `collegedekho` | [CollegeDekho — GATE CSE Marks vs Rank vs Score](https://www.collegedekho.com/articles/gate-cse-marks-vs-rank-vs-score-analysis/) | 2023 and 2025 marks-vs-rank tables (their "2026 expected" table is **not** used) |
| `themlhub` | [The ML Hub — GATE CSE Marks vs Rank](https://themlhub.ai/blog/gate-cse-marks-vs-rank) | Combined 2024–2025 marks-vs-rank table; 2025 appeared (170,825, citing the official report); qualifying marks 2024–2026; Mt ≈ 78 for 2024; score formula constants |
| `careers360-toppers-2025` | [Careers360 — GATE 2025 toppers](https://news.careers360.com/gate-2025-toppers-list-out-rahul-kumar-singh-tops-cse-100-marks-subject-wise-air-holders) | 2025 CS topper: 100 marks |
| `collegedekho-toppers` | [CollegeDekho — GATE CSE toppers](https://www.collegedekho.com/amp/news/gate-cse-toppers-list-2025-with-marks-and-score-63147/) | 2024 CS topper: 90 marks, score 1000 |
| `careers360-stats` | [Careers360 — GATE statistical report](https://engineering.careers360.com/articles/gate-statistical-report) | 2024 CS appeared: 1,23,967 |
| `collegedunia-2026` | [Collegedunia — GATE 2026 cutoff analysis](https://collegedunia.com/articles/e-60-gate-2026-cutoff-analysis) | 2026 CS appeared: ~2,11,020 |
| `widely-reported` | Multiple portals (Shiksha, Careers360, CollegeDekho) | 2023 General qualifying mark 32.5 |
| Official category rule | GATE brochure | OBC-NCL/EWS qualifying = 90% of General; SC/ST/PwD = ⅔ of General — every stored category value matches this rule |
| Official formula | GATE information brochure (organising IIT) | Score = Sq + (St − Sq) × (M − Mq)/(Mt − Mq), Sq = 350, St = 900 |

**Confidence.** Official reports publish qualifying marks, topper data and the score
constants, but not a full marks↔rank table — those come from education portals compiling
candidate results, and they disagree (e.g. 65 marks in 2025 ≈ AIR 200–500 vs 600–1,500).
The app therefore blends the tables and shows a **range**, labelled with the years used.
Unknowns are stored as `null`, never guessed.

**Wanted:** the official GATE 2026 CS statistical report (Mt, rank distribution), and
opt-in anonymised scorecards from users (checklist 4J) to tighten the band.
