// Structural audit of the question bank (data/Aggregated_Output.json is the CS-IT source).
//   node scripts/validate-question-bank.mjs            -> CS bank
//   node scripts/validate-question-bank.mjs <file.json> [manifest.json]
// It checks things a machine CAN check: ids, marks, option shape, exactly one correct MCQ option, NAT ranges, unbalanced
// math or braces, garbled text, duplicate questions and missing images. It cannot prove an answer is academically right;
// answers are checked against the official keys by scripts/check-answer-keys.mjs and by reading the questions themselves.
import fs from "fs";

const file = process.argv[2] ?? "data/Aggregated_Output.json";
const manifestFile = process.argv[3] ?? "public/data/image-manifest.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, "utf8")) : {};
const issues = [];
const notes = [];
const bad = (q, m) => issues.push(`${q.question_id}: ${m}`);
const seen = new Map();
const norm = (t) => t.toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9$]/g, "").slice(0, 200);
let total = 0;

for (const paper of data) {
  const ys = paper.exam_metadata?.["year-shift"] ?? "";
  const nums = new Set();
  for (const q of paper.questions) {
    total++;
    if (!q.question_id.includes(ys.replace("-", "_"))) bad(q, `id does not match paper ${ys}`);
    if (nums.has(q.question_no)) bad(q, "duplicate question number");
    nums.add(q.question_no);
    if (![1, 2].includes(q.marks)) bad(q, `marks ${q.marks}`);
    const t = q.question_text || "";
    if (t.trim().length < 15) bad(q, "very short question text");
    if ((t.match(/\$/g) || []).length % 2) bad(q, "odd number of $ (unbalanced math)");
    let depth = 0;
    for (const c of t) { if (c === "{") depth++; if (c === "}") depth--; if (depth < 0) break; }
    if (depth !== 0) bad(q, "unbalanced braces in the question");
    if (/�|â€|Ã/.test(t)) bad(q, "garbled characters");
    if (!q.topic || !q.subject || !q.section) bad(q, "missing section, subject or topic");
    const opts = q.options || [];
    if (q.question_type === "NAT") {
      const r = q.nat_answer_range;
      if (!r) bad(q, "NAT without an answer range");
      else if (r.min > r.max) bad(q, "NAT min is above max");
      if (opts.length) bad(q, "NAT has options");
    } else {
      if (opts.length !== 4) bad(q, `${opts.length} options`);
      if (opts.map((o) => o.option_id).join("") !== "ABCD") bad(q, "option ids are not A to D");
      const texts = opts.map((o) => (o.text || "").replace(/\s+/g, ""));
      if (new Set(texts).size !== texts.length && !opts.some((o) => o.has_image)) bad(q, "two options have the same text");
      if (opts.some((o) => !(o.text || "").trim() && !o.has_image)) bad(q, "empty option");
      const c = opts.filter((o) => o.is_correct).length;
      if (q.question_type === "MCQ" && c !== 1) notes.push(`${q.question_id}: MCQ with ${c} correct (official multi-answer keys are listed by check-answer-keys)`);
      if (q.question_type === "MSQ" && c < 1) bad(q, "MSQ with no correct option");
      if (q.question_type === "MSQ" && c === 4) notes.push(`${q.question_id}: MSQ with all four options correct, worth a look`);
    }
    if (q.has_image && !(q.images_required || []).length) bad(q, "has_image but images_required is empty");
    if ((q.images_required || []).length && !(manifest[ys] || []).length) bad(q, `images required but the manifest has none for ${ys}`);
    const key = norm(t);
    if (key.length > 40) { if (seen.has(key)) bad(q, `same text as ${seen.get(key)}`); else seen.set(key, q.question_id); }
  }
}
console.log(`${total} questions in ${data.length} papers`);
console.log(`${issues.length} issue(s)`);
for (const i of issues) console.log("  " + i);
if (notes.length) { console.log(`${notes.length} note(s)`); for (const n of notes) console.log("  " + n); }
process.exit(issues.length ? 1 : 0);
