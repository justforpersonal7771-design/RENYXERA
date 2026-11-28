"use client";

/**
 * Study library home: your reading numbers on top (read-only tilt cards), the study loop, then the bookshelf.
 * Study is a separate product from Plus and Pro (docs/study-materials/13, migration 0063): everyone reads the sample topics;
 * bought packs open the rest. Packs and bundles open in a window (components/study/study-shop-modal.tsx) from "Get books",
 * a book's page and the unlock cards; /study?shop=1 and /study#packs open it directly.
 */
import { useEffect, useState } from "react";
import { BookOpen, FlaskConical, Highlighter, Library } from "lucide-react";
import { Bookshelf } from "@/components/study/bookshelf";
import { CS_SHELF } from "@/lib/study/catalog";
import { FREE_TOPICS } from "@/lib/study/packs";
import { highlightCount, readSeen } from "@/lib/study/progress";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { TiltCard } from "@/components/ui/interactive";
import { openStudyShop } from "@/store/use-study-shop-store";
import { BranchSoon } from "@/components/branch/branch-soon";
import { getCurrentBranch } from "@/lib/branch/current";

const readyChapters = CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => ({ b, c, topics: Number(/(\d+)\s+topics?/.exec(c.ready ?? "")?.[1] ?? 0) })));
const totalTopics = readyChapters.reduce((s, x) => s + x.topics, 0);
const readyBooks = CS_SHELF.filter((b) => b.chapters.some((c) => c.href)).length;
const sampleTopics = CS_SHELF.filter((b) => b.chapters.some((c) => c.href)).length * FREE_TOPICS;

export default function StudyPage() {
  const access = useStudyAccess();
  const [soon, setSoon] = useState(false); // study books exist for Computer Science only so far
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the branch is read from this browser after mount
  useEffect(() => { setSoon(getCurrentBranch() !== "CSE"); }, []);
  const [stats, setStats] = useState<{ read: number; chapters: number; hl: number } | null>(null);
  useEffect(() => {
    const seen = readSeen();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only progress, read once after mount
    setStats({ read: Object.keys(seen).length, chapters: new Set(Object.values(seen).map((v) => v.ch)).size, hl: highlightCount() });
    if (new URLSearchParams(window.location.search).has("shop") || window.location.hash === "#packs") openStudyShop("Study packs and bundles");
  }, []);
  const open = access.all ? totalTopics : sampleTopics;
  const pct = stats && open ? Math.min(100, Math.round((stats.read / open) * 100)) : 0;
  if (soon) return <div className="p-4 sm:p-6"><BranchSoon feature="study" /></div>;
  return (
    <div className="space-y-6 pb-8">
      <Bookshelf aside={
        <section aria-label="Your reading" className="grid grid-cols-2 gap-3">
          <TiltCard tint="mint" className="card-pastel p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><BookOpen className="h-4 w-4" /> Topics read</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{stats?.read ?? 0}</span><span className="text-base text-[var(--text-secondary)]"> / {open}</span></p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full rounded-full bg-[var(--tint-mint-ink)]" style={{ width: `${pct}%` }} /></div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{access.all ? "of every topic written so far" : "of the topics open to you"}</p>
          </TiltCard>
          <TiltCard tint="sky" className="card-pastel p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><Library className="h-4 w-4" /> Chapters started</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{stats?.chapters ?? 0}</span><span className="text-base text-[var(--text-secondary)]"> / {readyChapters.length}</span></p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">on this device</p>
          </TiltCard>
          <TiltCard tint="butter" className="card-pastel p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><Highlighter className="h-4 w-4" /> Highlights saved</p>
            <p className="mt-1 font-display text-3xl font-extrabold font-num text-[var(--text-primary)]">{stats?.hl ?? 0}</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">select text in a lesson to add one</p>
          </TiltCard>
          <TiltCard tint="lilac" className="card-pastel p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><FlaskConical className="h-4 w-4" /> Library so far</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{totalTopics}</span><span className="text-base text-[var(--text-secondary)]"> topics</span></p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{readyBooks} books, {readyChapters.length} chapters, a lab in every topic</p>
          </TiltCard>
        </section>
      } />
    </div>
  );
}
