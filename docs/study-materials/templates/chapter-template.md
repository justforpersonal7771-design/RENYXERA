# Chapter template (authoring dialect)

Copy this file to `content/study/<branch>/<chapter-id>/chapter.md` and fill every section. The compiler turns it into `chapter.json` and reports precise errors. Do not delete required blocks; if one genuinely does not apply, write `:::skip reason="..."` and the reviewer must accept it.

```
---
id: cs.os.deadlock
title: Deadlocks
branch: CS
section: "CS 5: Operating System"
subject: Operating System
syllabus_refs:
  - "CS Section 5 / Operating System: Deadlock"
prereqs:
  - cs.os.synchronisation.semaphores
see_also:
  - cs.os.scheduling.priority-inversion
pyq_tags:
  - "Deadlock"
difficulty: core
sources:
  - "Silberschatz, Galvin, Gagne: Operating System Concepts (ch. Deadlocks)"
  - "GATE CS papers in our bank (tag: Deadlock)"
tree_version: 1
---

# Topic: The four conditions
id: cs.os.deadlock.coffman

:::hook
Two people each hold one chopstick and wait for the other's. Nobody can eat, and nobody lets go.
:::

:::intuition
(Plain words, no symbols if possible. One picture.)
:::diagram graph id=rag-intro alt="Two processes each holding one resource and requesting the other, forming a cycle"
nodes: P1 process, P2 process, R1 resource, R2 resource
edges: R1 -> P1 (held by), P1 -> R2 (requests), R2 -> P2 (held by), P2 -> R1 (requests)
highlight: cycle
:::

:::definition name="Coffman conditions"
A deadlock can arise only if all four hold at once: (1) mutual exclusion, (2) hold and wait, (3) no pre-emption, (4) circular wait.
:::

:::example id=ex1 pyq="GATE CS 20XX Shift N Q.NN"
given: ...
find: ...
steps:
  - say: "..."
    math: "..."
answer: "..."
verify: verify/ex1.py
:::

:::trap
wrong: "Any cycle in a resource allocation graph means deadlock."
why-tempting: "A cycle looks like processes waiting on each other."
why-wrong: "With multiple instances of a resource, a cycle is necessary but not sufficient."
rule: "Cycle with single-instance resources ⇒ deadlock; with multiple instances ⇒ check reducibility."
:::

:::shortcut condition="single instance of every resource type"
(A faster method, only valid under the stated condition.)
:::

:::gate-note
how-asked: ["detect a cycle in a given RAG", "count minimum resources to avoid deadlock", "safe/unsafe state with Banker's algorithm"]
frequency: auto   # computed from the bank
time-budget: "1.5 minutes"
:::

:::recall
cue: "Coffman conditions?"
answer: "Mutual exclusion · Hold and wait · No pre-emption · Circular wait. Break any one, deadlock cannot happen."
anchor: rag-intro
:::

:::check
- type: MCQ
  question: "..."
  options: ["...", "...", "...", "..."]
  answer: B
  solution: "..."
  why-not: { A: "...", C: "...", D: "..." }
- type: NAT
  question: "..."
  answer: "12 to 12"
  solution: "..."
:::

:::pyq-links
auto: true
:::

:::references
- "Silberschatz et al., Operating System Concepts, ch. 8"
:::

# Topic: ...
(repeat the same blocks for each topic; the schema enforces order and required blocks)

# Chapter summary
:::summary
(Key ideas in 5 bullets.)
:::

:::chapter-check
(Mixed, interleaved questions across the chapter's topics.)
:::
```

## Notes for the author

- Numbers in `example` and `check` come from the `verify` script, not from memory.
- Every `diagram` needs `alt` and, for graphs and automata, the compiler generates the text-equivalent table.
- Use snippet references (`:::snippet id=binary-search-trace`) instead of redrawing a standard figure.
- Keep each callout to one idea.
- Run `npm run study:check <chapter>` before asking for review; it runs every machine check in `docs/study-materials/03-CONTENT-PIPELINE.md` §4.
