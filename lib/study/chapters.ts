/** Every written chapter by its page link, so split view can show a second chapter beside the current one. */
import type { Chapter } from "@/lib/study/schema";
import { OS_DEADLOCK } from "@/content/study/CS/os-deadlock";
import { OS_PROCESSES } from "@/content/study/CS/os-processes";
import { OS_SCHEDULING } from "@/content/study/CS/os-scheduling";
import { OS_SYNC } from "@/content/study/CS/os-sync";
import { OS_MEMORY } from "@/content/study/CS/os-memory";
import { OS_VM } from "@/content/study/CS/os-vm";
import { OS_FS } from "@/content/study/CS/os-fs";

export const CHAPTERS: Record<string, Chapter> = {
  "/study/deadlock": OS_DEADLOCK,
  "/study/processes": OS_PROCESSES,
  "/study/scheduling": OS_SCHEDULING,
  "/study/synchronisation": OS_SYNC,
  "/study/memory": OS_MEMORY,
  "/study/virtual-memory": OS_VM,
  "/study/files": OS_FS,
};
