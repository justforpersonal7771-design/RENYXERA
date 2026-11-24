// Compiles and runs every ```c block of a lesson (markdown) and compares it with the ```output block that follows it.
// Usage: node scripts/lesson-verify.mjs <lesson.md> [--gcc <path>]
// Block tags: ```c (checked), ```c-nocheck (shown only: undefined behaviour, machine-specific, or fragments), ```output (expected text).
// A first line `/* stdin: text */` inside a ```c block is fed to the program as input. Compiled with -std=c11 -Wall -Wextra.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const file = process.argv[2];
if (!file) { console.error("usage: node scripts/lesson-verify.mjs <lesson.md>"); process.exit(2); }
const gcc = process.argv.includes("--gcc") ? process.argv[process.argv.indexOf("--gcc") + 1] : "gcc";
const env = { ...process.env, PATH: "C:\\msys64\\ucrt64\\bin;" + process.env.PATH };
const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const blocks = [...text.matchAll(/```(c|c-nocheck|output)\n([\s\S]*?)```/g)].map((m) => ({ kind: m[1], body: m[2], at: text.slice(0, m.index).split("\n").length }));
const dir = mkdtempSync(join(tmpdir(), "lesson-"));
let n = 0, bad = 0, skipped = 0, warnings = 0;
for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  if (b.kind === "c-nocheck") { skipped++; continue; }
  if (b.kind !== "c") continue;
  const next = blocks[i + 1];
  const expected = next && next.kind === "output" ? next.body.replace(/\s+$/g, "") : null;
  const stdin = (b.body.match(/^\/\* stdin: (.*) \*\//) ?? [])[1] ?? "";
  const src = join(dir, `s${i}.c`), exe = join(dir, `s${i}.exe`);
  writeFileSync(src, b.body);
  const c = spawnSync(gcc, ["-std=c11", "-Wall", "-Wextra", "-o", exe, src], { env, encoding: "utf8" });
  n++;
  if (c.status !== 0) { bad++; console.log(`FAIL line ${b.at}: does not compile\n${c.stderr.split("\n").slice(0, 6).join("\n")}`); continue; }
  if (c.stderr.trim()) { warnings++; console.log(`warn line ${b.at}: ${c.stderr.split("\n")[0]}`); }
  const r = spawnSync(exe, [], { env, input: stdin.replace(/\\n/g, "\n") + "\n", encoding: "utf8", timeout: 5000 });
  const got = (r.stdout ?? "").replace(/\r\n/g, "\n").replace(/\s+$/g, "");
  if (expected === null) { console.log(`ok   line ${b.at}: compiled and ran (no output block to compare)`); continue; }
  if (got === expected) console.log(`ok   line ${b.at}: output matches`);
  else { bad++; console.log(`FAIL line ${b.at}: output differs\n  expected: ${JSON.stringify(expected)}\n  got:      ${JSON.stringify(got)}`); }
}
console.log(`\n${n} programs checked, ${skipped} shown-only, ${warnings} compiler warnings, ${bad} failed`);
process.exit(bad ? 1 : 0);
