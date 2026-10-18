---
name: feedback-pyq-claude-extracts
description: "PYQ extraction must be done by Claude reading page images, never Gemini; rules live in docs/PYQ_EXTRACTION_HANDBOOK.md"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-30T16:44:38.617Z
---

The PYQ papers, answer keys and figures must be transcribed by Claude directly (page PNG and text layer), not by Gemini or any model API.

**Why:** The user wants maximum accuracy. They stopped the Gemini extraction on 30 Sep 2026.

**How to apply:** In any PYQ session, first read `D:\0-UI\r2ma-stable\docs\PYQ_EXTRACTION_HANDBOOK.md`; its Status section says where to resume. Eye-check every figure crop. Related: [[project-data-content-foundation]], [[feedback-backslash-mangling]].
