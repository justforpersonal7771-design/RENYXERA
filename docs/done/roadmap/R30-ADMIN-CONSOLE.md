# R30: Admin-lite (first slice of Release 10)

[← Docs index](../../README.md) · [Open items](../../open-work/OPEN-ITEMS-2026-11-06.md)

**This is not a separate release.** The full admin console is Release 10 ([`../../roadmap/R09-R10-DEPTH-AND-ADMIN.md`](../../roadmap/R09-R10-DEPTH-AND-ADMIN.md), items 10A to 10M). R30 is the admin-lite page that R10 lists as "first": Overview, Funnel and tagged links, inside the student app at `/admin`. On 3 Nov 2026 the owner asked for a super-admin console (grant Plus or Pro, marketing, Telegram/Instagram/YouTube automation) and left separate-app versus `/admin` to me. Decision on 4 Nov: it stays at `/admin` (reasons in [`../../roadmap/R10-ADMIN-SPEC.md`](../../roadmap/R10-ADMIN-SPEC.md) section 1). The full specification is in [`../../roadmap/R10-ADMIN-SPEC.md`](../../roadmap/R10-ADMIN-SPEC.md); the order below is superseded by its section 5.

Goal (owner, 3 Nov 2026): one place to analyse, market and automate, without code.

## Security model
- `/admin` and `/api/admin/*` are open only to users listed in `public.admin_users` (migration 0052). The check runs on the server with the service role; the browser cannot read or write that table. Anyone else gets a 404.
- Every admin action that writes data goes through an API route that re-checks the admin table. DB writes the owner must run (migrations, seeding) stay owner-run; the console never holds elevated keys in the browser.

## Built (step 1)
- **Overview:** visitors, tests, accounts, paid orders and revenue (live mode only), visitors per day, by branch; 7/30/90 days.
- **Funnel:** visitors, tested, signed in, saw plans, clicked pay, paid, by first-touch source.
- **Links:** tagged-link builder (utm_source, medium, campaign) so every post is measurable.

## Planned, in order
2. **Marketing:** week-by-week content calendar with status (drafted, posted, result), the content pack, reply tracker, per-campaign results from the funnel.
3. **Learners:** search by username, plan, last seen, streaks; grant or extend a plan (writes via audited API).
4. **Content ops:** Forge batches (seeded, pending, rejected), approve or retire a question, report queue, PYQ extraction progress.
5. **Automation:** schedule weekly digest to Telegram, daily-question post, expiring-plan reminders, win-back messages (opt-in users only); each with a switch and a run log.
6. **Health:** AI quota, pregen throughput, error rate (Sentry), deploy version, Supabase usage against free-tier limits.
7. **Experiments:** copy and price tests with a clear winner rule.

## Owner steps for step 1
1. Apply [`supabase/migrations/0052_admin_console.sql`](../../../supabase/migrations/0052_admin_console.sql) in the Supabase SQL editor.
2. Make yourself admin (replace the email): `insert into public.admin_users (user_id) select id from auth.users where email = 'YOUR_EMAIL';`
3. Open `/admin` while signed in with that account.
