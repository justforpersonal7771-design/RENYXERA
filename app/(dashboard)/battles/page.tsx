"use client";

/**
 * Battles (R19): send a set to friends and watch them play it live. Sample data until migration 0041 ships.
 */
import { Swords, Hourglass, Trophy, RotateCcw, Share2 } from "lucide-react";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { UPCOMING } from "@/lib/preview/features";
import { BATTLE, type BattlePlayer } from "@/lib/preview/sample-data";

const STATUS: Record<BattlePlayer["status"], { label: string; tint: string }> = {
  opened: { label: "Opened the link", tint: "sky" }, started: { label: "Playing now", tint: "butter" }, submitted: { label: "Submitted", tint: "mint" },
};

export default function BattlesPage() {
  return (
    <div className="space-y-6 pb-8">
      <PreviewFrame state={UPCOMING.battles} name="Battles" when="Challenge friends to the same questions and watch them play live.">
        {(tier) => <Battles limit={tier === "free" ? 3 : null} />}
      </PreviewFrame>
    </div>
  );
}

function Battles({ limit }: { limit: number | null }) {
  const b = BATTLE;
  return (
    <>
      <section className="card-pastel metal p-6 sm:p-8" data-tint="rose" aria-label="Battles">
        <span className="section-label"><Swords className="h-3.5 w-3.5" /> Battles</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">Same questions.<br />Who scores more?</h1>
        <p className="mt-3 max-w-xl text-[var(--text-secondary)]">Finish any test, send it to friends, and see when they open it, how far they are and who won. Scores come from the server, never the browser.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-main"><Swords className="h-4 w-4" /> Start a battle</button>
          <span className="text-sm text-[var(--text-muted)]">{limit ? `${limit} active battles on Free` : "Unlimited battles"}</span>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-label="Live battle">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{b.title}</h2>
          <span className="text-sm text-[var(--text-muted)]">{b.questions} questions · {b.maxMarks} marks</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><Hourglass className="h-4 w-4" /> {b.expires}</span>
        </div>
        <ul className="mt-5 space-y-3">
          {b.players.map((p) => {
            const s = STATUS[p.status];
            return (
              <li key={p.name} className="flex items-center gap-4 rounded-2xl bg-[var(--surface-secondary)] p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-sm font-bold text-[var(--background)]">{p.avatar}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2"><span className="font-bold text-[var(--text-primary)]">{p.name}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `var(--tint-${s.tint})`, color: `var(--tint-${s.tint}-ink)` }}>
                      {p.status === "started" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" />}{s.label}</span></span>
                  <span className="mt-2 block h-2 overflow-hidden rounded-full bg-[var(--surface)]" role="progressbar" aria-label={`${p.name} answered`} aria-valuenow={p.answered} aria-valuemin={0} aria-valuemax={b.questions}>
                    <span className="block h-full rounded-full bg-[var(--ink)] transition-[width] duration-700" style={{ width: `${(p.answered / b.questions) * 100}%` }} /></span>
                </span>
                <span className="text-right"><span className="block font-num text-xl font-extrabold text-[var(--text-primary)]">{p.score ?? "–"}</span><span className="text-xs text-[var(--text-muted)]">{p.answered}/{b.questions}</span></span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="pill-soft"><Share2 className="h-4 w-4" /> Send the link again</button></div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card-pastel p-5" data-tint="peri" aria-label="Where marks were won">
          <h2 className="font-bold text-[var(--text-primary)]">Topic by topic vs Rohan</h2>
          <ul className="mt-3 space-y-3">
            {b.topics.map((t) => (
              <li key={t.topic}>
                <p className="flex justify-between text-sm"><span className="font-semibold text-[var(--text-primary)]">{t.topic}</span><span className="font-num text-[var(--text-secondary)]">{t.you} : {t.them}</span></p>
                <div className="mt-1 flex h-2 gap-0.5 overflow-hidden rounded-full">
                  <span className="bg-[var(--ink)]" style={{ flex: t.you }} /><span className="bg-[var(--tint-rose-ink)]/50" style={{ flex: t.them }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="card-pastel p-5" data-tint="butter" aria-label="Past battles">
          <h2 className="font-bold text-[var(--text-primary)]">Past battles</h2>
          <ul className="mt-3 space-y-2">
            {b.past.map((p) => (
              <li key={p.vs + p.when} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
                <Trophy className={`h-5 w-5 ${p.won ? "text-amber-500" : "text-[var(--text-muted)]"}`} />
                <span className="flex-1 text-sm"><b className="text-[var(--text-primary)]">{p.won ? `You beat ${p.vs}` : `${p.vs} won`}</b><span className="block text-xs text-[var(--text-muted)]">{p.when}</span></span>
                <span className="font-num text-sm font-bold text-[var(--text-primary)]">{p.you} : {p.them}</span>
                <button type="button" aria-label={`Rematch ${p.vs}`} className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-secondary)]"><RotateCcw className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
