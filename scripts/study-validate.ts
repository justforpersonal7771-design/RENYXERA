// Blueprint check: every topic must meet the minimums in docs/study-materials/BLUEPRINT-FINAL.md. Run: npx tsx scripts/study-validate.ts
import { validateTopic } from "../lib/study/schema";
import { OS_DEADLOCK } from "../content/study/CS/os-deadlock";
import { OS_PROCESSES } from "../content/study/CS/os-processes";
import { OS_SCHEDULING } from "../content/study/CS/os-scheduling";
import { OS_SYNC } from "../content/study/CS/os-sync";
import { OS_MEMORY } from "../content/study/CS/os-memory";
import { OS_VM } from "../content/study/CS/os-vm";
import { OS_FS } from "../content/study/CS/os-fs";
import { DM_LOGIC, DM_FOL } from "../content/study/CS/dm-logic";
import { DM_SETS, DM_POSET, DM_GROUPS } from "../content/study/CS/dm-sets";
import { DM_GRAPH } from "../content/study/CS/dm-graph";
import { DM_COUNT, DM_RECUR } from "../content/study/CS/dm-count";
import { CN_LAYERS } from "../content/study/CS/cn-layers";
import { CN_DLL } from "../content/study/CS/cn-dll";
import { CN_IP } from "../content/study/CS/cn-ip";
import { CN_TCP } from "../content/study/CS/cn-tcp";
import { CN_APP } from "../content/study/CS/cn-app";
let bad = 0;
for (const t of [...OS_DEADLOCK.topics, ...OS_PROCESSES.topics, ...OS_SCHEDULING.topics, ...OS_SYNC.topics, ...OS_MEMORY.topics, ...OS_VM.topics, ...OS_FS.topics, ...CN_LAYERS.topics, ...CN_DLL.topics, ...CN_IP.topics, ...CN_TCP.topics, ...CN_APP.topics, ...DM_LOGIC.topics, ...DM_FOL.topics, ...DM_SETS.topics, ...DM_POSET.topics, ...DM_GROUPS.topics, ...DM_GRAPH.topics, ...DM_COUNT.topics, ...DM_RECUR.topics]) { const p = validateTopic(t); bad += p.length; console.log(p.length ? p.join("\n") : `ok  ${t.id}`); }
process.exit(bad ? 1 : 0);
