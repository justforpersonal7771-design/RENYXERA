# PYQ pipeline: official GATE papers → one verified JSON per branch

Strategy: `docs/PYQ_ACQUISITION_STRATEGY.md`. **Working rules: `docs/PYQ_EXTRACTION_HANDBOOK.md`** (extraction is done by Claude, not Gemini).

## Folders

| Path | What | In git? |
|---|---|---|
| `data/pyq/official_pdfs/<BRANCH>/<paper>/<paper>_question_paper.pdf`, `_answer_key.pdf` | Official GATE PDFs, one folder per branch; `manifest.json` has URL + SHA-256 | No (large; re-downloadable) |
| `data/pyq/official_pdfs/<BRANCH>/<BRANCH>_GATE2027_syllabus.pdf` | Official syllabus used for tagging | No |
| `data/pyq/_work/<BRANCH>/<paper>/` | Page renders, model outputs, key.json, validated.json, tags.json | No |
| `data/pyq/<BRANCH>/gate_<branch>_pyqs.json` | **The question bank for that branch only** | Yes |
| `data/pyq/<BRANCH>/images/<paper>/Q07_1.png` | Question and option images | Yes |
| `data/pyq/<BRANCH>/syllabus.json` | Closed topic list parsed from the official syllabus | Yes |
| `data/pyq/<BRANCH>/reports/<paper>.md` | Validation report per paper | Yes |
| `data/pyq/<BRANCH>/reviews/<paper>.json` | Your review decisions | Yes |

Paper ids: `EC_2026`; two-shift years `CE_2026_S1`, `CE_2026_S2`.
Question ids: `GATE_EC_2026_Q7`, `GATE_CE_2026_S1_Q7`.

## Run order (per branch, per paper)

```bash
python scripts/pyq/fetch.py EC                      # official QPs + keys → official_pdfs/EC
python scripts/pyq/keys.py EC                       # exact answer keys (all papers)
python scripts/pyq/regions.py EC --paper EC_2026    # figure regions (after rendering pages)
# Claude transcribes -> data/pyq/EC/transcriptions/EC_2026/b*.json  (see docs/PYQ_EXTRACTION_HANDBOOK.md)
python scripts/pyq/crop.py EC --paper EC_2026       # merge + crop figures
python scripts/pyq/validate.py EC --paper EC_2026   # every check → reports/EC_2026.md
# tagging: Claude, from the official syllabus (tag.py still calls Gemini - to be replaced)
python scripts/pyq/review.py EC --paper EC_2026     # review flagged questions at http://localhost:8765
python scripts/pyq/build.py EC                      # → data/pyq/EC/gate_ec_pyqs.json
```

- No AI API is used: Claude transcribes pages and scanned keys (see the handbook).
- Re-run `validate.py` after any change, then `build.py`.
- A question enters the bank only if it passed every check, or you approved it in review.
