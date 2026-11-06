# Security runbook: key rotation, incident response, restore drill

[← Docs index](../README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md) · [Owner tasks](../open-work/OWNER-TASKS.md) · [Technical reference, section 13](TECHNICAL_REFERENCE.md)

Written 6 Nov 2026 for R16-B2 (key rotation) and R16-E4 (restore drill and incident checklist). Everything here is free. Never paste a secret into a chat, an email or a file in the repo. Secrets live in two places only: GitHub (Settings, Secrets and variables, Actions) and Cloudflare (Workers, the app, Settings, Variables and Secrets).

## 1. Where each secret lives and how to rotate it

Rotate yearly, and at once if you suspect a leak (an old laptop, a screenshot, a pasted log). After any rotation, run a deploy (GitHub, Actions, CI, Run workflow) so the Worker picks up the change, then do the check in the last column.

| Secret | What it protects | Where to create the new one | Update in | Check after |
|---|---|---|---|---|
| Supabase service-role key | Full read/write on the database; used only on the server | Supabase, Project settings, API keys, roll the secret key | Cloudflare Worker variable and GitHub secret (if used there) | `/admin` loads; a signed-in test saves |
| Supabase DB password (`SUPABASE_DB_URL`) | Backups and scripts | Supabase, Project settings, Database, reset password; copy the new Session pooler string | GitHub secret `SUPABASE_DB_URL` | Run the Database backup workflow once |
| Razorpay key id and secret, webhook secret | Payments | Razorpay Dashboard, Account and settings, API keys, regenerate; Webhooks, edit secret | Cloudflare variables (`RAZORPAY_*`) | Place a 1-rupee test order and verify it activates |
| Gemini key (`GEMINI_API_KEY`) | AI cost | Google AI Studio, API keys, create, delete the old | GitHub secret and Cloudflare variable | Ask the AI Mentor one question |
| OpenRouter keys (`OPENROUTER_API_KEYS`) | AI cost | openrouter.ai, Keys | GitHub secret | Run the AI pre-generation workflow manually |
| Telegram bot token (`TELEGRAM_BOT_TOKEN`) | Posting as the bot | Telegram, BotFather, /revoke, pick the bot | GitHub secret and Cloudflare variable; re-run the Telegram setup workflow (it re-registers the webhook) | Send `/start` to the bot |
| Telegram webhook secret | Fake bot updates | Invent a long random string | GitHub secret and Cloudflare variable; re-run Telegram setup | Bot replies |
| `PREGEN_SECRET`, reward secrets | Server-to-server calls | Invent a long random string | GitHub secret and Cloudflare variable | The workflow using it succeeds |
| Instagram token (`IG_ACCESS_TOKEN`) | Posting to Instagram | Meta developer console, regenerate (long-lived tokens expire in about 60 days) | GitHub secret | Social check workflow passes |
| Cloudflare API token (`CLOUDFLARE_API_TOKEN`) | Deploying the app | Cloudflare, My profile, API tokens, roll | GitHub secret | CI deploy step succeeds |
| `BACKUP_PASSPHRASE` | Reading backups | Invent a long random passphrase; **keep old backups' passphrase too** | GitHub secret | Section 3 drill |

Public values (`NEXT_PUBLIC_*`: Supabase URL, publishable key, Turnstile site key, Sentry DSN) are visible in every browser; they are not secrets and do not need rotating for a leak.

## 2. Incident checklist (something looks stolen, leaked or broken)

Do these in order. Write the time of each step in a note so you can tell users exactly what happened.

1. **Contain (first 15 minutes).** Change your password and sign out all sessions on the affected account. If it is the Supabase, GitHub or Cloudflare account, do that one first. Turn on two-factor if it was off.
2. **Rotate.** Rotate every secret in section 1 that the affected account could see. Service-role key and Razorpay first.
3. **Look.** Supabase, Logs: unusual queries. Razorpay: payments and refunds you did not make. Cloudflare: Workers logs and analytics spikes. GitHub: Settings, Security log, and the latest commits. `/admin` Funnel: sudden changes.
4. **Roll back if the code was touched.** GitHub, the last good commit, "Revert". Push to `main` (it deploys). Or Cloudflare, Workers, Deployments, roll back.
5. **Restore data if it was changed or deleted.** Use section 3 into a **new** Supabase project; never restore over the live one first.
6. **Tell people if their data was exposed.** Under India's DPDP Act you must tell the affected users and the Data Protection Board without delay when personal data is breached. Email via the account address list, and post on the Telegram channel. Say what happened, what data, what you did, and what they should do (change password).
7. **Write it down.** Add a dated entry at the bottom of this file: what, when, cause, fix, what to change so it cannot repeat.

## 3. Restore drill (do every quarter: Jan, Apr, Jul, Oct)

The weekly job `Database backup` makes an encrypted dump of the `public` schema and keeps it 90 days. Sign-in accounts live in Supabase Auth and are not in the dump, so a restore recovers profiles, attempts, mocks and Forge items, not logins. A backup you never test is not a backup.

1. GitHub, Actions, **Database backup**, open the latest successful run, download the artifact `renyxera-db-backup`, unzip it.
2. On your PC (needs gpg and psql; Git for Windows includes gpg): `gpg --decrypt renyxera-db-YYYYMMDD-HHMM.sql.gz.gpg > dump.sql.gz` then `gunzip dump.sql.gz`. The passphrase is the `BACKUP_PASSPHRASE` secret.
3. Supabase, New project (free tier allows two). Copy its Session pooler connection string.
4. `psql "<that string>" -f dump.sql`. Warnings about existing roles are normal; errors about missing tables are not.
5. In the new project's SQL editor run: `select count(*) from public.forge_items;` (expect 300+) and `select count(*) from public.profiles;`. Compare with the live project.
6. Delete the test project (or keep it paused). Tick the drill in `OWNER-TASKS.md` and note the date below.

Drill log: none yet (first drill due before 31 Jan 2027).

## 4. Standing protections already in place (so you know what is covered)

- Security headers on every page; the Content-Security-Policy runs in report-only mode (enforcing it is a separate step, see section 5).
- Razorpay webhook: signature checked, and each event id is stored once so a replay does nothing.
- Cloudflare Turnstile on sign-in, sign-up, password reset, checkout, guest waitlist and guest issue reports.
- Rate limits on every public endpoint; honeypot fields on public forms; same-origin checks on write endpoints.
- `/.well-known/security.txt` so researchers know where to report a problem.
- Weekly encrypted database backup, 90 days.

## 5. Not done yet (owner or later)

- **Enforce the CSP:** read the CSP report logs after a week of normal traffic, fix real violations, then switch the header from report-only to enforcing.
- **Two-factor on every account** (owner task B2).
- **Shared rate limits:** the limiter is per server instance; a database counter would make it global. Needs a migration (owner-run).
- **Sentry alerts and user-visible security events** (new-device sign-in notices).
