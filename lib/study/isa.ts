/**
 * Computer Organisation engines for the instruction-set labs (formats, addressing modes, stack code). Checked by scripts/isa-check.ts.
 */

/* ------------------------------------------------------------ instruction formats */
/** Expanding opcodes. `opBits` is the first-level opcode width, `addrBits` the width of one operand field. `counts[i]` is how many instructions
 * the designer wants at level i (level 0 has the most operand fields, each later level has one field fewer, freeing `addrBits` bits for opcode).
 * Returns whether the plan fits, and how many codes are still free after each level (the last entry is what is left for the final level). */
export function expandOpcode(opBits: number, addrBits: number, counts: number[]) {
  let free = 2 ** opBits; const left: number[] = []; let ok = true;
  for (const c of counts) {
    if (c > free) ok = false;
    free = Math.max(0, free - c) * 2 ** addrBits;
    left.push(free);
  }
  return { ok, left };
}
/** The largest value an n-bit immediate field can hold: signed two's complement or unsigned. */
export const immRange = (bits: number, signed: boolean) => (signed ? { min: -(2 ** (bits - 1)), max: 2 ** (bits - 1) - 1 } : { min: 0, max: 2 ** bits - 1 });
/** Bits left for an immediate after the fixed fields of a fixed-length instruction. */
export const immBits = (width: number, ...fields: number[]) => width - fields.reduce((a, b) => a + b, 0);
/** Bits needed to name n things (registers, opcodes). */
export const bitsFor = (n: number) => Math.ceil(Math.log2(n));

/* ------------------------------------------------------------ addressing modes */
export type AMode = "immediate" | "direct" | "indirect" | "register" | "regind" | "displacement" | "relative" | "autoinc" | "autodec";
export const MODE_NAMES: Record<AMode, string> = {
  immediate: "Immediate", direct: "Direct (absolute)", indirect: "Memory indirect", register: "Register", regind: "Register indirect",
  displacement: "Displacement (base or index)", relative: "PC-relative", autoinc: "Auto-increment", autodec: "Auto-decrement",
};
export type Mem = Record<number, number>;
/** Effective address, operand and number of operand memory references (the instruction fetch is not counted) for one addressing mode.
 * `a` is the address/constant field, `r` the register contents, `pc` the address of the NEXT instruction, `step` the operand size for auto-increment. */
export function effective(mode: AMode, a: number, r: number, pc: number, mem: Mem, step = 1) {
  const rd = (x: number) => mem[x] ?? 0;
  switch (mode) {
    case "immediate": return { ea: null as number | null, operand: a, refs: 0, newR: r };
    case "direct": return { ea: a, operand: rd(a), refs: 1, newR: r };
    case "indirect": { const p = rd(a); return { ea: p, operand: rd(p), refs: 2, newR: r }; }
    case "register": return { ea: null, operand: r, refs: 0, newR: r };
    case "regind": return { ea: r, operand: rd(r), refs: 1, newR: r };
    case "displacement": return { ea: a + r, operand: rd(a + r), refs: 1, newR: r };
    case "relative": return { ea: pc + a, operand: rd(pc + a), refs: 1, newR: r };
    case "autoinc": return { ea: r, operand: rd(r), refs: 1, newR: r + step };
    case "autodec": return { ea: r - step, operand: rd(r - step), refs: 1, newR: r - step };
  }
}
/** Branch target of a PC-relative branch: the PC already points at the next instruction; the offset is counted in instructions of `size` bytes. */
export const branchTarget = (nextPc: number, offset: number, size = 1) => nextPc + offset * size;
/** Reach of a PC-relative branch with a k-bit signed offset, in bytes from the next instruction. */
export const branchReach = (k: number, size: number) => ({ back: -(2 ** (k - 1)) * size, forward: (2 ** (k - 1) - 1) * size });

/* ------------------------------------------------------------ expressions and stack code */
const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };
/** Infix to postfix (shunting yard) for single-letter variables, numbers, + - * / and parentheses. Returns null if the expression is malformed. */
export function toPostfix(src: string): string[] | null {
  const toks = src.match(/[A-Za-z]\w*|\d+|[-+*/()]/g); if (!toks || toks.join("") !== src.replace(/\s+/g, "")) return null;
  const out: string[] = [], ops: string[] = [];
  for (const t of toks) {
    if (/^[A-Za-z0-9]/.test(t)) out.push(t);
    else if (t === "(") ops.push(t);
    else if (t === ")") { while (ops.length && ops[ops.length - 1] !== "(") out.push(ops.pop() as string); if (!ops.length) return null; ops.pop(); }
    else { while (ops.length && ops[ops.length - 1] !== "(" && PREC[ops[ops.length - 1]] >= PREC[t]) out.push(ops.pop() as string); ops.push(t); }
  }
  while (ops.length) { const o = ops.pop() as string; if (o === "(") return null; out.push(o); }
  return out;
}
export type StackStep = { token: string; action: string; stack: number[] };
/** Runs postfix code on a stack machine. Returns each step, the result, and the deepest the stack got. null if the code underflows or leaves more than one value. */
export function runPostfix(code: string[], vars: Record<string, number>) {
  const st: number[] = []; const steps: StackStep[] = []; let max = 0;
  for (const t of code) {
    if (PREC[t]) {
      if (st.length < 2) return null;
      const b = st.pop() as number, a = st.pop() as number;
      st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : a / b);
      steps.push({ token: t, action: t === "+" ? "ADD" : t === "-" ? "SUB" : t === "*" ? "MUL" : "DIV", stack: [...st] });
    } else {
      const v = /^\d+$/.test(t) ? Number(t) : vars[t] ?? 0;
      st.push(v); steps.push({ token: t, action: `PUSH ${t}`, stack: [...st] });
    }
    max = Math.max(max, st.length);
  }
  return st.length === 1 ? { steps, result: st[0], maxDepth: max } : null;
}
/** Instruction counts for X = expression on a machine with 3-address instructions (one per operator) and a stack machine (push per operand, one per operator, pop into X). */
export function codeCounts(code: string[]) {
  const ops = code.filter((t) => PREC[t]).length, operands = code.length - ops;
  return { threeAddress: ops, stack: operands + ops + 1 };
}
