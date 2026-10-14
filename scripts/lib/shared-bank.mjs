// Shared aptitude and maths pool.
//
// General Aptitude (15 marks) is common to every GATE paper, and Linear Algebra, Calculus and Probability & Statistics
// overlap between CS, DA, EC, EE and ME. This builds, for each branch, a file of the OTHER branches' questions on those
// topics, so a student in any branch can practise all of them. Every question keeps its own id (so its answer key still
// works) and is tagged with the paper it came from and every paper that asked the same question.
//
// Identical questions (same text and options) are listed once, with all the papers that asked it. A branch never gets a
// second copy of a question it already has.
import { mkdirSync, writeFileSync } from "node:fs";

const clean = (t) => String(t ?? "").replace(/\s+/g, "").toLowerCase();
const fingerprint = (q) => clean(q.question_text) + "|" + (q.options ?? []).map((o) => clean(o.text)).join("|");
const isGA = (q) => /general aptitude/i.test(q.section ?? "");
export function mathKey(q) {
  if (!/math/i.test(q.section ?? "")) return null;
  const s = String(q.subject ?? "").toLowerCase();
  if (s.startsWith("linear algebra")) return "linear";
  if (s.startsWith("calculus")) return "calculus";
  if (s.startsWith("probability")) return "prob";
  return null;
}

/**
 * banks: { CSE: { paper: "CS", papers, manifest, base }, ... } with full (answer-carrying) papers.
 * strip(papers) removes answers. Returns { totalShared, ids }.
 */
export function buildSharedBanks(banks, strip, outDir = "public/data/shared") {
  mkdirSync(outDir, { recursive: true });
  const codes = Object.keys(banks);

  // Who asked what, by fingerprint (only for shareable questions).
  const askedBy = new Map(); // fingerprint -> [{ code, id }]
  const hostMath = {}; // code -> { key: { section, subject } }
  for (const code of codes) {
    hostMath[code] = {};
    for (const p of banks[code].papers) for (const q of p.questions) {
      const mk = mathKey(q);
      if (!isGA(q) && !mk) continue;
      if (mk && !hostMath[code][mk]) hostMath[code][mk] = { section: q.section, subject: q.subject };
      const fp = fingerprint(q);
      if (!askedBy.has(fp)) askedBy.set(fp, []);
      askedBy.get(fp).push({ code, id: q.question_id });
    }
  }

  const allIds = new Set();
  const summary = {};
  for (const host of codes) {
    const own = new Set();
    for (const p of banks[host].papers) for (const q of p.questions) own.add(fingerprint(q));

    const taken = new Set();
    const papers = [];
    const manifest = {};
    const tags = {};
    for (const [fp, who] of askedBy) {
      const codesAsking = [...new Set(who.map((w) => banks[w.code].paper))];
      if (codesAsking.length > 1) for (const w of who) if (w.code === host) tags[w.id] = codesAsking;
    }

    let added = 0;
    for (const origin of codes) {
      if (origin === host) continue;
      const O = banks[origin];
      for (const p of O.papers) {
        const ys = p.exam_metadata["year-shift"];
        const key = `${ys}-${O.paper}`;
        const qs = [];
        for (const q of p.questions) {
          const mk = mathKey(q);
          if (!isGA(q) && !mk) continue;
          const fp = fingerprint(q);
          if (own.has(fp) || taken.has(fp)) continue;
          let { section, subject } = q;
          if (mk) {
            const target = hostMath[host][mk];
            if (!target) continue; // the host has no matching maths subject
            section = target.section;
            subject = target.subject;
          }
          taken.add(fp);
          const asked = [...new Set((askedBy.get(fp) ?? []).map((w) => banks[w.code].paper))];
          qs.push({ ...q, section, subject, origin_branch: O.paper, asked_in: asked });
          tags[q.question_id] = asked;
          allIds.add(q.question_id);
        }
        if (!qs.length) continue;
        papers.push({ exam_metadata: { "year-shift": key }, questions: qs });
        if (O.manifest[ys]) manifest[key] = { dir: `${O.base}/${ys}`, files: O.manifest[ys] };
        added += qs.length;
      }
    }
    const out = JSON.stringify({ papers: strip(papers), manifest, tags });
    if (/"is_correct"|"nat_answer_range"/.test(out)) throw new Error(`shared bank for ${host}: an answer field leaked`);
    writeFileSync(`${outDir}/${host}.json`, out);
    summary[host] = added;
  }
  return { summary, ids: [...allIds].sort() };
}
