# Instagram setup: click by click

Meta changes its screens often. If a button has a slightly different name, pick the closest one and tell me what you see.

## Step 1. Make the account Professional (phone, 2 min)
1. Instagram app, your profile, menu (three lines), **Settings and activity**.
2. **Account type and tools**, **Switch to professional account**.
3. Choose **Creator** (or Business), category **Education**, **Done**.

## Step 2. Create the Meta developer app (laptop, 10 min)
1. Open https://developers.facebook.com and log in with the Facebook account tied to your Meta login (create one if needed). Accept the developer terms and verify your phone if asked.
2. **My Apps**, **Create App**.
3. App name `RENYXERA Publisher`, your email, **Next**.
4. Use case: pick **Other**, then app type **Business**, **Next**, **Create app**.
5. In the app dashboard, **Add product**, find **Instagram**, **Set up**.
6. Open **Instagram, API setup with Instagram login**.

## Step 3. Add your Instagram account as a tester (laptop, 3 min)
1. In the app, **App roles**, **Roles**, **Add People**, choose **Instagram Tester**, type `renyxera`, **Submit**.
2. On your phone: Instagram, Settings and activity, **Website permissions** (or **Apps and websites**), **Tester invites**, **Accept**.

## Step 4. Generate the token (laptop, 3 min)
1. Back in **API setup with Instagram login**, section **Generate access tokens**, click **Add account**, log in as `renyxera`, and allow all permissions (you need **instagram_business_basic** and **instagram_business_content_publish**).
2. Click **Generate token** next to the account. Copy the token. It is long and starts with `IG...`. **Do not paste it into any chat or file.** It is valid 60 days.
3. Copy the **Instagram account ID** shown beside the account (a number).

## Step 5. Put them in GitHub (laptop, 3 min)
GitHub, your repository, **Settings**, **Secrets and variables**, **Actions**, **New repository secret**:

| Name | Value |
|---|---|
| `IG_ACCESS_TOKEN` | the token from step 4 |
| `IG_USER_ID` | the account ID from step 4 |

(`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL` are already there.)

## Step 6. Test without posting (1 min)
GitHub, **Actions**, **social-check**, **Run workflow**. Open the run: it should print `Instagram OK: @renyxera (...)` and `Telegram OK: @<your bot>`. If it says the token is invalid, redo step 4. If `IG_USER_ID` differs, it tells you the right number.

## Step 7. Post the first Reel
1. Wait for the 1080x1920 cut of the film (I will tell you when it is ready) in `video/out/`.
2. On your laptop, in the repo folder, run `node scripts/social-upload.mjs video/out/<file>.mp4` (needs `.env.local` with the Supabase keys, which you already have). It prints a public link.
3. Tell me the link, or paste it in `content/calendar.json` as `media_url` of `launch-film-reel`, and change `status` from `draft` to `approved`.
4. At the entry's date and time (IST) the next 30-minute run posts it to Instagram and Telegram. To post now, set the date to today and a past time, then **Actions, social-publish, Run workflow**.

## Reminders
- **Token expires in 60 days.** Put a reminder at day 50. To renew: repeat step 4 and replace the `IG_ACCESS_TOKEN` secret.
- Instagram allows about 50 API posts a day; we use 1.
- Fallback if the API ever fails: Meta Business Suite can schedule Reels manually and is free.
