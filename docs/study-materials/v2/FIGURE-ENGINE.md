# Master figure engine (built 24 Nov 2026)

Figures are **data**, drawn as theme-aware SVG or HTML. They work in light and dark, on desktop and mobile (a wide figure scrolls inside its own box; the page never scrolls sideways). Code: `lib/study/figures.ts` (types), `lib/study/figure-layout.ts` (layout maths), `components/study/figures/` (drawing), `lib/study/figure-samples.ts` (one worked sample per kind, the best format reference). Check: `npm run check:figures`.

Use a figure in a lesson exactly like the old ones: `{ type: "figure", id, fig: { kind: "...", ... }, caption, alt }`.

| Kind | Draws | Key fields |
|---|---|---|
| `memory` | boxes with address on the left, name beside it, value inside, arrows for pointers | `cells[{ id?, addr, name?, value, size?, tone?, ptr? }]` (`ptr` = the `id` or `addr` it points to) |
| `array` | 1-D or 2-D grid, indexes above, addresses inside (base + index × size, row- or column-major), named pointers | `data[][]`, `base`, `size`, `colMajor`, `index`, `rowIndex`, `tones{"r,c"}`, `pointers[{ name, at:[r,c] }]` |
| `linked` | singly, doubly and circular lists, `head` labels, NULL ground symbol, curved back links | `nodes[{ id, data, next, prev?, tone? }]` (`next: null` = NULL), `heads[]`, `doubly` |
| `tree` | binary and general trees; a lone left or right child leans the right way; edge labels, sub-labels (balance factors) | `root{ label, kids:[left,right] with null, tone?, edge?, sub? }` |
| `calltree` | the tree of recursive calls, the value returned on the way back, call numbers | same as `tree` plus `ret`, `order` |
| `heap` | a heap as a tree and as its array, same tones on both | `values[]`, `zeroBased`, `tones{index}` |
| `stackframe` | call-stack frames, newest on top, each with name / value rows | `frames[{ title, rows[{ name, value }], tone? }]` |
| `trace` | a dry-run table with the changed cells highlighted | `cols[]`, `rows[{ cells[], changed[], note?, tone? }]` |
| `bits` | rows of bits with optional place values, nibble grouping and highlighted bits | `rows[{ label, bits:"00000101", hl[], value?, tone? }]`, `weights`, `group` |
| `ring` | circular queue with `front` and `rear` markers | `n`, `items[]` (null = empty), `front`, `rear` |
| `hashtable` | slots, chains, tombstones, numbered probe order | `slots[{ key?, chain?, tombstone?, tone? }]`, `probes[]` |
| `frames` | **Back / Next / Play** player over any of the above, with arrow keys and a step counter | `frames[{ caption, fig }]` |

`tone` is one of `hl` (look here), `ok` (new or correct), `bad` (wrong or lost), `dim` (inactive).

## Rules for writers

1. One figure shows **one idea**. Anything that changes over time is `frames`, never one crowded picture.
2. Every figure has a **title** and a one-line `note` that says what to look at.
3. Put the figure **before** the rule it illustrates.
4. Every number in a figure comes from a program run or a hand check, like every other number in the book.

## Tested

Layout maths (addresses, ring counts, in-order tree placement, heap indexing, reference checks) by `npm run check:figures`; all 12 kinds rendered and screenshot-checked in light and dark, desktop (1280) and mobile (390), with no sideways page scroll and the frames player (Next, Back, disabled at the ends, arrow keys) clicked through.
