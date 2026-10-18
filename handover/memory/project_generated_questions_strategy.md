---
name: project-generated-questions-strategy
description: "User's plan (6 Oct 2026) for All-India mocks built from generated GATE-level questions for every branch; order is PYQs first, then generation"
metadata:
  node_type: memory
  type: project
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-10-06T12:28:50.110Z
---

Mocks are on hold (don't schedule/extend mocks). The user's plan: mocks become a mix of NEW questions that Claude generates, which must be:
- at GATE level or harder;
- application-, trend- and concept-based (not basic);
- grounded in the full official syllabus, built with complete context of every branch's PYQs.

The pipeline should be robust and advanced, with daily generation, covering every branch. It also needs a better name than "practice questions".

**Why:** the user wants original, high-quality material rather than reusing PYQs in mocks.

**How to apply:**
- Order: finish PYQ extraction + tagging for all branches first (EE, ME, CE, DA), then design and build the generation system.
- The design doc can be drafted alongside, but generation runs after a branch's PYQs are tagged.
- Related: [[tag-during-transcription]], [[pyq-claude-extracts]].

Forge rollout order (user, 6 Oct 2026): CS first, then EC, then other branches as their PYQs finish. Design: docs/FORGE_DESIGN.md.
