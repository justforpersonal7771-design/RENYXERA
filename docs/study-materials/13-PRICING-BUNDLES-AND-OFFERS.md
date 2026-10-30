# 13 · Study materials: subject packs, bundles and where we offer them

*31 Oct 2026. Owner decision (S1/S4) recorded here; it replaces the "branch pass" recommendation in `08-PRODUCT-AND-PRICING.md` §3. Prices are proposals on the owner's range (₹99 to ₹149 per subject); every number below is derived from our own measured data (`data/forge/CS/profile.json`: marks per paper and the share of Hard questions over 15 official papers, 2017 to 2026).*

## 1. Decisions (owner, 31 Oct)

| | Decision |
|---|---|
| Model | **Per-subject packs plus curated bundles** (not a branch pass, not a subscription). Prices ₹99 to ₹149 per subject depending on the subject's weight and volume; may rise later, never retroactively. |
| Order | **CS first.** Other branches only after CS is complete. **General Aptitude last** (vast, and identical for every branch, so it is built once and sold once for all branches). |
| Accuracy review | **The owner reviews CS** (spot-checks, every subject before it ships). A paid reviewer per subject is considered later, branch by branch. |
| Refunds | Only for glitches and errors (double or wrong charge, a payment that did not activate, a technical fault or content error we cannot fix), requested **by email with a genuine reason**, reviewed one by one. No change-of-mind refunds. Live policy: `/refunds` (rewritten 31 Oct). |
| Kept from earlier rules | Study materials stay a separate product (a plan does not include them). No free trials, no lifetime offers, no invented "was" prices, no fake urgency. |

## 2. Subject packs (CS) and prices

The price follows two facts: how many marks the subject carries (more marks, more value to the student) and how much teaching it needs (topics, depth, how many questions are Hard).

| Pack | Marks per paper | Hard questions | Topics | Price |
|---|---|---|---|---|
| Operating Systems | 8.4 | 18 % | 6 | ₹149 |
| Theory of Computation | 8.1 | 13 % | 4 | ₹149 |
| Computer Networks | 7.9 | 7 % | 6 | ₹149 |
| Computer Organization & Architecture | 7.7 | 17 % | 6 | ₹149 |
| Algorithms | 7.6 | 22 % | 7 | ₹149 |
| Discrete Mathematics | 7.5 | **44 %** (hardest) | 7 | ₹149 |
| Database Management Systems | 7.4 | 8 % | 7 | ₹149 |
| Digital Logic | 6.9 | 13 % | 4 | ₹129 |
| Programming & Data Structures (C 6.0 + DS 4.1) | 10.1 | 14 % / 10 % | 8 | ₹129 |
| Compiler Design | 5.7 | 22 % | 4 | ₹129 |
| Engineering Maths (Probability 3.4 + Linear Algebra 3.0 + Calculus 1.4) | 7.8 | n/a | 10 | ₹99 |
| **General Aptitude (all branches, built last)** | 15.0 | 3 % | 22 | ₹149, once, valid in every branch |

Sum of the 11 technical CS packs: **₹1,529**. With Aptitude: **₹1,678**.

A useful honest label on every pack: **"worth about X marks in a typical paper"** and the **price per mark** (for example OS: ₹149 for 8.4 marks is about ₹18 per mark of paper weight). It shows value without any discount tricks.

## 3. Bundles (curated, each smaller than the sum of its packs)

| Bundle | Contains | Packs total | Price | Saving |
|---|---|---|---|---|
| **Marks Magnet 5** | OS, TOC, CN, COA, Algorithms (the five technical subjects with the most marks: 39.7 marks per paper) | ₹745 | **₹599** | ₹146 (20 %) |
| **Toughest 4** | Discrete Maths, Algorithms, Compiler Design, OS (the highest share of Hard questions) | ₹576 | **₹479** | ₹97 (17 %) |
| **Systems Core** | OS, COA, CN, DBMS | ₹596 | **₹499** | ₹97 (16 %) |
| **Theory & Maths** | TOC, Discrete Maths, Compiler Design, Engineering Maths | ₹526 | **₹429** | ₹97 (18 %) |
| **Complete CS** | all 11 technical packs | ₹1,529 | **₹999** | ₹530 (35 %) |
| **Complete CS + Aptitude** | the above plus General Aptitude (when it exists) | ₹1,678 | **₹1,099** | ₹579 (35 %) |
| **Build your own** | any 3 or more packs, chosen on the page | sum | **15 % off** | by rule |

Rules that keep the ladder honest:
- A curated bundle is always at least as good a deal as the same packs under "build your own" (15 %), and Complete CS is the best deal per pack. No arrangement may make a smaller purchase cheaper per pack than a larger one.
- **Step-up credit (trust builder):** what a student already paid for single packs counts toward a bundle that contains them, for 30 days. "You paid ₹298 for two packs; Systems Core costs ₹201 more." This removes the fear of buying "the wrong size".
- **With a plan:** a student buying a Plus or Pro **season pass** may add Complete CS at the bundle price from the checkout step (see §4). Study stays a separate product (the plan does not unlock it); the discount is the only link. Combination "Complete CS + Pro Season" is advertised as the sum minus a stated amount, computed from the live season price (`seasonPlan`), never from a stored "was" price.
- Prices are GST-inclusive text on the same receipt system; an existing coupon can apply to a pack or bundle (one discount per order, whichever is larger).

## 4. Where we suggest them (offer moments)

Principle: **suggest at the moment the student has just felt the need**, once, with a reason, never pre-ticked, always dismissible. Everything is computed from the student's own data (weak subjects from mistakes and analytics), so each message is true.

| # | Moment | What we show | Why it works |
|---|---|---|---|
| 1 | **Plans checkout (before paying for Plus or Pro)**: the confirm step | A single add-on row: "Add Complete CS for ₹999 (separately ₹1,529). Includes every CS subject." Unticked by default, one tap to add, price total updates. | Order-bump logic: the student is already in a buying mindset; shown before the payment, so the total is honest. |
| 2 | **Right after a Plus or Pro purchase** (success screen) | "Your plan makes practice faster. Learn the topics you miss: pick your weakest subject pack, or Complete CS." Step-up credit shown. | The purchase proves intent; ties plan (practice) to study (learning). |
| 3 | **Results screen**, after a test | "Your weakest subjects: OS (41 %), Discrete (33 %). The OS pack is ₹149; both together are ₹298, or Toughest 4 for ₹479." | Strongest moment of need; recommendation is personal. |
| 4 | **Mistakes and Revision screens** | After the third wrong answer in one subject: a quiet card "Learn this topic properly: OS pack" | Need is proven by their own mistakes. |
| 5 | **Forge: locked solution and locked cards** | Today's "See Plus" stays; add "Learn the idea first" link to the matching free lesson, with the pack behind it | Teaches the cause of the error; also feeds SEO and free previews. |
| 6 | **Study taster end card** (already built: "That was the free part") | The pack for that subject first, then "or Marks Magnet 5" | The student has just read a real lesson. |
| 7 | **Dashboard, "next best action"** | Appears only when a pack matches the weakest subject, and only if they have used the app on 3 separate days. | Avoids nagging new users. |
| 8 | **Telegram weekly report** (linked members) | "Weekly report: your weakest subject was OS. Pack: ₹149." One line, no spam. | Uses the channel the student chose. |
| 9 | **Exam countdown beats** (100, 60, 30 days) | "100 days left: Complete CS is ₹999. Here is a study order that fits." Honest prices, no "ends tonight". | Real deadlines, not fake urgency. |
| 10 | **Referral** | A friend who buys a pack gives both a small coupon (existing coupon system). | Uses the trust of classmates. |

Not allowed: pre-ticked boxes, countdown timers that reset, invented "original prices", pop-ups on exam screens, any offer while a test is running, offers to students who have used the product for fewer than 2 days.

## 5. Strategy ideas (business and marketing)

- **Good, better, best, with a decoy that is also a true deal:** single pack (good) / Marks Magnet 5 at ₹599 (better) / Complete CS at ₹999 (best, shown as "most students choose this" **only once that is true**). Show the sums so the saving is visible.
- **Price per mark of paper weight** is our own, non-copyable framing: a student sees why Algorithms (7.6 marks) costs the same as OS (8.4) and why Engineering Maths is cheaper.
- **Goal-based bundles** read better than subject lists: "Fix my weakest 3", "I have 60 days", "Hardest topics first". The page lets the student pick a goal and shows the bundle.
- **Free first lesson per subject** (already planned) is the real "trial": it respects the no-free-trial rule and builds trust.
- **Launch price ("founding")** is allowed only as a true, dated launch price that ends when the first complete CS release ships, and the receipt shows what was paid.
- **Bundle with Pro** targets the heaviest users: Pro buyers are the most likely to buy Complete CS; the checkout bump (moment 1) is where this happens.
- **Measure** (per month): attach rate of the checkout bump, share of orders by size (single, bundle, complete), average order value, step-up rate, refund requests per 100 orders, and the pack-to-completion rate (do buyers actually finish what they bought; low completion predicts refund requests and churn of trust).

## 6. What this changes in the build

- `product_id` per pack and per bundle in the billing order; a **bundle expands into pack entitlements** (`study_access (user_id, branch, subject_id, valid_until)` one row per subject), so a later single-pack purchase never double-grants.
- Aptitude is a shared pack (`branch = ALL`).
- Plans checkout gets the optional add-on row (moment 1); the order API validates the add-on server-side (price and eligibility), like coupons.
- The refund script (`scripts/refund.mjs`) must revoke the pack rows of a refunded order.
- New policy text is live at `/refunds`, `/terms` §7 and on the Plans confirm box (31 Oct).
- Open: GST treatment of digital packs (accountant), the exact wording of the checkout row (legal read before launch), and the final numbers after the first 50 pilot buyers.

## 7. Research notes (honest limits)

Public price data for GATE notes is thin. What was found (31 Oct): a combined "all Maths subjects" notes bundle listed around ₹185; free handwritten GATE CS notes per subject from several sites; toppers' handwritten notes sold per subject by a coaching-community store (price not visible in the cached page); an all-exam one-year pack at ₹4,999 positioned against ₹18,000 coaching; and tutoring sites selling a 3-subject bundle at about 17 % below the sum. Our ₹99 to ₹149 per subject sits well above free notes and well below coaching, so the page must lead with what free notes do not give: tested numbers, GATE-weight labelling, practice links and checks. Revisit with real conversion data.
