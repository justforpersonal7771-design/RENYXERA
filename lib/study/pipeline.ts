/**
 * Computer Organisation engines for the pipelining labs: timing, speed-up, and an instruction-by-instruction schedule of a 5-stage in-order pipeline
 * (IF, ID, EX, MEM, WB) with or without forwarding. Checked by scripts/pipeline-check.ts.
 */

/* ------------------------------------------------------------ timing and speed-up */
/** Cycles to run n instructions through a k-stage pipeline with no stalls: the first takes k, each later one adds 1. */
export const pipelineCycles = (n: number, k: number) => k + n - 1;
/** Speed-up over a machine that runs each instruction in k cycles of the same length: n·k / (k + n − 1). Tends to k as n grows. */
export const cycleSpeedup = (n: number, k: number) => (n * k) / pipelineCycles(n, k);
/** Share of the pipeline's slots doing useful work, n / (k + n − 1). */
export const efficiency = (n: number, k: number) => n / pipelineCycles(n, k);
/** Real stage delays: the clock must fit the slowest stage plus the latch between stages. */
export function pipeTimes(stages: number[], latch: number, n: number) {
  const k = stages.length, total = stages.reduce((a, b) => a + b, 0), clock = Math.max(...stages) + latch;
  const nonPipe = n * total, pipe = pipelineCycles(n, k) * clock;
  return { k, total, clock, nonPipe, pipe, speedup: nonPipe / pipe, ideal: total / clock, latency: k * clock };
}

/* ------------------------------------------------------------ the instruction schedule */
export type Instr = { text: string; op: string; dst: string | null; srcs: string[]; load: boolean; branch: boolean; taken: boolean };
const ALU = ["ADD", "SUB", "AND", "OR", "XOR", "SLT", "MUL", "ADDI", "SLL", "SRL"];
/** One line such as "ADD R1,R2,R3", "LW R1,0(R2)", "SW R1,0(R2)" or "BEQ R1,R2 taken". Returns null if it is not understood. */
export function parseInstr(line: string): Instr | null {
  const text = line.trim().replace(/\s+/g, " "); if (!text) return null;
  const op = text.split(" ")[0].toUpperCase(); const regs = (text.match(/\bR\d{1,2}\b/gi) ?? []).map((r) => r.toUpperCase());
  const taken = /\btaken\b/i.test(text);
  if (op === "LW") return regs.length >= 2 ? { text, op, dst: regs[0], srcs: [regs[1]], load: true, branch: false, taken: false } : null;
  if (op === "SW") return regs.length >= 2 ? { text, op, dst: null, srcs: regs, load: false, branch: false, taken: false } : null;
  if (op === "BEQ" || op === "BNE") return regs.length >= 1 ? { text, op, dst: null, srcs: regs, load: false, branch: true, taken } : null;
  if (ALU.includes(op)) return regs.length >= 2 ? { text, op, dst: regs[0], srcs: regs.slice(1), load: false, branch: false, taken: false } : null;
  return null;
}
export type Row = { text: string; IF: number; ID: number; EX: number; MEM: number; WB: number; stalls: number; flush: number };
/**
 * Schedules instructions in order. An instruction leaves IF when the one before it leaves ID. In ID it waits until its operands can be had:
 * without forwarding, until the producer has written the register (the same cycle is fine: the register file writes in the first half and reads in the second);
 * with forwarding, an ALU result is ready for the next instruction's EX, and a load result one cycle later, so only a load followed at once by its user stalls (1 cycle).
 * A taken branch costs `branchPenalty` cycles before the next instruction can be fetched (predict not taken).
 */
export function schedule(list: Instr[], opts: { forwarding: boolean; branchPenalty: number }) {
  const rows: Row[] = []; const last: Record<string, { id: number; load: boolean }> = {};
  list.forEach((ins, i) => {
    const prev = rows[i - 1]; const extra = i > 0 && list[i - 1].branch && list[i - 1].taken ? opts.branchPenalty : 0;
    const iF = i === 0 ? 1 : prev.ID + extra;
    let ready = iF + 1;
    for (const s of ins.srcs) { const w = last[s]; if (!w) continue; ready = Math.max(ready, opts.forwarding ? w.id + (w.load ? 2 : 1) : w.id + 3); }
    const id = Math.max(iF + 1, ready);
    rows.push({ text: ins.text, IF: iF, ID: id, EX: id + 1, MEM: id + 2, WB: id + 3, stalls: id - iF - 1, flush: extra });
    if (ins.dst) last[ins.dst] = { id, load: ins.load };
  });
  const cycles = rows.length ? rows[rows.length - 1].WB : 0;
  return { rows, cycles, stalls: rows.reduce((a, r) => a + r.stalls, 0), flush: rows.reduce((a, r) => a + r.flush, 0) };
}

/* ------------------------------------------------------------ CPI with hazards */
/** CPI of a pipeline that otherwise completes one instruction a cycle: 1 + the stall cycles per instruction. */
export const cpiWith = (...stallsPerInstr: number[]) => 1 + stallsPerInstr.reduce((a, b) => a + b, 0);
/** Stall cycles per instruction from branches: fraction of branches × share that cost the penalty × penalty. */
export const branchStalls = (branchFreq: number, costFraction: number, penalty: number) => branchFreq * costFraction * penalty;
/** Stall cycles per instruction from load-use hazards with forwarding. */
export const loadUseStalls = (loadFreq: number, dependentFraction: number, stall = 1) => loadFreq * dependentFraction * stall;
/** Speed-up of a k-stage pipeline with the given CPI over a machine taking k cycles per instruction at the same clock. */
export const pipelineSpeedup = (k: number, cpi: number) => k / cpi;
