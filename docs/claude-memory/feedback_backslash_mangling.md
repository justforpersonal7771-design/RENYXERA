---
name: feedback-backslash-mangling
description: Writing files through Bash heredocs/inline python in this environment strips backslashes — use Write/Edit for any content with \ escapes
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-25T20:20:31.305Z
---

In this Windows/Git-Bash setup, content passed through the Bash tool (heredocs, `python - <<EOF`, `sed` replacements) loses backslashes: `"\\("` became `"\("` → the string `"("`, and regexes like `/\\\(/` came out broken.

**Why:** It shipped a production bug on 2026-09-26: `lib/mathjax-config.ts` was written via heredoc, its MathJax delimiters became plain `(` `)`, and every `\( … \)` formula in exams/review rendered as raw text until hotfix dd57a88.

**How to apply:** For any file content containing backslashes (TeX, regexes, escape sequences, Windows paths), create/edit it with the Write or Edit tools, never through Bash. After writing, grep the result to confirm the escapes survived. Browser-side checks in Playwright scripts can use `String.fromCharCode(92)` to avoid the problem.
