/** Computer Networks depth engines (Kurose/Forouzan-level topics). Every number in cn-deep-*.ts comes from here, checked by script. */

/* ------------------------------------------------------------ performance */
export function perf(rateMbps: number, distKm: number, speedKmPerMs: number, pktBytes: number, pktPerSec: number) {
  const prop = distKm / speedKmPerMs; // ms
  const trans = (pktBytes * 8) / (rateMbps * 1000); // ms
  const rtt = 2 * prop; const bdpBits = rateMbps * 1e6 * (prop / 1000); const intensity = (pktPerSec * pktBytes * 8) / (rateMbps * 1e6);
  return { prop, trans, rtt, bdpBits, bdpBytes: bdpBits / 8, intensity };
}
export const bottleneck = (rates: number[]) => Math.min(...rates);

/* ------------------------------------------------------------ Hamming code (even parity, positions 1..n, parity at powers of 2) */
export function hammingEncode(data: string) {
  const d = data.split("").filter((c) => c === "0" || c === "1").map(Number); let r = 0; while (2 ** r < d.length + r + 1) r++;
  const n = d.length + r; const code = Array<number>(n + 1).fill(0); let k = 0;
  for (let i = 1; i <= n; i++) if ((i & (i - 1)) !== 0) code[i] = d[k++];
  const parity: { p: number; covers: number[]; value: number }[] = [];
  for (let j = 0; j < r; j++) { const p = 2 ** j; const covers = []; let x = 0; for (let i = 1; i <= n; i++) if (i & p && i !== p) { covers.push(i); x ^= code[i]; } code[p] = x; parity.push({ p, covers, value: x }); }
  return { r, n, code: code.slice(1).join(""), parity };
}
export function hammingCheck(word: string) {
  const c = [0, ...word.split("").filter((x) => x === "0" || x === "1").map(Number)]; const n = c.length - 1; let syn = 0;
  for (let p = 1; p <= n; p *= 2) { let x = 0; for (let i = 1; i <= n; i++) if (i & p) x ^= c[i]; if (x) syn += p; }
  const fixed = [...c]; if (syn && syn <= n) fixed[syn] ^= 1;
  return { syndrome: syn, fixed: fixed.slice(1).join("") };
}
export const parityBitsNeeded = (m: number) => { let r = 0; while (2 ** r < m + r + 1) r++; return r; };

/* ------------------------------------------------------------ learning bridge */
export function learnSwitch(frames: { src: string; dst: string; port: number }[], ports: number) {
  const table = new Map<string, number>(); const log: { f: string; action: string; out: number[] }[] = [];
  for (const f of frames) {
    table.set(f.src, f.port);
    const known = table.get(f.dst);
    const out = f.dst === "FF" || known === undefined ? Array.from({ length: ports }, (_, i) => i + 1).filter((p) => p !== f.port) : known === f.port ? [] : [known];
    log.push({ f: `${f.src}→${f.dst} on ${f.port}`, action: f.dst === "FF" ? "broadcast: flood" : known === undefined ? "unknown: flood" : known === f.port ? "same port: filter" : `forward to ${known}`, out });
  }
  return { table: [...table].map(([mac, port]) => ({ mac, port })), log };
}
export const minFrameBits = (rateMbps: number, rttUs: number) => rateMbps * rttUs; // bits = R × 2τ

/* ------------------------------------------------------------ 802.11 CSMA/CA timing */
export function csmaca(rateMbps: number, payloadB: number, difsUs: number, sifsUs: number, slotUs: number, backoffSlots: number, ackB: number, rts: boolean) {
  const t = (b: number) => (b * 8) / rateMbps; // µs
  const data = t(payloadB), ack = t(ackB), rtsT = rts ? t(20) : 0, cts = rts ? t(14) : 0;
  const total = difsUs + backoffSlots * slotUs + (rts ? rtsT + sifsUs + cts + sifsUs : 0) + data + sifsUs + ack;
  return { data, ack, total, efficiency: data / total, throughputMbps: (payloadB * 8) / total };
}

/* ------------------------------------------------------------ NAT */
export function nat(pub: string, flows: { ip: string; port: number; dst: string }[], startPort = 5001) {
  const map = new Map<string, number>(); let next = startPort; const rows: { inside: string; outside: string; dst: string }[] = [];
  for (const f of flows) { const k = `${f.ip}:${f.port}`; if (!map.has(k)) map.set(k, next++); rows.push({ inside: k, outside: `${pub}:${map.get(k)}`, dst: f.dst }); }
  return { rows, entries: map.size };
}

/* ------------------------------------------------------------ IPv6 */
export function v6Expand(a: string) {
  const s = a.trim().toLowerCase(); if (!/^[0-9a-f:]+$/.test(s) || (s.match(/::/g) ?? []).length > 1) return null;
  const [l, r] = s.includes("::") ? s.split("::") : [s, null];
  const L = l ? l.split(":") : [], Rr = r ? r.split(":") : []; const fill = r === null ? 0 : 8 - L.length - Rr.length; if (fill < 0 || (r === null && L.length !== 8)) return null;
  const groups = [...L, ...Array(fill).fill("0"), ...Rr]; if (groups.length !== 8 || groups.some((g) => g.length > 4 || g.length === 0)) return null;
  return groups.map((g) => g.padStart(4, "0")).join(":");
}
export function v6Compress(full: string) {
  const g = full.split(":").map((x) => x.replace(/^0+(?=.)/, ""));
  let best = -1, bl = 0; for (let i = 0; i < 8; i++) { if (g[i] !== "0") continue; let j = i; while (j < 8 && g[j] === "0") j++; if (j - i > bl && j - i >= 2) { best = i; bl = j - i; } i = j; }
  if (best < 0) return g.join(":");
  const left = g.slice(0, best).join(":"), right = g.slice(best + bl).join(":"); return `${left}::${right}`;
}

/* ------------------------------------------------------------ classful and supernetting */
export function classOf(ip: string) {
  const o = ip.split(".").map(Number); if (o.length !== 4 || o.some((x) => !(x >= 0 && x <= 255))) return null; const a = o[0];
  const cls = a < 128 ? "A" : a < 192 ? "B" : a < 224 ? "C" : a < 240 ? "D" : "E";
  const prefix = cls === "A" ? 8 : cls === "B" ? 16 : cls === "C" ? 24 : null;
  return { cls, prefix, hosts: prefix ? 2 ** (32 - prefix) - 2 : 0, network: prefix ? o.map((x, i) => (i < prefix / 8 ? x : 0)).join(".") : "—" };
}
export function supernet(nets: string[]) {
  const nums = nets.map((n) => n.split(".").map(Number).reduce((a, b) => a * 256 + b, 0));
  if (nums.some((x) => Number.isNaN(x))) return null;
  const lo = Math.min(...nums), hi = Math.max(...nums) + 255; let p = 24;
  while (p > 0) { const size = 2 ** (32 - p); if (Math.floor(lo / size) === Math.floor(hi / size)) break; p--; }
  const size = 2 ** (32 - p); const base = Math.floor(lo / size) * size;
  const covers = size / 256; const exact = covers === nets.length && base === lo && new Set(nums).size === nets.length;
  const ip = [24, 16, 8, 0].map((s) => (base >>> s) & 255).join(".");
  return { prefix: p, base: ip, covers, exact };
}

/* ------------------------------------------------------------ flow control */
export function rwnd(bufB: number, lastRcvd: number, lastRead: number, rttMs: number) {
  const win = bufB - (lastRcvd - lastRead); return { win, maxMbps: (win * 8) / (rttMs * 1000) };
}
export const windowNeeded = (rateMbps: number, rttMs: number) => (rateMbps * 1e6 * rttMs) / 1000 / 8; // bytes
export const scaleShift = (bytes: number) => { let s = 0; while (65535 * 2 ** s < bytes) s++; return s; };

/* ------------------------------------------------------------ RTO estimation */
export function rto(samples: number[], est0: number, dev0: number, alpha = 0.125, beta = 0.25) {
  let est = est0, dev = dev0; const rows: { sample: number; est: number; dev: number; rto: number }[] = [];
  for (const s of samples) { dev = (1 - beta) * dev + beta * Math.abs(s - est); est = (1 - alpha) * est + alpha * s; rows.push({ sample: s, est, dev, rto: est + 4 * dev }); }
  return rows;
}

/* ------------------------------------------------------------ Internet checksum */
export function checksum(words: string[]) {
  let sum = 0; const steps: string[] = [];
  for (const w of words) { const v = parseInt(w, 16); if (Number.isNaN(v)) continue; sum += v; let wrap = false; if (sum > 0xffff) { sum = (sum & 0xffff) + 1; wrap = true; } steps.push(`+ ${w.toUpperCase().padStart(4, "0")} = ${sum.toString(16).toUpperCase().padStart(4, "0")}${wrap ? " (carry wrapped)" : ""}`); }
  const cs = ~sum & 0xffff; return { sum: sum.toString(16).toUpperCase().padStart(4, "0"), checksum: cs.toString(16).toUpperCase().padStart(4, "0"), steps };
}

/* ------------------------------------------------------------ DNS */
export function dnsMessages(mode: "iterative" | "recursive", cachedTld: boolean) {
  // host ↔ local resolver (2), then root, TLD, authoritative (2 each) unless the TLD is cached (skip root)
  const servers = cachedTld ? ["TLD", "authoritative"] : ["root", "TLD", "authoritative"];
  const msgs = 2 + 2 * servers.length;
  const path = mode === "iterative" ? ["host → local", ...servers.flatMap((s) => [`local → ${s}`, `${s} → local`]), "local → host"]
    : ["host → local", ...(cachedTld ? ["local → TLD", "TLD → authoritative", "authoritative → TLD", "TLD → local"] : ["local → root", "root → TLD", "TLD → authoritative", "authoritative → TLD", "TLD → root", "root → local"]), "local → host"];
  return { msgs, path, servers };
}

/* ------------------------------------------------------------ MIME base64 */
export function base64Info(text: string) {
  const bytes = new TextEncoder().encode(text); let bin = ""; bytes.forEach((b) => (bin += String.fromCharCode(b)));
  const enc = typeof btoa === "function" ? btoa(bin) : Buffer.from(bytes).toString("base64");
  return { bytes: bytes.length, encoded: enc, encLen: 4 * Math.ceil(bytes.length / 3), pad: (3 - (bytes.length % 3)) % 3 };
}

/* ------------------------------------------------------------ web caching (Kurose's institutional cache) */
export function webCache(hit: number, reqPerSec: number, objKb: number, accessMbps: number, internetS: number, lanS: number) {
  const traffic = (reqPerSec * (1 - hit) * objKb * 1000) / (accessMbps * 1e6); // utilisation of access link (objKb in kilobits)
  const accessDelay = traffic < 1 ? (objKb * 1000) / (accessMbps * 1e6) / (1 - traffic) : Infinity;
  const avg = hit * lanS + (1 - hit) * (internetS + accessDelay);
  return { util: traffic, accessDelay, avg };
}
export function httpTime(objects: number, rttMs: number, mode: "nonpersistent" | "persistent" | "pipelined", parallel = 1) {
  if (mode === "nonpersistent") { const rounds = Math.ceil(objects / parallel); return 2 * rttMs + rounds * 2 * rttMs; }
  if (mode === "persistent") return 2 * rttMs + objects * rttMs;
  return 2 * rttMs + rttMs;
}
