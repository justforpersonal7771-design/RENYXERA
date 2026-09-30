// Runs every question of a branch bank through the app's own parser (normalizeQuestion ->
// AST) and reports anything that would not render as intended:
//   - an [IMAGE_Q_..] placeholder that did not become an image node
//   - a maths segment that did not become a latex node / raw \( \[ left in a text node
//   - NAT range that does not parse, options missing for MCQ/MSQ
//   npx tsx scripts/pyq/render-check.ts EC
import { readFileSync } from "node:fs";
import { normalizeQuestion } from "@/lib/repository/transformers/question-normalizer";

const code = (process.argv[2] || "EC").toUpperCase();
const bank = JSON.parse(readFileSync(`data/pyq/${code}/gate_${code.toLowerCase()}_pyqs.json`, "utf8"));
const PH = /\[IMAGE_Q_\d{2}_(?:[A-D]|\d+)\]/g;
const MATH = /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;

function walk(nodes: any[], f: (n: any) => void) {
  for (const n of nodes || []) {
    f(n);
    if (Array.isArray(n.children)) walk(n.children, f);
  }
}

let bad = 0, total = 0;
for (const paper of bank.papers) {
  const [year, shift = "FN"] = String(paper.exam_metadata["year-shift"]).split("-");
  for (const raw of paper.questions) {
    total++;
    const q = normalizeQuestion(raw, { year, shift, imagesRequired: raw.images_required });
    const problems: string[] = [];
    const parts = [{ raw: raw.question_text, ast: q.contentAst }, ...q.options.map((o: any) => ({ raw: o.optionTextRaw, ast: o.contentAst }))];
    for (const { raw: text, ast } of parts) {
      const wantImg = (text.match(PH) || []).length;
      const wantMath = (text.match(MATH) || []).length;
      let img = 0, math = 0;
      walk(ast, (n) => {
        if (n.type === "image") img++;
        if (n.type === "latex-inline" || n.type === "latex-display") math++;
        if (n.type === "text" && /\\\(|\\\)|\\\[|\\\]|IMAGE_Q_/.test(n.content ?? n.value ?? "")) problems.push(`raw token left in text: ${String(n.content ?? n.value).slice(0, 60)}`);
      });
      if (img !== wantImg) problems.push(`images: ${img} nodes for ${wantImg} placeholders`);
      if (math !== wantMath) problems.push(`maths: ${math} nodes for ${wantMath} segments`);
    }
    if (raw.question_type === "NAT" && !q.nat_answer_range) problems.push(`NAT range did not parse: ${raw.nat_answer_range}`);
    if (raw.question_type !== "NAT" && q.options.length !== 4) problems.push(`options: ${q.options.length}`);
    if (problems.length) { bad++; console.log(`${raw.question_id}: ${problems.join(" | ")}`); }
  }
}
console.log(`${code}: ${total - bad}/${total} questions render-clean`);
process.exit(bad ? 1 : 0);
