# Telegram Premium: what it unlocks for RENYXERA, and the steps

*17-18 Oct 2026. You have Telegram Premium on your own account. Premium belongs to **you**, not to the bot, so some perks help the channels you own and some help how you run them. Nothing here costs extra. Where a perk could not be confirmed from Telegram's own pages, it says **check in your app**.*

## 1. What Premium gives you, and what we do with it

| Perk | Helps with | Do it? |
|---|---|---|
| **4 channel boosts** (confirmed: your Premium = 4 boosts, spread across channels as you like, movable every 24 h) | Unlocks channel features (levels) for the hub and branch channels | **Yes: `02-BOOSTS.md`** |
| **Channel stories** (once a channel reaches boost level 1) | Free, high-visibility posts: film cuts, a daily question image, mock reminders | **Yes: `03-STORIES-AND-REACTIONS.md`** |
| **Custom reactions, channel emoji status, profile colour** (levels) | Branded look across all channels | Yes, same doc |
| **4 GB uploads** | Post the full 4K film directly in the hub, no YouTube dependency | Yes (hub, once) |
| **Higher folder, pin and joined-channel limits** | Run all rooms from one account; one folder per branch | Yes: `04-FOLDERS-AND-LINKS.md` |
| **Telegram Business tools** (greeting, away message, quick replies, business hours, chatbot connection) | A support inbox in your DMs | **Check in your app** (Settings → Telegram Business), then `05-BUSINESS-AND-SUPPORT.md` |
| Voice-to-text, translation, no ads | Quality of life while moderating | Optional |

Premium does **not** change what our bot can do: the bot cannot send custom emoji or exceed normal bot limits because you have Premium. The automation posts work exactly as before.

## 2. What I build in the application (after your go-ahead)

1. **Mini App button on the bot** (free, any account): the bot's menu button opens the site inside Telegram, so a student goes from a channel post straight into practice.
2. **Story-ready images:** a script that renders the day's question as a 1080x1920 picture. Bots cannot post stories, so you post them; I produce the image.
3. **Business chatbot hook:** if your account shows Business tools, connect our bot to answer common DMs (payment, plans, "answer won't load") with a human hand-off, using the existing webhook.
4. **Branch deep links:** `t.me/<bot>?start=cs` opens the bot, sets the branch, and sends that branch's channel, topic and practice links.

## 3. Order of work

| # | Who | What | Time |
|---|---|---|---|
| 1 | You | `02-BOOSTS.md`: put your boosts on the hub and the largest branch channel | 5 min |
| 2 | You | `03-STORIES-AND-REACTIONS.md`: reactions, status, first story | 10 min |
| 3 | You | `04-FOLDERS-AND-LINKS.md`: one folder per branch, send me the links | 10 min |
| 4 | You | `06-MINI-APP-AND-BOT.md`: BotFather steps, then tell me | 5 min |
| 5 | Me | Deep links, story-image script, Mini App polish | after step 4 |
| 6 | You | `05-BUSINESS-AND-SUPPORT.md` if the menu exists | 10 min |
