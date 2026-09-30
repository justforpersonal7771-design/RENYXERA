// Compiles every maths segment with MathJax (the same engine the app renders with) and
// reports the ones that fail. Input: a JSON file { "<id>": "<text with \( \) \[ \] $$ $$ maths>" }.
// Output (stdout): JSON { "<id>": ["error message", ...] } — only ids with errors.
//   node scripts/pyq/tex-check.mjs strings.json
import { readFileSync } from "node:fs";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const tex = new TeX({ packages: AllPackages, formatError: (_jax, err) => { throw err; } });
const doc = mathjax.document("", { InputJax: tex, OutputJax: new SVG({ fontCache: "none" }) });

const SEG = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$/g;
const input = JSON.parse(readFileSync(process.argv[2], "utf8"));
const out = {};
for (const [id, text] of Object.entries(input)) {
  const errs = [];
  // Unbalanced delimiters are errors too.
  const opens = (text.match(/\\\(/g) || []).length, closes = (text.match(/\\\)/g) || []).length;
  if (opens !== closes) errs.push(`unbalanced \\( \\): ${opens} open, ${closes} close`);
  const dOpen = (text.match(/\\\[/g) || []).length, dClose = (text.match(/\\\]/g) || []).length;
  if (dOpen !== dClose) errs.push(`unbalanced \\[ \\]: ${dOpen} open, ${dClose} close`);
  for (const m of text.matchAll(SEG)) {
    const src = m[1] ?? m[2] ?? m[3] ?? "";
    try { doc.convert(src, { display: !m[1] }); }
    catch (e) { errs.push(`${String(e?.message || e).slice(0, 120)} in: ${src.slice(0, 80)}`); }
  }
  if (errs.length) out[id] = errs;
}
process.stdout.write(JSON.stringify(out));
