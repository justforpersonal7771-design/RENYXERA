"use client";

/**
 * Study library home: reading progress, the bookshelf, and the study packs and bundles.
 * Study is a separate product from Plus and Pro (docs/study-materials/13). Free and Plus read the sample topics;
 * Pro reads everything for now (owner, 19 Nov 2026) until pack checkout ships.
 */
import { useEffect, useState } from "react";
import { BookOpen, Check, FlaskConical, Highlighter, Library, Lock } from "lucide-react";
import { Bookshelf } from "@/components/study/bookshelf";
import { CS_SHELF } from "@/lib/study/catalog";
import { BUILD_YOUR_OWN_OFF, BUNDLES, FREE_TOPICS, PACKS, packTotal, rupees } from "@/lib/study/packs";
import { highlightCount, readSeen } from "@/lib/study/progress";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { track } from "@/lib/growth/track";

const readyChapters = CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => ({ b, c, topics: Number(/(\d+)\s+topics?/.exec(c.ready ?? "")?.[1] ?? 0) })));
const totalTopics = readyChapters.reduce((s, x) => s + x.topics, 0);
const readyBooks = CS_SHELF.filter((b) => b.chapters.some((c) => c.href)).length;
const sampleTopics = CS_SHELF.filter((b) => b.chapters.some((c) => c.href)).length * FREE_TOPICS;

export default function StudyPage() {
  const access = useStudyAccess();
  const [stats, setStats] = useState<{ read: number; chapters: number; hl: number } | null>(null);
  useEffect(() => {
    const seen = readSeen();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only progress, read once after mount
    setStats({ read: Object.keys(seen).length, chapters: new Set(Object.values(seen).map((v) => v.ch)).size, hl: highlightCount() });
  }, []);
  const open = access.all ? totalTopics : sampleTopics;
  const pct = stats && open ? Math.min(100, Math.round((stats.read / open) * 100)) : 0;
  return (
    <div className="space-y-6 pb-8">
      <Bookshelf />

      <section aria-label="Your reading" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-pastel p-4 sm:p-5" data-tint="mint">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><BookOpen className="h-4 w-4" /> Topics read</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{stats?.read ?? 0}</span><span className="text-base text-[var(--text-secondary)]"> / {open}</span></p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full rounded-full bg-[var(--tint-mint-ink)]" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{access.all ? "of every topic written so far" : "of the free sample topics"}</p>
        </div>
        <div className="card-pastel p-4 sm:p-5" data-tint="sky">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><Library className="h-4 w-4" /> Chapters started</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{stats?.chapters ?? 0}</span><span className="text-base text-[var(--text-secondary)]"> / {readyChapters.length}</span></p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">on this device</p>
        </div>
        <div className="card-pastel p-4 sm:p-5" data-tint="butter">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><Highlighter className="h-4 w-4" /> Highlights saved</p>
          <p className="mt-1 font-display text-3xl font-extrabold font-num text-[var(--text-primary)]">{stats?.hl ?? 0}</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">select text in a lesson to add one</p>
        </div>
        <div className="card-pastel p-4 sm:p-5" data-tint="lilac">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><FlaskConical className="h-4 w-4" /> Library so far</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{totalTopics}</span><span className="text-base text-[var(--text-secondary)]"> topics</span></p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{readyBooks} books, {readyChapters.length} chapters, a lab in every topic</p>
        </div>
      </section>

      <section id="packs" aria-label="Study packs and bundles" className="scroll-mt-24 space-y-4">
        <div className="card-pastel p-5 sm:p-6" data-tint="peach">
          <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Study packs and bundles</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Study materials are bought separately from Plus and Pro: one pack per subject, or a bundle for less. Every book opens with {FREE_TOPICS} free sample topics. {access.all ? "You can read every book now." : "Pro members read every book while packs are being prepared."} Pack checkout opens soon.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BUNDLES.map((b) => {
            const sum = packTotal(b.packs); const save = sum - b.pricePaise;
            return (
              <div key={b.id} className={`flex flex-col rounded-3xl border bg-[var(--surface)] p-5 ${b.id === "complete" ? "border-amber-400/70" : "border-[var(--border)]"}`}>
                <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">{b.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{b.note}</p>
                <p className="mt-3 font-display text-3xl font-extrabold text-[var(--text-primary)]">{rupees(b.pricePaise)}</p>
                <p className="text-xs text-[var(--text-secondary)]">packs separately {rupees(sum)} · you save {rupees(save)} ({Math.round((save / sum) * 100)}%)</p>
                <ul className="mt-3 flex flex-wrap gap-1">{b.packs.map((id) => <li key={id} className="rounded-full bg-[var(--surface-secondary)] px-2 py-0.5 text-xs font-semibold">{PACKS.find((p) => p.id === id)?.name}</li>)}</ul>
                <button type="button" onClick={() => track("upgrade_clicked", null, `study_bundle:${b.id}`)} className="pill-soft mt-auto self-start pt-2">Tell me when it opens</button>
              </div>
            );
          })}
          <div className="flex flex-col rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">Build your own</p>
            <p className="text-sm text-[var(--text-secondary)]">Any 3 or more packs</p>
            <p className="mt-3 font-display text-3xl font-extrabold text-[var(--text-primary)]">{BUILD_YOUR_OWN_OFF}% off</p>
            <p className="text-xs text-[var(--text-secondary)]">the sum of the packs you choose</p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[520px] text-sm">
            <thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th className="px-4 py-3">Subject pack</th><th className="px-4 py-3">Marks a paper</th><th className="px-4 py-3">Books</th><th className="px-4 py-3 text-right">Price</th></tr></thead>
            <tbody>{PACKS.map((p) => {
              const books = p.books.map((id) => CS_SHELF.find((b) => b.id === id)).filter(Boolean);
              const ready = books.filter((b) => b!.chapters.some((c) => c.href)).length;
              return (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">{p.name}</td>
                  <td className="px-4 py-2.5 font-num">{p.marks}</td>
                  <td className="px-4 py-2.5">{ready === books.length ? <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400"><Check className="h-3.5 w-3.5" /> Ready</span> : ready > 0 ? `${ready} of ${books.length} ready` : <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]"><Lock className="h-3.5 w-3.5" /> Coming soon</span>}</td>
                  <td className="px-4 py-2.5 text-right font-num font-bold">{rupees(p.pricePaise)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
