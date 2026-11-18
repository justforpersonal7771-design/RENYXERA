/** Every written chapter by its page link, loaded on demand, so split view can show a second chapter beside the current one
 *  without putting every chapter in the lesson bundle. */
import type { Chapter } from "@/lib/study/schema";

export const CHAPTERS: Record<string, () => Promise<Chapter>> = {
  "/study/deadlock": () => import("@/content/study/CS/os-deadlock").then((x) => x.OS_DEADLOCK),
  "/study/processes": () => import("@/content/study/CS/os-processes").then((x) => x.OS_PROCESSES),
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
};
