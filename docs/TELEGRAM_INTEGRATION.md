# Telegram integration (10 Oct 2026)

Telegram is now the "tap on the shoulder" for the app: reminders, timers, alarms and alerts, tied to the member's account and plan.

## What it does

| | Free | Plus | Pro |
|---|---|---|---|
| Daily question channel + discussion group | yes | yes | yes |
| Account linking, and we check you joined the channel and group | yes | yes | yes |
| `/today` countdown | yes | yes (+ today's blocks) | yes |
| Mock results published alert | yes | yes | yes |
| Timers `/timer 25` | 1 at a time | 5 | 10 |
| Daily alarms `/alarm 06:00` | — | 3 | 10 |
| Reminder 10 min before every Study Planner block, with **Done** and **+15 min** buttons | — | yes | yes |
| Morning digest of today's blocks, at your time (`/digest 07:30`) | — | yes | yes |
| Mock starting in 30 minutes | — | yes | yes |
| Plan-ending alerts (3 days and 1 day before) | — | yes | yes |
| Evening "N blocks unfinished — roll forward?" with buttons; re-plan shortcut | — | — | yes |
| Weekly review (planned vs done), Sunday evening | — | — | yes |

The single source for these numbers is `lib/telegram/tiers.ts`; the bot, the API and the Profile screen all read it, and every send re-checks the member's plan, so a downgrade stops paid messages immediately.

## How it works
- **Linking:** Profile → Telegram → "Link Telegram" makes a one-time code (15 minutes) and opens `t.me/<bot>?start=<code>`. Pressing Start sends the code to our webhook, which ties that chat to the account. One chat per account and one account per chat. `/unlink` or the Unlink button removes it and cancels waiting reminders.
- **Subscribed check:** the bot asks Telegram whether the member is in the channel and in the group (`getChatMember`), on link, on "Check again", on `/status` and once a day. This needs the bot to be an **administrator of the channel** and a **member (admin) of the group**; until then the screen says "couldn't verify".
- **Sending:** a dispatcher (`/api/telegram/dispatch`, protected by `PREGEN_SECRET`) runs every minute and sends what is due. It claims rows before sending so overlapping runs never double-send.
- **Two-way:** pressing **Done** in Telegram, or **Roll forward** at night, is saved as an action; the app applies it to the calendar the next time it opens (`TelegramActionsSync`). Ticking a block in the app tells the server, so it is not reminded about.
- **Ask once a day:** in the app, missed blocks show a card (Plus and Pro) with Roll forward / Skip / Ask me tomorrow, and for Pro "Re-plan the rest". In Telegram, Pro gets the same question at 20:30 IST. Nothing moves without a tap.
- **Times** in the bot are India time (IST).

## One-time setup (owner)
1. **Bot:** you already have the bot and token. Note its @username.
2. **Channel and group access:** open the channel → Administrators → add the bot (it needs no special rights). Add the bot to the discussion group and make it an administrator.
3. **Cloudflare secrets** (Workers → your Worker → Settings → Variables and Secrets → Secret): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET` (a new long random string you make up), and optionally `TELEGRAM_BOT_USERNAME`. `PREGEN_SECRET` is already set.
4. **Run migration** `supabase/migrations/0035_telegram.sql` in the Supabase SQL editor.
5. **Register the webhook** (once): put the same token and webhook secret in `.env.local` and run `node --env-file=.env.local scripts/telegram-set-webhook.mjs`. It also sets the command menu.
6. **Schedule the dispatcher** every minute with Supabase `pg_cron` + `pg_net` (free): enable both under Database → Extensions, then run in the SQL editor (replace `<SECRET>` with your `PREGEN_SECRET`):
   ```sql
   select cron.schedule('telegram-dispatch', '* * * * *', $$
     select net.http_post(
       url := 'https://gate.renyxera.workers.dev/api/telegram/dispatch',
       headers := '{"Content-Type":"application/json","x-pregen-secret":"<SECRET>"}'::jsonb,
       body := '{}'::jsonb) $$);
   ```
   A GitHub Action (`telegram-dispatch.yml`) also runs every 5 minutes as a backup; running both is safe.

## Not built yet (by priority)
- [ ] Ask the AI Mentor from Telegram (Pro, uses the daily AI quota)
- [ ] Weak-topic nudges from analytics (Pro)
- [ ] Streak-at-risk evening nudge (Plus)
- [ ] Quiet hours and per-day opt-outs
- [ ] Group reminders for study buddies and club challenges
- [ ] WhatsApp as a second channel after revenue
