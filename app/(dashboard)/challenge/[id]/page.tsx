"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Swords, Hourglass, LayoutGrid } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { track } from "@/lib/growth/track";
import { InviteFriends } from "@/components/friends/invite-friends";
import { LiveLobby, MakeLiveButton } from "@/components/friends/live-lobby";
import type { ExamSessionDraft } from "@/types/exam.types";

type Battle = { id: string; title: string; ownerName: string; ownerScore: number | null; maxScore: number | null; questionIds: string[]; expiresAt: string; expired: boolean; mode?: "async" | "live" };
type Loaded = { battle: Battle; isOwner: boolean; entries: { you: boolean; status: string; score: number | null; maxScore: number | null }[] };

const MIN_COVER = 0.8; // must match the server: a friend needs most of the battle's questions in their bank

/** /challenge/<battle id>: a live battle. Sign in, take the same questions, and the sender watches you play. */
export default function BattlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isInitialized = useDataStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => !s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { useDataStore.getState().loadRepository(); }, []);

  useEffect(() => {
    if (!authReady) return;
    let off = false;
    fetch(`/api/battles/${id}`).then(async (r) => {
      const j = await r.json().catch(() => ({}));
      if (off) return;
      if (!r.ok) setError(r.status === 404 ? "This battle link isn't valid." : "Couldn't load this battle. Try again in a moment.");
      else { setData(j as Loaded); track("visit", null, "battle_link"); }
    }).catch(() => { if (!off) setError("Couldn't load this battle. Check your connection."); });
    return () => { off = true; };
  }, [id, authReady, user?.id]);

  // Opening the link while signed in tells the sender "opened".
  useEffect(() => {
    if (user && data && !data.isOwner && !data.battle.expired) void fetch(`/api/battles/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "open" }) }).catch(() => {});
  }, [user, data, id]);

  const available = useMemo(() => (data && isInitialized ? data.battle.questionIds.filter((q) => !!QuestionRepository.getQuestionById(q)) : []), [data, isInitialized]);
  const enough = !!data && available.length >= Math.max(3, Math.ceil(data.battle.questionIds.length * MIN_COVER));
  const done = data?.entries.find((e) => e.you && e.status === "submitted");

  if (error) return <div className="mx-auto max-w-md py-20 text-center"><p className="font-bold text-[var(--text-primary)]">{error}</p><Link href="/test-centre" className="pill-soft mt-4 inline-flex"><LayoutGrid className="h-4 w-4" /> Test Centre</Link></div>;
  if (!data) return <div className="grid place-items-center py-24" role="status"><Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" /></div>;
  const b = data.battle;

  const rematch = async () => {
    setBusy(true);
    try {
      const r = await fetch(`/api/battles/${id}/rematch`, { method: "POST" });
      const j = (await r.json().catch(() => ({}))) as { path?: string; error?: string };
      if (!r.ok || !j.path) { setError(j.error ?? "Couldn't start the rematch."); setBusy(false); return; }
      router.push(j.path);
    } catch { setBusy(false); }
  };

  const start = async () => {
    if (!user) { openAuth("signup"); return; }
    setBusy(true);
    try {
      const r = await fetch(`/api/battles/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "start", total: available.length }) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); setError((j as { error?: string }).error ?? "Couldn't start this battle."); setBusy(false); return; }
      const draft: ExamSessionDraft = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        config: { examType: "CUSTOM_TEST", title: b.title, questionCount: available.length, ...(b.ownerScore !== null && b.maxScore !== null ? { challenge: { score: b.ownerScore, max: b.maxScore, by: b.ownerName } } : {}), battle: { id } },
        questions: available.map((questionId, i) => ({ questionId, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      };
      useExamStore.getState().loadDraft(draft.id, draft);
      track("test_started", null, "battle");
      await useExamRuntimeStore.getState().startSession(draft);
      router.push("/exam/session");
    } catch { setBusy(false); }
  };

  return (
    <div className="mx-auto w-full max-w-xl py-8">
      <section className="card-pastel p-6 text-center sm:p-8" data-tint="lilac" aria-label="Battle">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-lilac-ink)]"><Swords className="h-7 w-7" aria-hidden /></span>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[var(--tint-lilac-ink)]">Battle</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[var(--text-primary)]">{b.ownerScore === null ? (data.isOwner ? <>Your challenge</> : <>{b.ownerName} challenges you</>) : <>{b.ownerName} scored <span className="font-num">{b.ownerScore}</span> out of <span className="font-num">{b.maxScore}</span></>}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{b.title} · {b.questionIds.length} questions. Take the same questions in the real exam screen. {data.isOwner ? "You see when friends open it, how far they are and who wins." : `${b.ownerName} sees when you open it, how far you are and who wins.`}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><Hourglass className="h-3.5 w-3.5" /> {b.expired ? "Expired" : `Open until ${new Date(b.expiresAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`}</p>

        {data.isOwner ? (
          <div className="mt-6"><p className="text-sm text-[var(--text-secondary)]">This is your battle. Challenge friends below, or send the link to anyone, and watch them play.</p>{!b.expired && b.mode !== "live" && b.ownerScore === null ? <div><button type="button" onClick={start} disabled={busy || !isInitialized || !enough} className="btn-main mt-4 disabled:opacity-50">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting…</> : "Take it now"}</button></div> : null}{!b.expired && b.mode === "live" && b.ownerScore === null ? <LiveLobby battleId={b.id} isOwner canPlay={isInitialized && enough} onStart={start} /> : null}{!b.expired ? <InviteFriends battleId={b.id} /> : null}{!b.expired && b.mode !== "live" && b.ownerScore === null ? <div><MakeLiveButton battleId={b.id} /></div> : null}{b.ownerScore !== null && data.entries.length > 0 ? <div><button type="button" onClick={rematch} disabled={busy} className="btn-main mt-4">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />} Rematch</button></div> : null}<div><Link href="/battles" className="btn-soft mt-4 inline-flex">See live status</Link></div></div>
        ) : b.expired ? (
          <p className="mt-6 text-sm font-semibold text-[var(--tint-rose-ink)]">This battle has expired. Ask {b.ownerName} for a new one.</p>
        ) : done ? (
          <div className="mt-6">
            {b.ownerScore !== null && done.score !== null && done.maxScore ? (
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3 text-center" aria-label="Combined result">
                {[{ who: "You", score: Number(done.score), max: Number(done.maxScore) }, { who: b.ownerName, score: b.ownerScore, max: b.maxScore ?? 1 }].map((p, i, all) => {
                  const win = p.score > all[1 - i].score;
                  return (
                    <div key={p.who} className={`rounded-2xl border p-3 ${win ? "border-[var(--text-primary)] bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                      <p className="truncate text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{p.who}</p>
                      <p className="font-display text-3xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{p.score}</span><span className="text-base font-bold text-[var(--text-muted)]"> / <span className="font-num">{p.max}</span></span></p>
                      <p className="text-xs text-[var(--text-secondary)]"><span className="font-num">{Math.round((p.score / (p.max || 1)) * 100)}</span>% {win ? "· Winner" : ""}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="font-display text-xl font-extrabold text-[var(--text-primary)]">You scored <span className="font-num">{done.score}</span> / <span className="font-num">{done.maxScore}</span></p>
            )}
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{b.ownerScore === null ? `${b.ownerName} has not finished yet. Check the battle later to see who won.` : Number(done.score) > b.ownerScore ? `You beat ${b.ownerName}.` : Number(done.score) === b.ownerScore ? `You matched ${b.ownerName}.` : `${b.ownerName} is ahead. Try a rematch.`}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" onClick={rematch} disabled={busy} className="btn-main">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />} Rematch</button><Link href="/battles" className="btn-soft inline-flex">See the battle</Link></div>
          </div>
        ) : b.mode === "live" && user ? (
          <LiveLobby battleId={b.id} isOwner={false} canPlay={isInitialized && enough} onStart={start} />
        ) : (
          <>
            {isInitialized && !enough ? <p className="mt-3 text-xs text-[var(--tint-butter-ink)]">Only {available.length} of these {b.questionIds.length} questions are in your paper&apos;s bank, so this battle can&apos;t be fair for you. Switch your branch in Profile if it was set for another paper.</p> : null}
            <button type="button" onClick={start} disabled={busy || !isInitialized || !enough} className="btn-main mt-6 disabled:opacity-50">
              {busy || !isInitialized ? <><Loader2 className="h-4 w-4 animate-spin" /> {busy ? "Starting…" : "Loading questions…"}</> : !user ? "Sign in to take the battle" : "Take the battle"}
            </button>
            {!user && <p className="mt-3 text-xs text-[var(--text-muted)]">A free account lets {b.ownerName} see your progress and the winner.</p>}
          </>
        )}
      </section>
    </div>
  );
}
