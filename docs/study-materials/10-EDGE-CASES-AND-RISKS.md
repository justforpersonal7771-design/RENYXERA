# 10 · Edge cases and risks

Each row: the situation, why it matters, the planned handling. Grouped so nothing is missed. "Gate" means a build or release check blocks it.

## A. Content accuracy and sources

| Situation | Handling |
|---|---|
| Two standard textbooks disagree (definition, convention, notation) | Pick the convention GATE uses (check the bank and the official key); state the alternative in a `note`; never silently choose |
| The official GATE key is itself disputed or has MTA (marks to all) | Show the official key as official; add a "disputed/MTA" note; never "correct" the official key in the study text |
| A textbook has an erratum we rely on | Cite the corrected statement; record the erratum source in the review record |
| A formula is valid only under conditions (small deflection, ideal gas, steady state) | Conditions are a required field of the formula card; `shortcut` without a stated condition fails the build |
| Multiple correct methods | Show the main method and name the alternative; a `shortcut` states when it fails |
| A topic is on the syllabus but never asked | Compact treatment with the "rarely asked" label; do not pad |
| A topic is asked but not on the syllabus text (appears in a past paper) | Add a topic labelled "appears in past papers, not listed in the syllabus" with the PYQs as evidence |
| Syllabus changes mid-year | Diff, tag affected lessons, publish a correction note; removed items become "optional" for one cycle |
| GATE answer dispute after the final key | Follow the final official key; note challenges only if the organisers revised it |
| Example numbers wrong after an edit | Verify scripts rerun on every build; a changed number without a changed verify output fails (gate) |
| AI drafting hallucination (made-up theorem, wrong constant, invented standard clause) | Independent re-solve, citations required for every standards-based fact, expert review, plus targeted "adversarial prompts" checking known pitfalls per subject |
| Copy of a textbook's example slips in | Overlap check plus a reviewer instruction; examples must be ours (numbers recomputed) |
| Units and dimensions mistakes (civil, mechanical, electrical) | Required symbol/unit table, dimensional lint, reviewer from the discipline |
| Rounding conflicts with GATE's tolerance range | State the number of decimals GATE accepts; show a range where the key does |

## B. Content structure and consistency

| Situation | Handling |
|---|---|
| Topic needs a prerequisite from another branch's subject | `prereqs` can cross subjects; shared library nodes exist (maths) |
| The same idea appears in two subjects | One canonical lesson + `see_also` link; no duplication |
| A chapter grows beyond 10 topics | Split; renumber with stable IDs preserved |
| Notation conflicts between subjects (e.g. `j` vs `i` for √−1 in EE vs maths) | Branch lens block states the convention; style guide fixes defaults |
| Terminology varies (e.g. "page fault" vs "page miss") | Glossary with preferred term and synonyms; auto-links |
| A diagram family is missing | Build it before the dependent chapter; otherwise the chapter waits (never use a screenshot) |
| Renaming/removing a topic | IDs are permanent; tombstones; redirects; progress is kept |

## C. Rendering and devices

| Situation | Handling |
|---|---|
| Very long equation on a 360 px phone | Horizontal scroll inside the equation box, or an author-supplied stacked layout at narrow widths (gate: renders without page overflow) |
| Large table or diagram on a phone | Pinch-zoom for diagrams; table modes (scroll/card/rotate) per table; minimum text size enforced |
| Dark mode and light mode | All diagrams use theme tokens; golden tests in both |
| Old or low-RAM phones, slow networks | Bundles are small and compressed; lazy-loaded diagrams; no images; progressive render; offline vault option |
| Browser without Web Crypto or IndexedDB (private mode, very old browsers) | Detect early; clear message with supported-browser list; the free preview still works; no silent failure |
| IndexedDB cleared by the browser | The vault re-downloads after key renewal (online); progress is server-side so nothing is lost |
| Clock skew on the device | Use server time for keys and expiry (the app already has server-time helpers) |
| Tab suspended/resumed on mobile | Blank-on-blur must not corrupt state; resume restores the scroll position and block |
| Screen readers | Assistive mode (07) with extra watermark and lower cap |
| Zoom 200 %, large fonts | Layout reflows; diagrams scale; tested |
| Right-to-left or Hindi text (later) | Text blocks only; math/code stay LTR; font coverage checked |
| Equation engine differences across browsers | One engine (MathJax SVG) with fixed fonts; golden screenshots |
| Printing disabled but the user needs notes | Offer the on-screen recall sheets and the Planner; no print |

## D. Protection edge cases

| Situation | Handling |
|---|---|
| False positive blanking (a legitimate reader loses focus often) | Gentle blur first, quick resume, thresholds tunable; telemetry on blank events per user |
| Student uses a screen reader | Assistive mode; documented; audited |
| Student shares screenshots in a study group | Terms allow personal notes in the app only; the watermark names the account; first offence warning, repeat → revocation |
| Account sharing between friends | Two-device limit, concurrent-session detection, per-day cap, watermark |
| Watermark removal attempts (cropping, inpainting) | Dense tiling plus invisible geometry-based mark; the invisible mark survives cropping and re-encoding well enough for attribution |
| Headless browser with valid cookies | Turnstile, dwell-time enforcement, per-day cap, behaviour flags |
| Devtools open for legitimate debugging by a developer | Our own test accounts have a flag to disable the devtools heuristic |
| Key theft from memory by a determined attacker | Possible for that session only; per-chapter keys, per-session wrapping and short lifetimes limit the blast radius; the leak is watermarked and attributable |
| Search engine caches of preview pages | Previews are intentionally public; protected content is never in HTML |
| Content leaked anyway | Runbook in `07` §8: decode the watermark, revoke, rotate keys, new canaries, takedown |
| Insider access | Private repo with least privilege; the build output is encrypted; no plaintext artefacts in CI logs |
| Repository visibility | Verify the repo is **private** before the first real chapter is committed (gate in Phase 0) |

## E. Commerce and access

| Situation | Handling |
|---|---|
| Payment succeeds but the webhook is late | Existing "I paid, check" flow and hourly reconcile extend to study orders; access is granted only by the signed webhook path |
| Refund or chargeback | Refund script revokes `study_access` and rotates that account's wrapped keys; reading log kept for the audit |
| Branch switch after purchase | Access is per purchased branch; switching branch never loses it |
| Purchase for two branches | Two rows; bundle discount applies automatically |
| Access expires mid-chapter | Show "expires in N days" reminders (reuse the plan-ending reminder); the current session finishes; next key renewal fails with a renewal prompt; offline vault also expires with the key |
| Price change | Orders record the price paid; changes apply to new purchases only |
| Coupon abuse | Existing coupon rules (one per member, limits, expiry) apply |
| Gifting or institutional bulk purchase | Later; design reserves a `source` value and a voucher table |
| Account deletion request (DPDP) | Delete personal data; keep the anonymised purchase record for accounting; revoke keys |
| Failed GST/invoice requirements | Reuse the printable receipt; formal GST invoice only with a registered entity (same as the plans) |
| Student buys but never gets to read (device unsupported) | Pre-purchase compatibility check on the pricing card ("works on …"); content-failure refund path |

## F. Operations and people

| Situation | Handling |
|---|---|
| Reviewer unavailable or slow | Chapters wait in "checked" status; no publishing without review; a backup reviewer list per subject |
| Reviewer and drafter disagree | The reviewer decides on facts; disagreements are written into the review record |
| Context loss (I start a new session) | The pipeline records everything in files: briefs, source notes, verify scripts, review records, a per-chapter status file, and the handbook in `docs/study-materials/`; resume from the status file (same discipline as `PYQ_EXTRACTION_HANDBOOK.md`) |
| A published chapter later found wrong | Hotfix path (48 h), visible correction note, rollback pointer, root-cause entry in the defect log, check sibling chapters for the same error class |
| Large simultaneous releases | Release per subject, not all at once; staged rollout to a % of buyers first for big rewrites |
| Free-tier limits (Worker CPU, Supabase storage/egress) | Bundles are small; CDN caching of ciphertext (safe, it is opaque); monitor monthly; storage estimate: 330 CS lessons ≈ 10 to 25 MB total |
| Cloudflare Workers CPU limit | Decryption is client-side; the Worker only checks entitlement and releases a key |
| Legal notices claiming copyright of examples | The originality pipeline records sources and the overlap check results; we remove and rewrite promptly |
| Reviewer IP and credit | A short written agreement: work-for-hire or licence, credit line optional; settled before they review |
| Student complaints about difficulty or errors | The report button on every topic (reuse `question_reports` pattern) with the 24-hour triage target |

## G. Learning-outcome risks

| Risk | Handling |
|---|---|
| Material reads well but students still score low | Check questions and PYQ links are part of the product; block analytics + before/after accuracy; rewrite weak topics |
| Memory aids create false memories | Every aid is fact-checked; reversible by construction (see `06`) |
| Over-reliance on shortcuts | Shortcuts always state their condition; the trap block shows when they fail |
| Students skip prerequisites | Prerequisite chips and a gentle warning; path mode orders them |
| Too long, students quit | 4 to 10 minute topics, progress rings, "continue where I left off" |

## H. Legal and policy

| Item | Handling |
|---|---|
| Terms of Service, refund policy, privacy policy updates | Written before launch (08 §5) |
| DPDP: reading logs are personal data | Purpose limitation, 90-day retention, export/delete on request |
| Trademarks of textbooks and exam bodies | Only factual citation of titles/authors; the "not affiliated with GATE organisers" disclaimer stays |
| Use of AI in drafting | Disclosed in a plain "How this was made" page: AI-assisted drafting, machine checks, expert review |
| Accessibility obligations | Assistive mode, alt text, contrast; documented |
