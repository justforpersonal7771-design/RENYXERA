// Writes the PUBLIC question bank and image manifest into public/data/ before every build,
// so Cloudflare serves them as static assets straight from its CDN (serving them through
// the Worker re-serialised 1.3 MB per load and caused Error 1102 on the free plan).
//
// Step 6 (5A): answers are stripped here. The public file has no `is_correct` and no
// `nat_answer_range`; keys live only in Postgres (question_answers) and are unlocked via
// /api/answers. The build fails if an answer field survives. data/ stays the single
// source of truth; public/data/ is generated and git-ignored.
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("public/data", { recursive: true });

const papers = JSON.parse(readFileSync("data/Aggregated_Output.json", "utf8"));
const publicPapers = papers.map((paper) => ({
  exam_metadata: paper.exam_metadata,
  questions: paper.questions.map(({ nat_answer_range, options, ...q }) => ({
    ...q,
    options: (options ?? []).map(({ is_correct, ...o }) => o),
  })),
}));
const out = JSON.stringify(publicPapers);
if (/"is_correct"|"nat_answer_range"/.test(out)) {
  throw new Error("copy-static-data: an answer field leaked into the public question bank");
}
writeFileSync("public/data/questions.json", out);
copyFileSync("data/image-manifest.json", "public/data/image-manifest.json");
const count = publicPapers.reduce((n, p) => n + p.questions.length, 0);
console.log(`copy-static-data: public/data/questions.json (${count} questions, no answers) + image-manifest.json`);
