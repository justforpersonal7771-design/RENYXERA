---
name: feedback-no-native-pickers
description: "Never use native <input type=\"date|time\"> — use the app's DatePicker/TimePicker; eslint blocks it"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-10-07T05:07:30.169Z
---

Never ship a native `<input type="date">`, `type="time"`, `datetime-local`, `month` or `week` — the browser's default popup clashes with the app's design. Use `components/ui/date-picker.tsx` (supports min/max) or `components/ui/time-picker.tsx`. An eslint `no-restricted-syntax` rule in eslint.config.mjs fails on them (added 2026-10-07).

**Why:** user spotted the default calendar on the study-plan tool and asked that it never recur.
**How to apply:** any new date/time field → use the custom pickers; when a native picker-like popup (select, color, etc.) appears, check for a themed component first.
