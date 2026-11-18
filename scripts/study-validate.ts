// Blueprint check: every topic must meet the minimums in docs/study-materials/BLUEPRINT-FINAL.md. Run: npx tsx scripts/study-validate.ts
import { validateTopic } from "../lib/study/schema";
import { OS_DEADLOCK } from "../content/study/CS/os-deadlock";
import { OS_PROCESSES } from "../content/study/CS/os-processes";
import { OS_SCHEDULING } from "../content/study/CS/os-scheduling";
import { OS_SYNC } from "../content/study/CS/os-sync";
import { OS_MEMORY } from "../content/study/CS/os-memory";
import { OS_VM } from "../content/study/CS/os-vm";
import { OS_FS } from "../content/study/CS/os-fs";
let bad = 0;
for (const t of [...OS_DEADLOCK.topics, ...OS_PROCESSES.topics, ...OS_SCHEDULING.topics, ...OS_SYNC.topics, ...OS_MEMORY.topics, ...OS_VM.topics, ...OS_FS.topics]) { const p = validateTopic(t); bad += p.length; console.log(p.length ? p.join("\n") : `ok  ${t.id}`); }
process.exit(bad ? 1 : 0);
