---
name: reference-signed-in-e2e
description: How to run signed-in Playwright tests despite Turnstile captcha — admin magic link → @supabase/ssr cookies
metadata:
  node_type: memory
  type: reference
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-26T13:57:08.927Z
---

Password sign-in is captcha-protected (Turnstile), so headless tests can't log in through the form. Working approach (used 2026-09-26 for step 6):
1. `admin.auth.admin.generateLink({ type: "magiclink", email })` with the service-role key (.env.local).
2. `createServerClient` from `@supabase/ssr` with a cookie jar (`setAll` pushes to an array), then `auth.verifyOtp({ token_hash: data.properties.hashed_token, type: "magiclink" })` — no captcha needed.
3. `context.addCookies(jar.map(c => ({ ...c, domain: "localhost", path: "/" })))`.
Run with `node --env-file=.env.local`. Test account: justforpersonal7774@gmail.com. Write the helper with the Write tool ([[feedback-backslash-mangling]]); keep it as an untracked zz-* file and delete after.
