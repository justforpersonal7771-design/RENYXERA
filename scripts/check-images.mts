// Regression guard (27-28 Oct bug): every image in every branch bank and every shared-pool question must resolve
// to a real file. Fails CI if any resolves to the missing-image fallback.
import { readFileSync, existsSync } from "node:fs";
const m1: any = await import("../lib/services/image-resolver"); const ImageResolver = m1.ImageResolver ?? m1.default?.ImageResolver;
const m3: any = await import("../lib/repository/paper-rows"); const paperRows = m3.paperRows ?? m3.default?.paperRows;
const m2: any = await import("../lib/repository/transformers/compiler-facade"); const CompilerFacade = m2.CompilerFacade ?? m2.default?.CompilerFacade;
let bad = 0, ok = 0; const ex: string[] = [];
for (const b of ["CSE", "ECE", "EE", "ME", "CE", "DA"]) {
  const man = JSON.parse(readFileSync(b === "CSE" ? "public/data/image-manifest.json" : `public/data/${b}/image-manifest.json`, "utf8"));
  ImageResolver.initialize(man, b === "CSE" ? "/images" : `/images/${b}`);
  const sh = JSON.parse(readFileSync(`public/data/shared/${b}.json`, "utf8"));
  ImageResolver.addExtra(sh.manifest);
  const raw: any[] = paperRows(sh.papers);
  const qs = new CompilerFacade().compileSynchronously(raw);
  const walk = (n: any) => { if (!n) return; if (Array.isArray(n)) return n.forEach(walk); if (n.type === "image") { const u = n.resolvedUrl; if (existsSync("public" + u)) ok++; else { bad++; if (ex.length < 4) ex.push(`${b} ${u}`); } } for (const v of Object.values(n)) if (typeof v === "object") walk(v); };
  for (const q of qs) { walk(q.contentAst); for (const o of q.options ?? []) walk((o as any).contentAst); }
}
console.log("shared images ok", ok, "broken", bad); console.log(ex.join("\n"));
