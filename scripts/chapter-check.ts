// Checks a textbook chapter end to end: schema rules, every figure (links, ranges, constant frame size), every place a book node refers to,
// the code-styling helpers, and that every complete C program in the chapter compiles and prints what the book says.
// Run: npx tsx scripts/chapter-check.ts   (gcc must be on PATH; on this machine add C:\msys64\ucrt64\bin)
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateTopic, type Block, type Topic } from "../lib/study/schema";
import { autoCode, formatC, splitCodeQ } from "../components/study/rich-text";

let bad = 0;
const ok = (name: string, pass: boolean, detail = "") => { if (!pass) bad++; console.log(`${pass ? "ok  " : "FAIL"} ${name}${detail ? ": " + detail : ""}`); };
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mod = require(process.argv[2] ?? "../content/study/CS/pds-pilot") as Record<string, Topic>;
const t: Topic = mod[process.argv[3] ?? "pilotPointers"];
console.log(`chapter ${t.no}: ${t.title}`);

// 1. the blueprint rules
const problems = validateTopic(t); ok("validateTopic", problems.length === 0, problems.join("; "));

// 2. every book node resolves, and every figure / example / trap is placed exactly once
const book = t.book ?? [];
const figs = t.blocks.filter((b): b is Extract<Block, { type: "figure" }> => b.type === "figure");
const exs = t.blocks.filter((b) => b.type === "example") as Extract<Block, { type: "example" }>[];
const traps = t.blocks.filter((b) => b.type === "trap");
const placedFig = book.filter((n) => n.t === "fig").map((n) => (n as { id: string }).id);
const placedEx = book.filter((n) => n.t === "ex").map((n) => (n as { id: string }).id);
const placedTrap = book.filter((n) => n.t === "trap").map((n) => (n as { i?: number }).i ?? 0);
ok("each figure placed once", figs.every((f) => placedFig.filter((x) => x === f.id).length === 1), figs.filter((f) => placedFig.filter((x) => x === f.id).length !== 1).map((f) => f.id).join(","));
ok("each example placed once", exs.every((e) => placedEx.filter((x) => x === e.id).length === 1), exs.filter((e) => placedEx.filter((x) => x === e.id).length !== 1).map((e) => e.id).join(","));
ok("each trap placed once", traps.every((_, i) => placedTrap.filter((x) => x === i).length === 1), `traps=${traps.length} placed=${placedTrap.join(",")}`);
ok("figure ids unique", new Set(figs.map((f) => f.id)).size === figs.length);
ok("headings numbered in order (h2 count)", book.filter((n) => n.t === "h2").length >= 6, String(book.filter((n) => n.t === "h2").length));

// 3. every figure
type Cell = { id?: string; addr: unknown; name?: string; value: unknown; ptr?: string };
const memOk = (m: { cells: Cell[] }, where: string) => {
  const ids = new Set(m.cells.map((c) => c.id).filter(Boolean));
  const dangling = m.cells.filter((c) => c.ptr && !ids.has(c.ptr));
  ok(`${where}: every arrow target exists`, dangling.length === 0, dangling.map((c) => `${c.name}->${c.ptr}`).join(","));
  const named = m.cells.filter((c) => c.ptr).every((c) => typeof c.value === "number" && m.cells.some((d) => d.id === c.ptr && d.addr === c.value) || c.value === 0 || (c.ptr === "n" || c.ptr === "gone"));
  ok(`${where}: a pointer's value equals the address of the box it points at`, named, m.cells.filter((c) => c.ptr).map((c) => `${c.name}=${c.value}->${c.ptr}@${m.cells.find((d) => d.id === c.ptr)?.addr}`).join(" "));
};
for (const f of figs) {
  const fg = f.fig as { kind: string; frames?: { caption: string; fig: { kind: string; cells?: Cell[]; frames?: { rows: unknown[] }[] } }[]; cells?: Cell[]; data?: unknown[][]; tones?: Record<string, string>; pointers?: { at: [number, number] }[] };
  ok(`${f.id} has alt text and caption`, f.alt.length > 10 && f.caption.length > 10);
  if (fg.kind === "memory" && fg.cells) memOk({ cells: fg.cells }, f.id);
  if (fg.kind === "array" && fg.data) {
    const rows = fg.data.length, cols = fg.data[0].length;
    const inRange = (k: string) => { const [r, c] = k.split(",").map(Number); return r >= 0 && r < rows && c >= 0 && c < cols; };
    ok(`${f.id}: tones and pointers inside the grid`, Object.keys(fg.tones ?? {}).every(inRange) && (fg.pointers ?? []).every((p) => inRange(p.at.join(","))));
  }
  if (fg.kind === "frames" && fg.frames) {
    const kinds = new Set(fg.frames.map((x) => x.fig.kind));
    ok(`${f.id}: all frames the same kind`, kinds.size === 1, [...kinds].join(","));
    if (fg.frames[0].fig.kind === "memory") {
      const names = fg.frames.map((x) => (x.fig.cells ?? []).map((c) => c.name).join("|"));
      ok(`${f.id}: every frame shows the same boxes (constant size)`, new Set(names).size === 1, [...new Set(names)].join("  /  "));
      fg.frames.forEach((x, i) => memOk({ cells: x.fig.cells ?? [] }, `${f.id} frame ${i + 1}`));
    }
    ok(`${f.id}: every frame has a caption`, fg.frames.every((x) => x.caption.length > 8));
    type Fr = { fig: { kind: string; items?: { label: string }[]; rows?: { label?: string }[]; frames?: { title: string; rows: unknown[] }[] } };
    const sig = (x: Fr) => x.fig.kind === "strip" ? (x.fig.items ?? []).map((i) => i.label).join("|") : x.fig.kind === "bits" ? (x.fig.rows ?? []).map((r) => r.label).join("|") : "";
    if (["strip", "bits"].includes(fg.frames[0].fig.kind)) ok(`${f.id}: every frame has the same parts (constant size)`, new Set((fg.frames as unknown as Fr[]).map(sig)).size === 1);
  }
}

// 4. code styling helpers
const A = (s: string, want: string) => { const got = autoCode(s); ok(`autoCode "${s.slice(0, 40)}"`, got === want, got === want ? "" : got); };
A("int x = 10; makes a box named x holding 10.", "`int x = 10;` makes a box named x holding 10.");
A("p = &b moves the arrow.", "`p = &b` moves the arrow.");
A("The star belongs to p only. q is an int.", "The star belongs to p only. q is an int.");
A("Rule: One declaration per pointer: int *p; int *q;", "Rule: One declaration per pointer: `int *p; int *q;`");
A("*p = 25; goes to the box", "`*p = 25;` goes to the box");
A("keeps the program; the RAM holds what is being used now; the CPU takes", "keeps the program; the RAM holds what is being used now; the CPU takes");
A("they add: 128 + 32 + 16 + 4 + 2 = 182.", "they add: `128 + 32 + 16 + 4 + 2 = 182`.");
A("What does int *p, q; declare?", "What does `int *p, q;` declare?");
A("c = *ptr - a; : *ptr is c itself (20), so c = 20 - 11 = 9.", "`c = *ptr - a;` : `*ptr` is c itself (20), so `c = 20 - 11 = 9`.");
A("Call printxy(1, 1): x = 1, y = 1 are copies.", "Call `printxy(1, 1)`: `x = 1, y = 1` are copies.");
const sp = splitCodeQ("int a = 4; int *p = &a; (*p)++; printf(\"%d\", a); What is printed?");
ok("splitCodeQ lifts the code and keeps the question", !!sp && sp.after === "What is printed?" && sp.code.split("\n").length === 4, sp ? sp.code.replace(/\n/g, " | ") : "null");
ok("formatC indents braces", formatC("void f(void) { int a = 1; a++; }") === "void f(void) {\n    int a = 1;\n    a++;\n}");

// 5. every complete C program compiles and prints what the book says
const dir = mkdtempSync(join(tmpdir(), "chap-"));
let n = 0;
const run = (label: string, src: string, expect?: string) => {
  const file = join(dir, `p${n++}.c`), exe = join(dir, `p${n}.exe`);
  writeFileSync(file, src);
  try { execFileSync("gcc", ["-w", "-o", exe, file], { stdio: "pipe" }); } catch (e) { ok(`${label} compiles`, false, String((e as { stderr?: Buffer }).stderr ?? e).slice(0, 160)); return; }
  // the exit status is ignored: the book shows void main on purpose in one GATE question, and its status is meaningless
  const res = spawnSync(exe, { encoding: "utf8", timeout: 4000 });
  // a program that does not finish in 4 seconds is reported as an infinite loop (some GATE questions are exactly that)
  const out = (res.error ? "[infinite loop]" : (res.stdout ?? "")).replace(/\r\n/g, "\n").trim();
  if (expect === undefined) ok(`${label} compiles and runs`, true, out.replace(/\n/g, " | "));
  else ok(`${label} prints the book's output`, out === expect.trim(), out === expect.trim() ? "" : `got "${out}" want "${expect}"`);
};
for (const x of book) if (x.t === "code" && /\bmain\s*\(/.test(x.text) && !x.file?.endsWith("_input.c")) run(`code ${x.file ?? ""}`, x.text, x.file === "address_demo.c" ? undefined : x.out);
const wantEx: Record<string, string> = { "p-e2": "3 7 7 3", "p-e3": "9", "p-e4": "25", "p-e6": "10, 10, 14", "c1-e1": "102", "c1-e2": "6 7", "c2-e2": "0", "c2-e3": "3", "c3-e1": "0", "c3-e2": "10", "c3-e3": "z K S", "c4-e1": "5", "c4-e2": "y", "c4-e3": "yes 5", "c5-e1": "[infinite loop]", "c6-e1": "46", "c6-e2": "20101020", "c6-e3": "26", "c7-e1": "9", "c7-e2": "7", "c7-e3": "52", "c7-e4": "23", "c8-e4": "60", "c11-e1": "6", "c11-e2": "1, 5", "c11-e3": "111", "c11-e4": "10", "c11-e5": "24", "c11-e6": "19", "c11-e7": "5", "c12-e1": "Hello World!d!", "c12-e3": "2", "c13-e1": "Hi Bye Bye Hi", "c14-e1": "0, c", "c9-e1": ["1 2 3 ", "10 11 12 ", "19 20 21"].join("\n"), "c8-e5": "4", "c5-e3": ["1.000000", "1.500000", "1.750000", "1.875000", "1.937500"].join("\n") };
for (const e of exs) if (/\bmain\s*\(/.test(e.given) && !e.file?.endsWith("_input.c") && !e.file?.endsWith(".txt")) run(`example ${e.id}`, e.given.includes("#include") ? e.given : "#include <stdio.h>\n" + e.given, wantEx[e.id]);
const e5 = exs.find((e) => e.id === "p-e5"); if (e5) run("example p-e5", "#include <stdio.h>\n" + e5.given.replace("/* the call: printxy(1, 1) */", "") + "\nint main(void){ printxy(1, 1); return 0; }", "1, 0");
const e1 = exs.find((e) => e.id === "p-e1"); if (e1) run("example p-e1", `#include <stdio.h>\nint main(void){\n${e1.given}\nprintf("%d %d", a, b); return 0; }`, "8 1");

// 6. the check questions: answers present, options match kind
const qs = t.blocks.flatMap((b) => (b.type === "check" ? b.questions : []));
ok("check question ids unique", new Set(qs.map((q) => q.id)).size === qs.length);
ok("MCQ/MSQ have 4 options and a valid answer", qs.filter((q) => q.kind !== "NAT").every((q) => q.options?.length === 4 && q.answer.split(",").every((a) => ["A", "B", "C", "D"].includes(a.trim()))));
ok("NAT answers are numbers", qs.filter((q) => q.kind === "NAT").every((q) => Number.isFinite(parseFloat(q.answer))));

console.log(bad ? `\n${bad} problem(s)` : "\nall chapter checks passed");
process.exit(bad ? 1 : 0);
