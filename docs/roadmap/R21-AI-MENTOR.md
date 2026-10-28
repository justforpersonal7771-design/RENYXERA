# Release 21: AI Mentor, rebuilt as the brain of the app

*Owner document, 29 Oct 2026. Written for Adil. Status: plan only, nothing built yet.*

## 1. Why the current screen fails

The owner's verdict, "it is full of analytics, not an AI Mentor", is correct. Read from `app/(dashboard)/ai-mentor/page.tsx` (1,008 lines):

| What the screen shows today | What it really is |
|---|---|
| Readiness gauge, subject mastery | Analytics (a second copy of /analytics) |
| "AI Study Plan Suggestions" | Rule-based `StudyPlanEngine`, no AI call |
| Concept Prerequisite Knowledge Graph | Static graph plus mastery numbers |
| Shortcut & Exam Trick Library, Saved Notes | A library |
| Mistake Cognitive Patterns, Learning Timeline | Analytics and history |

The page never calls the AI. There is no place to ask a question, no conversation, no memory the student can feel, and nothing that acts. The only real AI in the product lives in the AI Tutor (one question at a time) and the pre-generated hints. The Mentor should be the layer above both: the part that knows you.

**Division of labour after the refactor**

| Screen | Job | Question it answers |
|---|---|---|
| Analytics | Numbers and charts | "How am I doing?" |
| AI Tutor | One question, taught in depth | "Explain this." |
| **AI Mentor** | Knows the student, decides, talks, acts | **"What should I do next, and why?"** |

## 2. Design principles (from what the best AI tutors do)

Drawn from the published practice of Khanmigo, Duolingo Max, Google's guided-learning / LearnLM work, Socratic, and spaced-repetition systems (Anki/FSRS). This is my own summary of those products, not freshly fetched pages; re-check specifics before quoting them publicly.

1. **Conversation first.** A mentor is something you talk to. The chat is the centre of the screen, not a side card.
2. **It decides, you approve.** Every suggestion comes with a one-tap action (add to calendar, start the test, open the lesson). Nothing is added silently.
3. **Guide, don't just tell.** Socratic mode asks the student to try the next step before revealing it. Direct-answer mode is one tap away.
4. **Show its evidence.** Every claim cites the data behind it ("you missed 4 of 5 Deadlock questions this month"). Trust comes from visible reasons.
5. **Remember across days.** Goals, weak spots, preferences and past advice persist, and the Mentor refers to them.
6. **Honest and calm.** No fake urgency or invented scores. If there is not enough data, it says so and asks for a short diagnostic.
7. **Cheap by design.** Everything that can be computed without AI stays rule-based; the model is called only where language or judgement is needed (section 6).

## 3. The new screen, region by region

Desktop: two columns. Mobile: single column, chat full-height with a bottom composer, the other regions as horizontal chips above it.

### A. Mentor header (top of the left column)
- Greeting in the mentor's voice that depends on time and state ("Good evening Adil. 94 days to GATE. Yesterday you finished OS Memory Management, nice.").
- **Today's focus**: one sentence plus one primary button ("Start 20-min Deadlock drill").
- Personality switch: Friendly / Strict coach / Concise. Stored in the profile, passed to every prompt.
- Plan banner: requests left today, "Earn more" (sponsor break), "See plans" on Free.

### B. Chat (the heart, left column, most of the height)
1. Free-text ask with streaming replies. It understands: "what should I study today", "why do I keep missing graph questions", "make me a 3-day plan for TOC", "quiz me on joins", "explain my last wrong answer".
2. **Quick-prompt chips** that change with the student's state (after a test: "Go over my last test"; no data: "Find my level").
3. **Rich reply cards inside the chat**, not just text:
   - Plan card with "Add all to calendar" and per-item date/priority.
   - Question card (a real PYQ) answerable in place, with an instant result.
   - Lesson card linking to the matching study-material section.
   - Chart card (small, one topic's trend) so numbers appear only when they support an answer.
   - Source line: "Based on: 12 mistakes, last 3 tests, calendar".
4. **Modes**: Ask, Socratic (guided), Quiz me, Plan, Review my test.
5. **Photo doubt**: attach a photo of a textbook question (Pro; Gemini vision; counts as one request). Already listed as FEATURES #15.
6. Message actions: copy, save to Notes, "this was wrong" (feeds the correction queue), thumbs up/down.
7. Per-thread history in IndexedDB (`ConversationMemory` already exists) with cloud sync for signed-in users; threads can be pinned or deleted.

### C. "Know me" panel (right column, top): what the Mentor remembers
- Goal: target score or rank, exam date, daily hours, weak and strong subjects. Editable, one tap each. These feed every prompt.
- "Things I've noticed" list (3 to 5 lines, each with an Evidence link opening the matching questions): e.g. "You lose marks on sign errors in Linear Algebra", "You are fastest in the morning".
- A "Forget this" control on each remembered item, and "Reset what the Mentor knows". Privacy is visible.

### D. Plan and today (right column, middle)
- **Today's plan**: 3 to 5 tasks with time estimates, checkable, synced with the Calendar. "Re-plan" rebuilds the rest of the week around what actually happened.
- **This week** strip (7 days) and a "Behind schedule" nudge that offers to compress or drop low-value tasks.
- Plans come from `StudyPlanEngine` (rules) and are phrased and re-ordered by the AI on request, never auto-added.

### E. Next best action queue (right column, bottom)
Ranked cards, max 5, each one tap to act:
1. Revisit due mistakes (spaced repetition due today).
2. Weak-topic drill (10 questions generated or picked from the bank).
3. Take the next mock (when readiness and gap analysis say so).
4. Lesson to read (linked section).
5. Rest-day suggestion when burnout risk is high (`burnoutRisk` is already computed).

### F. Weekly review (a card that appears on Sunday, also reachable from the header)
AI-written summary of the week: what improved, what slipped, the one thing to change, next week's plan draft, with an "Accept plan" button. Optionally mirrored to Telegram (FEATURES #20).

### G. Diagnostic and onboarding (first visit, or when data is thin)
A 10-question adaptive diagnostic across the branch's subjects (taken from PYQs, marked by the existing engine). The Mentor then states a starting level per subject and proposes a first plan. This is what makes it feel intelligent from day one.

### H. What moves out of this screen
Readiness gauge, subject masteries, mistake patterns and the learning timeline stay available but move to **Analytics** (they are analytics). The Mentor links to them with "See the full picture" and quotes from them inside chat answers. The knowledge graph becomes a Mentor tool: "Why can't I solve this?" opens a prerequisite chain inside chat, instead of a permanent card. Shortcut library and Saved Notes move to **Study** (they are study material).

## 4. The AI capabilities, and how each one works

| Capability | Trigger | Data used | Model / cost class |
|---|---|---|---|
| Chat answer with evidence | User message | Profile summary, last N turns, retrieved facts | Flash; summary-based prompt |
| Next best action | Screen open, test finished | Mistakes due, mastery, calendar, readiness | Rules (free); AI only to phrase |
| Study plan draft and re-plan | "Plan" mode, "Re-plan" | Exam date, hours/day, weak topics, calendar | Rules for slots; Flash to explain |
| Socratic step-by-step | Socratic mode | The question plus its stored solution | Flash-Lite per step, reuses pre-gen items |
| Quiz me / drill | "Quiz me" | Bank by topic and difficulty; Spark for gaps | Bank first (free); Spark if the bank is thin |
| Review my test | After a submit | Session, time per question, mistakes | Flash, one call, cached by session |
| Weekly review | Sunday or on demand | 7 days of sessions, calendar, goals | Flash, one call per week |
| Diagnostic | First visit | 10 PYQs | Rules (free); AI summary only |
| Photo doubt | Pro, image attached | Image plus profile | Flash with vision |
| Insight mining | Background, weekly | Mistake log | Rules (patterns) plus one Flash-Lite call to name them |

## 5. Memory model

| Layer | Content | Where | Lifetime |
|---|---|---|---|
| Profile | Goal, date, hours, personality, branch | Supabase `profiles` plus IndexedDB | Permanent, editable |
| Learner state | Topic mastery, mistake patterns, streak, burnout risk | Computed by `MemoryEngine` / `MasteryEngine` | Recomputed |
| Facts the Mentor noted | "Prefers formulas first", "weak at proofs" | New table `mentor_memories` (user, text, evidence_ids, created_at) | Until the user forgets |
| Conversation | Threads and turns | `ConversationMemory` (IndexedDB) plus `mentor_threads` for signed-in sync | Pinned or 90 days |
| Retrieval | Last N turns plus top 5 relevant memories plus current numbers | Built per request in `ai-context-builder.ts` | Per request |

Prompts get a compact "learner brief" (about 300 tokens), never the raw history. The brief is cached per day so most chats reuse it.

## 6. Cost and plan fit (builds on docs/AI_USAGE_STRATEGY.md)

- **Free:** the one-time 5-request teaser works in chat. Next best action, Today's plan, the diagnostic and a weekly-review preview stay **rules-only and free**, so the Mentor is useful without AI spend. Locked parts show a calm "Plus" tag, no blurred fakes.
- **Plus:** chat, plans and drills within the daily 75 requests; Socratic and quiz modes use pre-generated items first.
- **Pro:** 150/day, photo doubts, weekly review, longer memory, deep review of tests.
- One chat turn is one request. Rule-based cards cost nothing. A turn that only reshuffles known data ("show my plan") is answered locally without a call.
- Guardrails: reuse the existing rate limit, the shared cache keyed by learner-brief hash, `maxOutputTokens` caps, and the monthly fair-use ceiling.

## 7. Safety and quality

- Answers about GATE facts (syllabus, dates, marking) come from our data, not the model's memory; the Mentor says "I'm not sure" rather than guessing.
- Every numeric claim in a reply is computed by code and injected into the prompt; the model writes sentences, it does not calculate. A post-check rejects replies that state a number not in the provided facts.
- Medical or mental-health topics: gentle redirection, no advice. Burnout suggestions are about rest and schedule only.
- Prompt-injection hardening: user text and question text are quoted data, never instructions.
- The "this was wrong" flag stores the thread id; each week we review the top flagged answers.

## 8. Build order

| Phase | Deliverable | Notes |
|---|---|---|
| M1 | New shell: header, chat with streaming, quick prompts, Know-me panel, analytics cards moved out | Reuses `/api/ai/generate` plus a new `type: "MENTOR_CHAT"` |
| M2 | Next best action queue and Today's plan with calendar actions | Mostly rules; minimal AI cost |
| M3 | Reply cards (plan, question, lesson, chart) and modes (Socratic, Quiz me, Review my test) | Needs structured JSON replies and a parser |
| M4 | Diagnostic and onboarding | PYQ-based, no AI cost |
| M5 | Memory table, "things I've noticed", forget controls, cloud sync of threads | Needs a migration |
| M6 | Weekly review, Telegram mirror, photo doubts | Pro features |
| M7 | Quality loop: flags, an evaluation set of 50 questions, the number post-check | Gate before wide launch |

## 9. Done when

- A first-time student can open the Mentor, take the diagnostic, get a plan, ask a question, and add the plan to the calendar without leaving the screen.
- No chart-only card remains on the Mentor screen; every card has a button that does something.
- A reply never contains a number the code did not supply (checked by the post-check on the 50-question evaluation set).
- Free users see a working Mentor without using AI requests.
- Desktop and mobile in light and dark pass the visual audit (`scripts/zz-audit.mjs`) with no contrast or overflow findings.

## 10. Decisions for the owner

1. Name: keep "AI Mentor" in the navbar with "Your Mentor" as the page title? (Recommended: yes.)
2. Free keeps the 5-request teaser plus sponsor-break credits for chat, as today? (Recommended: yes, no change.)
3. Move Readiness, Mastery, Patterns and Timeline to Analytics in M1, or after the chat ships? (Recommended: M1, so the screen stops reading as analytics immediately.)
4. Store Mentor memories in the cloud for signed-in users? (Recommended: yes, with a visible "Forget" control.)
