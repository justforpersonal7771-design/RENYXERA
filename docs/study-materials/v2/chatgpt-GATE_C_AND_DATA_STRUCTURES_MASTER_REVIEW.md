# GATE Programming in C & Data Structures — Master Student Review

**Review date:** 24 November 2026  
**Review stance:** the 25-year-old student described in the brief: failed GATE twice, weak foundations, ashamed to ask questions, about 100 days left, and frustrated by notes that use unexplained words and skip steps.  
**Documents actually inspected:** `00-HONEST-REVIEW.md`, `00-README.md`, `01-MASTER-PROMPT.md`, `03-PROGRAMMING-IN-C.md`, and `04-DATA-STRUCTURES.md`.  
**External verification:** official GATE 2027 CS syllabus/download portal and the public WG14 C11 committee draft N1570, supplemented by established algorithm references where noted.

---

## 0. Decision first

**Do not approve bulk writing yet. Approve a corrected plan and one small, fully written pilot. Do not sell the current material for ₹149 yet.**

The subject plans are much better than a list of chapter names. They recognise that the learner needs memory pictures, traces, plain English, and a progression from easy examples to GATE-level problems. But the plans are not books, the required diagram engine is not shown to exist, the question bank is not attached, and several technical claims need correction before Claude is allowed to generate hundreds of pages.

My decision is:

1. **Approve the direction:** beginner-first, visual, trace-heavy teaching is the right direction for the reader described.
2. **Do not approve the plans as final v1:** correct the high-priority issues in this report, resolve the chapter and question-count contradictions, and mark syllabus-core topics separately from extensions.
3. **Approve one pilot only after those corrections:** one small pointer lesson is a good style test, but it should not be the first thing a completely new learner sees. The pilot must include the bridge lessons it depends on.
4. **Do not bulk-generate the books:** first make a real beginner complete the pilot without needing another book or video.
5. **Do not claim a question-frequency ranking yet:** the plans do not include an audited PYQ dataset. The honest frequency answer is **“not sure”** until each question is tagged against official papers and answer keys.

### What this report is based on

| Evidence class | What is included | What it does and does not prove |
|---|---|---|
| **A. Uploaded documents** | The five Markdown files listed above. | These are directly inspected. Their actual wording and contradictions are reviewed below. |
| **B. Earlier review in this conversation** | The earlier student-perspective review: its four parts, 80+ reported issues, C finer-point coverage, Data Structures gaps, and roughly 70 diagram requirements. | This is used as an earlier review record. Some details are restated and refined here; it is not treated as a substitute for missing chapter manuscripts. |
| **C. Earlier Deep Research report** | The report that summarised the project, syllabus and C rules. | Useful as a checklist, but it made assumptions about files and included a few over-broad technical statements. I correct those below. |
| **D. Independent web verification** | GATE 2027 official syllabus and downloads page; WG14 N1570 C11 committee draft; CERT C guidance; CLRS hashing analysis. | Used to verify syllabus wording and selected language/algorithm rules. It is not a full year-by-year PYQ frequency audit. |

### Files that are still missing

The files available for this review are exactly the five listed at the top. The README and other documents refer to files that were not available to inspect:

- `02-REVIEWER-PROMPT.md` — reviewer prompt; its quality cannot be assessed.
- Existing Computer Organisation chapters and the old `01-VISION-AND-PRINCIPLES.md` — referenced by `00-HONEST-REVIEW.md`, but not supplied here. The claim that the old policy caused the earlier writing problem is a claim made by that review document, not something independently checked against the old files.
- The engineering notes / diagram-engine specification and its implementation — referenced by `01-MASTER-PROMPT.md`, but not supplied.
- The actual written book chapters — the C and Data Structures files supplied here are **plans**, not the finished chapters.
- The PYQ bank at `/topics/...` — referenced by `03-PROGRAMMING-IN-C.md`, but not supplied. No question count, year-frequency or “most repeated” claim can be audited from it.
- The Algorithms plan — needed to check the promised split for searching, sorting, hashing, complexity and graph algorithms.

**Important correction to the earlier Deep Research summary:** it described some uploaded documents as “presumably” or “likely” containing material and treated the Data Structures plan as unavailable. That was not a sound basis for findings. This review now uses the five files actually present and reads `04-DATA-STRUCTURES.md` directly. The missing-file list above is the current, inspected status.

---

# PART 1. FEELINGS — ten lines from the student

1. I felt relieved when `00-HONEST-REVIEW.md` admitted that the old writing made a weak student feel stupid instead of helping.
2. I liked the promise that words will be explained before they are used; that is exactly where my other notes lose me.
3. The C plan still scares me because it names things like “usual arithmetic conversions”, “aliasing”, “VLA” and “sequence points” before showing what those words mean.
4. The Data Structures plan looks more visual, but it throws AVL, B+, red-black trees, tries, union-find and amortised analysis into the same subject without showing what is essential first.
5. I would get stuck at the first pointer example unless I first learn what a variable, byte, address, array and type mean with real boxes.
6. I would also get stuck at the stack expression chapter because `^` is called right-associative without saying that C uses `^` for bitwise XOR, not power.
7. The diagrams sound promising, but the files mostly describe diagrams; I cannot yet see the actual drawings or test whether they teach me anything.
8. I felt “I can do this” when I saw the step-by-step linked-list pointer changes, queue frames, and tree traversals being required.
9. I felt tricked by the practice promises: one file says 31 questions per topic, another says at least 60 per chapter and about 1,000 overall, and no actual question bank was attached.
10. **Would I pay ₹149 now? No.** I would be paying for a plan and a promise, not a finished lesson that proves it can teach someone like me.

---

# PART 2. GAP TABLE — what stops me, confuses me, or could teach me something wrong

The table deliberately covers all five documents and both subject plans. `HIGH` means fix before the pilot or before Claude writes that topic. `MEDIUM` means fix before the relevant chapter ships. `LOW` means useful polish or optional scope.

| # | Where | What I could not understand / what is missing / what may be wrong | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | `00-README.md`, process steps 1–7 | It says both ChatGPT and Gemini reviews are needed, but gives no rule for resolving disagreements or checking either reviewer’s facts. | UNCLEAR-ENGLISH | Add an evidence-first adjudication rule: check against official syllabus/standard/source; do not accept a point just because two models agree. | HIGH |
| 2 | `00-README.md`, file list | It lists `02-REVIEWER-PROMPT.md`, but that file was not supplied, so the reviewer workflow cannot be executed as written. | FACT-DOUBT | Add the missing prompt before approval; version and test it on a deliberately flawed sample chapter. | HIGH |
| 3 | `00-README.md`, step 5 | The proposed pilot is C9.1–C9.6, but a beginner may not yet understand bytes, variables, arrays, or the distinction between a value and an address. | MISSING-PREREQUISITE | Include a short required bridge: bits/bytes, a variable box, value vs address, integer type, and array basics before pointer indirection. | HIGH |
| 4 | `00-README.md`, step 6 | The diagram engine is to be built after the pilot is approved, but the pilot is supposed to prove a visual teaching method. | WRONG-ORDER | Build a tiny prototype of the required diagram types before writing the pilot; do not wait until bulk production. | HIGH |
| 5 | `00-README.md`, step 7 | The other subjects and existing books are described as future rewrites, but there is no schedule, capacity estimate, or priority order for a student with 100 days. | MISSING-PREREQUISITE | Keep this project limited to C + Data Structures for the pilot; do not imply every subject will be rewritten before the exam. | MEDIUM |
| 6 | `00-HONEST-REVIEW.md`, §1 | It quotes a dense pointer paragraph and says the original book did this, but the original chapter is not included in the current upload. | FACT-DOUBT | Keep this as the author’s report of the old experience; attach the old chapter if the team wants a line-by-line audit of that claim. | MEDIUM |
| 7 | `00-HONEST-REVIEW.md`, §2 | It says the old book had only three examples and five check questions. I cannot verify that from the five files. | FACT-DOUBT | Label these counts as observations from the previous review, not independently verified counts in this review. | LOW |
| 8 | `00-HONEST-REVIEW.md`, §3.1 | It cancels two statements from `01-VISION-AND-PRINCIPLES.md`, but that source file is missing. | FACT-DOUBT | Attach the old vision document and mark the exact policy changes in version history. | MEDIUM |
| 9 | `00-HONEST-REVIEW.md`, §3.3 | “At least eight diagrams in every topic” could force eight pointless diagrams into a tiny concept. | TOO-LONG-BORING | Require a minimum number only for a meaningful lesson unit; require diagrams where they help, and justify any topic with fewer. | MEDIUM |
| 10 | `00-HONEST-REVIEW.md`, §3.5 | It says a coverage checklist must include every edge case and every undefined behaviour. That could bury a beginner under obscure details. | TOO-HARD-TOO-EARLY | Divide finer points into core, GATE-relevant, and beyond; teach one safe base case before unusual cases. | HIGH |
| 11 | `00-HONEST-REVIEW.md`, §4.2 | The 12-step ladder has a lot of parts, but the file does not define how to split a chapter containing many separate topics into readable lessons. | WRONG-ORDER | Define a lesson as one teachable concept or small connected group; use the full ladder at lesson level, not mechanically on every tiny subtopic. | HIGH |
| 12 | `00-HONEST-REVIEW.md`, §4.3 | It treats all diagrams as data that can be redrawn, but no actual schema or renderer is attached. | FACT-DOUBT | Add valid schema examples, validation rules, fallback rendering, and sample SVG output before claiming the system works. | HIGH |
| 13 | `01-MASTER-PROMPT.md`, ROLE | “The best teacher in India” is a vague role claim. It does not make the model accurate or beginner-friendly. | UNCLEAR-ENGLISH | Replace the boast with measurable teaching behaviours, technical review requirements, and explicit evidence rules. | MEDIUM |
| 14 | `01-MASTER-PROMPT.md`, reader rule 3 | Every technical word must get an everyday comparison and a picture. Some words (for example, “implementation-defined”) need a precise definition more than a forced analogy. | UNCLEAR-ENGLISH | Give a plain definition first; use an analogy only if it is accurate; give a technical definition and a counterexample when needed. | MEDIUM |
| 15 | `01-MASTER-PROMPT.md`, S2/S3/S4 | Every idea must be pictured before the rule. This is not always possible or useful for abstract language rules. | NEEDS-DIAGRAM | Permit a small example, trace, analogy or formal statement first where that teaches better; require a visual when it materially improves understanding. | MEDIUM |
| 16 | `01-MASTER-PROMPT.md`, S4 | “One sentence + one picture + one tiny example” for every step, plus no more than six lines between pictures, will make long lessons repetitive and cluttered. | TOO-LONG-BORING | Use one diagram per learning step, not one per sentence; group closely related micro-steps where safe. | MEDIUM |
| 17 | `01-MASTER-PROMPT.md`, S5/S8/S11 | The lesson requires three traced examples, 4–8 GATE question types, 31 exercises, eight flashcards and a cheat picture. This is too much for every tiny topic. | TOO-LONG-BORING | Scale the requirements to lesson size; keep a fixed minimum for a chapter, not for each atomised subtopic. | HIGH |
| 18 | `01-MASTER-PROMPT.md`, S6/S7 | Exact rules and all edge cases appear after examples, but dangerous undefined behaviour should be flagged as soon as first encountered. | WRONG-ORDER | Introduce a “safe / depends / undefined” warning in the first example where it matters, then give the formal classification later. | HIGH |
| 19 | `01-MASTER-PROMPT.md`, S7 | The coverage list demands every edge case, variant and comparison, which can pull C lessons into rare standard-library details irrelevant to GATE. | TOO-HARD-TOO-EARLY | Add a priority tag and a reason for including every non-core item. | HIGH |
| 20 | `01-MASTER-PROMPT.md`, S8 and GATE ALIGNMENT | It demands question proportions “GATE uses”, but the plans have not provided an audited question corpus. | FACT-DOUBT | Until a PYQ audit exists, label frequency “not sure”; teach question forms without claiming how often they occur. | HIGH |
| 21 | `01-MASTER-PROMPT.md`, S10 | “Only tricks that are always valid” is a good rule, but the prompt does not require the assumptions under which a shortcut is valid. | MISSING-FINER-POINT | Every shortcut must list prerequisites, assumptions, and a counterexample where it fails. | MEDIUM |
| 22 | `01-MASTER-PROMPT.md`, diagram rules | It insists on uppercase kinds such as `MEMORY` and `ARRAY`, while the engineering table later uses lowercase `memory`, `array`, etc. | FACT-DOUBT | Define one case-sensitive schema and validate output against it. | HIGH |
| 23 | `01-MASTER-PROMPT.md`, diagram block | `data: <the cells, nodes...>` is a placeholder, not a valid machine-readable format. | MISSING-PREREQUISITE | Supply JSON/YAML schema examples with required fields, coordinates/indexing conventions, null values, frames, and validation. | HIGH |
| 24 | `01-MASTER-PROMPT.md`, diagram rules | `NULL` is described as a “ground symbol”; a null pointer is not guaranteed to be represented by address zero. | FACT-DOUBT | Draw `NULL` as a labelled null-pointer state/terminal marker, not a numeric address or physical ground. | HIGH |
| 25 | `01-MASTER-PROMPT.md`, worked-example rules | “Every program is run” is not enough: undefined-behaviour examples may produce a compiler-specific output that must not be taught as the answer. | FACT-DOUBT | Classify each example first; run only defined code for expected output; compile warning/UB demonstrations separately and never present one run as the C answer. | HIGH |
| 26 | `01-MASTER-PROMPT.md`, worked examples | It says the model should state “the assumption GATE uses,” but there is no single official default machine model in the syllabus. | FACT-DOUBT | Use only assumptions given by the question or state an explicitly chosen teaching platform; never invent a universal GATE machine. | HIGH |
| 27 | `01-MASTER-PROMPT.md`, self-check §118–123 | Self-check says 31 practice questions, while `03-PROGRAMMING-IN-C.md` later says at least 60 per chapter. | FACT-DOUBT | Choose one count unit: per lesson, per chapter or per subject; make all totals add up. | HIGH |
| 28 | `01-MASTER-PROMPT.md`, topic brief | No required fields for standard version, source references, code compiler/version, PYQ provenance, or assumptions per example. | MISSING-PREREQUISITE | Add fields for C version, source citations, compiler test log, portability classification, question source/year/session/Q number, and required diagrams. | HIGH |
| 29 | `01-MASTER-PROMPT.md`, “How we use it” §144 | “A script runs every code sample and compares outputs” is not sufficient for interactive input, multiple compilers, warning-only snippets, UB, or platform-dependent examples. | FACT-DOUBT | Add code-example categories and test harness expectations; preserve exact compiler, flags, architecture and input. | HIGH |
| 30 | `01-MASTER-PROMPT.md`, §145–165 | The diagram engine is a dependency, but no design, renderer, or test fixtures are included. | MISSING-PREREQUISITE | Build and test core diagrams (memory, array, linked, stack frame, tree, trace, frames, graph, queue/hash) before scaling. | HIGH |
| 31 | `03-PROGRAMMING-IN-C.md`, §0 | “About 18 chapters” conflicts with the actual C0–C19 list of 20 chapters. | FACT-DOUBT | Change “18” to 20 or explain which chapters are combined. | MEDIUM |
| 32 | C plan, §0 and C1–C19 | The phrases “pointer puzzles”, “undefined behaviour”, “type conversion” and “recursion traces” appear as assumed exam forms before a beginner knows what they are. | MISSING-PREREQUISITE | Keep the overview short; define technical terms as soon as each chapter begins. | MEDIUM |
| 33 | C0.2–C0.4 | “A byte is one box” and “the byte has 8 bits” are written as universal facts. In C, a byte is the size of `char`; it is not guaranteed to be exactly eight bits. | FACT-DOUBT | Teach “C byte” versus “8-bit octet”; state `CHAR_BIT` is at least 8; use 8-bit bytes only as a declared teaching assumption. | HIGH |
| 34 | C0.4 / C0 finer points | “1 KB is 1024” is ambiguous because decimal kB and binary KiB are different units. | FACT-DOUBT | Use KiB = 1024 bytes and kB = 1000 bytes; explain that exam questions may use their own convention. | MEDIUM |
| 35 | C0.5 | Compiler, linker and loader are named but there is no explicit source-to-object-to-executable-to-process walkthrough, including headers and multiple source files. | STEP-SKIPPED | Add one tiny two-file program and show preprocessing, compilation, assembly/object, linking, loading, and execution at an introductory level. | MEDIUM |
| 36 | C1.3–C1.4 | `printf` and `scanf` appear before format specifier, conversion specifier, width, length modifier, whitespace behaviour and argument-type matching are properly taught. | UNEXPLAINED-WORD | Give a beginner I/O lesson with `%d`, `%u`, `%f`, `%lf` for `scanf`, `%c`, `%s`, field width, return value and common mismatch errors. | HIGH |
| 37 | C1.4 | The plan says `&` in `scanf` is a forward reference to pointers. A zero-level reader cannot understand why it is needed. | STEP-SKIPPED | Teach input into a variable using a simple “where should the function put the value?” picture, then revisit the actual address rule in C9. | HIGH |
| 38 | C2.5 and C2.7 | The two's-complement and floating-point pictures may be too early before place value, bit weights, sign, exponent and fraction are taught. | WRONG-ORDER | Add a number-systems bridge: binary place value, unsigned range, sign bit, fraction bits, exponent bias, precision and rounding. | HIGH |
| 39 | C2.8 | Literal suffixes (`L`, `U`, `f`) are listed but the type selected for decimal/octal/hex integer constants is not explained. | MISSING-FINER-POINT | Teach literal typing rules and how suffix/base change the candidate type; use a table and compiler-checked examples. | MEDIUM |
| 40 | C2.11 / C2 finer points | The “type-promotion ladder” `char → int → unsigned → long → float → double` is not a correct universal rule for C's usual arithmetic conversions. | FACT-DOUBT | Replace it with two stages: integer promotions, then usual arithmetic conversions using rank, signedness and representability; show branch-by-branch worked examples. | HIGH |
| 41 | C2.12 | “Overflow and wrap-around” risks making me think signed overflow wraps just like unsigned overflow. | FACT-DOUBT | Separate unsigned modulo arithmetic from signed overflow (undefined in the ordinary signed arithmetic case); never show one printed answer for signed overflow. | HIGH |
| 42 | C2 finer points | The signed range formula assumes an n-bit two's-complement representation with no complication from padding bits. | FACT-DOUBT | Label it as the assumed GATE/platform model; distinguish the C11/C17 standard model and typical hardware. | HIGH |
| 43 | C2.6 | The plan says `char` and ASCII as though all execution character sets are ASCII and plain `char` is always signed. | FACT-DOUBT | Explain character set versus numeric value, and say plain `char` may behave as signed or unsigned depending on implementation. | MEDIUM |
| 44 | C3.10–C3.11 | Precedence and evaluation order are discussed together; I may believe precedence tells me which side runs first. | UNEXPLAINED-WORD | Separate parsing/grouping from evaluation sequencing; add paired examples with identical grouping but different execution order. | HIGH |
| 45 | C3.11 | “Sequence points” are named, but modern C explanations should teach “sequenced before / unsequenced” and carefully define the chosen standard language. | UNEXPLAINED-WORD | Teach the beginner rule first; then give standard terminology and show which expressions are undefined. | HIGH |
| 46 | C3.11 example `i = 5; j = i++ + ++i;` | If Claude prints one result from a real compiler, I may memorise that result even though the expression has undefined behaviour. | FACT-DOUBT | Label it as “no defined C result”; use it only as a diagnostic counterexample, not an output question with a single answer. | HIGH |
| 47 | C3.4 | `^` is introduced as a bitwise operator but there is no explicit warning that it is XOR, not exponentiation. This later clashes with D3.8. | MISSING-FINER-POINT | Put a visible warning beside every C `^` example: “C uses this for XOR, not power.” | HIGH |
| 48 | C3.4 / C3 finer points | Shift rules are compressed into “right shift negative is implementation-defined, left shift overflow”. | STEP-SKIPPED | Explain negative shift count, shift count ≥ bit width, unsigned left shift, signed nonnegative left shift, and negative signed right shift separately. | HIGH |
| 49 | C3.8 | The comma operator is listed without distinguishing it from commas that separate function arguments or declarators. | UNEXPLAINED-WORD | Show comma operator in an expression separately from punctuation commas; trace its left and right operands. | MEDIUM |
| 50 | C4.3 | `switch` is defined as working on integer values, but integer promotions, enum/char cases, constant-expression constraints and duplicate converted case values are not explained. | MISSING-FINER-POINT | Add one full switch walkthrough and a “what may appear after case” checklist. | MEDIUM |
| 51 | C5.4 | The plan says `continue` in a `for` jumps to increment, but does not contrast `while` and `do-while`. | STEP-SKIPPED | Add a three-column comparison: next action after `continue` for `for`, `while`, and `do-while`. | HIGH |
| 52 | C5.8–C5.10 | Logarithmic loop patterns, multiple loop variables, comma operator, unsigned loops and floating-point loop counters are thrown together. | TOO-HARD-TOO-EARLY | Teach simple loops, exact trace tables, then nested loops, then geometric progression and non-integer/unsigned traps. | MEDIUM |
| 53 | C6.5 | A stack frame is presented as though every C implementation must use a physical stack with a fixed layout. | FACT-DOUBT | State that stack frames are a teaching model/common implementation strategy, not a C language guarantee. | HIGH |
| 54 | C6.8 and §48 | Full recursion is deferred to Data Structures/Algorithms, but a learner meets recursion while studying functions and must understand base case and return flow there. | WRONG-ORDER | Teach a simple recursive countdown/factorial in C6; teach the systematic recursion toolkit and applications in D5. | HIGH |
| 55 | C6.10 | “How `printf` works” is listed as variable arguments, but the reader is not told about `stdarg.h`, `va_list`, `va_start`, `va_arg`, `va_end`, and default argument promotions. | MISSING-FINER-POINT | Either explain the basic mechanism or mark it as a short library implementation note; do not imply `printf` is magic. | MEDIUM |
| 56 | C6 finer points | “Default int and implicit declarations (old C)” appears next to current function rules. | TOO-HARD-TOO-EARLY | Put obsolete C90 history in a clearly marked note; do not use it in current C11/C17 examples. | MEDIUM |
| 57 | C6.8 / `f(g(2), g(3))` | Function argument evaluation order is called unspecified, but the plan does not warn that unsequenced conflicting side effects can make an expression undefined. | FACT-DOUBT | Give one harmless unspecified-order example and a separate undefined-behaviour example; never conflate the two. | HIGH |
| 58 | C7.1–C7.9 | Scope, lifetime, linkage, storage duration and physical memory segment are mixed together. | UNEXPLAINED-WORD | Teach four separate questions: where a name is visible, how long an object exists, whether translation units share the name, and where an implementation commonly stores it. | HIGH |
| 59 | C7.8 | “Stack, data segment, heap” is written as if it were the formal C storage model. | FACT-DOUBT | Teach C storage durations (automatic, static, allocated, thread where in scope); show stack/heap/data only as a typical process-memory model. | HIGH |
| 60 | C7.9 | “Locals are not initialised (garbage)” is unsafe wording; reading an uninitialised automatic object is not simply a predictable random value. | FACT-DOUBT | Say the value is indeterminate; do not use it before a valid assignment; teach why a compiler output is not a reliable prediction. | HIGH |
| 61 | C7.5–C7.6 | `static` local and file-scope `static` have different effects, but linkage is only glossed as “file-private”. | UNEXPLAINED-WORD | Teach internal/external/no linkage with two source files and `extern`; distinguish storage duration from linkage. | HIGH |
| 62 | C7.10 / C12.4 | `volatile` and `const` are named without teaching what they do not guarantee. | MISSING-FINER-POINT | Explain that `volatile` is not thread synchronisation/atomicity, and `const` does not automatically make pointed-to storage immutable through every alias. | MEDIUM |
| 63 | C8.6–C8.7 | The C plan mentions row-major and column-major. C multidimensional arrays are arrays of arrays laid out in row-major order; column-major is a different representation model, not a second C layout. | FACT-DOUBT | Separate C's actual row-major array-of-arrays from generic column-major address-calculation questions. | HIGH |
| 64 | C8.8 / C10.6 | “What is really passed” is not stated precisely: an array function parameter is adjusted to a pointer parameter; the entire array is not passed by value. | STEP-SKIPPED | Show declaration adjustment, loss of array length, `sizeof` inside and outside the function, and how to pass length separately. | HIGH |
| 65 | C8.10 | Variable-length arrays are marked “note” but no C version or implementation support is stated. | FACT-DOUBT | State the selected standard and that VLA support is optional in C11 implementations; show a fixed-size alternative. | MEDIUM |
| 66 | C9.8 / Topic Brief §134 | Pointer size is suggested as “4 or 8 bytes”; the example machine assumption defaults pointer to 4 bytes. Pointer sizes are implementation-defined and not universally the same for all pointer types. | FACT-DOUBT | Never assume pointer size. State it only when the question or declared platform supplies it. | HIGH |
| 67 | C9.9 | `%p` is listed without saying that it expects a `void *` argument and prints an implementation-defined representation. | MISSING-FINER-POINT | Show `printf("%p", (void *)p)` for object pointers and do not predict a portable literal address string. | MEDIUM |
| 68 | C9.7 | “NULL and uninitialised (wild) pointers” are put together; a null pointer, uninitialised pointer and dangling pointer are three different states. | UNEXPLAINED-WORD | Use three separate pictures and examples. Explain that a null pointer is not guaranteed to be represented by all-zero bits or address zero. | HIGH |
| 69 | C10.2 | Pointer subtraction is described as an “int-like count”. The standard result type is `ptrdiff_t`, and subtraction is only defined for elements of the same array (or one past it), subject to representability. | FACT-DOUBT | Name `ptrdiff_t`, show a valid same-array subtraction and an invalid different-array case. | HIGH |
| 70 | C10.3 | “Relational comparison of pointers” is too broad; relational pointer comparisons are only defined in specified related-object cases, not arbitrary addresses. | FACT-DOUBT | Teach the exact standard cases and clearly distinguish `==`/`!=` from `<`, `>`, `<=`, `>=`. | HIGH |
| 71 | C10.6 | Array decay exceptions are named but not fully specified; the learner may conclude arrays always turn into pointers. | MISSING-FINER-POINT | Explain contexts where array-to-pointer conversion occurs and where it does not, including `sizeof`, unary `&`, and string-literal initialization. | HIGH |
| 72 | C10.7 | The `a`, `*a`, `a[i]`, `*(a+i)+j`, `**a` family appears without a slow type-reading method. | STEP-SKIPPED | For `int a[3][4]`, annotate the type of every intermediate expression and draw every pointer level before calculating addresses. | HIGH |
| 73 | C10.8 | Pointer-to-array versus array-of-pointers is named but one side-by-side beginner declaration reading example is not required. | NEEDS-DIAGRAM | Require two memory diagrams plus a declaration parse: `int (*p)[5]` versus `int *p[5]`. | HIGH |
| 74 | C10.11 | `void *` and casts appear, but conversion rules, alignment, effective type and why `void *` arithmetic is not standard C are not spelled out. | MISSING-FINER-POINT | Explain object-pointer conversions, required alignment, and mark `void *` arithmetic as a compiler extension if shown. | MEDIUM |
| 75 | C11.4 | `gets` is listed as a topic next to `fgets`; `gets` was removed from C11 and should not be taught as a usable standard function. | FACT-DOUBT | Remove it from the “learn and use” list; keep a red historical warning only. Teach bounded input, field width and buffer capacity. | HIGH |
| 76 | C11.3 | `char *p = "text"` is described as pointing to “read-only memory”. The literal cannot be modified in C, but its physical section is not specified by the language. | FACT-DOUBT | Say “string literal storage; do not modify it”; use a visual distinction without promising a particular memory segment. | HIGH |
| 77 | C11.5 | `strncpy` is named but the plan does not demand its most important trap: it may not append a null terminator when the source length reaches the limit. | MISSING-FINER-POINT | Include a traced source-length `< n`, `= n`, and `> n` comparison; state it is not a simple safe `strcpy`. | HIGH |
| 78 | C11.5–C11.9 | The library list omits `memcpy` versus `memmove`, `strtol`/`strtoul`, bounded output via `snprintf`, and the limits of `atoi`/`sprintf`. | MISSING-GATE-CONCEPT | Add a short library table: signature, input/output, return value, overlap/bounds, terminator, error reporting. Tag rarely tested APIs as beyond. | MEDIUM |
| 79 | C11.8 | `ctype.h` is listed without its argument rule. Passing a negative signed `char` other than `EOF` to functions such as `tolower` can be undefined. | MISSING-FINER-POINT | Add `(unsigned char)` conversion before ctype calls and show why it matters. | MEDIUM |
| 80 | C12.3 | The right-left/spiral rule is presented like a reliable universal parser for complex declarations. | FACT-DOUBT | Teach the actual declaration grammar and use spiral/right-left as a mnemonic, not as the definition. | MEDIUM |
| 81 | C12.5–C12.7 | Dangling pointers and aliasing appear without object lifetime and effective-type/strict-aliasing basics. | MISSING-FINER-POINT | Include lifetime, use-after-return/free, valid object access, alignment and a carefully bounded aliasing note. | MEDIUM |
| 82 | C13.5 / C13 finer points | “Each member is aligned to its own size” is not a C guarantee. Alignment is implementation-specific; members remain in declaration order, padding may occur, and `sizeof` includes padding. | FACT-DOUBT | Replace with a platform-specified worked layout; never give a universal member-size alignment formula. | HIGH |
| 83 | C13.7 / finer points | “Union size = largest member” is an oversimplification; the size is sufficient to hold the largest member and may include trailing padding. | FACT-DOUBT | Say `sizeof(union)` is at least enough for its largest member; demonstrate with declared alignment and `sizeof`. | HIGH |
| 84 | C13.7 | “Writing one member and reading another” risks teaching that every inactive-member read is automatically undefined. The actual C rules are more nuanced, including implementation-defined representations and common-initial-sequence cases. | FACT-DOUBT | Teach only the precise cases intended; do not label every union type-pun as the same category of behaviour. | HIGH |
| 85 | C13.9 | Bit-field allocation order, storage unit, signedness and packing are not fixed by a universal diagram. | FACT-DOUBT | Use a named compiler/platform assumption or keep the picture abstract; state implementation-defined/unspecified aspects. | MEDIUM |
| 86 | C13.4 | “Structure passed by value copies the whole thing” is broadly useful but needs contrast with arrays inside a struct and pointer members. | NEEDS-EXAMPLE | Show copying a struct containing an array and then a struct containing a pointer; explain shallow copy versus pointed-to object. | MEDIUM |
| 87 | C14.4 | `calloc` is described as “initialises” without distinguishing all-bits-zero from a null pointer or floating-point zero representation. | FACT-DOUBT | State the exact rule: allocated bytes are all bits zero; do not claim this universally represents every pointer/floating zero value. | HIGH |
| 88 | C14.5 | `realloc` is listed without the safe temporary-pointer pattern or the failure case that leaves the old allocation valid. | STEP-SKIPPED | Teach `tmp = realloc(p, new_size)`; update `p` only on success; avoid using a zero-size request as a portable pattern. | HIGH |
| 89 | C14.6–C14.8 | `free` and dangling pointers appear, but the plan does not say that `free` does not set the caller's pointer to `NULL`. | MISSING-FINER-POINT | Draw pointer before/after free; show alias pointers; teach explicit nulling and why it does not fix other aliases. | HIGH |
| 90 | C14.2 | Stack/data/heap process layout is treated as a universal memory structure. | FACT-DOUBT | Label it as a common teaching model, not a C requirement; separately teach automatic/static/allocated storage duration. | MEDIUM |
| 91 | C15.4–C15.5 | Macro argument substitution and evaluation are named, but no requirement says both the argument and the entire expansion need parentheses. | STEP-SKIPPED | Show `SQUARE(1+2)` failure, then `(((x)*(x)))` with one side-effect warning; compare a function. | HIGH |
| 92 | C15.6 | `#` and `##` are listed without showing whitespace, token pasting, stringification and macro expansion order. | UNEXPLAINED-WORD | Add one tiny example for each, including cases where expansion rules surprise the learner. | LOW |
| 93 | C16.2–C16.5 | Call-by-reference, value-result and call-by-name are put in a C chapter without a strong warning that C itself passes arguments by value. | FACT-DOUBT | Label them as programming-language theory models; show C pointer-based mutation separately; never imply C natively supports call-by-reference. | HIGH |
| 94 | C16.6 | “Static scope” is too close to the `static` storage-class keyword; a beginner will confuse lexical scope with static variables. | UNEXPLAINED-WORD | Rename it “lexical (static) scoping versus dynamic scoping”; place the `static` keyword in a different lesson. | HIGH |
| 95 | C16.8 | Nested functions and closures are not standard C features, but appear in the core C plan. | TOO-HARD-TOO-EARLY | Put them in a clearly marked programming-language comparison note, not required C material. | LOW |
| 96 | C17 | File I/O includes `errno`, `exit`, `abort`, but the chapter is marked low-priority without specifying input/output states and error cases. | STEP-SKIPPED | Teach `FILE *`, stream, EOF, return values and `ferror`/`feof` with a simple file trace; mark advanced error handling beyond. | MEDIUM |
| 97 | C18 | Undefined, unspecified and implementation-defined behaviour is postponed to a late “skills chapter”. | WRONG-ORDER | Add short warning boxes at first encounter in every chapter; keep C18 as the summary decision tree and revision chapter. | HIGH |
| 98 | C19 | “Our own PYQ bank (`/topics/...`)” is a placeholder path, not an attached or auditable source. | FACT-DOUBT | Require a question manifest with paper/year/session/question number, official question PDF, answer key, syllabus tag, and solution review status. | HIGH |
| 99 | C plan, practice §3 | It says 6+10+10+5 questions per topic (31), at least 60 per chapter, and about 1,000 overall. Those totals do not reconcile. | FACT-DOUBT | Decide whether 31 is per lesson, per chapter or per topic and publish a count spreadsheet with totals. | HIGH |
| 100 | C plan, §0 and many “GATE level” bullets | Claims such as “very common”, “frequent” and “20 most repeated trick patterns” are not supported by the supplied question bank. | FACT-DOUBT | Replace with “practice pattern” or “frequency not audited”; only use rankings after a reproducible PYQ tagging exercise. | HIGH |
| 101 | C plan, C18–C19 | Output prediction and PYQ practice appear at the end, although tracing is needed from the first variable/loop lesson. | WRONG-ORDER | Introduce the trace table in C1 and reuse it in every chapter; C18 consolidates rather than introduces it. | HIGH |
| 102 | `04-DATA-STRUCTURES.md`, §0 | It says the GATE syllabus has Arrays, Stacks, Queues, Linked Lists, Trees, BSTs, Heaps and Graphs, then gives a “how GATE asks” table without actual audited question data. | FACT-DOUBT | Keep these as sample question forms; change “GATE asks” to “question forms to practise” until each claim is validated. | HIGH |
| 103 | D0 | “Cost means how many steps as data grows” is good, but `O(1)`, `O(n)`, `O(n²)` are not introduced with input-size and counting prerequisites. | MISSING-PREREQUISITE | Teach n, operation count, constant, linear, quadratic, logarithm, best/worst/average before asking the learner to read cost tables. | HIGH |
| 104 | D0.4–D0.8 | The difference between an abstract data type and a data structure is named but not shown using one ADT with two implementations. | NEEDS-EXAMPLE | Use a stack ADT implemented once by an array and once by a linked list; show that the behaviour contract is the same. | HIGH |
| 105 | D0.5–D0.7 | Contiguous/linked, static/dynamic and linear/non-linear are three different classifications but are grouped together. | UNEXPLAINED-WORD | Teach each contrast separately and state that these labels answer different questions. | MEDIUM |
| 106 | D1.1–D1.4 | Array operations and binary search are included, but sortedness and the reason binary search can discard half the range are not treated as prerequisite proofs. | STEP-SKIPPED | Add a picture proof and a left/mid/right trace; distinguish searching from the data structure itself. | HIGH |
| 107 | D1.6 | Address formula includes lower bounds other than zero and 3-D arrays, but no notation convention is fixed for base address, element size, row/column count or indexing origin. | MISSING-PREREQUISITE | Define formula symbols first; work one 2-D example from boxes to formula and only then 3-D. | HIGH |
| 108 | D1.5–D1.7 | Column-major storage is listed beside C arrays without warning that C multidimensional arrays are row-major. | FACT-DOUBT | State that column-major is a general representation question; do not depict it as the way C stores a built-in 2-D array. | HIGH |
| 109 | D1.7 | Special-matrix storage lists diagonal, upper/lower triangular, symmetric, tri-diagonal and banded matrices, but does not specify whether all are GATE-core. | TOO-HARD-TOO-EARLY | Tag each formula [CORE], [GATE+], or [BEYOND] after PYQ verification; teach the easiest cases before general band storage. | MEDIUM |
| 110 | D1.8 | Sparse matrix triplet form is named without showing how row/column/value triples are ordered or how transpose is represented. | NEEDS-EXAMPLE | Add a small matrix, its triplet list, and a reconstruction picture. Mark compressed sparse row/column as extension unless needed. | MEDIUM |
| 111 | D1.11 | Dynamic-array doubling and amortised O(1) are advanced before summations/geometric series are taught. | MISSING-PREREQUISITE | Teach total copied elements across capacities 1,2,4,8, then derive the bound slowly; contrast worst-case single append. | HIGH |
| 112 | D2.3 | Insert/delete “at position” and “by key” are named, but there is no explicit algorithm for every head/tail/empty/one-node case. | STEP-SKIPPED | Use a consistent operation template: precondition, pointer changes, head/tail update, memory free, time cost, edge cases. | HIGH |
| 113 | D2.4 | Dummy/header node is introduced without saying whether it stores data or is a permanent sentinel. | UNEXPLAINED-WORD | Show list with and without a sentinel, then explain how it removes special cases. | MEDIUM |
| 114 | D2.5 | Recursive list reversal is included beside iterative reversal, but recursion is not yet fully explained to a beginner. | WRONG-ORDER | Teach iterative reverse first; teach recursion stack frames in D5; return to recursive reverse after that. | HIGH |
| 115 | D2.6–D2.7 | Slow/fast pointers and Floyd cycle detection appear as names; why slow and fast meet, and how the cycle entry is found, are not explained. | STEP-SKIPPED | Derive the meeting and entry steps with a circular diagram and distance labels. | MEDIUM |
| 116 | D2.11 | “Delete a node when only its pointer is given” is incomplete. It cannot delete the final node using the usual copy-next trick. | FACT-DOUBT | State the limitation; show the trick only for a non-tail node and explain why tail deletion is impossible without predecessor access. | HIGH |
| 117 | D2.13 | Skip lists and XOR lists are included even though they are not on the stated GATE syllabus. | TOO-HARD-TOO-EARLY | Move both to [BEYOND] sidebar or remove from the 100-day path. | LOW |
| 118 | D2.12 | “O(1) deletion in a doubly list given the node” needs a qualification about valid node links and unlinking/freeing. | MISSING-FINER-POINT | Show the two neighbour-link updates and distinguish unlinking from returning the memory to the allocator. | MEDIUM |
| 119 | D3.7–D3.8 | Infix/postfix/prefix are listed without an initial definition of operand, operator, token, precedence and associativity. | UNEXPLAINED-WORD | Start with simple arithmetic expression reading; introduce the stack only after the learner can identify operands and operators. | HIGH |
| 120 | D3.8 | The expression chapter says exponent `^` is right-associative. In C, `^` means bitwise XOR, not exponentiation. | FACT-DOUBT | Choose an explicit exponent token (e.g. `EXP`) in generic maths examples; include a box saying C `^` is XOR. | HIGH |
| 121 | D3.8 | The plan mentions right-associative `^` but does not define how unary minus interacts with exponentiation or parentheses. | MISSING-FINER-POINT | Set the exact grammar and precedence table used in every conversion problem; do not leave conventions implicit. | HIGH |
| 122 | D3.9–D3.13 | Monotonic stack, min-stack, two stacks in one array, Catalan permutations and stack using queues are all included with no core/extension labels. | TOO-HARD-TOO-EARLY | Prioritise push/pop, underflow/overflow, expression processing and operation traces first; tag the rest after PYQ review. | MEDIUM |
| 123 | D3.12 | Catalan-number stack permutations are named without a prerequisite explanation of what is being counted and why the sequence is a valid stack output. | MISSING-PREREQUISITE | Draw input order, push/pop timeline and invalid output examples before giving the formula. | MEDIUM |
| 124 | D4.4 / D4.5 | Circular queue formulas depend on whether `rear` points to the last item or next free slot. The plan gives one convention without defining it. | FACT-DOUBT | Fix a convention in a box and draw it before formulas; separately show the count-based and one-unused-slot methods. | HIGH |
| 125 | D4.4 | The one-slot-empty queue has capacity n−1, but the plan does not state that clearly. | MISSING-FINER-POINT | State array size n, usable capacity n−1, full condition and empty condition under the chosen convention. | HIGH |
| 126 | D4.5 | Linked queue operations do not mention the critical case where removing the final node must reset both front and rear. | NEEDS-TRACE | Add empty, one-node, multi-node and repeated dequeue frames. | HIGH |
| 127 | D4.8 | Queue using two stacks says amortised cost but does not separate worst-case cost of one operation from amortised cost over many operations. | MISSING-FINER-POINT | Show one expensive transfer and a sequence analysis where each item moves only a bounded number of times. | MEDIUM |
| 128 | D5.7 | “Writing a recurrence for running time” is included, but solving recurrences is assigned elsewhere without a bridge or dependency. | MISSING-PREREQUISITE | Teach how to write a recurrence here; cross-link the full recurrence-solving methods in Algorithms. | HIGH |
| 129 | D5.6 | Fibonacci, Hanoi, permutations, subsets and binary search are all introduced at once. | TOO-HARD-TOO-EARLY | Start with countdown, factorial and sum; then Fibonacci; then branching recursion and backtracking examples. | MEDIUM |
| 130 | D5.9 | Stack overflow is mentioned without explaining maximum recursion depth, available stack limits or why those limits are implementation-dependent. | UNEXPLAINED-WORD | Explain conceptually and avoid claiming a fixed safe depth. | LOW |
| 131 | D6.3 | “Full”, “complete”, “perfect”, “degenerate”, “skewed” and “almost-complete” can vary between books. | UNEXPLAINED-WORD | Adopt one naming glossary; prefer full/strict, complete and perfect with pictures; mark synonyms. | HIGH |
| 132 | D6.4 | Height and level conventions are deferred as a finer point, but every later formula depends on them. | WRONG-ORDER | Define root level and edge-height before any counting formula; state empty-tree and leaf-height conventions in every formula set. | HIGH |
| 133 | D6.4 | Counting formulas are listed but the assumptions are unclear: max nodes at level, height and perfect-tree formulas need a root/level convention. | STEP-SKIPPED | Derive each from a labelled tree picture; include minimum/maximum cases and one counterexample. | HIGH |
| 134 | D6.4 | `n0 = n2 + 1`, edges = n−1, and null pointers = n+1 are presented as facts without stating the tree type or counting definitions. | FACT-DOUBT | State the binary-tree assumptions and prove each formula using edge counts / child counts. | HIGH |
| 135 | D6.5 | Array representation shows `2i`, `2i+1`, parent `i/2` but does not say this is 1-based indexing. | FACT-DOUBT | Give both conventions: 1-based left `2i`, right `2i+1`, parent floor(i/2); 0-based left `2i+1`, right `2i+2`, parent floor((i−1)/2). | HIGH |
| 136 | D6.6–D6.8 | Traversals and reconstruction are listed, but uniqueness depends on distinct labels and on which traversal pair is supplied. | MISSING-FINER-POINT | State assumptions; show a unique reconstruction using inorder+preorder/inorder+postorder and a counterexample for preorder+postorder in a non-full tree. | HIGH |
| 137 | D6.9 | Catalan counting appears without the basic recurrence or what “different tree shapes” means. | MISSING-PREREQUISITE | Show first few shapes for n=0,1,2,3 and derive the split recurrence before naming Catalan numbers. | MEDIUM |
| 138 | D6.10–D6.13 | Threaded trees, n-ary trees, expression trees, diameter and LCA may be too much for the declared syllabus and time. | TOO-HARD-TOO-EARLY | Mark each as core, GATE extension or beyond with source evidence; keep the 100-day core lean. | MEDIUM |
| 139 | D7.1 / D7.12 | “Left smaller, right larger” does not settle duplicates. Different textbooks use different duplicate policies. | MISSING-FINER-POINT | State the duplicate-key policy used (reject, count multiplicity, or one specified side) and keep it fixed in every operation. | HIGH |
| 140 | D7.4 | BST deletion cases are named but there is no requirement to trace parent links and successor/predecessor replacement step by step. | NEEDS-TRACE | Show leaf, one-child, two-child deletion with actual pointers/links and a before/after tree. | HIGH |
| 141 | D7.9–D7.10 | “Average height O(log n) for random insertions” has no probability model; “random” needs distinct keys and a random insertion order. | FACT-DOUBT | State assumptions precisely; distinguish worst-case O(n) from expected behaviour under random permutations. | HIGH |
| 142 | D7.13 | Costs are named but the table does not yet show best, worst, expected, or height-dependent complexity per operation. | MISSING-GATE-CONCEPT | Add a BST operation table with the tree-height variable h first; then substitute balanced/unbalanced cases. | HIGH |
| 143 | D8.2–D8.5 | AVL balance factor sign convention is not specified, so the same tree may get opposite +1/−1 labels in two books. | FACT-DOUBT | Define BF = height(left)−height(right) or the reverse and never switch. | HIGH |
| 144 | D8.3 | The text may imply one rotation for each of LL, RR, LR and RL; LR and RL require a double rotation. | FACT-DOUBT | Show LL/RR as one rotation; LR/RL as two rotations; label the pivot and preserve all four subtrees. | HIGH |
| 145 | D8.5 | AVL deletion is harder than insertion; the plan says it may rotate up the tree, but no complete trace or stopping conditions are required. | STEP-SKIPPED | Add a deletion sequence with rebalancing at multiple ancestors, or move deletion to a labelled advanced section. | MEDIUM |
| 146 | D8.6 | AVL minimum-node recurrence depends on the chosen height base case. | FACT-DOUBT | Define height(empty), height(leaf), and N(h) base values before using the recurrence or maximum-height bound. | HIGH |
| 147 | D8.7–D8.11 | Red-black, splay, 2–3, B and B+ trees are grouped with AVL despite not all being in the Programming & Data Structures syllabus line. | TOO-HARD-TOO-EARLY | Keep AVL as an optional BST extension; move B/B+ to DBMS cross-reference; red-black/splay to [BEYOND] unless PYQs prove need. | HIGH |
| 148 | D8.8–D8.10 | “Order m” B-tree formulas vary by textbook convention and root exceptions. | MISSING-FINER-POINT | Define order as maximum children m, then state minimum/maximum children and key counts, including root exceptions; use one worked split/merge. | MEDIUM |
| 149 | D9.3 | Both 0-based and 1-based heap indexing are promised, but no single standard convention is chosen for worked examples. | WRONG-ORDER | Teach one convention first; put the other in a side-by-side conversion table. | MEDIUM |
| 150 | D9.4–D9.7 | Sift-up, sift-down, heapify and O(n) build-heap are listed, but each operation's exact comparison/swap sequence is not specified. | NEEDS-TRACE | Require each frame to show array and tree simultaneously; count comparisons separately from swaps. | HIGH |
| 151 | D9.7 | O(n) build-heap is claimed without a prerequisite summation or explanation of why most nodes are near leaves. | MISSING-PREREQUISITE | Build the height-by-height cost picture, sum nodes times possible sift distance, and compare with n log n. | HIGH |
| 152 | D9.12 | “Max of a min-heap is in a leaf (the last n/2 positions)” is index-convention dependent and should be stated exactly. | FACT-DOUBT | Define leaf index range for both 0-based and 1-based heaps, and show it on a diagram. | MEDIUM |
| 153 | D9.10 | Binomial and Fibonacci heaps are only named as notes, but may distract from the binary heap explicitly listed in the syllabus. | TOO-HARD-TOO-EARLY | Mark them [BEYOND]; do not let them displace binary heap operations and build-heap practice. | LOW |
| 154 | D10 | Tries, suffix ideas, segment trees, Fenwick trees and k-d trees are not named in the CS PDS syllabus. | TOO-HARD-TOO-EARLY | Keep one optional “not in the core list” page or remove from the first book edition. | LOW |
| 155 | D11.6 | The expected probe formulas are described as “for chaining and for open addressing under uniform hashing”, which can misattribute open-addressing bounds to chaining. | FACT-DOUBT | Label `1/(1−α)` and `(1/α) ln(1/(1−α))` as CLRS-style upper bounds for unsuccessful/successful search under uniform hashing in open addressing; teach chaining separately. | HIGH |
| 156 | D11.6 | The expected-probe formulas have no assumptions about uniform hashing, insertion/search distribution, table fullness or load factor. | MISSING-FINER-POINT | Put assumptions directly above each formula; distinguish ideal uniform hashing from linear probing and other schemes. | HIGH |
| 157 | D11.2 / D11.8 | “Prime table size” is mentioned as a general good rule, but its usefulness depends on the hash function and probing scheme. | FACT-DOUBT | Explain which methods benefit from prime m and why; do not state “prime is always better.” | MEDIUM |
| 158 | D11.5 | Quadratic probing and double hashing need parameter constraints to guarantee a probe sequence can visit enough slots. | MISSING-FINER-POINT | State the chosen quadratic formula and conditions; for double hashing explain why step size must be relatively prime to m to cover the table. | HIGH |
| 159 | D11.7 | Tombstones are listed but not drawn through a search after deletion and later insertion. | NEEDS-TRACE | Show why marking a slot empty can break search; show a tombstone and reuse sequence. | MEDIUM |
| 160 | D11.9 | Perfect hashing and universal hashing appear in a large already-dense chapter. | TOO-HARD-TOO-EARLY | Mark as [BEYOND] unless an audited GATE question justifies the space. | LOW |
| 161 | D12.2–D12.3 | The list mixes graph vocabulary from discrete mathematics (planar/bipartite/strongly connected) with the graph-representation purpose of this book. | WRONG-ORDER | Teach vertices, edges, directed/undirected, weighted, degree, path, cycle and components first; cross-link deeper graph theory to Discrete Mathematics. | MEDIUM |
| 162 | D12.3 | “Maximum edges” and handshake lemma need simple-graph assumptions; directed/undirected, loops and multiedges change formulas. | FACT-DOUBT | State the graph model before every count formula and prove the undirected degree sum. | HIGH |
| 163 | D12.4–D12.6 | The adjacency-list space `n+e` should be stated as O(V+E), with undirected edges usually stored twice; matrix is O(V²). | MISSING-FINER-POINT | Use V and E notation and state representation conventions. | MEDIUM |
| 164 | D12.7 | BFS/DFS order depends on the order in which neighbours are visited, but the plan does not say how tie-breaking is defined. | FACT-DOUBT | Every traversal question must state adjacency order or say multiple valid visit orders exist. | HIGH |
| 165 | D12.7 | The full algorithms are sent to Algorithms, but the student still needs enough detail here to understand the queue/stack-based traversal. | MISSING-GATE-CONCEPT | Give one beginner BFS and DFS run with visited set, queue/stack and neighbour ordering; cross-link full proof/complexity to Algorithms. | HIGH |
| 166 | D13 | Disjoint sets are not in the PDS section's explicit list; union-find belongs naturally with graph algorithms. | TOO-HARD-TOO-EARLY | Move to Algorithms/graph algorithms or mark as optional prerequisite extension. | MEDIUM |
| 167 | D14 | The compare table will be misleading unless each cost states the assumptions (sorted array, tail pointer, balanced BST, load factor, hash quality). | MISSING-FINER-POINT | Add an “assumptions” column and separate worst/expected/amortised costs. | HIGH |
| 168 | D15 | “Pattern library for each structure” gives no PYQ manifest, citations or proof of frequency. | FACT-DOUBT | Link every real question to the official paper and answer key; keep synthetic examples labelled synthetic. | HIGH |
| 169 | DS plan, §3 | 31 questions per topic may become an unmanageable total because the plan has many subtopics and no chapter/topic count policy. | TOO-LONG-BORING | Set one realistic, explicit question allocation and publish the total before writing. | MEDIUM |
| 170 | Both plans | The plans do not show a 100-day route, daily workload, revision days, diagnostic test or a rule for what to skip when behind. | MISSING-PREREQUISITE | Add a lean high-priority route with active recall, spaced revision and mixed PYQ sets. | HIGH |

**Count:** 170 issues are recorded above. They are not 170 reasons to abandon the project. They are a fix list. The most urgent items are standard correctness, beginner prerequisite order, unsupported GATE-frequency claims, question-count arithmetic, and the missing verification workflow.

---

# PART 3. WHAT A COMPLETE GATE SUBJECT MUST HAVE — missing or insufficiently specified coverage

## 3.1 What the official syllabus actually says

The current official GATE 2027 CS syllabus from IIT Madras lists:

- **Section 4 — Programming and Data Structures:** “Programming in C. Recursion. Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs.”
- **Section 5 — Algorithms:** “Searching, sorting, hashing. Asymptotic worst case time and space complexity. Algorithm design techniques: greedy, dynamic programming and divide-and-conquer. Graph traversals, minimum spanning trees, shortest paths.”

This split matters. The C plan should teach C language fundamentals and enough recursion to understand function calls. The Data Structures plan should own the data structures named in Section 4. Hashing, searching and sorting are explicitly listed in Section 5, so they should have a clear home in the Algorithms plan even if this book teaches the data structure behind them.

**Official frequency answer:** **not sure**. The syllabus does not publish a topic-wise question frequency. The plans do not include the PYQ bank needed to calculate it. The GATE 2027 download page provides official question papers and answer keys for recent years and a bulk paper download link for 2007–2026; that gives the project a valid source base, but it does not itself perform the topic tagging or frequency analysis.

## 3.2 Coverage labels to use throughout both books

- **[CORE]** Directly named in the current syllabus or a necessary foundation for a named syllabus item.
- **[GATE+]** A useful finer point or plausible exam extension that should be included only after core teaching is secure and question-bank evidence is checked.
- **[BEYOND]** Useful computer science knowledge, but not required for the stated PDS line based on the current syllabus. Clearly mark it so a weak student does not spend scarce days on it.
- **[NOT SURE]** The team has not completed the PYQ audit. Do not state frequency as fact.

The official syllabus says what must be covered, not how many pages or questions each topic deserves. The “typical question type” below describes a suitable way to practise the concept; it is not a claim about how often GATE asks it.

## 3.3 Programming in C — required coverage audit

Most C areas are present by name in C0–C19. The problem is that several are not yet sufficiently specified to guarantee that Claude will teach them correctly. The following are required additions or clarifications, mapped to the official line **“Programming in C”**.

| Missing / under-specified topic or finer point | Syllabus line served | Frequency | Typical practice question | Zero-level prerequisite |
|---|---|---|---|---|
| C language execution model versus a typical machine picture | Programming in C | not sure | Identify which statements are language rules and which are platform details. | Program, instruction, memory box, value. |
| C standard version policy (choose a baseline such as C11/C17) | Programming in C | not sure | Is this syntax valid in the declared C version? | What a compiler and standard are. |
| Translation stages in more detail: preprocessing, compilation, assembly, linking, loading | Programming in C | not sure | Locate an error in the pipeline; explain header/source/object/executable roles. | Text file, command, compiler. |
| Declaration, definition, prototype, scope and linkage | Programming in C | not sure | Is this a declaration or a definition? Does the name link across files? | Variable/function, block, file. |
| Object, value, type, representation and storage duration as distinct ideas | Programming in C | not sure | What object exists, what type has it, and how long does it live? | Variables and memory boxes. |
| Complete integer type model: rank, ranges, padding, signedness | Programming in C | not sure | Determine result type/range under stated assumptions. | Bits, place values, negative numbers. |
| Plain `char` versus `signed char` and `unsigned char` | Programming in C | not sure | Is a character value negative or nonnegative on the stated implementation? | Character codes and signedness. |
| Integer constant typing and suffix/base rules | Programming in C | not sure | What type does `0xffU`, `010L`, or a large decimal literal have? | Decimal/octal/hex and integer types. |
| Integer promotions and usual arithmetic conversions in decision-tree form | Programming in C | not sure | Determine the common type and result for mixed signed/unsigned operands. | Integer types, ranges, rank. |
| Assignment conversion versus arithmetic conversion versus cast | Programming in C | not sure | What type/value results after assignment or explicit cast? | Types and expressions. |
| `sizeof`, `size_t`, arrays versus pointers, VLA exception | Programming in C | not sure | Determine `sizeof` result under stated declarations. | Arrays, pointer, bytes. |
| Formatted I/O: complete format syntax, length modifiers, width, matching argument types | Programming in C | not sure | Find the mismatch or calculate characters/count returned. | Function call, string, basic types. |
| `scanf` input whitespace, field width, return value, newline handling | Programming in C | not sure | Trace input conversion for given input. | Keyboard input, char array, pointer preview. |
| Integer division and remainder for negative values; division-by-zero and unrepresentable quotient | Programming in C | not sure | Compute quotient/remainder or classify undefined case. | Signed integers and division. |
| Bitwise versus logical operators; integer promotions; shift-count restrictions | Programming in C | not sure | Trace bit mask or classify invalid shift. | Binary bits, integer conversions. |
| Precedence versus sequencing versus unspecified order | Programming in C | not sure | Add parentheses, then decide whether output is defined. | Expressions and side effects. |
| Undefined, unspecified and implementation-defined behaviour introduced early | Programming in C | not sure | Classify an expression and explain whether one output exists. | Expressions, types, compiler. |
| Array-to-pointer conversion contexts and multidimensional parameter adjustment | Programming in C | not sure | Determine type and `sizeof` inside/outside a function. | Arrays and pointers. |
| Pointer validity, one-past rule, subtraction result `ptrdiff_t`, relational comparisons | Programming in C | not sure | Trace valid pointer offsets and reject invalid operations. | Address and array bounds. |
| Pointer alignment, object lifetime, null pointer representation | Programming in C | not sure | Decide whether dereference/conversion is valid. | Pointer, object, lifetime. |
| Function pointers versus object pointers; declarator parsing | Programming in C | not sure | Read function-pointer declarations and call them. | Functions, pointer variables. |
| Effective type/aliasing and `restrict` at an introductory level | Programming in C | not sure | Identify when accessing an object through another type is not allowed. | Type, object representation, pointer. |
| String-literal storage and modifiability versus physical memory location | Programming in C | not sure | Decide whether a write through a pointer to a literal is valid. | Character array, pointer, array initialization. |
| `strncpy`, `memcpy`, `memmove`, `snprintf`, `strtol` and `ctype` traps | Programming in C | not sure | Predict termination/overlap/return behaviour for a specified buffer. | Null terminator, array capacity, library call. |
| Dynamic allocation: failure path, safe `realloc`, `free` aliases and lifetime | Programming in C | not sure | Trace allocations and classify leak/dangling/double-free. | Pointer, `sizeof`, arrays. |
| `calloc` all-bits-zero versus semantic zero values | Programming in C | not sure | Decide which claims are guaranteed by the standard. | Bits, pointer representation, floating type. |
| Structures: alignment, padding, member order, `offsetof`, tail padding | Programming in C | not sure | Compute layout under an explicitly stated ABI. | Struct member, byte, alignment. |
| Unions: size/alignment and reading a different member | Programming in C | not sure | Identify what can be inferred portably from a union example. | Struct/union storage, object representation. |
| Bit-fields: allocation/order/signedness are implementation-dependent details | Programming in C | not sure | Interpret a bit-field only under the stated implementation. | Binary bits, structure. |
| Preprocessor: macro arguments, `#`, `##`, header guards, expansion order | Programming in C | not sure | Expand a macro and identify double evaluation. | Tokens, textual replacement. |
| `static` keyword versus static/lexical scope; scope versus linkage versus duration | Programming in C | not sure | Predict visibility and lifetime in block/file examples. | Blocks, functions, source files. |
| C parameter passing: all arguments passed by value; pointer-based mutation | Programming in C | not sure | Show why a function changes an object only through an address/alias. | Function call, variables, pointers. |
| Programming-language parameter models as theory, not C behaviour | Programming in C (extension) | not sure | Compare call-by-value/reference/value-result/name under a declared model. | Function calls and activation records. |
| Recursion basics inside C functions before advanced data-structure recursion | Programming in C; Recursion | not sure | Trace base case, recursive call and return value. | Functions, parameters, return. |
| File streams and safe input/output status | Programming in C (extension) | not sure | Trace EOF and distinguish EOF from an I/O error. | Functions, character input, return values. |
| `volatile` limitations and atomic/thread-safety distinction | Programming in C (extension) | not sure | Identify what `volatile` does not promise. | Type qualifiers and memory. |

### Important C facts to correct before the book is written

1. **A C byte is not necessarily eight bits.** `sizeof(char)` is one C byte; `CHAR_BIT` is at least 8. If the teaching diagrams use eight-bit bytes, label that as an assumption.
2. **Do not use a universal 4-byte pointer assumption.** Object-pointer sizes and representations are implementation-defined. Let the question supply the values or name the example platform.
3. **The type-conversion ladder in C2 is wrong as a general rule.** Integer promotions and usual arithmetic conversions must be taught as formal decision steps, not as one fixed list.
4. **C11/C17 signed integer representation is not universally two's complement.** Two's complement is the common teaching/platform assumption, but the book must label it when relying on it. Do not silently treat a typical machine as the language standard.
5. **Pointer subtraction returns `ptrdiff_t`, not “an int-like count”.** It is valid only for the same array object or one past it, and the result must be representable. Relational pointer comparisons have their own specified cases; equality comparison is not the same rule.
6. **`sizeof` returns `size_t`.** For arrays it measures the full array where the array type is still present; in a function parameter declared with array syntax, the parameter is adjusted to a pointer.
7. **`calloc` gives all-bits-zero storage.** Do not claim that this must be the representation of a null pointer or every floating-point zero on every conforming implementation.
8. **Structure member alignment is not “member size”.** C specifies member order and allows padding; actual alignment and padding depend on the implementation/ABI. `sizeof` includes padding.
9. **Union type-punning is more nuanced than “reading an inactive member is always UB”.** The exact implementation and representation rules matter. Do not oversimplify.
10. **`gets` was removed in C11.** It should be shown only as a historical unsafe function, not taught as an available modern C library function.
11. **String literals must not be modified.** The standard rule is about undefined behaviour on modification, not about a guaranteed physical “read-only memory segment”.
12. **C `^` is bitwise XOR, not exponentiation.** This must be obvious in both books.
13. **Uninitialised automatic objects are not merely “garbage”.** Their values are indeterminate; using them can produce undefined behaviour. Teach assignment before reading.
14. **The physical stack/heap/data-segment diagram is a common implementation model, not the abstract C language model.** Keep both models distinct.
15. **`static` storage class and static/lexical scope are different concepts.** C uses lexical scope; “dynamic scope” is a programming-language theory comparison, not a C feature.

## 3.4 Data Structures — required coverage audit

The uploaded Data Structures plan has 16 chapters D0–D15 and a broad range of topics. It is not missing most of the headline nouns in the official Section 4 list. What it lacks is a reliable prerequisite ladder, precise operating conventions, proofs/traces for many listed formulas, and a clear separation between Section 4 core and Section 5/DBMS extensions.

| Topic missing or insufficiently specified | Official syllabus line served | Frequency | Typical practice question | Zero-level prerequisite |
|---|---|---|---|---|
| Asymptotic notation and input-size model before D0 cost tables | Algorithms: asymptotic worst-case time and space; prerequisite for all structures | not sure | Compare growth and count primitive operations. | Integers, variables, loops, simple counting. |
| Best, worst, average, expected and amortised cost as different claims | Algorithms complexity; all D chapters | not sure | Find operation cost under stated input/tree/hash assumptions. | What an operation step is; probability basics for expected cost. |
| Space complexity and auxiliary space | Algorithms: asymptotic worst-case time and space | not sure | Count extra memory beyond stored input. | Arrays, variables, recursion stack. |
| Mathematical prerequisites: powers, logarithms, summations, geometric series | Complexity, tree height, heap build, dynamic arrays, hashing | not sure | Simplify `log n`, sum a doubling sequence, use a recurrence. | Arithmetic, exponents, elementary algebra. |
| Recurrence setup and recurrence/algorithm connection | Recursion; Algorithms: divide-and-conquer and recurrence relations in broader prep | not sure | Write a recurrence for a recursive procedure. | Function calls and recursion trace. |
| General array operation costs separated from C array syntax | Arrays | not sure | Count shifts, accesses and comparisons. | C array, index, memory. |
| Binary search correctness and sorted-array prerequisite | Arrays; Algorithms: searching | not sure | Trace left/right/mid and find comparison count. | Sorted list, indices, interval, comparison. |
| Full dynamic-array capacity, resize failure and amortised append explanation | Arrays (extension) | not sure | Trace capacity changes and total copy cost. | Array insertion, geometric series. |
| Linked-list pointer invariants and operation preconditions | Linked lists | not sure | Trace insertion/deletion with empty/one/many nodes. | C structs, pointers, `NULL`. |
| Singly versus doubly versus circular list operation matrix | Linked lists | not sure | Choose representation and compare traversal/insert/delete. | Node, next/prev pointers. |
| Dummy/header node and sentinel invariants | Linked lists | not sure | Trace an operation with and without a sentinel. | Singly linked list. |
| List deletion with only a pointer and its final-node impossibility | Linked lists | not sure | Determine whether a given deletion can be done. | Node links, head/tail. |
| Full stack representation and empty/full conventions | Stacks | not sure | Trace push/pop and identify overflow/underflow. | Array index or linked node. |
| Operator-stack notation rules including unary operators | Stacks; Algorithms expression handling if included | not sure | Convert/evaluate with specified precedence and associativity. | Tokens, operators, operands, parentheses. |
| Stack permutation/Catalan derivation | Stacks (extension) | not sure | Check whether an output order is achievable. | Push/pop, input sequence. |
| Circular queue conventions and usable capacity | Queues | not sure | Find front/rear after enqueue/dequeue sequence. | Modulo arithmetic, array index. |
| Linked queue final-node case | Queues | not sure | Simulate removing the last item and reset both ends. | Linked list. |
| Deque variants and restrictions | Queues (extension) | not sure | Decide which end allows insertion/deletion. | Queue and stack. |
| Priority queue interface versus implementation | Queues; binary heaps | not sure | Compare array/list/heap implementation costs. | Queue operations and ordering. |
| Recursion tree versus call stack distinction | Recursion | not sure | Count calls and maximum stack depth separately. | Functions and call/return. |
| Recurrence solving cross-reference to Algorithms | Recursion; Algorithms | not sure | Solve/estimate recursive call count. | Recursion and algebra. |
| Tree vocabulary and height/depth/level conventions | Trees | not sure | Count leaves, nodes, levels, height. | Graph/tree idea, counting. |
| Binary-tree types with exact definitions | Trees | not sure | Classify full/complete/perfect/skewed tree. | Parent, child, root, level. |
| Proofs of binary-tree counts with assumptions | Trees | not sure | Derive max nodes, leaves, edges, null links. | Tree drawing and simple algebra. |
| Tree array indexing in both 0-based and 1-based forms | Trees; heaps | not sure | Compute parent/children indices. | Array indices and integer division. |
| Traversal reconstruction assumptions and non-uniqueness | Trees | not sure | Reconstruct or prove impossible from traversals. | Pre/in/post/level traversal. |
| BST duplicate policy and height-dependent costs | Binary search trees | not sure | Build, search, insert, delete, count comparisons. | Binary tree ordering. |
| BST successor/predecessor and two-child deletion | Binary search trees | not sure | Trace replacement and subsequent deletion. | BST search path and inorder. |
| AVL balance-factor sign and rotation details | Binary search trees (extension) | not sure | Insert/delete and rebalance. | BST, height, rotations. |
| B/B+ tree belongs also to DBMS indexing | Database indexing (Section 9), optional cross-link here | not sure | Split/merge/search by order. | Multiway tree, sorted keys, disk blocks. |
| Red-black/splay tree priority evidence | Not explicit in the PDS syllabus line | not sure | Understand a balancing rule at survey level. | BST and rotations. |
| Heap array indexing, parent/child, complete-tree shape | Binary heaps | not sure | Find children/parent and maintain heap. | Complete binary tree, array. |
| Heap insert/delete/heapify/build-heap separate traces | Binary heaps | not sure | Compute final array and count comparisons/swaps. | Heap property and tree indexing. |
| Build-heap O(n) proof | Binary heaps; Algorithms complexity | not sure | Explain why bottom-up build is linear. | Summations and tree height. |
| Graph models: simple graph, multigraph, loops, directed/undirected | Graphs; graph theory | not sure | Count possible edges or interpret a graph. | Vertex, edge. |
| Degree/handshake theorem assumptions | Graphs; Discrete Mathematics | not sure | Sum degrees or count edges. | Counting, undirected graph. |
| Adjacency matrix/list operation costs with representation assumptions | Graphs | not sure | Choose representation and estimate space/check-neighbour cost. | Matrix, list, vertices/edges. |
| BFS/DFS full basic trace with tie-breaking | Graphs; Algorithms: graph traversals | not sure | Fill queue/stack and visited order. | Queue, stack, adjacency list. |
| Connected components/cycle detection boundary conditions | Graphs; Algorithms | not sure | Identify components or trace detection. | BFS/DFS, graph terms. |
| Hashing belongs to Algorithms section; one clear owner needed | Algorithms: hashing | not sure | Build table under a specified hash/probe rule. | Modulo, arrays, collision. |
| Hash functions and probe coverage conditions | Algorithms: hashing | not sure | Fill table and list every probe. | Remainder, table index, sequence. |
| Load factor and expected probes with the right model | Algorithms: hashing | not sure | Compute α and evaluate a stated model formula. | Fractions, logarithm for advanced formula. |
| Deletion tombstones and search correctness | Algorithms: hashing | not sure | Delete one key and search for a later key. | Open addressing and probing. |
| Comparison table assumptions for array/list/BST/AVL/heap/hash | Algorithms complexity + data structures | not sure | Pick a structure for a workload and justify costs. | Operation definitions and complexity. |
| A source-backed GATE question set and mixed revision | Section 4 and 5 topics | not sure | Solve a tagged official question and explain each step. | All preceding core chapters. |

### Scope decisions for the Data Structures book

| Item in D plan | Recommendation | Why |
|---|---|---|
| D0 ADT, memory, operation cost | **Keep [CORE]** | It gives the language needed to compare the structures. Add complexity prerequisites. |
| D1 arrays, address calculations, operations | **Keep [CORE]**, move searching/advanced matrix packing to cross-links or [GATE+] | Arrays are named in Section 4; searching is Section 5. |
| D2 linked lists | **Keep [CORE]** | Explicitly named in Section 4. The operation traces need more detail. |
| D3 stacks | **Keep [CORE]** | Explicitly named in Section 4; do basic operations before advanced applications. |
| D4 queues | **Keep [CORE]** | Explicitly named in Section 4; circular queue convention must be fixed. |
| D5 recursion | **Keep [CORE]** | Explicitly named in Section 4 and should connect to C6. |
| D6 trees | **Keep [CORE]** | Explicitly named in Section 4. Define terms and conventions early. |
| D7 BST | **Keep [CORE]** | Explicitly named in Section 4. Ensure deletion and complexity are fully taught. |
| D8 AVL | **Keep only as a clearly labelled extension until PYQ audit** | Balanced trees are not named in the Section 4 list. Do not assume AVL frequency. |
| D8 B/B+ trees | **Move core teaching to DBMS cross-reference** | Section 9 explicitly includes indexing (e.g. B and B+ trees). A short bridge here is fine. |
| D8 red-black/splay/2–3 | **[BEYOND] or brief optional note** | They are not named in the PDS list and will consume time. |
| D9 binary heaps | **Keep [CORE]** | Explicitly named in Section 4. Spend more time here than on optional heap families. |
| D10 tries, suffix, segment/Fenwick/k-d trees | **[BEYOND]** | Not named in the current PDS line. |
| D11 hashing | **Teach once, with shared ownership in Algorithms** | Hashing is explicitly listed under Section 5, not Section 4. Avoid duplicate chapters with conflicting formulas. |
| D12 graph representation + basic traversal bridge | **Keep [CORE]** | Graphs are in Section 4; graph traversals are in Section 5. Teach enough here to understand representations. |
| D13 union-find | **Move to Algorithms/graph algorithms or [BEYOND]** | Not named in the Section 4 list. |
| D14 structure comparison | **Keep [CORE]** | This is a valuable revision tool if every cost is qualified. |
| D15 GATE patterns | **Keep, but only with cited question records** | Never label a pattern “frequent” without the tagged source bank. |

---

# PART 4. THE DIAGRAMS I NEED — chapter-by-chapter visual specification

These are requirements for the author and diagram system. A diagram description is not a finished visual. Every production lesson must include the actual rendered picture or interactive frame, the source data for the picture, and a short caption telling me what to notice.

**Key:** **Single** = one explanatory picture. **Frames** = step-by-step pictures. **Trace** = a row-by-row table showing values/operations over time. Use all three when the concept changes over time.

## 4.1 Programming in C

| Chapter | What must be drawn | What I should notice | Format |
|---|---|---|---|
| C0 — computer, bits and memory | A row of memory cells with addresses, a cell expanded into bits, binary place values, and source → preprocessor → compiler → assembler → linker → executable → loader/run pipeline. | An address identifies a cell; the value is stored inside; source code is not the same as a running process. | Single + frames for pipeline. |
| C0 — number systems | Decimal/binary place-value table; binary-to-hex grouping; octal grouping; conversions such as 45 decimal and 0x2F. | Each position has a weight; grouping bits is the quick conversion trick. | Trace table. |
| C1 — first C program | Code with every line labelled: `#include`, `main`, braces, statements, semicolon, return; screen/keyboard picture. | Each line has a role; `printf` sends output; `scanf` reads input. | Single + trace. |
| C1 — nested `printf` | Inner function call, characters printed, return count, then outer function call. | The inner call prints before the outer call can use its return value. | Frames + trace table. |
| C2 — variable and type | Variable box with name, type, value, size and illustrative address; separate boxes for `char`, `int`, `float`. | A variable's name is not its address; a type controls how a value is interpreted. | Single. |
| C2 — integer representation | Bit weights, unsigned range, signed two's-complement circle **under an explicit assumption**, negative conversion steps. | The sign/range and wrap-around rule depend on signedness and the stated model. | Frames + trace. |
| C2 — floating point | Sign/exponent/fraction fields; a place-value example for 0.5 and an inexact 0.1 approximation. | Precision is finite; decimal fractions may not have exact binary representation. | Single + trace. |
| C2 — conversions | Integer-promotion decision tree; signed/unsigned common-type cases; cast/truncation; `-1 < 1u` under stated widths. | Conversion is a sequence of rules, not a fixed ladder. | Flow + trace. |
| C3 — precedence | Expression tree for `a + b * c`, `a & b == c`, `*p++`; precedence table with parentheses. | Grouping is not the same as evaluation order. | Single + annotated trace. |
| C3 — truth and short-circuit | Truth tables for `&&`, `||`, `!`; branch picture where the right side is skipped. | The right operand might not run. | Single + trace. |
| C3 — bitwise operations | Bit rows for `&`, `|`, `^`, `~`, shifts; masks that test/set/clear/toggle one bit. | Each bit is processed separately; `^` in C means XOR. | Single + frames. |
| C3 — prefix/postfix | Columns for initial value, expression result, final value; separate safe and undefined examples. | Prefix yields the updated value; postfix yields the old value; unsequenced conflicting side effects may have no defined result. | Trace. |
| C4 — `if`/`else` | Decision flowchart and a dangling-else brace/indent picture. | An `else` attaches to the nearest unmatched `if`. | Single + frames. |
| C4 — `switch` | Case labels, entry arrow, fall-through arrows and `break` exits. | Execution continues into later labels until a break/return or end. | Single + trace. |
| C5 — loops | Separate flowcharts for `while`, `do-while`, and `for`; entry/condition/body/update arrows. | Where the condition is checked and when the update runs. | Single. |
| C5 — nested loops | Grid of `(i,j)` pairs, iteration table and output column. | Which pairs execute and how many times the inner body runs. | Trace. |
| C5 — `break`/`continue` | Control-flow picture with the jump destination marked for each loop type. | `continue` goes to different next steps in `for`, `while`, and `do-while`. | Frames + flow. |
| C6 — function call | Stack-frame picture with parameters, local variables, return point and caller frame. | A call creates a new activation; returning ends that call's local lifetime. | Frames. |
| C6 — recursion | Call tree for countdown/factorial, with return values written on the way back. | Calls go down to a base case; answers travel back up. | Call tree + trace. |
| C7 — scope/lifetime | Nested blocks and visible-name region; timeline for automatic/static objects; two-file linkage example. | “Where a name is visible” differs from “how long its object lives.” | Single + timeline. |
| C7 — storage duration | Abstract storage-duration table alongside a typical implementation memory sketch, clearly labelled as different models. | Automatic/static/allocated storage duration is a language concept; stack/heap is a common implementation picture. | Compare + single. |
| C8 — 1-D array | Cells with indices, values, base address and element size. | Index 0 is the first element; address changes by element size. | Single. |
| C8 — 2-D/3-D arrays | Grid and flattened row-major sequence; stacked 2-D planes for a 3-D array; address formula labels. | C arrays are arrays of arrays and use row-major layout. | Single + frames + trace. |
| C8 — array parameter | Local array-size diagram versus adjusted pointer parameter in a function; `sizeof` comparison. | The function does not receive a whole array by value. | Single + trace. |
| C9 — pointer basics | Memory boxes with address on left, name/type/value inside, pointer box holding an address and an arrow to its target. | A pointer is a variable whose value is an address; the arrow is not the stored data itself. | Single. |
| C9 — `&` and `*` | Before/after of `p = &x`, `*p = 5`, `y = *p`. | `&` obtains an address; `*` accesses the pointed-to object. | Frames. |
| C9 — pointer states | Three side-by-side memory drawings: null pointer, uninitialised pointer, dangling pointer. | These are not the same; none should be dereferenced unless valid. | Single. |
| C9 — swap | Two integer boxes and two pointer parameters; swap each value in frames. | Function receives pointer values by value and changes caller objects through them. | Frames + trace. |
| C10 — pointer arithmetic | Array cells with `p`, `p+1`, `p+2`, element size and one-past position. | Pointer step is by pointed-to element, not always one byte. | Single + frames. |
| C10 — 2-D pointer family | For `int a[3][4]`, arrows/types for `a`, `*a`, `a[1]`, `*(a+1)`, `&a`, `a+1`, `&a+1`. | Same starting address can have different pointer types and different increments. | Layered single + trace. |
| C10 — declaration pair | Side-by-side `int (*p)[5]` and `int *p[5]` with array-of-pointers and pointer-to-array drawings. | Parentheses change what `p` is. | Single + declaration parse. |
| C10 — increment expressions | Five-element array and pointer position for `p++`, `(*p)++`, `*p++`, `*++p`. | Is the pointer moving or the pointed-to value changing? | Trace. |
| C11 — strings | Character cells with each index and final `\0`; empty string and missing-terminator warning. | A C string is a character sequence ending at a null character. | Single. |
| C11 — array versus literal pointer | Writable character array versus pointer to a string literal; show “modifiable” versus “do not modify” without promising a physical memory segment. | These declarations create different objects and different write rules. | Single. |
| C11 — string functions | `strcpy`, `strncpy`, `strcmp`, `strlen`, `memcpy`, `memmove` before/after buffers. | Capacity, null termination, return values and overlap matter. | Frames + trace. |
| C12 — pointer to pointer | `pp → p → x` with values and addresses. | Each `*` follows one pointer level. | Single + frames. |
| C12 — complex declarators | Declaration split into grouped parts with parentheses highlighted and a verbal reading order. | Read from the identifier outward; parentheses bind parts together. | Single. |
| C12 — function pointers | Function names/addresses, function-pointer variable and call arrow. | A function pointer points to a function, not an object. | Single + trace. |
| C12 — `const` combinations | Four-cell table: what may change, the pointer or the pointed-to value. | `const` applies to the thing immediately described by the declaration. | Compare. |
| C13 — structure layout | Byte offsets for a structure under a named ABI; padding visibly hatched; member order preserved. | Padding and alignment depend on implementation; `sizeof` includes padding. | Single + trace. |
| C13 — member reorder | Same structure with different member order and measured sizes under a named compiler/platform. | Reordering may change padding and total size. | Compare. |
| C13 — union | One shared storage area labelled with member views and a warning about representation-dependent reads. | Union members overlap; size must fit the largest member but may include padding. | Single. |
| C13 — bit-fields | A storage-unit diagram labelled with bit widths and an explicit compiler assumption. | Allocation order/packing is not portable in general. | Single. |
| C14 — process memory | Code, static area, heap and stack as a typical OS model; distinguish abstract storage duration. | The model helps visualise but is not the C standard's complete object model. | Single. |
| C14 — allocation lifecycle | `malloc` → use → `realloc` success/failure → `free`; show pointer update and aliases. | Reallocation may move memory; failure must not lose the old pointer. | Frames + trace. |
| C14 — leaks/dangling | Lost pointer, freed block, old alias and explicit null assignment. | `free` does not set every alias to null; memory ownership must be tracked. | Frames. |
| C15 — macro expansion | Original macro, substitution steps, final token sequence; bad and parenthesised square macro. | The preprocessor substitutes tokens before normal C expression evaluation. | Frames. |
| C16 — parameter models | Same function under call-by-value, pointer-based mutation, copy-restore and call-by-name as separate theory models. | C itself passes arguments by value; the other models are for theory questions. | Compare + stack frames. |
| C16 — static/dynamic scope | Nested call chain with variable lookup arrows under lexical versus dynamic scope. | Which binding is used depends on the scoping rule, not the `static` keyword. | Frames. |
| C17 — file stream | File characters, current file position, `fgetc` return, EOF and error indicator. | EOF is a return sentinel, not a character stored in the file. | Frames + trace. |
| C18 — output method | Reusable code trace template: line, expression, variable values, memory state, definedness. | Do not calculate an output until you have checked whether the program has a defined result. | Trace. |
| C18 — behaviour classification | Decision tree for defined, unspecified, implementation-defined and undefined behaviour. | Some questions have multiple allowed outcomes; some have no standard-defined outcome. | Flow. |
| C19 — PYQ map | Chapter/topic links to official paper, year, session, question number and answer-key status. | A “GATE example” must be traceable to a source; synthetic questions are labelled separately. | Matrix/table. |

## 4.2 Data Structures

| Chapter | What must be drawn | What I should notice | Format |
|---|---|---|---|
| D0 — ADT versus implementation | One stack ADT with array implementation on one side and linked-list implementation on the other. | The operations are the same; the memory arrangement is different. | Compare. |
| D0 — contiguous versus linked | Array cells in one run versus nodes scattered in memory; arrows and addresses. | Random access is easy in arrays; reaching a linked-list position requires walking links. | Single. |
| D0 — complexity growth | Steps-versus-n plot for constant, linear, logarithmic and quadratic growth, using example operation counts. | Input size n changes the number of steps; the curves are not just labels. | Single. |
| D1 — insertion/deletion | Array before/after with arrows showing every shifted element. | Front insertion/deletion shifts many elements; access by index does not. | Frames + trace. |
| D1 — sorted array/binary search | Sorted cells with left/mid/right markers for each comparison. | Every comparison removes a half-range only because the data is sorted. | Frames + trace. |
| D1 — row/column major | Same matrix displayed as a grid and as a flat sequence under each storage convention. | Which index changes fastest; label that C's built-in arrays use row-major order. | Single + formula trace. |
| D1 — triangular/special matrix | Matrix with stored cells highlighted and a packed 1-D array with index mapping. | The formula must match the declared storage order and indexing origin. | Single + trace. |
| D1 — sparse triplet | Matrix, row-column-value triples, and reconstruction. | Only non-zero entries are stored; define the triplet sorting order. | Single. |
| D1 — dynamic array | Capacity 1→2→4→8 frames, copied values, count of total copied elements. | One append may be expensive; total copies across many appends are linear. | Frames + trace. |
| D2 — singly linked list | Node boxes labelled `data | next`, head, tail and NULL. | The data is in nodes; `head` stores the starting node's address. | Single. |
| D2 — insert/delete | Empty, one-node, many-node cases; pointer changes shown one at a time. | Save the next pointer before overwriting a link; update head/tail properly. | Frames. |
| D2 — doubly/circular list | `prev` and `next` arrows, head/tail connection, circular last-to-first link. | Each representation has different link invariants and edge cases. | Single. |
| D2 — reverse list | `prev`, `cur`, `next` for each step; show when the old rest of the list is saved. | Change one link at a time without losing the remaining chain. | Frames + trace. |
| D2 — cycle detection | Circular list with slow/fast pointers, meeting point, then reset-and-walk to cycle entry. | The pointers move at different speeds; meeting alone is not the cycle entry. | Frames. |
| D3 — stack | Vertical stack with top index/pointer, push and pop arrows, empty/full state. | Last in is first out; top moves on every operation. | Frames. |
| D3 — postfix evaluation | Token column, action column, stack after every token. | An operator removes the correct operands in the correct order. | Trace. |
| D3 — infix conversion | Input token, operator stack, output expression at every step. | Parentheses, precedence and associativity decide when an operator is popped. | Trace. |
| D3 — valid stack permutations | Input order, stack contents, push/pop timeline and invalid-output example. | Some permutations cannot be made by a single stack. | Timeline + trace. |
| D4 — circular queue | Ring array with front/rear, wrap-around frames, empty/full states. | Fix what `front` and `rear` point to; one-slot-empty capacity is n−1. | Frames + trace. |
| D4 — queue implementations | Array queue, linked queue, deque, priority queue, each with front/rear or priority order. | Same interface, different storage and operation costs. | Compare. |
| D4 — two-stack queue | Two stacks with transfer step and queue order after every operation. | Reverse twice to restore FIFO order; occasional operation may cost O(n). | Frames + trace. |
| D5 — call stack | One frame per recursive call, with parameter/local/return value. | Calls are separate; the final answer comes back during unwinding. | Frames. |
| D5 — recursion tree | Branches and return values for Fibonacci/Hanoi or another suitable example. | Number of calls and maximum depth are different quantities. | Call tree + trace. |
| D6 — tree vocabulary/types | Root, parent, child, leaf, internal node, level, depth, height; full/complete/perfect/skewed examples. | Every term points to a specific part of the tree; level/height conventions are fixed. | Single. |
| D6 — counting proofs | Perfect tree levels, max nodes per level, edges, leaves, null links with highlighted counts. | The formula is derived from the picture and assumptions. | Frames + short proof. |
| D6 — array representation | Tree node indices beside array cells for both 0-based and 1-based conventions. | Parent/child formulas depend on the indexing convention. | Single + trace. |
| D6 — traversals | One labelled tree with numbered visitation order for preorder, inorder, postorder, level-order. | Only the order of visiting changes; the tree does not. | Single + trace. |
| D6 — reconstruction | Traversal lists beside a tree, root selection and left/right subarrays in each frame. | Inorder with preorder/postorder is unique only under the stated distinct-label assumptions. | Frames. |
| D7 — BST insertion/search | Comparison path highlighted for each key, one insertion per frame. | Every key follows the smaller-left/larger-right rule. | Frames. |
| D7 — BST deletion | Separate leaf, one-child and two-child cases; successor/predecessor path. | Two-child deletion replaces with a neighbouring key and then removes that key from its old place. | Frames. |
| D7 — BST costs | Best balanced shape versus chain; search path length shown. | Cost depends on tree height; worst-case height can be n−1. | Compare. |
| D8 — AVL rotations | LL, RR, LR and RL before/after with pivot and subtrees A/B/C/D. | Rotations preserve BST order; LR/RL need two simple rotations. | Frames. |
| D8 — AVL insert/delete | Each node's balance factor before and after; rebalancing up the ancestor path. | Deletion can require rebalancing at more than one ancestor. | Frames + trace. |
| D8 — B/B+ trees | Node keys/children, overflow split, underflow merge/borrow, linked B+ leaves. | State the order definition and root exceptions; do not mix B and B+ rules. | Frames. |
| D9 — binary heap | Same heap shown as a tree and array with parent/child index arrows. | Heap-order property does not mean the array is fully sorted. | Single. |
| D9 — sift up/down | Highlight compared parent/children and every swap. | Insert repairs upward; delete-root repairs downward. | Frames + trace. |
| D9 — build heap | Bottom-up starting nodes, height bands and total work per level. | Most nodes are near leaves, which explains O(n). | Frames + cost diagram. |
| D9 — heap sort | Array after each swap and heap-size reduction. | The sorted tail grows while the heap shrinks. | Frames + trace. |
| D10 — optional tree structures | Trie prefix branching; one small segment/Fenwick example if retained. | They are extension topics, not the core exam route. | Single. |
| D11 — hash function/collision | Key → hash function → table index; two keys colliding. | The hash function selects a slot; collision handling is a separate rule. | Single. |
| D11 — probing | Table slots with each linear/quadratic/double-hash probe marked in order. | Insertion order and probe formula determine the final table. | Frames + trace. |
| D11 — chaining | Bucket slots with linked chains; insert/search/delete. | Multiple keys may share one bucket; load factor can exceed one. | Single + frames. |
| D11 — tombstone | Search path through a deleted slot and later insertion reusing it. | Deletion cannot simply turn an occupied probe-chain slot into a never-used empty slot. | Frames. |
| D11 — load factor | n occupied keys over m slots; simple chart showing the stated model's probe bound. | Any expected-probe formula has assumptions; a generic curve is not universal. | Single + formula trace. |
| D12 — graph representations | One graph with adjacency matrix and adjacency list beside it. | Matrix uses O(V²); adjacency list uses O(V+E), with undirected edges commonly listed twice. | Single. |
| D12 — graph counts | Directed/undirected examples with/without loops; degree labels. | Formula depends on graph assumptions; handshake lemma is for undirected graphs. | Single + trace. |
| D12 — BFS/DFS | Same graph with queue for BFS and stack/recursion for DFS; visit order numbers. | Neighbour ordering must be stated or multiple visit orders may be valid. | Frames + trace. |
| D13 — union-find | Parent forest before/after union-by-rank/size and path compression. | Find follows parent pointers; compression shortens future paths. | Frames. |
| D14 — compare structures | Operation table with assumptions and separate worst/expected/amortised columns. | There is no universally best structure; the workload and assumptions matter. | Compare. |
| D15 — PYQ map | A matrix from official source question to topic, difficulty, solution and reviewer status. | Real question provenance is visible; synthetic question is not mislabeled as PYQ. | Matrix/table. |

### Visual production rule

A picture counts only if it teaches a thing I could not reliably understand from the prose alone. A table of numbers with the word “figure” above it does not count as a diagram. A trace table is valuable, but it is not a substitute for a memory picture when I need to understand where a pointer points.

---

# 5. Corrections to the earlier review and Deep Research report

This section deliberately separates good earlier findings from statements that need correction.

## 5.1 Earlier findings that remain valid

- A zero-level learner must be taught bits, bytes, variables, types, arrays, addresses and functions before pointer tricks.
- The C plan's pointers are too dense to be understood from topic names alone. The `int a[3][4]` pointer family needs type-by-type explanation and drawings.
- Recursion should begin with basic function calls in C6 and continue systematically in D5.
- Trace tables must start in the first C lesson, not only in C18.
- The Data Structures book needs real frame-by-frame operations for list insertion/deletion, stack push/pop, queue wraparound, tree insertion/deletion/traversal, AVL rotation, heapify and hash probing.
- The C plan needs more precision around `sizeof`, type conversions, pointer arithmetic, array decay, string behaviour, dynamic allocation and undefined behaviour.
- The C plan's “31 versus 60 versus 1,000” practice counts need to reconcile.
- A true beginner pilot is necessary before bulk writing or charging money.

## 5.2 Earlier statements that should be narrowed or corrected

1. **“Only pointers into the same array may be compared or subtracted.”** This is too broad if it treats all comparison operators alike. Pointer subtraction has the same-array/one-past rule. Relational comparisons have their own C rules, including ordered members of the same aggregate. Equality comparison has still different rules. Teach the exact operator-specific rules.
2. **“All reads of an inactive union member are undefined.”** This is too absolute. Union representation access is nuanced; the selected member, common initial sequence rules, implementation-defined interpretation and possible trap representations matter. The book should teach only precise cases, with a stated implementation where needed.
3. **“C has automatic (stack), static and dynamic (heap) storage classes.”** This mixes standard storage duration with common memory regions. C's storage-duration categories include automatic, static, allocated and (in C11) thread storage duration. A stack or heap is an implementation model, not a one-to-one standard category.
4. **“A byte is eight bits.”** This is a common platform assumption, not a universal C rule. A C byte is the unit measured by `sizeof(char)`; `CHAR_BIT` is at least 8.
5. **“`calloc` zeroes things.”** It zeroes all bits. That does not universally promise a null-pointer representation or a floating-point zero value.
6. **“Union size equals largest member.”** It is sufficient to contain the largest member and may be larger due to padding/alignment.
7. **“Static locals initialise before the program starts to zero.”** Broadly useful under static storage duration when no explicit initializer is given, but teach it as static-duration zero-initialisation, not as a memory-location claim.
8. **“The preprocessor does pure text substitution.”** This is a useful beginner approximation, but macro replacement has token rules, argument prescan, stringification, token pasting and rescanning. Teach the approximation first, then the relevant rules.
9. **“Two's complement is almost universal, so assume it.”** For GATE-style examples it is often the stated or intended machine model, but the book should never claim a C11/C17 guarantee where the chosen standard does not provide one.
10. **The prior report's use of Wikipedia as a supporting C reference was weak.** Use WG14's public N1570 draft, the official GATE syllabus, and reputable compiler/security references instead.

---

# 6. A corrected production plan for Claude

## 6.1 Replace the current machine assumptions

Remove the default brief:

> “32-bit: int 4 bytes, pointer 4 bytes, char 1 byte, little endian”

Replace it with:

> **Machine and language assumptions:** State the C version. Use only the sizes, signedness, alignment and endianness given in the question. If the question gives none, distinguish what ISO C guarantees from what a common platform does. Never assume pointer size, `int` size, endianness, structure padding or floating-point representation silently. For address diagrams, label addresses as illustrative unless the question supplies them.

## 6.2 Revised topic brief fields

Every Claude writing request must contain:

- Subject and lesson ID.
- Exact official GATE syllabus line(s).
- Prerequisites already taught, with lesson IDs.
- Core concepts and finer points, divided into [CORE], [GATE+], [BEYOND].
- C language version and platform assumptions (or “none; portable rule only”).
- Every PYQ source record, or explicitly “no audited PYQ claim supplied”.
- Required diagrams and the expected diagram type.
- Code-example list and verification method.
- Target reading time and intended lesson boundary.
- Output sections to write now; never ask the model to generate an entire book in one response.

## 6.3 Revised Claude writing instructions

Use this as the replacement core prompt. Keep the 12-station idea, but remove the impossible requirement that every tiny topic must contain eight diagrams and 31 questions.

```text
ROLE
Teach one 25-year-old GATE dropper who failed twice, has backlogs, remembers very little,
and is embarrassed to ask questions. The learner needs a patient first explanation, not a revision note.

NON-NEGOTIABLE TEACHING RULES
1. Assume only the listed prerequisites. Do not silently assume prior programming knowledge.
2. Define every technical word the first time it matters. Use a simple meaning, a correct example,
   and an analogy only when the analogy does not distort the rule.
3. Teach one idea at a time. Show the smallest example first and work every step.
4. Separate: (a) intuitive model, (b) exact language/algorithm rule, (c) implementation/platform assumption.
5. Mark content [CORE], [GATE+], or [BEYOND]. Do not let [BEYOND] interrupt the core lesson.
6. If a fact or GATE frequency is not source-backed, write “not sure” or “to verify”.
   Never invent a year, question number, frequency or weightage.
7. Introduce safe/unspecified/implementation-defined/undefined distinctions as soon as they arise.
   Never give one compiler's output as the C answer for undefined code.
8. Every worked example must show the initial state, each operation, the final state, and why.
9. A diagram must teach something. Do not create decorative diagrams just to meet a number.
10. Every diagram must have a title, caption, labels, data/source representation, and a human-checkable sketch.
11. Every C code sample must declare the C version, compile command and platform assumptions.
    Keep defined examples separate from UB demonstrations.
12. Do not call synthetic practice questions PYQs. Cite real PYQs using paper, year, session,
    question number, official paper link and answer-key link.
13. Explain why a common wrong answer feels plausible and exactly where it fails.
14. If the requested scope is too large for one response, stop at a clean lesson boundary and list
    the next lesson ID; do not shorten or silently omit required content.

LESSON STRUCTURE
A. Why this idea exists (short story/problem).
B. What the words mean (small glossary, only terms used in this lesson).
C. First picture or tiny example.
D. Build the idea in small steps.
E. Two or more fully worked traces, scaled to lesson size.
F. Exact rules and formulas.
G. Finer points and edge cases, grouped by priority.
H. GATE question forms; show audited examples only when source records are supplied.
I. Common mistakes and how to avoid them.
J. Practice: beginner first, then core, then GATE-level; provide complete solutions.
K. Recap, retrieval questions and the next prerequisite link.

SELF-CHECK
- Can the learner follow every term with only the listed prerequisites?
- Are all calculations and code outputs checked?
- Are standard rules separated from machine assumptions?
- Are diagrams accurate and actually rendered?
- Are PYQ citations real and traceable?
- Are [BEYOND] topics clearly optional?
- Does the lesson teach rather than merely list?
If any answer is no, fix it or state exactly what remains unverified.
```

## 6.4 Practice count: choose one arithmetic policy

The current C plan contains three incompatible count units:

- 6 warm-up + 10 core + 10 GATE-level + 5 twisted = **31 per topic**.
- “At least 60 problems per chapter.”
- “About 1,000 graded problems” across the subject.

The master prompt's self-check calls the practice ladder 31. The Data Structures plan also says 31 per topic. The simplest policy is:

- **Per lesson:** 6 warm-up + 6 core + 4 exam-style + 2 challenge = 18 fully worked or explained questions, adjusted for lesson size.
- **Per chapter:** a separate mixed review set, with its number specified after lesson count is fixed.
- **Per subject:** calculate the total from the actual lesson list; do not promise “1,000” until the list and question bank have been counted.

If you prefer the original 31-question ladder, keep it as **per chapter**, not per tiny topic. Do not keep both 31 per topic and 60 per chapter without calculating the total.

## 6.5 Reviewer workflow — every chapter must pass these gates

| Gate | Reviewer asks | Evidence required | Reject when |
|---|---|---|---|
| 1. Syllabus | Is every required syllabus item mapped to a lesson? | Coverage matrix with official line. | Any named syllabus topic has no lesson owner. |
| 2. Prerequisites | Does the chapter use a word/concept not taught earlier? | Prerequisite map and glossary audit. | A beginner must search another book/video to follow. |
| 3. Teaching | Are there small examples, full traces and real explanations? | Annotated lesson and trace tables. | It only names formulas/rules or skips a transition. |
| 4. Accuracy | Are language rules and formulas correct? | Standard clauses, proofs or reputable references. | Any unqualified false/implementation-specific claim. |
| 5. Code | Does the code behave as described under the stated assumptions? | Compiler name/version, command, input, output, logs. | Code output is guessed, or UB is assigned a single valid answer. |
| 6. Diagrams | Does the picture match the prose and the actual data? | Rendered SVG/diagram plus source data. | “Figure” is only a text table, labels are missing, or arrows are wrong. |
| 7. GATE examples | Are questions genuine and correctly tagged? | Official question paper and answer key. | A synthetic question is labelled PYQ or a year/question ID is invented. |
| 8. Beginner test | Can a weak learner explain the step without hints? | Think-aloud session, error log, pre/post mini-test. | The student says “I memorised it” but cannot explain it. |
| 9. Product quality | Is the lesson readable on phone and desktop? | Rendered app lesson and accessibility checks. | Diagram text is unreadable or the layout is too dense. |
| 10. Release | Are critical issues resolved and versioned? | Reviewer sign-off and change log. | Any open HIGH issue remains. |

Do not merge two reviewer model outputs by voting. Use both to generate possible issues, then adjudicate every technical claim against a primary source or reproducible test.

## 6.6 Code and standards policy

1. Pick a baseline standard (recommended: ISO C17 for the teaching examples, with selected C11 draft clauses used as public references where appropriate). The official GATE syllabus itself does not specify a C version, so do not pretend it does.
2. Use a declared compiler such as GCC or Clang and record exact version/flags. Example baseline: `gcc -std=c17 -Wall -Wextra -pedantic`.
3. Every example receives one of these labels: **portable defined**, **implementation-dependent with stated assumptions**, **constraint violation/diagnostic required**, or **undefined behaviour**.
4. Do not use actual output from undefined behaviour as the answer. A compiler may print something, crash, optimise away a branch, or appear to work; none is the language-defined answer.
5. For implementation-specific layout examples, include compiler, target ABI, architecture and output from `sizeof`/`offsetof`; explain that another system may differ.
6. Do not rely on non-standard extensions unless the point is to teach that extension. Label them clearly.
7. Re-run code whenever the prose or example changes. A cached test from an older revision is not enough.
8. Verify the diagram against the same trace as the code. A correct program with a wrong picture is still a failed lesson.

## 6.7 PYQ sourcing and frequency policy

Use the official GATE download portal as the source of truth for question papers and answer keys. The portal lists year-wise CS papers and answer keys for 2021–2026, plus a bulk question-paper download covering 2007–2026.

For each PYQ, store:

- GATE year;
- CS paper/session (for example CS-1 or CS-2 when applicable);
- question number and marks/type if shown;
- official paper URL and answer-key URL;
- official answer/key version or correction if applicable;
- syllabus line and chapter/topic tags;
- solution author and independent reviewer;
- a note where the question depends on an assumed machine model or language version.

Do not write “asked every year”, “very common”, “rarely asked”, “most repeated” or an exact frequency until the complete stated corpus has been tagged and deduplicated. State the corpus explicitly (for example “papers reviewed: 2014–2026, including both CS sessions where present”). Until then, write **frequency: not sure**.

---

# 7. Pilot plan and acceptance criteria

## 7.1 What to write first

Do not start with advanced pointers as the first thing the learner sees. The first pilot should be a connected mini-module:

1. **Bridge 0:** bits, bytes, binary place value and a labelled memory cell.
2. **Bridge 1:** variables, types, declarations, assignment and a tiny C program.
3. **Bridge 2:** arrays, indices, element size and address calculation.
4. **Pilot lesson:** pointers I — address-of, pointer variable, dereference, reading/writing through a pointer.
5. **Pilot follow-up:** array decay and pointer arithmetic only after the pointer lesson passes.

This preserves the idea of testing the pointer lesson, but does not pretend C9.1–C9.6 can be understood without the bridge.

## 7.2 Test with actual weak beginners

Use at least five learners who honestly match the intended audience, not only the author or strong GATE students. Ask them to read without help and record every time they stop, reread, guess, or look up a word. Do not tell them the answer while testing.

They must be able to:

- explain the difference between a variable's value and its address;
- draw a memory box and label the address/value;
- explain what `&x` and `*p` mean in plain English;
- trace `p = &x; *p = 5;` and show which box changes;
- explain why an uninitialised pointer is unsafe;
- compute a small array element address when the base address and element size are supplied;
- tell the difference between a defined example and one marked undefined behaviour;
- solve beginner practice questions without looking at the worked solution first.

## 7.3 Pass conditions

A pilot passes only when all of the following are true:

- At least 4 out of 5 learners can explain the core idea in their own words after one reading.
- At least 4 out of 5 can solve a fresh, structurally similar problem without hints.
- No learner needs an external source to understand a term the lesson itself introduced.
- No high-priority factual error, code mismatch or diagram mismatch remains.
- The learner can identify what they do not yet understand, rather than silently guessing.
- The mobile rendering is readable; the diagrams are legible without zooming excessively.

These are proposed project gates, not research-backed universal cut-offs. You can make them stricter, but do not weaken them simply to move faster.

---

# 8. A realistic 100-day route for the student

This is a study route, not a claim that the book is finished. It prioritises the official C/recursion/arrays/lists/stacks/queues/trees/BST/heaps/graphs core and avoids spending early days on optional trees or obscure C details.

| Days | Main focus | What I must be able to do before moving on |
|---|---|---|
| 1–5 | Bridge: binary, memory, first C program, variables, input/output | Read a tiny program; explain variable/type/value; convert small binary values. |
| 6–12 | C expressions, conversions, decisions, loops | Trace every line in a small program; distinguish precedence from evaluation order. |
| 13–18 | Functions, scope/lifetime basics, recursion foundation | Draw a call frame; trace a function return and a simple recursive call. |
| 19–27 | C arrays, pointers I and II | Draw arrays/pointers; trace address-of, dereference and safe pointer arithmetic. |
| 28–34 | C strings, advanced pointers needed for data structures, structures | Trace string functions, read node declarations, understand `struct` and `->`. |
| 35–43 | Linked lists, stacks, queues | Draw and trace insert/delete/reverse, push/pop and circular queue operations. |
| 44–53 | Trees, traversals, BST | Calculate tree properties and trace insertion/deletion/traversal. |
| 54–60 | Binary heaps; core recursion revision | Trace insert/delete/heapify and call-count examples. |
| 61–67 | Graph representations and traversal bridge | Convert graph ↔ matrix/list; trace BFS/DFS with a stated neighbour order. |
| 68–74 | Algorithms cross-link: searching, sorting, hashing, complexity | Solve the actual Algorithms topics that depend on arrays/graphs/hash tables. |
| 75–84 | Tagged official PYQs for C + Data Structures + Algorithms overlap | Explain why each official answer is right; log weak topics. |
| 85–92 | Mixed practice, spaced revision, timed section tests | Solve without notes; review mistakes and redo weak types. |
| 93–100 | Final revision and high-yield error book | Revise core rules, diagrams and wrong-answer patterns; avoid new optional topics. |

### 100-day study rules

- Every day: one new concept or a small lesson, one active-recall session, and a small set of problems.
- Every 3–4 days: revisit older topics without looking at notes first.
- Every week: one mixed test and an error-log review.
- Do not spend the core preparation window on red-black trees, splay trees, tries, XOR lists, segment trees or advanced hash theory until the named syllabus topics are stable.
- If behind, cut [BEYOND] material first. Do not cut the basics needed to understand pointers, recursion or tree operations.

---

# 9. Exact next actions for the project owner

| Order | Action | Why it comes now |
|---:|---|---|
| 1 | Fix C standard/platform policy, all high-priority fact doubts, especially C2/C9/C10/C11/C13/C14 and D3/D8/D11/D12. | Claude must not amplify wrong explanations. |
| 2 | Resolve practice-count policy and remove unsupported frequency claims. | Stop misleading promises before publication. |
| 3 | Create the missing reviewer prompt and attach the Algorithms plan/PYQ source manifest. | Reviewers need a complete source base. |
| 4 | Build a small validated set of diagrams and code-check fixtures. | The requested teaching method must be testable. |
| 5 | Write the bridge + pointer pilot using the revised prompt. | This is the best test of beginner-first teaching. |
| 6 | Run the pilot with five weak beginners and record their actual sticking points. | The intended learner decides whether the method works. |
| 7 | Only after a pass, produce the rest of C and Data Structures one chapter at a time. | Do not spend time generating content that will need a rewrite. |
| 8 | Build the official PYQ map and calculate frequencies only after tagging is complete. | This is the only honest way to make “GATE asks this often” claims. |

---

# 10. Sources and verification notes

## Official GATE sources

1. **IIT Madras, GATE 2027 — CS syllabus PDF**: [Official PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf). Section 4 lists Programming in C, Recursion, Arrays, Stacks, Queues, Linked Lists, Trees, BSTs, Binary Heaps and Graphs. Section 5 lists Searching, Sorting, Hashing, asymptotic complexity, Greedy, Dynamic Programming, Divide-and-Conquer, Graph Traversals, MSTs and Shortest Paths.
2. **IIT Madras, GATE 2027 — Test Papers & Syllabus page**: [Official page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus). It states that GATE 2027 syllabi were revised and identifies IIT Madras as the organising institute.
3. **IIT Madras, GATE 2027 — Downloads page**: [Official downloads](https://gate2027.iitm.ac.in/download). It lists year-wise question papers and answer keys for 2021–2026 and a bulk download of question papers for 2007–2026.

## C language and implementation references

4. **WG14 N1570, public C11 committee draft**: [PDF from the WG14 site](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf). Relevant clauses include §5 (translation/execution environment), §6.2 (scope, linkage, storage duration, types and representations), §6.3 (conversions), §6.5 (expressions, pointer arithmetic and sequencing), §6.7.2.1 (structures/unions), §6.5.3.4 (`sizeof`), §7.22.3 (`malloc`/`calloc`/`realloc`/`free`) and §7.24 (string handling). N1570 is a committee draft, not a beginner tutorial; use it to check the rule, then explain the rule in simple English.
5. **SEI CERT C, STR37-C**: [Character-handling function arguments](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/characters-and-strings-str/str37-c/). It explains why `<ctype.h>` functions require `EOF` or a value representable as `unsigned char`.

## Data Structures / Algorithms reference

6. **Cormen et al., Introduction to Algorithms, Chapter 11 (Hash Tables)**: [Publicly available textbook PDF copy](https://www.cs.mcgill.ca/~akroit/math/compsci/Cormen%20Introduction%20to%20Algorithms.pdf). The open-addressing expected-probe bounds cited in this review are under the uniform-hashing assumption: unsuccessful search at most `1/(1−α)`, successful search at most `(1/α) ln(1/(1−α))` with the stated equal-search-probability assumption. These are not generic chaining formulas.

## Verification caveats

- This review verifies the official GATE 2027 syllabus text and selected C/algorithm rules. It does **not** calculate PYQ frequency. No PYQ dataset was supplied in the reviewed files.
- No finished C chapter, finished Data Structures chapter, diagram renderer, app output, Algorithms plan or reviewer prompt was supplied for direct quality testing.
- C code examples were not run as part of this document review because the uploaded plans contain outlines rather than a complete bank of code snippets. Every future finished code lesson still needs compiler verification.
- The examples of typical question types in this report are recommended practice types, not a claim that each type appears every year.

---

## Final verdict

**The student-first idea is worth continuing. The current files are not ready to become a paid book.** Fix the high-priority facts, prerequisites, syllabus boundaries and production contradictions. Then write one complete bridge-plus-pointer pilot and test it with actual beginners. Until that test passes, the honest answer to “Would I pay ₹149?” remains **No — not for a plan, and not for content that has not yet proved it can teach me.**
