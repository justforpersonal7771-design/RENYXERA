/** Operating Systems depth engines (Galvin-level topics). Every number in os-deep.ts comes from here, checked by script. */

/* ------------------------------------------------------------ schedulers, multiprogramming, context switches */
/** CPU utilisation with n processes each waiting for I/O a fraction p of the time: 1 − pⁿ. */
export const cpuUtil = (n: number, p: number) => 1 - p ** n;
/** Round robin efficiency with quantum q and switch cost s: useful fraction q / (q + s). */
export const rrEfficiency = (q: number, s: number) => q / (q + s);

/* ------------------------------------------------------------ zombies and orphans */
export type PEv = { kind: "fork"; parent: string; child: string } | { kind: "exit"; who: string } | { kind: "wait"; who: string };
export function procTree(evs: PEv[]) {
  const parent = new Map<string, string>([["init", ""], ["P", "init"]]); const state = new Map<string, "running" | "zombie" | "gone">([["init", "running"], ["P", "running"]]);
  const log: string[] = [];
  for (const e of evs) {
    if (e.kind === "fork") { parent.set(e.child, e.parent); state.set(e.child, "running"); log.push(`${e.parent} forks ${e.child}`); }
    else if (e.kind === "exit") {
      state.set(e.who, "zombie"); log.push(`${e.who} exits → zombie until its parent waits`);
      for (const [c, p] of parent) if (p === e.who && state.get(c) !== "gone") { parent.set(c, "init"); log.push(`${c} orphaned → adopted by init`); if (state.get(c) === "zombie") { state.set(c, "gone"); log.push(`init reaps ${c}`); } }
      if (parent.get(e.who) === "init") { state.set(e.who, "gone"); log.push(`init reaps ${e.who}`); }
    } else {
      const z = [...parent].find(([c, p]) => p === e.who && state.get(c) === "zombie");
      if (z) { state.set(z[0], "gone"); log.push(`${e.who} waits → reaps ${z[0]}`); } else log.push(`${e.who} waits → blocks (no exited child)`);
    }
  }
  const rows = [...state].filter(([n]) => n !== "init").map(([n, s]) => ({ name: n, state: s, parent: parent.get(n) ?? "" }));
  return { rows, log, zombies: rows.filter((r) => r.state === "zombie").map((r) => r.name), orphans: rows.filter((r) => r.parent === "init" && r.name !== "P" && r.state !== "gone").map((r) => r.name) };
}

/* ------------------------------------------------------------ real-time: RM and EDF */
export type RTask = { c: number; t: number };
export const rmBound = (n: number) => n * (2 ** (1 / n) - 1);
export function rtSim(tasks: RTask[], alg: "RM" | "EDF") {
  const H = tasks.reduce((a, t) => lcm(a, t.t), 1); const horizon = Math.min(H, 200);
  const rem = tasks.map(() => 0), dl = tasks.map(() => 0); const tl: number[] = []; let miss: { task: number; at: number } | null = null;
  for (let time = 0; time < horizon; time++) {
    tasks.forEach((tk, i) => { if (time % tk.t === 0) { if (rem[i] > 0 && !miss) miss = { task: i, at: time }; rem[i] = tk.c; dl[i] = time + tk.t; } });
    const ready = tasks.map((_, i) => i).filter((i) => rem[i] > 0);
    const pick = ready.length ? ready.reduce((a, b) => (alg === "RM" ? (tasks[b].t < tasks[a].t ? b : a) : (dl[b] < dl[a] ? b : a))) : -1;
    tl.push(pick); if (pick >= 0) rem[pick]--;
  }
  if (!miss) tasks.forEach((_, i) => { if (rem[i] > 0 && !miss) miss = { task: i, at: horizon }; });
  const U = tasks.reduce((a, t) => a + t.c / t.t, 0);
  return { U, bound: rmBound(tasks.length), hyper: H, timeline: tl, miss: miss as { task: number; at: number } | null };
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/* ------------------------------------------------------------ semaphore traces */
export function pvTrace(init: number, ops: string[]) {
  let s = init; const queue: string[] = []; const log: { op: string; s: number; note: string }[] = [];
  for (const op of ops) {
    const m = /^([PV])\((\w+)\)$/i.exec(op.trim()); if (!m) continue; const who = m[2];
    if (m[1].toUpperCase() === "P") { s--; if (s < 0) { queue.push(who); log.push({ op, s, note: `${who} blocks (${queue.length} waiting)` }); } else log.push({ op, s, note: `${who} proceeds` }); }
    else { s++; if (s <= 0 && queue.length) { const w = queue.shift(); log.push({ op, s, note: `${who} wakes ${w}` }); } else log.push({ op, s, note: `${who} signals` }); }
  }
  return { final: s, waiting: [...queue], log };
}

/* ------------------------------------------------------------ monitor bounded buffer */
export function monitorBuffer(n: number, ops: ("P" | "C")[]) {
  let count = 0; const waitP: number[] = [], waitC: number[] = []; const log: string[] = [];
  ops.forEach((o, i) => {
    const id = i + 1;
    if (o === "P") {
      if (count === n) { waitP.push(id); log.push(`producer ${id} waits on notFull`); return; }
      count++; log.push(`producer ${id} adds item (count ${count})`);
      if (waitC.length) { const c = waitC.shift()!; count--; log.push(`signal notEmpty: consumer ${c} resumes and takes it (count ${count})`); }
    } else {
      if (count === 0) { waitC.push(id); log.push(`consumer ${id} waits on notEmpty`); return; }
      count--; log.push(`consumer ${id} removes item (count ${count})`);
      if (waitP.length) { const p = waitP.shift()!; count++; log.push(`signal notFull: producer ${p} resumes and adds (count ${count})`); }
    }
  });
  return { count, waitP, waitC, log };
}

/* ------------------------------------------------------------ readers–writers */
export function readersWriters(evs: string[], pref: "reader" | "writer") {
  const inR = new Set<string>(); let inW: string | null = null; const q: string[] = []; const log: string[] = [];
  const canEnter = (x: string) => (x[0] === "R" ? !inW && (pref === "reader" || !q.some((y) => y[0] === "W")) : !inW && inR.size === 0);
  const admit = () => { let moved = true; while (moved) { moved = false; for (let i = 0; i < q.length; i++) { const x = q[i]; const blockedByWriterAhead = pref === "writer" && x[0] === "R" && q.slice(0, i).some((y) => y[0] === "W"); if (!blockedByWriterAhead && (x[0] === "R" ? !inW : !inW && inR.size === 0)) { q.splice(i, 1); if (x[0] === "R") inR.add(x); else inW = x; log.push(`${x} enters`); moved = true; break; } if (x[0] === "W") break; } } };
  for (const e of evs) {
    const m = /^([+-])([RW]\d+)$/.exec(e.trim()); if (!m) continue; const x = m[2];
    if (m[1] === "+") { if (canEnter(x) && !q.length) { if (x[0] === "R") inR.add(x); else inW = x; log.push(`${x} enters`); } else if (pref === "reader" && x[0] === "R" && !inW) { inR.add(x); log.push(`${x} enters (readers have priority)`); } else { q.push(x); log.push(`${x} waits`); } }
    else { if (x[0] === "R") inR.delete(x); else if (inW === x) inW = null; log.push(`${x} leaves`); admit(); }
  }
  return { readers: [...inR], writer: inW as string | null, waiting: [...q], log };
}

/* ------------------------------------------------------------ dining philosophers */
export type DineStrat = "naive" | "asym" | "limit" | "both";
/** Everyone becomes hungry at once and grabs a first chopstick in order 0..n−1. */
export function dine(n: number, s: DineStrat) {
  const held = Array<number>(n).fill(-1); const seated = s === "limit" ? n - 1 : n; const first: number[] = [];
  for (let p = 0; p < seated; p++) {
    const L = p, R = (p + 1) % n; const f = s === "asym" && p % 2 === 1 ? R : s === "both" ? -1 : L;
    if (s === "both") { if (held[L] < 0 && held[R] < 0) { held[L] = p; held[R] = p; first.push(p); } continue; }
    if (held[f] < 0) held[f] = p;
  }
  if (s !== "both") for (let p = 0; p < seated; p++) { const L = p, R = (p + 1) % n; const f = s === "asym" && p % 2 === 1 ? R : L; const g = f === L ? R : L; if (held[f] === p && held[g] < 0) { held[g] = p; first.push(p); } }
  const deadlock = first.length === 0;
  return { eating: first, deadlock, maxTogether: Math.floor(n / 2) };
}

/* ------------------------------------------------------------ page-table size */
export function pageTable(vaBits: number, pageB: number, pteB: number, paBits: number) {
  const off = Math.log2(pageB); const vpnBits = vaBits - off; const entries = 2 ** vpnBits; const single = entries * pteB;
  const perPage = pageB / pteB; const bitsPerLevel = Math.log2(perPage); const levels = Math.ceil(vpnBits / bitsPerLevel);
  const frames = 2 ** (paBits - off); const inverted = frames * pteB;
  return { off, vpnBits, entries, single, perPage, bitsPerLevel, levels, frames, inverted };
}

/* ------------------------------------------------------------ buddy allocation */
export function buddy(total: number, reqs: string[]) {
  type Blk = { off: number; size: number; owner: string | null; asked: number };
  let blocks: Blk[] = [{ off: 0, size: total, owner: null, asked: 0 }]; const log: string[] = [];
  for (const r of reqs) {
    const a = /^([A-Z])(\d+)$/i.exec(r.trim()), f = /^-([A-Z])$/i.exec(r.trim());
    if (a) {
      const name = a[1].toUpperCase(), want = Number(a[2]); let size = 1; while (size < want) size *= 2;
      let b = blocks.filter((x) => !x.owner && x.size >= size).sort((x, y) => x.size - y.size || x.off - y.off)[0];
      if (!b) { log.push(`${name}${want}: no block`); continue; }
      while (b.size > size) { const half = b.size / 2; const i = blocks.indexOf(b); const l = { off: b.off, size: half, owner: null, asked: 0 }, rr = { off: b.off + half, size: half, owner: null, asked: 0 }; blocks.splice(i, 1, l, rr); log.push(`split ${b.size} at ${b.off}`); b = l; }
      b.owner = name; b.asked = want; log.push(`${name} gets ${size} at ${b.off} (asked ${want})`);
    } else if (f) {
      const name = f[1].toUpperCase(); const b = blocks.find((x) => x.owner === name); if (!b) continue; b.owner = null; b.asked = 0; log.push(`free ${name}`);
      let merged = true;
      while (merged) { merged = false; blocks.sort((x, y) => x.off - y.off); for (let i = 0; i + 1 < blocks.length; i++) { const x = blocks[i], y = blocks[i + 1]; if (!x.owner && !y.owner && x.size === y.size && x.off % (2 * x.size) === 0) { blocks.splice(i, 2, { off: x.off, size: 2 * x.size, owner: null, asked: 0 }); log.push(`merge buddies → ${2 * x.size} at ${x.off}`); merged = true; break; } } }
    }
  }
  blocks = blocks.sort((x, y) => x.off - y.off);
  const internal = blocks.reduce((s, b) => s + (b.owner ? b.size - b.asked : 0), 0);
  return { blocks, internal, log };
}

/* ------------------------------------------------------------ clock (second chance) */
export function clockAlg(refs: number[], frames: number) {
  const f: { p: number; r: number }[] = []; let hand = 0, faults = 0; const log: { ref: number; hit: boolean; frames: string }[] = [];
  for (const p of refs) {
    const hit = f.find((x) => x.p === p);
    if (hit) hit.r = 1;
    else {
      faults++;
      if (f.length < frames) f.push({ p, r: 1 });
      else { while (f[hand].r) { f[hand].r = 0; hand = (hand + 1) % frames; } f[hand] = { p, r: 1 }; hand = (hand + 1) % frames; }
    }
    log.push({ ref: p, hit: !!hit, frames: f.map((x) => `${x.p}${x.r ? "*" : ""}`).join(" ") });
  }
  return { faults, log };
}
export function fifoFaults(refs: number[], frames: number) { const q: number[] = []; let n = 0; for (const p of refs) if (!q.includes(p)) { n++; q.push(p); if (q.length > frames) q.shift(); } return n; }
export function lruFaults(refs: number[], frames: number) { const q: number[] = []; let n = 0; for (const p of refs) { const i = q.indexOf(p); if (i >= 0) q.splice(i, 1); else { n++; if (q.length === frames) q.shift(); } q.push(p); } return n; }

/* ------------------------------------------------------------ copy-on-write */
export function cow(pages: number, writes: string[]) {
  const shared = new Set(Array.from({ length: pages }, (_, i) => i)); let copies = 0; const log: string[] = [];
  for (const w of writes) { const m = /^([PC])(\d+)$/i.exec(w.trim()); if (!m) continue; const pg = Number(m[2]); if (pg >= pages) continue; const who = m[1].toUpperCase() === "P" ? "parent" : "child";
    if (shared.has(pg)) { shared.delete(pg); copies++; log.push(`${who} writes page ${pg}: fault, copy made`); } else log.push(`${who} writes page ${pg}: already private`); }
  return { copies, frames: pages + copies, eagerFrames: 2 * pages, shared: shared.size, log };
}

/* ------------------------------------------------------------ hard and soft links */
export function links(ops: string[]) {
  const inodes = new Map<number, number>(); const names = new Map<string, { inode?: number; target?: string }>(); let next = 1; const log: string[] = [];
  for (const op of ops) {
    const [cmd, a, b] = op.trim().split(/\s+/);
    if (cmd === "create" && a) { inodes.set(next, 1); names.set(a, { inode: next }); log.push(`create ${a} → inode ${next} (links 1)`); next++; }
    else if (cmd === "ln" && a && b) { const t = names.get(a); if (t?.inode) { inodes.set(t.inode, inodes.get(t.inode)! + 1); names.set(b, { inode: t.inode }); log.push(`hard link ${b} → inode ${t.inode} (links ${inodes.get(t.inode)})`); } }
    else if (cmd === "ln-s" && a && b) { names.set(b, { target: a }); log.push(`symlink ${b} → "${a}"`); }
    else if (cmd === "rm" && a) { const t = names.get(a); names.delete(a); if (t?.inode) { const c = inodes.get(t.inode)! - 1; inodes.set(t.inode, c); log.push(c ? `rm ${a}: inode ${t.inode} links ${c}` : `rm ${a}: links 0, inode ${t.inode} freed`); if (!c) inodes.delete(t.inode); } else log.push(`rm ${a}: symlink removed`); }
  }
  const rows = [...names].map(([n, v]) => { if (v.inode) return { name: n, kind: "file", detail: `inode ${v.inode}, links ${inodes.get(v.inode)}` }; const tgt = names.get(v.target!); const ok = !!tgt && (tgt.inode !== undefined || tgt.target !== undefined); return { name: n, kind: "symlink", detail: ok ? `→ ${v.target}` : `→ ${v.target} (dangling)` }; });
  return { rows, log, inodes: inodes.size };
}

/* ------------------------------------------------------------ free-space management */
export function freeSpace(diskBytes: number, blockBytes: number, ptrBytes: number, freeBlocks: number) {
  const blocks = diskBytes / blockBytes; const bitmapBytes = blocks / 8; const bitmapBlocks = Math.ceil(bitmapBytes / blockBytes);
  const perBlock = blockBytes / ptrBytes; const groupingBlocks = Math.ceil(freeBlocks / (perBlock - 1));
  const listBytes = freeBlocks * ptrBytes;
  return { blocks, bitmapBytes, bitmapBlocks, perBlock, groupingBlocks, listBytes };
}
export function firstFree(bitmap: string) { const i = bitmap.indexOf("1"); return i; }

/* ------------------------------------------------------------ disk access time */
export function diskTime(rpm: number, seekMs: number, sectorsPerTrack: number, bytesPerSector: number, readBytes: number) {
  const rev = 60000 / rpm; const rot = rev / 2; const trackBytes = sectorsPerTrack * bytesPerSector; const rate = trackBytes / rev; // bytes per ms
  const transfer = readBytes / rate; const total = seekMs + rot + transfer;
  return { rev, rot, trackBytes, rateMBs: (rate * 1000) / 1e6, transfer, total };
}

/* ------------------------------------------------------------ RAID */
export type Raid = 0 | 1 | 5 | 6 | 10;
export function raid(level: Raid, n: number, size: number) {
  const ok = level === 0 ? n >= 2 : level === 1 ? n >= 2 : level === 5 ? n >= 3 : level === 6 ? n >= 4 : n >= 4 && n % 2 === 0;
  const usable = level === 0 ? n * size : level === 1 ? size : level === 5 ? (n - 1) * size : level === 6 ? (n - 2) * size : (n / 2) * size;
  const tolerates = level === 0 ? 0 : level === 1 ? n - 1 : level === 5 ? 1 : level === 6 ? 2 : 1;
  const smallWrite = level === 0 ? "1 write" : level === 1 ? `${n} writes` : level === 5 ? "4 I/Os (read data + parity, write both)" : level === 6 ? "6 I/Os" : "2 writes";
  return { ok, usable, tolerates, smallWrite, efficiency: usable / (n * size) };
}

/* ------------------------------------------------------------ I/O: polling, interrupts, DMA */
export function ioCost(cpuMHz: number, rateKBs: number, unitBytes: number, pollCycles: number, irqCycles: number, dmaBlockKB: number, dmaSetupCycles: number) {
  const cps = cpuMHz * 1e6; const units = (rateKBs * 1000) / unitBytes;
  const poll = (units * pollCycles) / cps, irq = (units * irqCycles) / cps, dma = (((rateKBs / dmaBlockKB) * dmaSetupCycles) / cps);
  return { units, poll, irq, dma };
}
