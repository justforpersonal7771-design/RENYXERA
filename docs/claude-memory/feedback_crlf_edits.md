---
name: feedback-crlf-edits
description: "Repo files are a mix of CRLF and LF — scripted find/replace must match the file's newline style"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-26T17:33:03.440Z
---

Many files in D:\0-UI\r2ma-stable use CRLF, others LF. Python/sed replacements with "\n" in the search string silently miss on CRLF files (and `re.M` `$` doesn't match before `\r`).

**Why:** Cost several failed edits on 2026-09-26 (profile page, exam session, account settings) — an unmatched replace looked like success until tsc/grep showed otherwise.

**How to apply:** In Python, open with `newline=''`, detect `nl = "\r\n" if "\r\n" in s else "\n"`, convert search/replace strings with `.replace("\n", nl)`, and `assert old in s` before replacing. Import-insertion regex: `^import [^\n]*?;[ \t]*\r?$`. Prefer the Edit tool when practical. Related: [[feedback-backslash-mangling]].
