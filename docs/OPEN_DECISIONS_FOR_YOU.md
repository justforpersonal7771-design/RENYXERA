# Decisions only you can make (with context)

*18 Oct 2026. Answer in any form ("F1 A, F2 yes..."). Each item says why it matters and what I will do by default if you say nothing. Items marked **blocks** stop work until answered.*

## A. Forge (questions and mocks), see `FORGE_ENTITLEMENTS_AND_SETUP.md`

| # | Question | Context | My default |
|---|---|---|---|
| F1 **blocks** | How limited is Forge for **Plus**? Options: (a) 10 Forge questions a day, (b) 3 Forge sets a day, (c) full Daily Forge but no archive, (d) same as Pro except "X" hard items | Plus is INR 29, Pro INR 99. The gap should be clear but Plus must feel worth it | (c) Daily Forge + filtered practice, no archive, no X items; Pro gets archive + X + unlimited |
| F2 | Should **Free** see worked solutions of Forge Mock questions after the mock? | Shows quality (conversion moment) but gives away some solved questions | Yes, solutions for mock questions only, for one week after the mock |
| F3 | Do we post one Forge question a day publicly on Telegram branch channels (with the answer in a spoiler)? | Free promotion; costs 1 of 10 daily items | Yes, 1 of 10, from the Daily Forge, after Forge exists |
| F4 | Forge Mock schedule: weekly Sunday 10:00 IST per branch? | Needs 65 fresh questions every week per branch (heavy). Alternative: fortnightly for smaller branches | Weekly for CS, fortnightly for the rest until buffers exist |
| F5 | Launch order: CS, then EC, then EE, ME, CE, DA? | Largest audience first | Yes |
| F6 | Name: keep "Forge" (alternatives Apex Set, Crucible)? | Used in UI and posts, changeable in one file | Keep Forge |

## B. Study materials (separate paid product), see `docs/study-materials/00-README.md` and `08-PRODUCT-AND-PRICING.md`

| # | Question | Context | My default |
|---|---|---|---|
| S1 **blocks** | Pricing model: one-time pass per branch, subscription, or per-subject packs? And the price point? | Decides what we build (access control, checkout). Zero-budget app, student audience | One-time pass per branch (price: you decide; I suggest testing INR 499 to 999) |
| S2 | Branch order after CS? | Follows audience and question banks | EC, EE, ME, CE, DA |
| S3 | Sources rule: we learn from textbooks and may look at coaching notes for layout/coverage only; never copy wording, figures, examples | Legal safety and originality (your `notes/` folder is for reference) | Confirm yes |
| S4 **blocks** | Who reviews technical accuracy of each lesson (you, a friend, a paid tutor per subject)? | Single biggest quality lever; a wrong formula in a paid product is costly | You for CS spot-checks, paid tutor per subject later |
| S5 | Language: English only at launch, Hindi later? | Doubles the work if both | English only |
| S6 | Approve building one complete sample chapter (CS: Deadlock) first? | Proves design, protection and effort before the whole programme | Yes |
| S7 | Private repo for study content? | Content is the paid asset; a public repo exposes source files | Content in a private repo/bucket, only the renderer is public |

## C. Setup tasks that depend on you
| # | Task | Where |
|---|---|---|
| 1 | Instagram setup (Meta app, token, 2 secrets) | `docs/instagram/01-SETUP.md` |
| 2 | Upload the film to YouTube, send me the video id | checklist |
| 3 | Telegram Premium steps (boosts, per-branch folders, BotFather menu button) | `docs/telegram-premium/` |
| 4 | Watch the v8 films (laptop and phone) and send notes | `video/out/` |
| 5 | Forge test with real Free, Plus and Pro accounts (practice sets gate) | checklist |
| 6 | Custom domain (then business email and Google OAuth logo) | `docs/BUSINESS_EMAIL_STRATEGY.md` |
| 7 | Growth tasks G-5, C-3, V-1, P-1 | `docs/GROWTH_TASKS.md` |
| 8 | Check payment, More sheet, onboarding Telegram step, aptitude images, Civil practice on a real phone | checklist |

## D. Business and policy questions I cannot answer for you
- **Refund and pricing policy** for the study-materials pass (links to the existing refund page).
- **Student verification** for the personalised share cards: we only show what the student types; no ID check. Is that acceptable?
- **GST/tax** on the study-materials product once revenue grows (talk to an accountant).
- **Content licences:** whether you hold any rights to the textbooks in `notes/` beyond personal study.

## Answered on 31 Oct 2026
- **F1 (Plus Forge limit):** Plus gets **15 Forge questions a day** (owner said 15 to 20; started at the lower number because raising later is easy and lowering is not); Pro unlimited. Free gets a fixed 10-question taster (owner's tease rule, 30 Oct).
- **S1 (Study pricing):** per-subject packs at ₹99 to ₹149, curated bundles (core subjects, the hottest, the toughest, with Pro), refunds only for glitches and errors by email. Details and numbers: `docs/study-materials/13-PRICING-BUNDLES-AND-OFFERS.md`.
- **S2 (branch order):** CS first, then the other branches; **General Aptitude last** (built once, shared by every branch).
- **S4 (accuracy reviewer):** the owner reviews CS. A paid reviewer per subject is revisited after CS.
