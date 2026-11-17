// Blueprint check: every topic must meet the minimums in docs/study-materials/BLUEPRINT-FINAL.md. Run: npx tsx scripts/study-validate.ts
import { validateTopic } from "../lib/study/schema";
import { OS_DEADLOCK } from "../content/study/CS/os-deadlock";
let bad = 0;
for (const t of OS_DEADLOCK.topics) { const p = validateTopic(t); bad += p.length; console.log(p.length ? p.join("\n") : `ok  ${t.id}`); }
process.exit(bad ? 1 : 0);
