// Copies the question bank and image manifest into public/data/ before every build, so
// Cloudflare serves them as static assets straight from its CDN. Previously they went
// through /api/dataset and /api/image-manifest, which ran the Worker and re-serialised
// the 1.3 MB dataset as JSON on every app load (~90–100 ms CPU each). On the free plan
// that, plus cold starts, pushed requests over the CPU limit (Error 1102).
// The default /api/dataset response was the complete file, unchanged, so serving it
// statically changes nothing about what the browser receives. data/ stays the single
// source of truth; public/data/ is generated and git-ignored.
import { mkdirSync, copyFileSync } from "node:fs";

mkdirSync("public/data", { recursive: true });
copyFileSync("data/Aggregated_Output.json", "public/data/questions.json");
copyFileSync("data/image-manifest.json", "public/data/image-manifest.json");
console.log("copy-static-data: public/data/{questions,image-manifest}.json ready");
