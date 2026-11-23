// Verifies the Turing machine presets against brute force and prints the step counts quoted in content/study/CS/toc-e.ts. Run: npx tsx scripts/toc-tm-check.ts
import { TMS, runTM, inCfLang } from "../lib/study/toc";
let bad = 0;
const eq = (name: string, got: unknown, want: unknown) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(got)}${ok ? "" : ` (expected ${JSON.stringify(want)})`}`); };
const all = (alpha: string, n: number): string[] => { let out = [""]; let cur = [""]; for (let i = 0; i < n; i++) { cur = cur.flatMap((s) => [...alpha].map((c) => s + c)); out = out.concat(cur); } return out; };
let wrong = 0; for (const w of all("ab", 8)) if ((runTM(TMS.anbn, w).result === "accept") !== inCfLang("anbn", w)) wrong++; eq("anbn machine agrees with the language on all strings up to length 8", wrong, 0);
wrong = 0; for (const w of all("abc", 7)) if ((runTM(TMS.anbncn, w).result === "accept") !== inCfLang("anbncn", w)) wrong++; eq("anbncn machine agrees on all strings up to length 7", wrong, 0);
const inc = (s: string) => (parseInt(s, 2) + 1).toString(2); wrong = 0; for (const w of all("01", 8).filter((x) => x && x[0] === "1" || x === "")) { if (!w) continue; const r = runTM(TMS.inc, w); if (r.result !== "accept" || r.tape !== inc(w)) wrong++; } eq("increment machine correct for every binary string up to length 8", wrong, 0);
eq("increment 1011 -> 1100, steps", [runTM(TMS.inc, "1011").tape, runTM(TMS.inc, "1011").count], ["1100", runTM(TMS.inc, "1011").count]); console.log("   inc 1011 steps", runTM(TMS.inc, "1011").count, " inc 111 ->", runTM(TMS.inc, "111").tape, "steps", runTM(TMS.inc, "111").count);
for (const w of ["ab", "aabb", "aaabbb", "aab", "abb", ""]) console.log("   anbn", JSON.stringify(w), runTM(TMS.anbn, w).result, runTM(TMS.anbn, w).count);
for (const w of ["abc", "aabbcc", "aabbc", "abcabc"]) console.log("   anbncn", JSON.stringify(w), runTM(TMS.anbncn, w).result, runTM(TMS.anbncn, w).count);
process.exit(bad ? 1 : 0);
