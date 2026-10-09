// "GATE question of the day" for the RENYXERA Telegram channel (free Bot API), run by a scheduled
// GitHub Action. One official PYQ per IST day, rotating through the live branches (CS, EC, EE,
// ME, DA), posted with its options, maths shown as readable text, the figure sent as a photo,
// the official answer to YESTERDAY's question, a countdown and the join links.
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL (e.g. @renyxera); PREGEN_SECRET enables the
// "yesterday's answer" line (fetched from /api/daily/answer).
// Usage: node scripts/telegram-daily.mjs [--dry-run] [--day=<IST day number>]
import { readFileSync } from "node:fs";

const SITE = (process.env.SITE_URL || "https://gate.renyxera.workers.dev").replace(/\/$/, "");
const DRY = process.argv.includes("--dry-run");
const dayArg = process.argv.find((a) => a.startsWith("--day="));
const SHIFT = { FN: "Forenoon", AN: "Afternoon", S1: "Set 1", S2: "Set 2" };
const EXAM_START = Date.UTC(2027, 1, 6) / 86400_000;
const NEW_SCHEME_FROM = Date.UTC(2026, 9, 11) / 86400_000; // first day posted with this script
const BRANCHES = {
  CS: { file: "public/data/questions.json", img: "/images" },
  EC: { file: "public/data/ECE/questions.json", img: "/images/ECE" },
  EE: { file: "public/data/EE/questions.json", img: "/images/EE" },
  ME: { file: "public/data/ME/questions.json", img: "/images/ME" },
  DA: { file: "public/data/DA/questions.json", img: "/images/DA" },
};
// Sun..Sat. CS appears three times a week (largest bank), the others once or twice.
const WEEK = ["CS", "EC", "EE", "CS", "ME", "DA", "CS"];

const pools = {};
for (const [code, b] of Object.entries(BRANCHES)) {
  const data = JSON.parse(readFileSync(new URL(`../${b.file}`, import.meta.url), "utf8"));
  const pool = [];
  for (const p of data.papers ?? data) {
    const ys = p.exam_metadata?.["year-shift"] ?? "";
    const [year, shift = ""] = ys.split("-");
    if (!year) continue;
    for (const q of p.questions) pool.push({ ...q, code, ys, year, shift, slug: `gate-${code.toLowerCase()}-${ys.toLowerCase()}` });
  }
  pool.sort((a, b2) => a.question_id.localeCompare(b2.question_id));
  let seed = 20270206 + code.charCodeAt(0);
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  pools[code] = pool;
}

const branchOn = (day) => WEEK[(day + 4) % 7]; // IST day 0 (1 Jan 1970) was a Thursday
function pickFor(day) {
  const code = branchOn(day);
  let used = 0;
  for (let d = NEW_SCHEME_FROM; d < day; d++) if (branchOn(d) === code) used++;
  const pool = pools[code];
  return pool[used % pool.length];
}

const istDay = dayArg ? Number(dayArg.split("=")[1]) : Math.floor((Date.now() + 5.5 * 3600_000) / 86400_000);
const q = pickFor(istDay);

// ── LaTeX → readable text (Telegram has no maths rendering) ─────────────────
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻", n: "ⁿ", i: "ⁱ", x: "ˣ", T: "ᵀ" };
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", "+": "₊", "-": "₋", n: "ₙ", i: "ᵢ", x: "ₓ", j: "ⱼ", k: "ₖ", m: "ₘ" };
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const SYM = { Theta: "Θ", Gamma: "Γ", Lambda: "Λ", Pi: "Π", Phi: "Φ", Psi: "Ψ", psi: "ψ", xi: "ξ", zeta: "ζ", kappa: "κ", nu: "ν", chi: "χ", varepsilon: "ε", varphi: "φ", ell: "ℓ", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", times: "×", cdot: "·", pm: "±", pi: "π", theta: "θ", alpha: "α", beta: "β", gamma: "γ", delta: "δ", Delta: "Δ", lambda: "λ", mu: "μ", sigma: "σ", Sigma: "Σ", omega: "ω", Omega: "Ω", phi: "φ", epsilon: "ε", rho: "ρ", tau: "τ", eta: "η", infty: "∞", to: "→", rightarrow: "→", Rightarrow: "⇒", leftrightarrow: "↔", approx: "≈", in: "∈", subset: "⊂", subseteq: "⊆", cup: "∪", cap: "∩", forall: "∀", exists: "∃", neg: "¬", land: "∧", lor: "∨", oplus: "⊕", sum: "Σ", int: "∫", partial: "∂", nabla: "∇", ldots: "…", cdots: "…", dots: "…", oint: "∮", iint: "∬", iiint: "∭", langle: "⟨", rangle: "⟩", lceil: "⌈", rceil: "⌉", lfloor: "⌊", rfloor: "⌋", equiv: "≡", propto: "∝", sim: "∼", ll: "≪", gg: "≫", emptyset: "∅", setminus: "∖", notin: "∉", supset: "⊃", wedge: "∧", vee: "∨", otimes: "⊗", star: "★", prime: "′", ldotp: ".", dot: "·", bullet: "•", sqrt: "√", mathcal: "", boldsymbol: "", displaystyle: "", textstyle: "", limits: "", nolimits: "", mathrm: "", operatorname: "", degree: "°", circ: "°", angle: "∠", perp: "⊥", mid: "|", log: "log", ln: "ln", sin: "sin", cos: "cos", tan: "tan", lim: "lim", max: "max", min: "min", det: "det", exp: "exp", Pr: "Pr", mod: "mod", bmod: "mod" };
const script = (s, map, mark) => { const t = s.replace(/[{}]/g, ""); return [...t].every((c) => map[c]) ? [...t].map((c) => map[c]).join("") : `${mark}(${t})`; };
const CODES = []; // fenced code blocks, shown as <pre> in the message
const html = (s) => esc(s).replace(/(\d+)/g, (_, i) => `<pre>${esc(CODES[Number(i)])}</pre>`);
function toPlain(raw) {
  let s = String(raw ?? "").replace(/```[A-Za-z+#]*\n?([\s\S]*?)```/g, (_, c) => { CODES.push(c.replace(/\s+$/, "")); return `${CODES.length - 1}`; }).replace(/`([^`\n]+)`/g, "$1").replace(/\[IMAGE_Q_\w+\]/g, " ").replace(/\\n(?![A-Za-z])/g, "\n").replace(/\\\{/g, "").replace(/\\\}/g, "");
  if (/\\begin\{(array|tabular|matrix|pmatrix|bmatrix|cases)/.test(s) || /\|\s*---/.test(s)) return null;
  s = s.replace(/\\\(|\\\)|\\\[|\\\]|\$\$|\$/g, "");
  for (let i = 0; i < 4; i++) {
    s = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, (_, a, b) => (/^[\w.]+$/.test(a) && /^[\w.]+$/.test(b) ? `${a}/${b}` : `(${a})/(${b})`));
    s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, (_, a) => `√(${a})`);
    s = s.replace(/\\(?:text|mathrm|mathbf|mathit|boldsymbol|operatorname|mathbb|vec|hat|bar|overline)\s*\{([^{}]*)\}/g, "$1");
  }
  s = s.replace(/\^\s*\{([^{}]*)\}/g, (_, a) => script(a, SUP, "^")).replace(/\^\s*([0-9a-zA-Z])/g, (_, a) => script(a, SUP, "^"));
  s = s.replace(/_\s*\{([^{}]*)\}/g, (_, a) => script(a, SUB, "_")).replace(/_\s*([0-9a-zA-Z])/g, (_, a) => script(a, SUB, "_"));
  s = s.replace(/\\left|\\right|\\!|\\,|\\;|\\:|\\quad|\\qquad/g, " ").replace(/\\\\/g, "\n").replace(/\\ /g, " ");
  s = s.replace(/\\([A-Za-z]+)/g, (m, c) => (SYM[c] !== undefined ? SYM[c] : m));
  if (/\\[A-Za-z]|[{}]/.test(s)) return null;
  s = s.replace(//g, "{").replace(//g, "}");
  return s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

const label = (x) => `GATE ${x.code} ${x.year}${x.shift ? ` (${SHIFT[x.shift] ?? x.shift})` : ""} · Q${x.question_no}`;
const link = (x, content) => `${SITE}/pyq/${x.slug}/q${x.question_no}?utm_source=telegram&utm_medium=social&utm_campaign=daily_question&utm_content=${content}`;

const stem = toPlain(q.question_text);
const opts = (q.options ?? []).map((o) => ({ id: o.option_id, text: toPlain(o.text), img: /\[IMAGE_Q_/.test(o.text) }));
const optsReadable = opts.every((o) => o.img || o.text !== null);
const figure = q.has_image ? (q.images_required ?? []).map((p) => `${p.replace(/^IMAGE_Q_/, "")}.png`).find((f) => /_1\.png$/.test(f)) ?? null : null;
const photoUrl = figure ? `${SITE}${BRANCHES[q.code].img}/${q.ys}/${figure}` : null;
const stemShown = stem && stem.length + CODES.reduce((n, c) => n + c.length, 0) <= 1500 ?stem.replace(/\n?\s*\[IMAGE_Q_[^\]]*\]\s*/g, "\n") : null;

const body = [];
if (stemShown) body.push(html(stemShown));
else body.push(`<i>Open the link to read this question properly.</i>`);
if (stemShown && opts.length) {
  if (optsReadable && opts.some((o) => !o.img)) body.push(opts.map((o) => `${o.id}) ${o.img ? "(see figure)" : html(o.text)}`).join("\n"));
  else body.push(`<i>Options are in the figure.</i>`);
}
const daysLeft = Math.max(0, Math.ceil(EXAM_START - istDay));

let prev = null;
async function yesterdayLine() {
  const day = istDay - 1;
  if (day < NEW_SCHEME_FROM || !process.env.PREGEN_SECRET) return "";
  const y = pickFor(day);
  try {
    const r = await fetch(`${SITE}/api/daily/answer`, { method: "POST", headers: { "Content-Type": "application/json", "x-pregen-secret": process.env.PREGEN_SECRET }, body: JSON.stringify({ ids: [y.question_id] }) });
    const a = (await r.json())?.answers?.[y.question_id];
    if (!a) return "";
    const fmt = (n) => String(n);
    const ans = a.ranges?.length ? a.ranges.map(([lo, hi]) => (lo === hi ? fmt(lo) : `${fmt(lo)} to ${fmt(hi)}`)).join(" or ") : a.nat ? (a.nat[0] === a.nat[1] ? fmt(a.nat[0]) : `${fmt(a.nat[0])} to ${fmt(a.nat[1])}`) : a.options.length ? a.options.join(", ") : "";
    if (!ans) return "";
    prev = y;
    return `✅ <b>Yesterday's answer</b> · ${esc(label(y))}: <b>${esc(ans)}</b> (<a href="${link(y, "answer")}">see it solved</a>)`;
  } catch { return ""; }
}

const prevLine = await yesterdayLine();
const header = [
  `<b>🧠 GATE ${q.code} question of the day</b> · ${daysLeft} days to GATE 2027`,
  ``,
  `<b>${esc(label(q))}</b>`,
  `${esc(q.subject)} → ${esc(q.topic)}`,
  `${esc(q.question_type)} · ${esc(q.marks)} mark${Number(q.marks) > 1 ? "s" : ""}${q.question_type === "MCQ" ? ` · −${Number(q.marks) === 2 ? "2/3" : "1/3"} if wrong` : ""}`,
].join("\n");
const footer = [
  `👉 <a href="${link(q, "solve")}">Solve it in the exam interface and check the official answer</a>`,
  prevLine,
  `💬 Discuss: t.me/renyxera_chat`,
].filter(Boolean).join("\n\n");
const text = [header, body.join("\n\n"), footer].join("\n\n");

if (DRY) { console.log(`${photoUrl ? `[photo: ${photoUrl}]\n` : ""}${text}\n\n[branch ${q.code}, ${q.question_id}${prev ? `, yesterday ${prev.question_id}` : ""}]`); process.exit(0); }
const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHANNEL;
if (!token || !chat) { console.log("TELEGRAM_BOT_TOKEN / TELEGRAM_CHANNEL not set — skipping (dry run below)\n\n" + text); process.exit(0); }
const api = (m, payload) => fetch(`https://api.telegram.org/bot${token}/${m}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, ...payload }) }).then((r) => r.json());

if (photoUrl) {
  // Photo first (Telegram captions are capped at 1024 characters), then the full text under it.
  const sent = await api("sendPhoto", { photo: photoUrl, caption: `<b>${esc(label(q))}</b> · figure`, parse_mode: "HTML" });
  if (!sent.ok) console.warn("sendPhoto failed, posting text only:", sent.description);
}
const j = await api("sendMessage", { text, parse_mode: "HTML", link_preview_options: { is_disabled: true } });
if (!j.ok) { console.error("Telegram error:", j.description); process.exit(1); }
console.log(`Posted ${q.question_id} to ${chat}`);
