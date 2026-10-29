// Forge generator (local, $0): plan -> Gemini draft -> blind re-solve -> compute -> TeX render -> dedupe -> option checks.
//   node --env-file=.env.local scripts/forge/generate.mjs --branch=CS --n=10 --batch=b001
// Writes data/forge/<BR>/batches/<batch>.json and runs scripts/forge/validate.py on it (writes the report seed.mjs needs).
// Every rejected draft is logged to data/forge/<BR>/rejects/<batch>.jsonl with the reason, so quality problems are visible.
// Free-tier friendly: sequential calls, backoff on 429/503, stops cleanly when the daily quota is gone.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { GoogleGenAI } from "@google/genai";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { SVG } from "mathjax-full/js/output/svg.js";

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? "").split("=")[1] ?? d;
const BR = arg("branch", "CS"), N = +arg("n", "10"), BATCH = arg("batch", "b001"), MODEL = arg("model", "gemini-3.5-flash");
const MAX_TRIES = +arg("tries", "4");
const dir = `data/forge/${BR}`;
const profile = JSON.parse(readFileSync(`${dir}/profile.json`, "utf8"));
if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing (use --env-file=.env.local)");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- helpers ----------
const words = (t) => new Set((t.toLowerCase().match(/[a-z]{3,}/g) ?? []));
const nums = (t) => new Set((t.match(/\d+(?:\.\d+)?/g) ?? []));
const jac = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; return i / Math.max(1, a.size + b.size - i); };
const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
const mj = mathjax.document("", { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: "none" }) });
function texErrors(text) {
  const out = [];
  const parts = [...text.matchAll(/\\\((.+?)\\\)|\\\[(.+?)\\\]|\$\$(.+?)\$\$/gs)];
  for (const m of parts) {
    const tex = m[1] ?? m[2] ?? m[3];
    try { const html = adaptor.outerHTML(mj.convert(tex, { display: false })); if (/data-mjx-error|merror/.test(html)) out.push(tex.slice(0, 50)); } catch (e) { out.push(tex.slice(0, 50)); }
  }
  if ((text.match(/\\\(/g) ?? []).length !== (text.match(/\\\)/g) ?? []).length) out.push("unbalanced \\( \\)");
  return out;
}
function runVerify(code) {
  const py = "import sys,json;sys.path.insert(0,'scripts/forge');import validate;print(json.dumps(validate.run_verify(sys.stdin.read())))";
  const r = spawnSync("python", ["-c", py], { input: code, encoding: "utf8", timeout: 15000 });
  if (r.status !== 0) throw new Error((r.stderr || "verify failed").trim().split("\n").pop());
  return JSON.parse(r.stdout.trim().split("\n").pop());
}
async function gemini(prompt, temperature) {
  // OpenRouter first when configured (OPENROUTER_API_KEY + OPENROUTER_MODEL_SMART); Gemini free tier is the fallback.
  if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_MODEL_SMART) {
    for (let a = 0; a < 3; a++) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST", headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: process.env.OPENROUTER_MODEL_SMART, temperature, response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] }),
        });
        if (res.ok) { const j = await res.json(); return JSON.parse(j.choices[0].message.content); }
        if (res.status === 402) break;
        await sleep(4000 * (a + 1));
      } catch { await sleep(2000); }
    }
  }
  for (let a = 0; a < 6; a++) {
    try {
      const res = await ai.models.generateContent({ model: MODEL, contents: prompt, config: { responseMimeType: "application/json", temperature } });
      return JSON.parse(res.text);
    } catch (e) {
      const m = String(e?.message ?? e);
      if (/RESOURCE_EXHAUSTED|quota|429/i.test(m) && /per day|daily|PerDay/i.test(m)) { const err = new Error("DAILY_QUOTA"); err.quota = true; throw err; }
      if (/429|503|500|524|overloaded|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(m)) { await sleep(8000 * (a + 1)); continue; }
      if (e instanceof SyntaxError) { await sleep(1500); continue; }
      throw e;
    }
  }
  throw new Error("gemini: too many retries");
}

// ---------- existing corpus (dedupe) ----------
const prior = [];
for (const f of existsSync(`${dir}/batches`) ? readdirSync(`${dir}/batches`) : []) {
  if (f === `${BATCH}.json`) continue;
  for (const it of JSON.parse(readFileSync(`${dir}/batches/${f}`, "utf8")).items) prior.push({ id: it.id, w: words(it.question_text), n: nums(it.question_text) });
}
let nextId = Math.max(0, ...prior.map((p) => +p.id.split("_").pop())) + 1;
const batchFile = `${dir}/batches/${BATCH}.json`;
const items = existsSync(batchFile) ? JSON.parse(readFileSync(batchFile, "utf8")).items : [];
for (const it of items) { prior.push({ id: it.id, w: words(it.question_text), n: nums(it.question_text) }); nextId = Math.max(nextId, +it.id.split("_").pop() + 1); }

// ---------- slot planning ----------
const KINDS = ["multi_concept", "numeric_chain", "conceptual", "trap_aware", "trace", "application", "data_interpretation", "msq_discriminator"];
const usedTopics = {}; for (const it of items) usedTopics[it.topic] = (usedTopics[it.topic] ?? 0) + 1;
function pickSlot(i) {
  const pool = profile.topics.map((t) => ({ t, w: (t.weight ?? 1) / (1 + (usedTopics[t.topic] ?? 0) * 2) }));
  let r = Math.random() * pool.reduce((s, x) => s + x.w, 0), pick = pool[0].t;
  for (const x of pool) { r -= x.w; if (r <= 0) { pick = x.t; break; } }
  const ty = pick.types ?? { MCQ: 1 }; const tot = Object.values(ty).reduce((a, b) => a + b, 0); let q = Math.random() * tot, type = "MCQ";
  for (const [k, v] of Object.entries(ty)) { q -= v; if (q <= 0) { type = k; break; } }
  const kind = type === "MSQ" ? "msq_discriminator" : KINDS[(i + Math.floor(Math.random() * 3)) % KINDS.length];
  return { subject: pick.subject, topic: pick.topic, type, kind, difficulty: Math.random() < 0.2 ? "M" : "H", marks: Math.random() < 0.55 ? 2 : 1 };
}

const SCHEMA = `Return ONE JSON object:
{"question_text": string, "options": [{"option_id":"A","text":string},{"option_id":"B",...},{"option_id":"C",...},{"option_id":"D",...}]  (empty array for NAT),
 "answer": {"options": ["B"]} for MCQ (exactly one) / MSQ (one or more), or {"range":[lo,hi]} for NAT,
 "solution": {"given": string, "find": string, "steps": [string,...], "shortcut": string, "trap": string},
 "verify": {"lang":"python","code": string}}
Rules:
- Math in TeX using \\( ... \\) delimiters. Use normal JSON escaping: a TeX backslash is written as two backslash characters in the JSON text, no more. Code snippets in questions go in plain text with newlines.
- verify.code is Python using only math, itertools, fractions (math, itertools and fractions are preloaded: do NOT write import lines; only basic builtins like range, sum, min, max, abs, round, len, int, float, list, sorted are available); it must set a variable named answer: for NAT a number; for MCQ/MSQ the list or value of correct option ids. It must COMPUTE the result from the question's given numbers, not hardcode it.
- NAT range follows GATE: a single value (lo=hi) for integers, otherwise a tight tolerance (e.g. 2 decimals).
- No figures or images: put any data in text, small tables written as lines, or code.
- Exactly one correct option for MCQ. Distractors come from real misconceptions. Do not use "all of the above", "none of the above" or "both A and B".
- Original wording and numbers; never copy a past GATE question.`;

function draftPrompt(s) {
  return `You write original GATE ${profile.branch === "CS" ? "Computer Science and Information Technology" : profile.branch} exam questions at the difficulty of the real paper.
Write ONE ${s.type} question, ${s.marks} mark(s), difficulty ${s.difficulty === "H" ? "hard (top 10% of GATE)" : "typical GATE"}, kind "${s.kind}".
Subject: ${s.subject}. Topic: ${s.topic}. It must combine at least two concepts or several dependent steps, and be solvable without a calculator-heavy grind.
${SCHEMA}`;
}
const blindPrompt = (d) => `Solve this GATE question carefully, from scratch, step by step in your head, then answer. Return JSON {"answer": ...} where answer is an array of option ids (e.g. ["B"]) for MCQ/MSQ, or a number for NAT.
Question (${d.type}): ${d.question_text}
${d.options?.length ? d.options.map((o) => `${o.option_id}. ${o.text}`).join("\n") : ""}`;

// The model sometimes double-escapes TeX (\\( instead of \( after JSON parsing); halve doubled backslashes when that happens.
function fixSlashes(v) {
  if (typeof v === "string") return v.includes("\\\\(") || v.includes("\\\\begin") || v.includes("\\\\frac") ? v.split("\\\\").join("\\") : v;
  if (Array.isArray(v)) return v.map(fixSlashes);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "code" ? x : fixSlashes(x)]));
  return v;
}
const stripImports = (c) => c.split(String.fromCharCode(10)).filter((l) => !/^\s*(import|from)\s/.test(l)).join(String.fromCharCode(10));
function check(d, s, others) {
  const why = [];
  if (!d?.question_text || !d.solution?.steps?.length || !d.verify?.code || !d.answer) return ["missing fields"];
  const opts = d.options ?? [];
  if (s.type === "NAT") { if (opts.length) why.push("NAT must have no options"); const r = d.answer.range; if (!(Array.isArray(r) && r.length === 2 && r[0] <= r[1])) why.push("bad NAT range"); }
  else {
    if (opts.map((o) => o.option_id).join("") !== "ABCD") why.push("options must be A-D");
    const k = d.answer.options ?? []; if (s.type === "MCQ" && k.length !== 1) why.push("MCQ needs one key"); if (s.type === "MSQ" && !k.length) why.push("MSQ needs a key");
    const ws = opts.map((o) => words(o.text)); const ts = opts.map((o) => o.text.trim().toLowerCase());
    if (new Set(ts).size !== ts.length) why.push("duplicate options");
    for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) if (ws[i].size > 2 && jac(ws[i], ws[j]) > 0.9 && JSON.stringify([...nums(opts[i].text)]) === JSON.stringify([...nums(opts[j].text)])) why.push("near-identical options");
    if (opts.some((o) => /all of the above|none of the above|both a and b/i.test(o.text))) why.push("banned option wording");
    if (s.type === "MSQ" && (d.answer.options.length === 4 || d.answer.options.length === 0)) why.push("MSQ answer too obvious");
    if (s.type === "MCQ") { const lens = opts.map((o) => o.text.length); const kl = lens["ABCD".indexOf(d.answer.options[0])]; if (kl === Math.max(...lens) && kl > 1.8 * (lens.reduce((a, b) => a + b, 0) / 4)) why.push("key is conspicuously the longest option"); }
  }
  const all = [d.question_text, ...opts.map((o) => o.text), JSON.stringify(d.solution)].join("\n");
  const te = texErrors(all); if (te.length) why.push("TeX: " + te.join(" | "));
  const w = words(d.question_text), n = nums(d.question_text);
  for (const p of others) { if (jac(w, p.w) > 0.5 || (n.size >= 3 && jac(n, p.n) > 0.8 && jac(w, p.w) > 0.3)) { why.push(`too close to ${p.id}`); break; } }
  return why;
}
const closeNum = (a, b, lo, hi) => { const pad = Math.max(Math.abs(b) * 0.005, 0.01); return a >= lo - pad && a <= hi + pad; };

// ---------- main loop ----------
mkdirSync(`${dir}/rejects`, { recursive: true });
const rejFile = `${dir}/rejects/${BATCH}.jsonl`;
const reject = (s, d, why) => { appendFileSync(rejFile, JSON.stringify({ slot: s, why, draft: d }) + "\n"); console.log("  x", why.join("; ").slice(0, 120)); };
const save = () => writeFileSync(batchFile, JSON.stringify({ branch: BR, batch: BATCH, note: `Generated by scripts/forge/generate.mjs (${MODEL}); verified: blind re-solve, computed answer, TeX render, dedupe, option checks.`, items }, null, 1));
let made = 0, attempts = 0;
while (made < N && attempts < N * MAX_TRIES) {
  attempts++;
  const s = pickSlot(items.length + made);
  console.log(`[${made + 1}/${N}] ${s.type} ${s.marks}m ${s.kind} :: ${s.topic.slice(0, 60)}`);
  try {
    let d = await gemini(draftPrompt(s), 0.9); d = fixSlashes(d); if (d?.verify?.code) d.verify.code = stripImports(d.verify.code);
    const why = check(d, s, prior);
    if (why.length) { reject(s, d, why); continue; }
    let computed; try { computed = runVerify(d.verify.code); } catch (e) { reject(s, d, ["verify: " + e.message]); continue; }
    if (s.type === "NAT") { const [lo, hi] = d.answer.range; if (!closeNum(+computed, +computed, lo, hi)) { reject(s, d, [`computed ${computed} outside ${lo}..${hi}`]); continue; } }
    else { const got = [].concat(computed).map(String).sort().join(), want = [...d.answer.options].sort().join(); if (got !== want) { reject(s, d, [`computed ${got} != key ${want}`]); continue; } }
    const b = await gemini(blindPrompt({ ...d, type: s.type }), 0.2);
    if (s.type === "NAT") { const [lo, hi] = d.answer.range; if (!closeNum(+b.answer, +computed, lo, hi)) { reject(s, d, [`blind solver said ${b.answer}, key ${lo}..${hi}`]); continue; } }
    else { const got = [].concat(b.answer).map(String).sort().join(), want = [...d.answer.options].sort().join(); if (got !== want) { reject(s, d, [`blind solver said ${got}, key ${want}`]); continue; } }
    const id = `FORGE_${BR}_${String(nextId++).padStart(6, "0")}`;
    const it = { id, subject: s.subject, topic: s.topic, kind: s.kind, difficulty: s.difficulty, question_type: s.type, marks: s.marks, question_text: d.question_text, options: d.options ?? [], answer: d.answer, solution: d.solution, verify: d.verify };
    items.push(it); prior.push({ id, w: words(it.question_text), n: nums(it.question_text) }); made++; save(); console.log("  ok", id);
  } catch (e) {
    if (e.quota) { console.log("Daily Gemini quota reached; stopping. Run again tomorrow."); break; }
    console.log("  error", String(e.message).slice(0, 140)); await sleep(3000);
  }
  await sleep(2500);
}
save();
console.log(`\n${made} new items, ${attempts - made} rejected/failed (see ${rejFile}). Running validate.py ...`);
const v = spawnSync("python", ["scripts/forge/validate.py", batchFile], { encoding: "utf8" }); console.log(v.stdout.trim());
console.log(v.status === 0 ? "Batch OK: seed with scripts/forge/seed.mjs" : "Batch has problems: fix or drop the listed items before seeding");
