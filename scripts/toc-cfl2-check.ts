// Re-computes every number quoted in content/study/CS/toc-d.ts. Run: npx tsx scripts/toc-cfl2-check.ts
import { cfSplits, inCfLang, pumpCf } from "../lib/study/toc";
let bad = 0;
const eq = (name: string, got: unknown, want: unknown) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(got)}${ok ? "" : ` (expected ${JSON.stringify(want)})`}`); };
eq("a^3 b^3 c^3 in L", inCfLang("anbncn", "aaabbbccc"), true);
const A = cfSplits("anbncn", "aaabbbccc", 3); eq("a^p b^p c^p (p=3): splits allowed / that survive every pump", [A.total, A.survive], [A.total, 0]); console.log("   total splits", A.total);
const W = cfSplits("ww", "aaabbbaaabbb", 3); eq("ww with a^p b^p a^p b^p (p=3): survivors", W.survive, 0); console.log("   total splits", W.total);
const B = cfSplits("anbn", "aaabbb", 3); eq("a^n b^n (CFL): some split survives", B.survive > 0, true); console.log("   total", B.total, "survive", B.survive);
const S = cfSplits("square", "a".repeat(9), 3); eq("a^(n^2), w = a^9, p = 3: survivors", S.survive, 0); console.log("   total", S.total);
const g = pumpCf("anbncn", "aaabbbccc", 2, 1, 0, 1); eq("a^3b^3c^3, v=a (pos 3), x=b: pumps i=0..3 lengths", g.tries.map((t) => t.s.length), [7, 9, 11, 13]);
eq("those pumped strings in the language?", g.tries.map((t) => t.ok), [false, true, false, false]);
const q = pumpCf("anbn", "aaabbb", 2, 1, 0, 1); eq("a^3b^3, v=a, x=b pumped i=0..3 all in L", q.tries.every((t) => t.ok), true);
eq("ijk: a b b c c c in L (1<2<3)", inCfLang("ijk", "abbccc"), true); eq("ijk: pump up a b b c c c with v=a: a a b b c c c (2<2 false)", inCfLang("ijk", "aabbccc"), false);
eq("ww: abab in L, aba not", [inCfLang("ww", "abab"), inCfLang("ww", "aba")], [true, false]);
process.exit(bad ? 1 : 0);
