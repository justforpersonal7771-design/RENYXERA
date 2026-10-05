// Writes the PUBLIC question banks and image manifests into public/ before every build,
// so Cloudflare serves them as static assets straight from its CDN (serving them through
// the Worker re-serialised 1.3 MB per load and caused Error 1102 on the free plan).
//
// Step 6 (5A): answers are stripped here. The public files have no `is_correct` and no
// `nat_answer_range`; keys live only in Postgres (question_answers) and are unlocked via
// /api/answers. The build fails if an answer field survives. data/ stays the single
// source of truth; public/data/ (and the copied non-CS images) are generated and git-ignored.
//
// Multi-branch (docs/MULTI_BRANCH_DESIGN.md §5):
//   CSE  data/Aggregated_Output.json            -> public/data/questions.json (path unchanged)
//        data/image-manifest.json                -> public/data/image-manifest.json
//        images already live in public/images/<year-shift>/
//   ECE… data/pyq/<PAPER>/gate_<paper>_pyqs.json -> public/data/<CODE>/questions.json
//        data/pyq/<PAPER>/images/<paper_id>/*    -> public/images/<CODE>/<year-shift>/*
//        manifest built from those files          -> public/data/<CODE>/image-manifest.json
import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

// App branch code -> GATE paper code. Keep in step with lib/branches.ts (BRANCHES_WITH_DATA).
const PYQ_BRANCHES = { ECE: "EC" };

function stripAnswers(papers) {
  return papers.map((paper) => ({
    exam_metadata: paper.exam_metadata,
    questions: paper.questions.map(({ nat_answer_range, options, ...q }) => ({
      ...q,
      options: (options ?? []).map(({ is_correct, ...o }) => o),
    })),
  }));
}

function writeBank(file, papers, label) {
  const publicPapers = stripAnswers(papers);
  const out = JSON.stringify(publicPapers);
  if (/"is_correct"|"nat_answer_range"/.test(out)) {
    throw new Error(`copy-static-data: an answer field leaked into the public ${label} question bank`);
  }
  writeFileSync(file, out);
  return publicPapers.reduce((n, p) => n + p.questions.length, 0);
}

mkdirSync("public/data", { recursive: true });

// CSE (unchanged paths)
const csCount = writeBank("public/data/questions.json", JSON.parse(readFileSync("data/Aggregated_Output.json", "utf8")), "CSE");
copyFileSync("data/image-manifest.json", "public/data/image-manifest.json");
console.log(`copy-static-data: CSE public/data/questions.json (${csCount} questions, no answers) + image-manifest.json`);

// Other branches
for (const [code, paper] of Object.entries(PYQ_BRANCHES)) {
  const dir = `data/pyq/${paper}`;
  const bankFile = `${dir}/gate_${paper.toLowerCase()}_pyqs.json`;
  if (!existsSync(bankFile)) {
    console.log(`copy-static-data: ${code} skipped (no ${bankFile})`);
    continue;
  }
  const papers = JSON.parse(readFileSync(bankFile, "utf8"));
  const meta = JSON.parse(readFileSync(`${dir}/gate_${paper.toLowerCase()}_pyqs.meta.json`, "utf8"));
  mkdirSync(`public/data/${code}`, { recursive: true });
  const count = writeBank(`public/data/${code}/questions.json`, papers, code);

  const manifest = {};
  let images = 0;
  for (const p of papers) {
    const ys = p.exam_metadata["year-shift"];
    const pid = meta.papers?.[ys]?.paper;
    const src = pid && `${dir}/images/${pid}`;
    if (!src || !existsSync(src)) continue;
    const files = readdirSync(src).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
    if (!files.length) continue;
    cpSync(src, `public/images/${code}/${ys}`, { recursive: true });
    manifest[ys] = files;
    images += files.length;
  }
  // Every image a question asks for must exist, or the build fails.
  for (const p of papers) {
    const have = new Set(manifest[p.exam_metadata["year-shift"]] ?? []);
    for (const q of p.questions) {
      for (const ph of q.images_required ?? []) {
        const file = `${ph.replace(/^IMAGE_Q_/, "")}.png`;
        if (!have.has(file)) throw new Error(`copy-static-data: ${code} ${q.question_id} needs ${file}, which is missing`);
      }
    }
  }
  writeFileSync(`public/data/${code}/image-manifest.json`, JSON.stringify(manifest));
  console.log(`copy-static-data: ${code} public/data/${code}/questions.json (${count} questions, no answers) + ${images} images`);
}
