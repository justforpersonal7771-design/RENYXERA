import "server-only";
import type { Chapter, Topic } from "@/lib/study/schema";
import { CHAPTER_SOURCES } from "@/lib/study/chapters-server";
import { FREE_TOPICS, chapterInfo } from "@/lib/study/packs";
import { isAdminRequest } from "@/lib/server/admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { ownedPacks } from "@/lib/study/server";

/**
 * The server decides what a viewer may read (docs/study-materials/13, migration 0063). Topics the viewer cannot open are sent as
 * a stub (id and title only, `locked: true`), so their lesson text never reaches the browser. Readable: the first FREE_TOPICS topics
 * of each book's first chapter for everyone; every topic of a bought pack; everything for admins.
 */
export async function viewerAccess(): Promise<{ all: boolean; packs: string[] }> {
  const { ok, userId } = await isAdminRequest().catch(() => ({ ok: false, userId: null as string | null }));
  if (ok) return { all: true, packs: [] };
  if (!userId) return { all: false, packs: [] };
  return { all: false, packs: await ownedPacks(createServiceRoleClient(), userId).catch(() => [] as string[]) };
}

export function canReadTopic(href: string, index: number, access: { all: boolean; packs: string[] }) {
  if (access.all) return true;
  const info = chapterInfo(href);
  if (info.pack && access.packs.includes(info.pack.id)) return true;
  return info.sampleChapter && index < FREE_TOPICS;
}

const stub = (t: Topic): Topic => ({ id: t.id, title: t.title, blocks: [], locked: true });
const deferred = (t: Topic): Topic => ({ id: t.id, title: t.title, blocks: [], deferred: true });

/** `forPage`: the page HTML (view-source, the page payload) carries only the free sample topics; a paid reader's topics are marked
 *  `deferred` and fetched by the browser from the guarded API, so lesson text of a bought pack never sits in the page source. */
export async function chapterForViewer(href: string, access?: { all: boolean; packs: string[] }, forPage = false): Promise<Chapter | null> {
  const load = CHAPTER_SOURCES[href]; if (!load) return null;
  const ch = await load(); const a = access ?? (await viewerAccess());
  const free = chapterInfo(href).sampleChapter;
  return { ...ch, topics: ch.topics.map((t, i) => (!canReadTopic(href, i, a) ? stub(t) : forPage && !(free && i < FREE_TOPICS) ? deferred(t) : t)) };
}
