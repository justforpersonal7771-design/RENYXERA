/** Every written chapter by its page link, so split view can show a second chapter beside the current one. */
import type { Chapter } from "@/lib/study/schema";
import { OS_DEADLOCK } from "@/content/study/CS/os-deadlock";
import { OS_PROCESSES } from "@/content/study/CS/os-processes";

export const CHAPTERS: Record<string, Chapter> = {
  "/study/deadlock": OS_DEADLOCK,
  "/study/processes": OS_PROCESSES,
};
