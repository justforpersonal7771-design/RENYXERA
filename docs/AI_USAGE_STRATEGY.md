# AI usage strategy: generous Free, profitable Plus/Pro at low prices

*Owner document, 30 Sep 2026. Prices: Plus ₹29/month (₹249/year), Pro ₹99/month (₹799/year).*

The AI Mentor and AI Tutor are the only features where every use costs us money. Everything else (papers, mocks, analytics, sync) costs almost nothing per user. So the plan is:

- **Free** gets a one-time teaser (5 requests), and then earns more through sponsor breaks and referrals.
- **Plus/Pro** get more AI, served in ways that cost a fraction of the price.
- **The gap** is filled with credits that users earn: sponsor breaks and referrals.

> Prices below are Google's published Gemini API rates as last checked (mid-2025). Check the current numbers on Google AI Studio's pricing page before relying on them; the method stays the same even if the numbers move.

---

## 1. Where we are today (already built)

| Control | Where | Effect |
|---|---|---|
| **Free: one-time teaser of 5 requests** (no daily allowance); Plus **75**/day; Pro **150**/day | `ensure_welcome_ai()`, `consume_ai_call()` | Free users taste the AI, then earn more or upgrade |
| Paid allowance only on the account's **registered devices** (max 2) | `device_sessions` check in the AI route | One Pro login can't feed a whole hostel |
| **Exact-prompt response cache** | `ai_response_cache` | The same question asked twice costs once |
| **Bonus credits** (spent only after the daily allowance) | `ai_bonus_credits`, `consume_ai_bonus()` | Earned credits never raise the daily cap for everyone |
| **Sponsor breaks**: +5, +3, +2, +1 (max 4/day, expire at midnight) | `/api/rewards/sponsor` | Users who want more "pay" with attention |
| **Referrals**: 1 day of Plus + 15 credits (inviter), 10 credits (friend) | `credit_referral()` | Growth without giving away Pro |
| Rate limit 15 requests/minute, guests can't call AI at all | AI route | Stops scripts |

---

## 2. What one AI request really costs

A typical AI Mentor explanation is about 1,500 input tokens (instructions, the question, your context) and 500 output tokens.

| Model | Input $/1M | Output $/1M | Cost per request | In ₹ (~₹84/$) |
|---|---|---|---|---|
| gemini-2.5-flash (current) | ~0.30 | ~2.50 | ~$0.0017 | **~₹0.14** |
| gemini-3.5-flash-lite | ~0.10 | ~0.40 | ~$0.00035 | **~₹0.03** |

### Worst case vs realistic, per month

| Tier | Allowance/day | Worst case (every request, every day) | Realistic (~15% of allowance, typical for study apps) |
|---|---|---|---|
| Free | 5 once (+ ≤11/day earned) | ₹2 once + ≤₹46/month earned · ₹0.2 + ≤₹10 | ₹1 · ₹0.2 |
| Plus ₹29 | 75 | ₹315 · ₹68 | ₹47 · ₹10 |
| Pro ₹99 | 150 | ₹630 · ₹135 | ₹95 · ₹20 |

**Conclusion:** on the current model, a heavy Plus or Pro user could cost more than they pay. The fixes below bring a heavy user's cost well under the price, even in the worst case.

---

## 3. The methods (in order of impact)

### 3.1 Pre-generate the common answers (biggest saving)
Most AI requests are "explain this PYQ" or "give me a hint". There are only 975 PYQs.
- Generate the explanation, hint and shortcut for every question **once**, overnight, and store them. A GitHub Action can run slowly within the free API quota.
- Serve these for free. They cost nothing per user and don't count against any allowance.
- Only truly personal requests use the live AI: "why did *I* get this wrong", chat follow-ups, study plans.
- **Expected effect:** 60–80% fewer live calls.

### 3.2 Route by difficulty (model tiering)
- **Flash-Lite:** hints, short explanations, formatting, flashcards (~5× cheaper).
- **Flash:** multi-step reasoning, study plans, "why was I wrong" with long context.
- **Pro's perk:** "Deep explanation" uses Flash; Free and Plus default to Flash-Lite. Students feel the difference, and we only pay for it where they pay us.

### 3.3 Make the cache work for personal prompts too
- Today the cache key is the whole prompt, so a personalised prompt almost never repeats.
- Split every prompt into a **shared part** (question and explanation: cache it) and a **personal part** (the student's answer and weak topics: small, live).
- Use Gemini **context caching** for the long fixed system instructions, which are billed at a discount when reused.

### 3.4 Shorter prompts, capped answers
- Send only the last 6 chat turns, summarised, not 60.
- Set `maxOutputTokens`: about 350 for hints, 800 for explanations.
- **Expected effect:** each request costs 30–50% less.

### 3.5 Monthly fair-use ceiling on paid tiers
- Keep the daily allowance, and add a quiet monthly ceiling: Plus 1,200/month, Pro 2,500/month.
- Almost nobody reaches it. The few who do can buy a credit pack (§3.7).
- This makes the worst case in §2 impossible.

### 3.6 Free fallbacks when the paid budget is hit
- **Cloudflare Workers AI:** a free daily allowance on our existing account.
- Groq and OpenRouter free models for simple hints.
- Use them only for Free-tier hints, with a quality check. Paid users always get Gemini.

### 3.7 Credit packs (a small top-up, no subscription)
- For example, **₹19 for 150 requests**, valid 60 days.
- Priced so even Flash costs under 20% of the price.
- Sold through the same Razorpay order and webhook path (`billing_orders`), with a new plan id like `credits_150`.

### 3.8 Earned credits (already built, tune by data)
- **Sponsor breaks:** each break must earn more than the credits it gives away.
  - House or affiliate promos earn little per view. The +5, +3, +2, +1 ladder keeps the daily giveaway at 11 requests at most, which is ₹0.3–1.5.
  - Once a real ad network is approved (after the eu.org domain), use its **rewarded ads with server-side verification**. Rewarded video typically earns several times more than a banner.
- **Referrals:** the rewards are credits and 1 day of Plus, not Pro. Credits are only paid after real use on 2 different days.

---

## 4. Unit economics after the fixes (target)

Assumptions: 70% of requests are served from pre-generated answers, and live calls are 70% Flash-Lite / 30% Flash, which averages about ₹0.06 per live call.

| Tier | Price | Heavy user (at the monthly ceiling) | Typical user | Gross margin (typical) |
|---|---|---|---|---|
| Free | ₹0 | ~₹10 (all earned via sponsor breaks) | < ₹1 | covered by sponsor views, referrals and upgrades |
| Plus | ₹29 | ~₹22 | ~₹4 | **~85%** |
| Pro | ₹99 | ~₹45 | ~₹8 | **~90%** |

Razorpay takes about 2% per payment (UPI can be lower), and GST depends on registration. Both are still small at these prices.

---

## 5. Guardrails against abuse

- **One person, many free accounts:** Turnstile at sign-up, and the allowance is per account. Referral credits need real use on 2 days, and no reward if the accounts ever shared a device.
- **Account sharing:** the paid allowance only works on the 2 registered devices, and only 4 new devices a month can be added.
- **Scripted calls:** 15/minute per IP, a JWT is required, the body size is capped, and only fixed prompt types are accepted.
- **Replaying sponsor breaks:** signed, single-use tokens that must be at least 20 seconds old, with a 4-a-day cap on the server.
- **Leaked links / scraping PYQ answers:** already rate-limited through `/api/answers`.

---

## 6. What to watch every week

Add to `weekly_growth_metrics()` or the admin console (Release 10):

- Live AI calls per tier per day, cache hit rate, and share of pre-generated answers served.
- ₹ spent on AI per paying user vs price (target under 25%).
- Sponsor breaks per user, and credits granted vs used.
- Referral rewards paid vs referrals blocked (device overlap, not enough activity).

## 7. Build order (suggested)

1. Pre-generate PYQ explanations and hints (§3.1): the largest saving, free to run.
2. Model routing plus output caps (§3.2, §3.4): a one-day change in `lib/ai`.
3. Monthly fair-use ceilings (§3.5): a small migration.
4. Credit packs (§3.7): when payments go live.
5. Rewarded ads with server-side verification (§3.8): once an ad network approves the domain.
