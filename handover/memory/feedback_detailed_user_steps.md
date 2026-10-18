---
name: feedback-detailed-user-steps
description: "Whenever the user must do something (dashboards, secrets, SQL, logins), give numbered click-by-click steps, then wait for their confirmation"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-25T23:52:45.555Z
---

When a task needs an action from the user (Cloudflare/Supabase/Google console clicks, running SQL, adding secrets, logging in), give **detailed numbered steps**: exact menu path, what to click, what to type, where each value goes, and how to confirm it worked. Then **hold** — don't proceed with dependent work until the user says it's done.

**Why:** User asked explicitly (2026-09-26): "give me detailed steps whenever you expect from me something" and "please hold … I will tell you that i have added it then proceed".

**How to apply:** Keep secret values out of chat — have the user paste them into `.env.local` / `npx wrangler secret put` / GitHub secrets themselves; only public keys (e.g. a Turnstile site key) may be pasted in chat. After they confirm, verify the result yourself before marking the checklist. Related: [[feedback-batch-deploys]].
