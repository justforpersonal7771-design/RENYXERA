# R27 · Mentor chat: feature backlog and AI top-ups

[← Docs index](../README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md)

*Written 1 Nov 2026 from the owner's request: "create a list of features that we can add to this by researching: speech, talking with AI, uploading images, PDFs and so on, to make it robust". Companion to the chat screen that exists today (history, groups, search, edit with versions, answer again, mode and style menus, enlarge options, cross-device sync). Everything here must respect: zero budget until revenue (free tiers, browser features first), answers grounded in the student's own data, "tease, don't block" for paid features, phone first, and India time (IST).*

## 1. What the big chat apps offer (research)
A 2026 round-up of ChatGPT, Gemini and Claude ([Nektony comparison](https://nektony.com/reviews/claude-vs-chatgpt-vs-gemini), [workspace comparison](https://www.mindstudio.ai/blog/gemini-notebooks-vs-claude-projects-vs-chatgpt-memory), [feature comparison](https://aionx.co/ai-comparisons/ai-chatbot-features-comparison/), [file limits](https://tech-insider.org/ie/chatgpt-vs-claude-vs-gemini-file-upload-2026/)) shows the same building blocks everywhere, with figures that disagree between sources (treat limits as unverified):
- **Voice:** a hands-free spoken conversation (ChatGPT's is praised as the most natural; Gemini Live adds camera and screen sharing; Claude's is mobile-first).
- **Files:** images and PDFs (large page counts) read inside the chat.
- **Memory and projects:** remembered preferences, and project spaces with their own instructions and files (Claude Projects, ChatGPT Projects, Gemini Notebooks). Our "groups" in history are the first step.
- **Deep research:** a long, sourced report built in the background.
- **Canvas / Artifacts:** a side panel where a document or small app is built with you.
- **Study modes:** step-by-step tutoring instead of giving the answer.

## 2. The backlog, ordered by value for a GATE student
Effort: S = days, M = about a week, L = weeks. "Cost" is what it needs beyond today's free setup.

### A. Quick wins (build soon)
| Feature | What the student gets | Effort | Cost |
|---|---|---|---|
| **Dictation (speech to text)** | Mic button in the composer; speak a question, text appears (browser Web Speech API; English and Hindi) | S | Free (browser) |
| **Read aloud (text to speech)** | Speaker button on any answer; speed control; reads maths symbols sensibly | S | Free (browser voices) |
| **Copy as notes / save to notes** | One tap sends an answer to the student's Notes or Flashcards | S | Free |
| **Pinned messages and "starred answers"** | A shelf of the answers worth keeping, searchable | S | Free |
| **Export a chat** | Markdown or PDF of one chat (for revision) | S | Free |
| **Share a chat link** (read-only, consent first) | Send a good explanation to a friend | M | Free tier DB |
| **Prompt library** | Ready prompts per subject ("explain like I am new", "give me 3 traps", "make a one-page summary") | S | Free |
| **Slash commands** | `/plan`, `/quiz`, `/review`, `/explain` in the composer | S | Free |
| **Keyboard shortcuts** | New chat, search chats, focus the box | S | Free |

### B. Files and pictures (the "robust" step)
| Feature | What the student gets | Effort | Cost |
|---|---|---|---|
| **Photo of a question** | Take or pick a photo of a printed or handwritten question; the Mentor reads it and explains (vision model) | M | Vision model usage counts against the AI quota |
| **PDF / notes upload** | Ask questions about one's own notes or a paper; text is extracted in the browser (pdf.js), only the relevant parts are sent | M | Free extraction; model usage |
| **Paste a screenshot** | Ctrl+V an image into the box | S after photo support | as above |
| **Question from the bank in one tap** | `@` to attach any PYQ or Forge question to the message | S | Free |
| **Handwriting solution check** | Photo of the student's working; the Mentor marks the steps | L | vision usage |

### C. Voice conversation
| Feature | What the student gets | Effort | Cost |
|---|---|---|---|
| **Talk mode** | Hands-free back-and-forth: speak, it answers aloud, speak again (dictation + read aloud + silence detection) | M | Free in browsers that support it; best on Chrome/Android |
| **"Revise on the go" audio** | The day's weak topics read aloud as a 10-minute playlist | M | Free (browser TTS) or local TTS later |
| **Better voices** | Natural Indian-English and Hindi voices | L | A TTS service or local model (see Study doc 14) |

### D. Learning features that chat apps do not have (our edge)
| Feature | What the student gets | Effort | Cost |
|---|---|---|---|
| **Study mode** | "Guide me" asks one question at a time and never gives the answer first (exists as a mode; add progress and a hint ladder) | S | Free |
| **Explain this mistake** | From any wrong answer, one tap opens the chat with the question, the student's answer and the key already attached | S | Free |
| **Practice from the chat** | The Mentor offers 5 questions on the topic being discussed and opens them as a test | M | Free |
| **Weak-topic memory** | The Mentor remembers what the student struggled with across chats and says so ("last week you missed pipeline hazards") | M | Free, uses existing data |
| **Plan to calendar** | Plans become real calendar blocks (exists as "Add"); add reschedule from chat | S | Free |
| **Daily five-minute check** | A short Mentor message each day (Telegram or the app) | S | Free |
| **Mock debrief** | After a mock, a chat opens with the analysis already loaded | S | Free |
| **Canvas for plans and notes** | A side panel where a revision plan or a formula sheet is edited together with the Mentor | L | Free |
| **Deep research for exam strategy** | A longer, sourced answer ("how should I split 90 days across subjects?") built in the background | L | Larger model use, so paid plans |

### E. Quality, safety and trust
- **Show sources:** every claim from the student's data names where it came from (exists in part: the "check these numbers" note). Add a "Why this answer" drawer listing the data used.
- **Answer-quality feedback:** the thumbs and flag exist; add a "this was wrong" reason and a weekly review of flagged answers.
- **Safe-mode topics:** polite refusals for off-topic or harmful requests, with a short, calm message.
- **Privacy controls:** delete all chats, turn off synced history, "temporary chat" that is never saved (a favourite in ChatGPT/Gemini).
- **Accessibility:** screen-reader announcements for new answers (done in part), large-text setting, keyboard-only use.
- **Offline:** show saved chats offline; queue the message and send when back online.

### F. Order of work
1. **A (all quick wins)**, with dictation and read aloud first: they are free and feel premium.
2. **Photo of a question** and **PDF upload** (the most requested feature in this kind of app), after the usage rules in section 3 exist.
3. **Talk mode** on top of dictation and read aloud.
4. **Weak-topic memory** and **Explain this mistake** (they use our own data, so they are our moat).
5. **Canvas** and **deep research** last.

## 3. AI limits and top-ups ("small recharges")
**The problem:** the Mentor and the other AI features cost money per message (even on free tiers there are daily limits). Free students need a taster, Plus and Pro need more, and a student who runs out mid-exam-season should be able to keep going without jumping to a big plan.

**What others do:** ChatGPT sells a cheaper India plan with higher limits and UPI payment ([ChatGPT Go, ₹399](https://www.digit.in/news/general/openai-introduces-chatgpt-go-for-indian-users-check-benefits-price-availability-and-more.html)); smaller AI products sell **extra credit packs that work only on top of an active subscription and are used after the plan's own limit** ([example](https://chatmate.gumroad.com/l/chatmateai_extra)) and a student university programme uses free monthly credits first and purchased credits after ([HKU](https://its.hku.hk/?p=63397)). Consumer giants did not show one-off Indian top-up packs in this search, so this would be a differentiator.

**Proposed design (prices are placeholders to be set from real cost data):**
| Piece | Rule |
|---|---|
| **Daily allowance** | Free: a small taster (already built for practice sets); Plus: a daily limit; Pro: the highest daily limit. Shown as "12 of 30 messages left today" under the box, in IST, resetting at midnight IST. |
| **Top-up packs** | One-off packs that add messages which **do not expire for 90 days**, used only after the daily allowance is gone. Prices follow the "bigger is much cheaper per message" rule below. |
| **Who can buy** | Plus and Pro always; Free students can buy a pack too (a pack never unlocks Pro features, only extra messages), because "tease, don't block" means a path forward, not a wall. |
| **Where it appears** | In the chat when the allowance is nearly used up ("3 left today. Get more or upgrade"); on the Plans page as a small section; never as a pop-up during an answer. |
| **Upgrade nudge** | The header "Upgrade" button (built) for anyone not on Pro; when a student buys a second pack in a month, show "Pro would cost less" with the maths. |
| **Refunds** | Same rule as everything: only for errors or glitches, by email (see Refunds page). |

**Pack prices (owner direction, 1 Nov; unit changed from "messages" to Mentor tokens on 1 Nov so the meter follows real cost):**
| Pack | Price | Tokens | Price per 1K tokens | About how many normal questions | What it is for |
|---|---|---|---|---|---|
| **Small** | **₹19** | 150K tokens | 12.7 paise | about 90 short questions | The easy first buy, a low-risk try |
| **Medium** | **₹49** | 450K tokens | 10.9 paise | about 270 | The "decoy": looks fine, but is clearly beaten by the next one |
| **Large** | **₹79** | 1.2M tokens | **6.6 paise (48 % cheaper than Small)** | about 720 | The target: ₹30 more than Medium for 2.7 times the tokens |

(A short question uses about 1.5K tokens: what you write, the recent conversation the Mentor reads again, your progress summary, and the answer. Long plans and long chats use more, so heavy users use their tokens faster instead of costing us more.)

**Why it works (and stays honest):** the same ideas as telecom data packs and biscuit packets, used with true numbers.
- **Value shown on every pack** ("about 720 questions" and the price per 1K tokens), so the value is easy to see and true.
- **Decoy / middle option:** the 150 pack is deliberately priced so that the jump to 400 feels almost free (₹30 more). Most buyers move up one step, and the big pack carries the margin.
- **Anchor:** show the biggest pack first or highlighted as "Best value" with a plain comparison line ("buying the same amount in Small packs would cost ₹152").
- **Default to the best value:** the Large pack is pre-selected; the Small pack is one tap away. Never hide the small pack.
- **Odd prices (19, 49, 79)** read as lower than round ones and keep each pack under the impulse-buy line.
- **Rules we keep:** no fake countdowns, no invented scarcity, no "only 2 left", no pre-ticked extras on the payment page. The expiry (90 days) is stated next to the price, and refunds follow the normal policy (errors or glitches only, by email).

**Check before launch:** the Large pack's 6.6 paise per 1K tokens must still cover the real model cost per 1K tokens plus payment fees of about 2 %. Set the token counts from the measured cost, then keep the same shape (small is dear, big is much cheaper). If the cost is higher, lower the token counts, not the shape.

### 3b. Big requests: how we avoid losing money (owner concern, 1 Nov; unit decision: tokens, not messages)
If every request counted as "one message" whatever its size, a student who always sends huge requests would cost more than they pay. So the allowance and the packs are counted in **Mentor tokens** (the real unit of AI cost, including the conversation, or "context", the Mentor reads again each turn):
- **What already limits cost (built):** the message is capped at 2,000 characters, the answer at 2,048 tokens, the learner summary at 6,000 characters, and requests are rate-limited (15 a minute). So no single request can run away.
- **The main hidden cost is the conversation being re-sent on every turn.** Fixed 1 Nov: only the last **6** messages, trimmed to **1,200 characters** each (was 10 and 2,500), so a long chat no longer costs more per turn than a short one.
- **Token meter (function written and tested, [`lib/billing/ai-credits.ts`](../../lib/billing/ai-credits.ts), `npm run check:credits`):** each request is charged what it needs: input (message + recent conversation + summary) plus the expected answer, with a minimum of 1,000 and a ceiling of 16,000 tokens. A short question is about 1.5K; a deep question in a long chat or a full-week plan costs more; two photos add about 3K. The server later charges the real token counts the model reports.
- **Honest and visible:** under the box, "This will use about 2.4K tokens" appears before sending, and "Tokens left today: 38K" sits beside the plan. Pack pages say plainly: "A short question is about 1.5K tokens. Long plans and long chats use more."
- **Per-mode daily ceilings:** heavy modes (Plan, Review, Weekly, Quiz) also have a small daily cap per plan, so one student cannot spend a whole allowance on 5-message requests in one go.
- **A safety ceiling:** an absolute daily maximum of work per account (a circuit breaker above any pack) and an alert for us when an account passes a high-spend line, so a bug or abuse cannot run up a bill.
- **Nudges, not walls:** at 20 turns in one chat the Mentor suggests "start a new chat for a fresh, cheaper conversation" (and offers to summarise the chat into the first message of the new one).
- **Attachments:** photos and PDFs use more tokens and have size and count limits per message (for example 2 photos, 10 PDF pages), checked on the server.
- **Measure, then tune:** log (without message text) the tokens and cost of every call for two weeks; set the daily allowances and pack sizes from the real averages. If the real cost is above the pack price per 1K tokens, lower the token counts but keep the same price shape.
- **Server build:** extend the existing `consume_ai_call(p_user, p_limit)` database function to take a token cost (`p_cost`), spend daily allowance first and then packs, in one transaction (so two requests at once cannot overspend).

**Build outline:** a table `ai_credits (user_id, balance, expires_at, source)` with row-level security and server-only writes; the AI route spends daily allowance first, then the oldest pack; Razorpay order type "topup" using the existing checkout; a visible ledger on the Receipt page; unit tests for the spending order; an admin-free reconciliation script. Free-tier check: a few thousand rows is nothing for the database.

## 4. Decisions
**Decided by the owner (1 Nov 2026):**
1. Order of work is as in section 2F (quick wins first, then photo and PDF, then talk mode, then memory, then canvas and deep research).
2. **Free students can buy top-up packs.** A pack never unlocks Pro features; it only adds messages. (Server rule: the pack ledger is read only by the message counter, never by the plan check.)
3. **Temporary chat is on for guests and chats are never saved for them; signing in saves the open chat.** (Built 1 Nov: guests see "This is a temporary chat" with "Sign in to save"; after sign-in the open chat is kept.) Signed-in students keep normal saved chats; a "temporary chat" switch for signed-in students is a later quick win.
4. **Voice:** stay with free browser voices now. Plan a better voice later, including **Hinglish and Hindi** (voices and dictation in both).
5. Pack prices ₹19 / ₹49 / ₹79 for 150K / 450K / 1.2M tokens (section 3), 90-day expiry. Unit is tokens (context), not messages.

**Still open:**
1. Real cost per 1K tokens (to be measured in the two-week logging period) to confirm the prices.
2. Daily allowances per plan and the per-mode caps (section 3b).
3. Whether the "start a new chat" nudge should appear at 20 turns or sooner.
