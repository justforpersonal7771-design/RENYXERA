---
name: feedback-batch-deploys
description: "Commit locally as you go; push to main once per finished batch — the push itself auto-deploys (GitHub Actions, after all checks pass)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-26T19:36:14.583Z
---

Commit locally as work progresses; push to `main` only once per finished module/release batch. As of 2026-09-27 the `deploy` job in `.github/workflows/ci.yml` deploys to Cloudflare automatically on every push to `main`, but only after the `check` job (type-check, build, security/goals/grading/calibration checks) passes, then smoke-tests the live site.

**Why:** User (2026-09-26): "don't deploy each time… deploy all the commits for that release or module in a single batch". User (2026-09-27): "By just pushing the code to our main branch should trigger a deployment" — wants Vercel-style auto-deploy. Also said "don't deploy this change, we will deploy this in other batch" — respect explicit holds.

**How to apply:** Don't push mid-batch (a push = a production deploy). Needs repo secrets CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID and the five NEXT_PUBLIC_* values; until the user confirms they're set, fall back to local `npm run deploy:cf`. Urgent production fixes can ship immediately. Verify locally (build + Playwright) before each commit. Related: [[project-zero-budget-constraint]], [[feedback-detailed-user-steps]].
