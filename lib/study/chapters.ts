/** Every written chapter by its page link, loaded on demand, so split view can show a second chapter beside the current one
 *  without putting every chapter in the lesson bundle. */
import type { Chapter } from "@/lib/study/schema";

export const CHAPTERS: Record<string, () => Promise<Chapter>> = {
  "/study/deadlock": () => import("@/content/study/CS/os-deadlock").then((x) => x.OS_DEADLOCK),
  "/study/processes": () => import("@/content/study/CS/os-processes").then((x) => x.OS_PROCESSES),
  "/study/er-model": () => import("@/content/study/CS/db-a").then((x) => x.DB_ER),
  "/study/relational-model": () => import("@/content/study/CS/db-a").then((x) => x.DB_REL),
  "/study/relational-algebra": () => import("@/content/study/CS/db-a").then((x) => x.DB_RA),
  "/study/sql": () => import("@/content/study/CS/db-a").then((x) => x.DB_SQL),
  "/study/normal-forms": () => import("@/content/study/CS/db-b").then((x) => x.DB_NORM),
  "/study/indexing": () => import("@/content/study/CS/db-b").then((x) => x.DB_INDEX),
  "/study/transactions": () => import("@/content/study/CS/db-b").then((x) => x.DB_TXN),
  "/study/concurrency-control": () => import("@/content/study/CS/db-b").then((x) => x.DB_CC),
  "/study/scheduling": () => import("@/content/study/CS/os-scheduling").then((x) => x.OS_SCHEDULING),
  "/study/synchronisation": () => import("@/content/study/CS/os-sync").then((x) => x.OS_SYNC),
  "/study/memory": () => import("@/content/study/CS/os-memory").then((x) => x.OS_MEMORY),
  "/study/virtual-memory": () => import("@/content/study/CS/os-vm").then((x) => x.OS_VM),
  "/study/files": () => import("@/content/study/CS/os-fs").then((x) => x.OS_FS),
  "/study/layering": () => import("@/content/study/CS/cn-layers").then((x) => x.CN_LAYERS),
  "/study/data-link": () => import("@/content/study/CS/cn-dll").then((x) => x.CN_DLL),
  "/study/ip": () => import("@/content/study/CS/cn-ip").then((x) => x.CN_IP),
  "/study/transport": () => import("@/content/study/CS/cn-tcp").then((x) => x.CN_TCP),
  "/study/application": () => import("@/content/study/CS/cn-app").then((x) => x.CN_APP),
  "/study/logic": () => import("@/content/study/CS/dm-logic").then((x) => x.DM_LOGIC),
  "/study/first-order-logic": () => import("@/content/study/CS/dm-logic").then((x) => x.DM_FOL),
  "/study/sets-relations": () => import("@/content/study/CS/dm-sets").then((x) => x.DM_SETS),
  "/study/posets": () => import("@/content/study/CS/dm-sets").then((x) => x.DM_POSET),
  "/study/groups": () => import("@/content/study/CS/dm-sets").then((x) => x.DM_GROUPS),
  "/study/graph-theory": () => import("@/content/study/CS/dm-graph").then((x) => x.DM_GRAPH),
  "/study/counting": () => import("@/content/study/CS/dm-count").then((x) => x.DM_COUNT),
  "/study/recurrences": () => import("@/content/study/CS/dm-count").then((x) => x.DM_RECUR),
};
