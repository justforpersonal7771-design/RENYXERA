# Telegram: complete setup and promotion playbook

*Owner guide, 30 Sep 2026. Everything here is free.*

What you'll end up with:
- **A channel**, `@renyxera` (or your chosen name): one-way posts. Our bot posts a GATE CS question of the day there at 08:00 IST automatically.
- **A discussion group** linked to the channel: students comment on each post and ask doubts.
- **A bot**, e.g. `@RenyxeraBot`, owned by you, that posts for the app.
- **Tracking:** every link carries `utm_source=telegram`, so sign-ups from Telegram show up in `weekly_growth_metrics()`.

---

## Part 1: create the channel (phone app)

1. Open **Telegram**, then tap the ✏️ pencil (Android) or the compose icon (iPhone), then **New Channel**.
2. **Name:** `RENYXERA · GATE CS 2027`.
   **Description:** `Daily GATE CS PYQ, weightage insights & free All-India mocks. Practise free: https://gate.renyxera.workers.dev`
3. Upload the RENYXERA logo as the channel photo, then tap **→**.
4. **Channel type:** choose **Public**, then the link: `t.me/renyxera`. If it's taken, try `renyxera_gate` or `renyxeragate`. Write down the exact name.
5. Skip adding members for now, then tap **Next**.

## Part 2: create the discussion group and link it

1. Open the channel, tap its name, then ✏️ **Edit**, then **Discussion**, then **Add a group**, then **Create a new group**.
2. **Name:** `RENYXERA · GATE CS Discussion`, then **Create**.
3. Back in **Edit → Discussion**, it now shows the group. Every channel post gets a **Comments** button.
4. Open the group, then **Edit**:
   - **Group type:** Public, with the link `t.me/renyxera_chat`.
   - **Permissions:** turn off *Send links* for members, so they can't spam.
   - **Slow mode:** 10 seconds.
   - Keep **Chat history for new members: Visible**.
   - Tap **Administrators** and make sure you're the owner. Add one trusted friend later as a moderator.
5. Pin a rules message in the group:
   ```
   📌 Rules: GATE CS doubts & discussion only · be kind · no piracy/PDF sharing · no promotions.
   Free practice & mocks: https://gate.renyxera.workers.dev/?utm_source=telegram&utm_medium=group&utm_campaign=rules
   ```

## Part 3: create the bot with @BotFather

1. In Telegram search, open **@BotFather** (it has a blue tick), then tap **Start**.
2. Send `/newbot`.
3. **Name:** `RENYXERA Daily`.
4. **Username:** it must end in `bot`, e.g. `RenyxeraDailyBot`.
5. BotFather replies with a **token** like `7123456789:AAH...`. **Keep it secret.** Don't paste it in chats or code; only in GitHub (Part 5).
6. Optional polish:
   - `/setdescription`: `Posts the GATE CS question of the day for the RENYXERA channel.`
   - `/setuserpic`: upload the logo.

## Part 4: give the bot permission to post

1. Open your **channel**, then tap its name, then **Administrators**, then **Add Admin**.
2. Search your bot's username (e.g. `RenyxeraDailyBot`) and select it.
3. Leave only **Post messages** on. Turn every other permission off, then **Save**.

## Part 5: add the two secrets to GitHub (so the daily post runs)

1. On a laptop, open **github.com**, then your repository **RENYXERA**, then **Settings** (top tab).
2. Left sidebar: **Secrets and variables**, then **Actions**, then **New repository secret**.
3. **Name:** `TELEGRAM_BOT_TOKEN`. **Secret:** paste the BotFather token. Click **Add secret**.
4. **New repository secret** again. **Name:** `TELEGRAM_CHANNEL`. **Secret:** your channel username *with the @*, e.g. `@renyxera`. Click **Add secret**.

## Part 6: test it once

1. In the repository, open the **Actions** tab, then choose **Telegram daily question** on the left.
2. Click **Run workflow** (right side), then the green **Run workflow**.
3. Wait about 30 seconds and open the channel: today's question should be posted, with a "Solve it and check the official answer" link.
4. If the run is red, click it and open the **post** step. The error says what's wrong:
   - `chat not found`: the channel name secret is wrong. It needs the `@`, and the channel must be public.
   - `bot is not a member`: redo Part 4.
   - `Unauthorized`: the token is wrong. Redo Part 5, step 3.

From then on it posts automatically every day at **08:00 IST**, with no repeats until all 975 questions have been used.

---

## Part 7: promotion playbook (first 60 days)

### Content rhythm (in the channel)

| When | Post | How |
|---|---|---|
| Daily 08:00 | Question of the day | Automatic (bot) |
| Daily 20:00 | Answer and one-line trick for the morning question, with a link to the full solution | Manual, 2 min, with `utm_campaign=evening_answer` |
| Mon | "Topic of the week" from the Most Repeated Topics page, with 3 PYQs | Link `/articles/most-repeated-gate-cs-topics?utm_source=telegram&utm_campaign=topic_week` |
| Wed | Poll: "Which subject scares you most?" | Telegram's native **Poll** (attach → Poll). Polls get the most reactions |
| Sat 20:00 | "Sunday All-India Mock reminder" | Link to `/mocks?utm_source=telegram&utm_campaign=mock_reminder` |
| Sun (after results) | Leaderboard shout-out: top 3 usernames, with permission | Screenshot of the leaderboard |
| Monthly | Countdown: "X days to GATE 2027", plus the study planner | `/tools/gate-study-plan?utm_source=telegram` |

**Tip:** always add `utm_source=telegram&utm_medium=channel&utm_campaign=<name>` to links. Then `weekly_growth_metrics()` shows exactly which posts bring sign-ups.

### Growing the audience (free, ethical)

1. **Your own circle first:** share the channel in your college and friends' GATE groups, once, with a genuinely useful post (e.g. the "Most repeated topics" image). Don't spam repeatedly.
2. **Answer, don't advertise:** in public GATE groups and forums (Telegram, Reddit r/GATE, GATE Overflow), answer doubts properly. Link to the exact RENYXERA question page only when it helps.
3. **Referral link in the bio:** members share their invite link (Plans page); both earn AI credits.
4. **Collaborate:** offer small GATE YouTubers and Instagram pages a free "question of the day" embed or a joint weekly mock. Give them a custom UTM campaign so you can measure it.
5. **Directories:** list the channel on Telegram channel directories (e.g. tlgrm.eu, telegram-group.com). Free listings are enough.
6. **Cross-post:** turn the daily question into an Instagram/WhatsApp status image once a week, with the channel link.
7. **Milestones:** at 100, 500 and 1,000 members, post a thank-you with a small reward (e.g. an extra weekly mock).

### Rules to protect the brand

- Never share pirated books or coaching PDFs. Report and ban anyone who does.
- No paid "buy members" services: fake members kill the reach of real posts.
- Keep ads out of the group. Sponsors, when you have them, go in the channel, clearly labelled.
- Answer doubts within a day; a responsive group is the best advertisement.

### What to measure (weekly, 5 minutes)

- Channel: subscribers, average views per post, and poll participation.
- App: sign-ups where `acquisition.source = telegram` (`weekly_growth_metrics()` in the Supabase SQL editor: `select * from weekly_growth_metrics(4);`).
- Keep what brings sign-ups, and drop what only brings views.
