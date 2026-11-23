/**
 * Computer Organisation engines for input/output: the CPU cost of polling, interrupts and DMA, cycle stealing, daisy-chain arbitration and bus bandwidth.
 * Checked by scripts/io-hw-check.ts.
 */

/** Fraction of the CPU spent polling when the device must be polled `pollsPerSec` times a second, each poll costing `pollCycles` cycles. */
export const pollFractionRate = (pollsPerSec: number, pollCycles: number, clockHz: number) => (pollsPerSec * pollCycles) / clockHz;
/** Polling a device that delivers `rate` bytes a second in chunks of `chunk` bytes: it must be polled once per chunk. */
export const pollFraction = (rate: number, chunk: number, pollCycles: number, clockHz: number) => pollFractionRate(rate / chunk, pollCycles, clockHz);
/** Interrupt-driven I/O: one interrupt per chunk, costing `cycles` each, but only while the device is active (`busy`, 0 to 1). */
export const interruptFraction = (rate: number, chunk: number, cycles: number, clockHz: number, busy = 1) => ((rate / chunk) * cycles * busy) / clockHz;
/** DMA: the CPU only sets up each block transfer and takes one interrupt at its end. */
export const dmaFraction = (rate: number, block: number, setupCycles: number, completionCycles: number, clockHz: number, busy = 1) => ((rate / block) * (setupCycles + completionCycles) * busy) / clockHz;
/** Share of the memory cycles taken by a DMA device moving `rate` bytes a second one `word` at a time, with a memory cycle of `memCycleNs`. */
export const cycleStealFraction = (rate: number, word: number, memCycleNs: number) => ((rate / word) * memCycleNs) / 1e9;
/** Burst mode: the processor is locked out of memory for one whole block. */
export const burstBlockMicros = (blockWords: number, memCycleNs: number) => (blockWords * memCycleNs) / 1000;
/** Interrupts a second the device can raise before the handler alone uses the whole CPU. */
export const interruptCeiling = (clockHz: number, cyclesPerInterrupt: number) => clockHz / cyclesPerInterrupt;

/** Daisy chain: the grant signal enters at device 0 and is passed along; the first device that is requesting keeps it. Lower index = nearer the controller = higher priority. */
export function daisyChain(requests: boolean[]) {
  const path: number[] = [];
  for (let i = 0; i < requests.length; i++) { path.push(i); if (requests[i]) return { granted: i, path }; }
  return { granted: -1, path };
}
/** Polling arbitration with a rotating start: the counter starts just after the last winner, so no device is starved. */
export function rotatingPoll(requests: boolean[], lastWinner: number) {
  const n = requests.length;
  for (let k = 1; k <= n; k++) { const i = (lastWinner + k) % n; if (requests[i]) return i; }
  return -1;
}
/** Bytes a second a bus can move: `widthBits` wide, `clockMHz`, moving `words` words per transaction that also costs `overheadCycles` (for example one address cycle). */
export const busBandwidth = (widthBits: number, clockMHz: number, words = 1, overheadCycles = 0) => ((widthBits / 8) * words) / ((words + overheadCycles) / (clockMHz * 1e6));
