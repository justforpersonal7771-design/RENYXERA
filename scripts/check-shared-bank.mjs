// Checks the shared aptitude and maths pool written by scripts/copy-static-data.mjs (run it first):
//   node scripts/copy-static-data.mjs && node scripts/check-shared-bank.mjs
import fs from "fs";

const BRANCH_FILES = { CSE: "public/data/questions.json", ECE: "public/data/ECE/questions.json", EE: "public/data/EE/questions.json", DA: "public/data/DA/questions.json", ME: "public/data/ME/questions.json" };
const ids = new Set(JSON.parse(fs.readFileSync("data/shared-question-ids.json", "utf8")));
let failed = 0;
const check = (name, ok, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`); if (!ok) failed++; };
const own = {};
for (const [code, f] of Object.entries(BRANCH_FILES)) own[code] = new Set(JSON.parse(fs.readFileSync(f, "utf8")).flatMap((p) => p.questions.map((q) => q.question_id)));

for (const code of Object.keys(BRANCH_FILES)) {
  const raw = fs.readFileSync(`public/data/shared/${code}.json`, "utf8");
  const d = JSON.parse(raw);
  const qs = d.papers.flatMap((p) => p.questions);
  check(`${code}: no answer fields in the public file`, !/"is_correct"|"nat_answer_range"/.test(raw));
  check(`${code}: ${qs.length} shared questions, none already in the branch's own bank`, qs.every((q) => !own[code].has(q.question_id)));
  check(`${code}: every shared id is in data/shared-question-ids.json`, qs.every((q) => ids.has(q.question_id)));
  check(`${code}: ids are unique`, new Set(qs.map((q) => q.question_id)).size === qs.length);
  check(`${code}: every question names its origin paper`, qs.every((q) => q.origin_branch && q.asked_in?.includes(q.origin_branch)));
  check(`${code}: only aptitude and the three overlapping maths subjects`, qs.every((q) => /general aptitude/i.test(q.section) || /^(linear algebra|calculus|probability)/i.test(q.subject)));
  // Every image a question needs resolves to a file listed for its paper key.
  let missing = 0;
  for (const p of d.papers) {
    const key = p.exam_metadata["year-shift"];
    const files = new Set((d.manifest[key]?.files ?? []).map((f) => f.toLowerCase()));
    for (const q of p.questions) for (const ph of q.images_required ?? []) if (!files.has(`${ph.replace(/^IMAGE_Q_/, "")}.png`.toLowerCase())) missing++;
  }
  check(`${code}: every required image is listed in the manifest`, missing === 0, missing ? `${missing} missing` : "");
  let absent = 0;
  for (const v of Object.values(d.manifest)) for (const f of v.files) if (!fs.existsSync(`public${v.dir}/${f}`)) absent++;
  check(`${code}: every listed image file exists on disk`, absent === 0, absent ? `${absent} absent` : "");
}
console.log(failed ? `\n${failed} check(s) failed` : "\nShared bank is consistent");
process.exit(failed ? 1 : 0);
