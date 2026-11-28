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
        <section aria-label="Your reading" className="card-pastel p-4" data-tint="mint">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-[.14em] text-[var(--tint-ink)]">Your reading</p>
            <p className="text-xs text-[var(--text-secondary)]">{access.all ? "every topic written so far" : "topics open to you"}</p>
          </div>
          <p className="mt-1 font-display text-3xl font-extrabold leading-none tracking-[-0.02em] text-[var(--text-primary)]"><span className="font-num">{stats?.read ?? 0}</span><span className="text-base font-bold text-[var(--text-secondary)]"> / {open} topics read</span></p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full rounded-full bg-[var(--tint-mint-ink)]" style={{ width: `${pct}%` }} /></div>
          <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-black/5 pt-3 text-center dark:border-white/10">
            <div><dd className="font-num text-lg font-extrabold text-[var(--text-primary)]">{stats?.chapters ?? 0}<span className="text-xs font-bold text-[var(--text-secondary)]">/{readyChapters.length}</span></dd><dt className="text-[11px] text-[var(--text-secondary)]">chapters started</dt></div>
            <div><dd className="font-num text-lg font-extrabold text-[var(--text-primary)]">{stats?.hl ?? 0}</dd><dt className="text-[11px] text-[var(--text-secondary)]">highlights</dt></div>
            <div><dd className="font-num text-lg font-extrabold text-[var(--text-primary)]">{totalTopics}</dd><dt className="text-[11px] text-[var(--text-secondary)]">topics in {readyBooks} books</dt></div>
          </dl>
        </section>
      } />
    </div>
  );
}
