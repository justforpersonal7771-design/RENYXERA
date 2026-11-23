// Verifies the instruction-set engines and prints the numbers quoted in content/study/CS/coa-b.ts. Run: npx tsx scripts/isa-check.ts
import { bitsFor, branchReach, branchTarget, codeCounts, effective, expandOpcode, immBits, immRange, runPostfix, toPostfix, type Mem } from "../lib/study/isa";
let bad = 0;
const eq = (name: string, got: unknown, want: unknown) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(got)}${ok ? "" : ` (expected ${JSON.stringify(want)})`}`); };
// expanding opcode: 16-bit instruction, 4-bit operand fields, 4-bit first opcode
eq("14 three-address leaves 2 codes -> 32 two-address slots", expandOpcode(4, 4, [14]).left, [32]);
eq("14 three, 30 two leaves 2 -> 32 one-address slots", expandOpcode(4, 4, [14, 30]).left, [32, 32]);
eq("14 three, 30 two, 31 one -> 16 zero-address left", expandOpcode(4, 4, [14, 30, 31]).left, [32, 32, 16]);
eq("15 three-address, 15 two... plan fits", expandOpcode(4, 4, [15, 16]).ok, true);
eq("15 three-address then 17 two-address does not fit (only 16 codes)", expandOpcode(4, 4, [15, 17]).ok, false);
eq("12-bit instruction, 3-bit fields, 3-bit opcode: 4 two-address... 6 of 8 used", expandOpcode(3, 3, [6]).left, [16]);
// immediate fields
eq("32-bit instruction, 8-bit opcode, two 6-bit registers: immediate bits", immBits(32, 8, 6, 6), 12);
eq("12-bit signed immediate range", immRange(12, true), { min: -2048, max: 2047 });
eq("12-bit unsigned immediate range", immRange(12, false), { min: 0, max: 4095 });
eq("64 registers need 6 bits; 100 opcodes need 7 bits", [bitsFor(64), bitsFor(100)], [6, 7]);
eq("MIPS R-type: 6+5+5+5+5+6", 6 + 5 + 5 + 5 + 5 + 6, 32);
eq("MIPS I-type immediate: 32-6-5-5", immBits(32, 6, 5, 5), 16);
// addressing modes
const mem: Mem = { 100: 500, 500: 700, 600: 900, 4100: 33, 499: 55 };
const m = (mode: Parameters<typeof effective>[0]) => { const e = effective(mode, 100, 500, 4000, mem); return [e.ea, e.operand, e.refs, e.newR]; };
eq("immediate A=100", m("immediate"), [null, 100, 0, 500]);
eq("direct A=100", m("direct"), [100, 500, 1, 500]);
eq("indirect A=100", m("indirect"), [500, 700, 2, 500]);
eq("register R=500", m("register"), [null, 500, 0, 500]);
eq("register indirect R=500", m("regind"), [500, 700, 1, 500]);
eq("displacement A+R", m("displacement"), [600, 900, 1, 500]);
eq("relative PC=4000, A=100", m("relative"), [4100, 33, 1, 500]);
eq("auto-increment (word 1)", m("autoinc"), [500, 700, 1, 501]);
eq("auto-decrement (word 1)", m("autodec"), [499, 55, 1, 499]);
eq("branch target: next PC 2000, offset -5, 4-byte instructions", branchTarget(2000, -5, 4), 1980);
eq("8-bit offset, 4-byte instructions: reach in bytes", branchReach(8, 4), { back: -512, forward: 508 });
// expressions
const pf = toPostfix("(A+B)*(C+D)"); eq("postfix of (A+B)*(C+D)", pf, ["A", "B", "+", "C", "D", "+", "*"]);
const r = runPostfix(pf as string[], { A: 2, B: 3, C: 4, D: 5 }); eq("value and deepest stack", [r?.result, r?.maxDepth], [45, 3]);
eq("counts for (A+B)*(C+D): 3-address, stack", codeCounts(pf as string[]), { threeAddress: 3, stack: 8 });
eq("postfix of A+B*C-D", toPostfix("A+B*C-D"), ["A", "B", "C", "*", "+", "D", "-"]);
const r2 = runPostfix(toPostfix("A+B*C-D") as string[], { A: 1, B: 2, C: 3, D: 4 }); eq("A+B*C-D with 1,2,3,4", [r2?.result, r2?.maxDepth], [3, 3]);
eq("a - b - c is left associative", toPostfix("A-B-C"), ["A", "B", "-", "C", "-"]);
eq("malformed (A+B", toPostfix("(A+B"), null);
// recursion stack: factorial frames of 12 bytes, factorial(5) makes 6 calls
eq("stack bytes for factorial(5), 12-byte frames, 6 live calls", 6 * 12, 72);
process.exit(bad ? 1 : 0);
