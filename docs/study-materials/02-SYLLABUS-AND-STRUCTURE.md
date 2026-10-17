# 02 · Syllabus and content structure

The structure is not invented. It is derived, mechanically and then hand-corrected, from the **official GATE syllabus** of each paper, so a student sees the same section/subject/topic names they see in the brochure and in our past-paper bank.

## 1. The content tree

```
Branch (paper)            e.g. CS, EC, EE, ME, CE, DA
 └─ Section               official section, e.g. "CS Section 4: Algorithms" (General Aptitude is shared by every branch)
     └─ Subject           e.g. "Operating System"
         └─ Chapter       a coherent unit that a student studies in one to three sittings, e.g. "Deadlocks"
             └─ Topic     one teachable idea, 4 to 10 minutes, e.g. "Resource allocation graph"
                 └─ Lesson blocks    (see 04) intuition → definition → worked example → traps → recall → check
```

- **Chapter = our unit of authoring, review and release.** A chapter is reviewed and published as a whole; a topic is the unit of reading and progress tracking.
- Chapters map to the **units** already defined for CS in `lib/seo/syllabus.ts` (17 sections, 70 units, ~176 syllabus items) and to the hand-curated `data/pyq/<BR>/syllabus.json` for the other branches (EC 186 items, EE 154, ME 143, CE 152, DA 60). The syllabus item lists are the **coverage checklist**: every official item must be covered by at least one topic, and every topic must cite the syllabus item(s) it serves.

## 2. Sizes (planning numbers)

| Branch | Sections | Subjects | Syllabus items | Planned chapters | Planned topic lessons |
|---|---|---|---|---|---|
| CS (incl. shared GA) | 17 | ~19 | ~176 | ~70 (one per unit, split when a unit exceeds ~12 topics) | ~330 |
| EC | 8 | 33 | 186 | ~75 | ~350 |
| EE | 10 | 15 | 154 | ~65 | ~290 |
| ME | 4 | 23 | 143 | ~60 | ~270 |
| CE | 8 | 28 | 152 | ~62 | ~280 |
| DA | 7 | 8 | 60 | ~30 | ~120 |

Shared material (General Aptitude and the overlapping mathematics: Linear Algebra, Calculus, Probability, Numerical Methods, Differential Equations) is **written once** and reused by every branch that lists it (see §6). That is why the sum is less than the table's total.

## 3. IDs and ordering (permanent)

- **Stable IDs, never reused.** `branch.section.subject.chapter.topic` as slugs: `cs.os.deadlock.rag`. Renaming a title never changes the ID. Deleting a topic leaves a tombstone so links and progress never dangle.
- **Order is explicit, not alphabetical.** Each node has an `order` integer. Ordering rules, in priority:
  1. **Prerequisite order** inside a subject (you cannot teach *LL(1) parsing* before *FIRST/FOLLOW*).
  2. **Official syllabus order** between sections.
  3. **Weightage** (from our PYQ bank) only to decide *depth* and to flag "high-yield"; it never reorders against prerequisites.
- **Prerequisite graph.** Every chapter and topic lists `prereqs: [ids]`. A build step rejects cycles and rejects references to unknown IDs. The app uses it for "Start here" and for the warning "this topic assumes X".
- **Cross-subject links** (for example *Cache memory* in COA uses *Probability* for average access time) are explicit `see_also` edges, not copied text.

## 4. How the tree is built (reproducible, not manual)

1. **Source of truth:** the official syllabus PDF for the paper (already downloaded under `data/pyq/official_pdfs/<BR>/`), plus our syllabus files.
2. `scripts/study/build-skeleton.mjs` (to be written in Phase 0) reads the syllabus data and emits `content/study/<branch>/tree.json` with every section/subject/chapter/topic stub, IDs, orders, syllabus-item citations, and the PYQ tags that belong to each node.
3. I propose the chapter splits and topic lists; **you approve the tree per subject** before any drafting starts (cheap to change now, expensive later).
4. The approved tree is frozen with a version (`tree_version`). Changes after freeze go through a change log entry (what, why, which lessons affected).

## 5. Per-node metadata (everything a node carries)

| Field | Purpose |
|---|---|
| `id`, `title`, `slug`, `order` | identity and navigation |
| `syllabus_refs` | official syllabus lines this node covers (coverage proof) |
| `prereqs`, `see_also` | learning path and cross-links |
| `pyq_tags` | the bank tags, so each topic can list its real past questions and weightage |
| `weightage` | marks per year over the last N papers (auto-computed from the bank, refreshed each March) |
| `difficulty` | foundation / core / advanced (advanced = rarely asked, optional) |
| `time_minutes` | reading time estimate (auto from word count and block mix) |
| `status` | stub → drafted → checked → reviewed → published → needs-update |
| `version`, `reviewed_by`, `reviewed_at` | quality trail |
| `sources` | the textbooks and papers used to *learn* the topic (cited in the reference list, not copied) |

## 6. Shared and overlapping content across branches

- **General Aptitude** (verbal, quantitative, analytical, spatial): one set of chapters, shown in every branch.
- **Engineering Mathematics overlap:** a *core mathematics library* with topics tagged by which branches' syllabi include them (Linear Algebra, Calculus, Probability and Statistics, Differential Equations, Numerical Methods, Transform Theory, Complex Variables, Vector Calculus). A branch's maths section **selects** from the library; it does not duplicate it. A branch-specific *application* topic (for example "Laplace transform in circuit analysis") lives in the branch.
- **Tagged variants:** where the syllabi differ by depth (CS needs Discrete Mathematics; EE/EC need Complex Variables), the library node carries `branches: [...]` and the renderer shows only the relevant ones.
- **Overlap policy:** if two branches teach the same idea with different emphasis, we write one *common* lesson plus a short *branch lens* block, not two lessons.

## 7. Student-facing navigation

- **Map view:** sections → subjects → chapters as a tree with progress rings, "high-yield" flags, and the weightage bar from the PYQ bank.
- **Path view ("Start here"):** the prerequisite-ordered path for the student's goal (rank target and days left, reusing the Goals Engine), skipping chapters they already mastered (using Checkpoint results).
- **Topic view:** the lesson itself, a sticky outline, prev/next within the chapter, "prerequisites" and "next" chips, and the PYQ rail.
- **Search:** over titles, syllabus items and key terms only (server-side), never full lesson text (see `07`).
- **Bookmarks, notes, "mark as understood"**, and spaced-recall prompts reuse the existing mistakes/revision store.

## 8. Coverage and consistency rules (hard gates)

1. 100 % of official syllabus items of the paper map to at least one **published** topic. A script prints uncovered items; release is blocked while any exist.
2. 100 % of PYQ tags of the paper map to at least one topic (so every past question has a "learn this" link). Orphan tags are reported.
3. No topic exists without a syllabus citation (we do not pad).
4. Prerequisite graph is acyclic and every referenced ID exists.
5. Terminology and notation follow the style guide; a lint script flags banned variants (for example "FCFS" vs "First-Come First-Served" used inconsistently in the same chapter).
6. Every topic has: intuition block, formal block, ≥1 worked example, ≥1 trap, recall sheet, ≥3-question check. Missing parts fail the build (see `11`).

## 9. What changes each year

- **Each March** (after GATE results and before the next brochure): re-pull the official syllabus, diff it against our tree, add/retire items, update weightage, refresh high-yield flags, and publish a "What changed" note inside the app (see `09`).
- A syllabus diff that removes an item does not delete the lesson immediately: it is marked *out of syllabus (optional reading)* for one cycle, then archived.
