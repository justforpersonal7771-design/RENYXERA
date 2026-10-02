---
name: project-repo-location
description: "GATE OS's real, actively-developed codebase lives at D:\\0-UI\\r2ma-stable, not D:\\Personal\\Adil GATE\\GATE_OS"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-17T17:37:56.521Z
---

The real GATE OS codebase is **D:\0-UI\r2ma-stable**, a git repo with 2 commits ("...exam repository..." and "release 2 complete...feat: core learning analytics engines and UI") plus substantial uncommitted work in the working tree (the entire `lib/ai/` directory, `app/(dashboard)/ai-tutor/`, `app/(dashboard)/ai-mentor/`, `types/ai.types.ts`, plus modified bookmarks/mistakes/revision/setup/results-review pages and repository/storage files).

**D:\Personal\Adil GATE\GATE_OS** (the directory this Claude Code session's working directory/VS Code window is actually rooted in) is a stale/abandoned earlier copy containing only Release 1 foundations (data layer, AST pipeline, basic exam engine) — no Bookmarks, Mistakes, Revision, Calendar, Command Palette, or AI Tutor/Mentor exist there. A git repo was initialized there early in the 2026-09-17 session (commit `4bace30`) before this mismatch was discovered — that commit/repo is not the project of record.

**Why:** User corrected this on 2026-09-17 after I flagged that Release 2/Module B features described as "already built and tested" didn't exist in the session's working directory. The session's working directory could not be switched to r2ma-stable mid-session (VS Code `code -r` command failed), so work continued there via absolute paths, with a handover to a freshly-rooted session planned.

**How to apply:** Any file operation for GATE OS work must use absolute paths under `D:\0-UI\r2ma-stable`, never rely on the session's ambient working directory being correct. If a future session's working directory is already `D:\0-UI\r2ma-stable`, this note is purely historical context. See [[project-zero-budget-constraint]] for the deployment constraint that applies to all work on this repo.
