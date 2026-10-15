import { writeFileSync } from "node:fs";
import { timeline, FPS } from "../src/v4-timeline.ts";
const t = timeline();
writeFileSync(new URL("../src/v4-timeline.json", import.meta.url), JSON.stringify({ fps: FPS, total: t.total, ...t.markers }));
for (const s of t.scenes) console.log(s.id.padEnd(10), (s.at / FPS).toFixed(1).padStart(5), "+", (s.dur / FPS).toFixed(1));
console.log("total", (t.total / FPS).toFixed(1), "s", t.markers);
