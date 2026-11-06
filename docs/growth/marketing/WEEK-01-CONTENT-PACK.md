# Week 1 content pack (drafted 3 Nov 2026)

[← Docs index](../../README.md) · [Open items](../../open-work/OPEN-ITEMS-2026-11-06.md)

Source: our own past-paper profile for GATE CSE (15 papers, 2017 to 2026; marks per paper = marks asked on that topic divided by 15). Every number below comes from [`data/forge/CS/profile.json`](../../../data/forge/CS/profile.json). You review and post; nothing here is sent automatically.

**The hook (true and checkable):** five topics, about **13 of 100 marks** every year. Parsing 2.9, Cache 3.1, DFA/NFA 2.7, Virtual memory 2.5, K-maps 2.2 (marks per paper, rounded).

Always end with the same one action: "Try a real PYQ on this topic, free: gate.renyxera.workers.dev". Put the link in the bio on Instagram. Tag every link so the funnel report shows which channel works. The site reads `utm_source`: Instagram bio `gate.renyxera.workers.dev/?utm_source=instagram`, Telegram `...?utm_source=telegram`, Reddit/Quora replies `...?utm_source=reddit` or `quora`, YouTube comments `...?utm_source=youtube`.

## 1. Instagram carousel: "5 topics worth 13 marks, every year"
1. **Cover:** "GATE CSE: 5 topics = ~13 marks every year" + small line "from 15 real papers, 2017 to 2026".
2. **Cache and memory hierarchy:** about 3.1 marks per paper. Asked in all 10 years. "Practise: tag, index, offset bits."
3. **Parsing (LL(1), LR(1), LALR):** about 2.9 marks per paper, rising lately (3.2 in 2024 to 2026). "Practise: first/follow sets, conflicts."
4. **DFA/NFA and minimisation:** about 2.7 marks per paper. "Practise: counting states of the minimal DFA."
5. **Virtual memory:** about 2.5 marks per paper. "Practise: page-fault traces, TLB, multi-level tables."
6. **K-maps and Boolean minimisation:** about 2.2 marks per paper, 2.7 lately.
7. **How to use this:** "One topic a day, five days. Do 5 real PYQs on it, then read why each wrong option is wrong."
8. **Call to action:** "Free PYQs by topic with full solutions. Link in bio."
Caption: "Which topic do you avoid? Comment it and I will make that one next." (Questions in captions raise comments; reply to every one.)

## 2. Reel script (25 seconds)
- 0 to 3 s, on screen: "13 marks. 5 topics. Same every year." Voice: "Most GATE students split time evenly. The papers don't."
- 3 to 15 s, quick cuts of the five topic names with the marks per paper counting up.
- 15 to 22 s: "These numbers come from 15 real GATE CSE papers."
- 22 to 25 s: "Start with cache. Link in bio." 
Film it with the app's film feature if it can render the count-up; otherwise screen-record the Analytics topic list.

## 3. Telegram post (for your own group; opt-in members only)
> GATE CSE: where the marks actually are
> Across 15 papers (2017 to 2026) five topics bring about 13 of 100 marks every year:
> Cache 3.1 | Parsing 2.9 | DFA/NFA 2.7 | Virtual memory 2.5 | K-maps 2.2
> This week: do one topic a day with real PYQs. Reply with the topic you find hardest and I will post a worked example.
> Practise free: gate.renyxera.workers.dev/?utm_source=telegram

## 4. Reply templates for public GATE questions (post by hand, one per thread)
Use only where someone asked the question. Give the answer first, mention the app last and only if it helps. Do not post the same text twice in one community.

| Someone asks | Reply skeleton |
|---|---|
| "Which topics are most important for GATE CSE?" | Give the five topics and marks per paper above, say it comes from 15 papers, then: "I track this on RENYXERA if you want the full list." |
| "How many PYQs should I solve?" | "At least the last 10 years. Do them by topic, not year by year, and keep a list of every question you got wrong. Review that list weekly." |
| "How do I revise in the last 2 months?" | "Week 1 to 4: the five high-weight topics with PYQs. Week 5 to 6: mistakes list. Last 2 weeks: full mocks in exam timing." |
| "Cache numericals confuse me" | Show the tag/index/offset split in two lines, one worked example, offer more. |
| "Is there a free PYQ site with solutions?" | Be honest: name that RENYXERA is free for PYQs with solutions, say you built it, and say what is limited on the free plan. Never claim it is better than others. |
| "DFA minimisation shortcut?" | Describe "count what must be remembered" with one example; no link needed. |

Rule: if you are the builder, say so in the reply ("I'm building this"). Hidden promotion gets removed and hurts the account.

## 5. How to judge it after 7 days
Run `node scripts/growth-metrics.mjs` and read the funnel table by source. Keep the channel with the most "tested" per visitor, drop the one with visitors but no tests, and ask the next question: where do people stop?
