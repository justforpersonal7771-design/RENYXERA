# Gemini API: your subscription, the API key, limits and capacity

*Owner guide, 30 Sep 2026. Google changes limits and prices often. Every number marked **(verify)** should be checked on the page linked next to it before you rely on it.*

---

## 1. Your Gemini subscription vs the Gemini API: they are different things

You have a 3-month **Gemini consumer subscription** (Google AI Pro / "Gemini Advanced", bought through Google One). That subscription is for **you personally**, in the Gemini app and website and in Gmail, Docs and so on.

| | Gemini subscription (what you have) | Gemini **API** (what the app uses) |
|---|---|---|
| Who uses it | You, typing in gemini.google.com | Our server, on behalf of every student |
| Where it's managed | Google One | Google AI Studio / Google Cloud |
| Gives API tokens or credits to the app? | **No.** It does not add API quota or credits | Has its own free tier and paid billing |
| Can the app call it automatically? | **No.** Automating the consumer app breaks Google's terms | Yes, that's what the API key is for |

**How your subscription can still help (legitimately):**
- **Content work, by hand:** drafting and checking explanations, articles (like the 150-day plan), Telegram posts, marketing copy and practice-question ideas. You review, then we publish. This saves you hours at no API cost.
- **Long-document help:** it handles large uploads (syllabus PDFs, answer keys) well, for your own analysis.
- **Try before you build:** test new prompt ideas for the AI Mentor in the Gemini app before we code them.

It **does not** increase how many students the app can serve. That depends only on the API key's quota (sections 3–4).

---

## 2. Get (or check) the API key: step by step

The app reads the key from the server secret **`GEMINI_API_KEY`**, and it already has one. Use these steps to create a fresh key you own, or to move it to your own Google account.

1. On a laptop, open **https://aistudio.google.com** and sign in with the Google account that should own the key. Use a business-style account rather than a personal one if you can.
2. Accept the terms if asked.
3. In the left sidebar, click **Get API key** (or open **https://aistudio.google.com/apikey**).
4. Click **Create API key**. If it asks for a project, choose **Create API key in new project**. Google makes a Cloud project for you, e.g. "Gemini API".
5. Copy the key, which starts with `AIza…`. **Treat it like a password:** don't paste it into chats, screenshots or code.
6. **Put it on the live app** (Cloudflare Worker secret):
   1. Open **https://dash.cloudflare.com**, then **Workers & Pages**, then the **renyxera** worker (the one serving gate.renyxera.workers.dev).
   2. Go to **Settings**, then **Variables and Secrets**. Find `GEMINI_API_KEY` and click **Edit** (or **+ Add**, type **Secret**, name `GEMINI_API_KEY`).
   3. Paste the key and click **Deploy**. It takes effect within a minute; no code deploy is needed.
7. **Local development (optional):** put the same key in `D:\0-UI\r2ma-stable\.env.local` as `GEMINI_API_KEY=...`. That file is never committed.
8. **Test:** open the app, sign in, open **AI Mentor** and ask one question. If it answers, the key works.

### Keep the key safe

- In Google Cloud console → **APIs & Services → Credentials**, click the key, then **API restrictions → Restrict key**, and allow only the **Generative Language API**.
- Use a **separate key for development** so a leak there doesn't hit production.
- If a key leaks: AI Studio → API keys → **Delete**, then create a new one and repeat step 6.

---

## 3. Free tier: what you get for ₹0

Without billing enabled, the key runs on the **free tier**. Limits are per Google Cloud **project**, not per user, and reset daily (Pacific time, about 12:30 IST).

| Model | Requests/minute | Requests/day | Tokens/minute |
|---|---|---|---|
| gemini-2.5-flash (our current model) | ~10 **(verify)** | ~250 **(verify)** | ~250,000 |
| gemini-2.5-flash-lite | ~15 **(verify)** | ~1,000 **(verify)** | ~250,000 |

Check them at **https://ai.google.dev/gemini-api/docs/rate-limits**, and see your live usage in AI Studio → **Usage**.

**Context window:** both models accept about **1 million input tokens** per request and return up to about 64k output tokens **(verify)**. Our prompts are only about 1.5–3k tokens, so context is never the bottleneck; **requests per day** is.

**Privacy note:** on the free tier, Google may use prompts and responses to improve its products. On the paid tier it doesn't. Our prompts contain no names or emails (the privacy policy already says this), but keep it in mind.

---

## 4. How many students can that serve?

Each student request is one API call. The exact-prompt cache and future pre-generated answers (see `AI_USAGE_STRATEGY.md`) make many requests free.

| Setup | Live calls/day available | Students served per day* |
|---|---|---|
| Free tier, Flash only (today) | ~250 | ~50 Free-tier students using all 5 tries, **or** ~15 Plus/Pro students at typical use |
| Free tier, Flash + Flash-Lite routing | ~1,250 | ~250 Free or ~80 paid students |
| + pre-generated PYQ explanations (70% of requests need no live call) | same | **~3×** the above |
| Paid tier (billing on) | effectively unlimited; you pay per call (≈₹0.03–0.14) | limited only by budget |

\*Assumes Free students use their 5 tries in a day, and paid students use about 15% of their allowance (about 11 Plus or 22 Pro requests a day).

**What happens when the free daily quota runs out:** the AI answers with an error until the reset (around 12:30 IST). The app shows students "couldn't reach the AI right now". With the new 5-request teaser for Free users, the free tier stretches much further than before.

---

## 5. When to switch on paid billing

Under the ₹100 budget rule, paid billing (which needs a card) stays in the **backlog** until the app earns money. Switch it on when either of these happens:
- the free daily quota runs out on most days (AI Studio → Usage shows about 100%), or
- the first Plus/Pro payments arrive (then AI cost is covered: see the margins in `AI_USAGE_STRATEGY.md` §4).

### How, when the time comes

1. Open AI Studio → **Settings → Billing** (or Google Cloud console → **Billing**), then **Link a billing account**, and add a card or UPI Autopay.
2. **Set a budget alert immediately:** Cloud console → **Billing → Budgets & alerts → Create budget**, e.g. **₹500/month**, with emails at 50%, 90% and 100%.
3. Optionally cap spend: **APIs & Services → Generative Language API → Quotas**, and lower the requests-per-day limit to what your budget allows.
4. New Google Cloud accounts sometimes get **free trial credits** **(verify current offer)**, which is useful for the first months.

---

## 6. Checklist

- [ ] Key created in **your** Google account (section 2, steps 1–5)
- [ ] `GEMINI_API_KEY` updated on Cloudflare (step 6) and tested (step 8)
- [ ] Key restricted to the Generative Language API
- [ ] Separate development key in `.env.local`
- [ ] Check AI Studio → Usage every Monday (add to the weekly metrics routine)
- [ ] Billing plus budget alert: **only after income** (section 5)
