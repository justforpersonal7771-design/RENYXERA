---
name: feedback-tag-during-transcription
description: "Write subject/topic/difficulty tags while transcribing each PYQ batch, not as a separate later pass"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-10-05T14:59:05.282Z
---

When transcribing a PYQ paper, write its tag file `data/pyq/<BRANCH>/tags/<paper>.tsv` (qno, CODE.topic-index, E/M/H, using `scripts/pyq/tagcodes.py` codes over the curated `data/pyq/<BRANCH>/syllabus.json`) in the same pass as each `bNN.json` batch.

**Why:** the user said (5 Oct 2026) "from next time tag the subject, section and topic and relevant items during the transcription itself" — a separate tagging pass re-reads all 390 questions and wastes tokens.

**How to apply:** before transcribing a new branch, first curate its syllabus.json by hand from the official PDF (the auto-parser mangles it) and add its subject codes to `CODES` in tagcodes.py; then tag each question as it is transcribed; run `python scripts/pyq/tagcodes.py <BRANCH>` with validate/build. Related: [[feedback-pyq-claude-extracts]].
