"use client";

/**
 * A question round inside the game (owner rule, 18 Nov: once in the game, nothing sends the player to the app).
 *   rush  Blitz Rush on one building: 5 minutes, 3 strikes, 2 free skips, 4 right in a row adds 10 seconds.
 *         Each answer is checked by the server key (/api/answers via ensureAnswers) before it counts.
 *   set   A fixed set (a friend challenge or a raid): no answers shown until the end, then graded once.
 * Either way the round is saved as a normal test and graded by the server (lib/game/train.ts), so the building
 * level and the battle score come from stored, server-graded data.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Loader2, Shield, SkipForward, Timer, X } from "lucide-react";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { ensureAnswers } from "@/lib/repository/answer-keys";
import { isResponseCorrect, marksFor } from "@/lib/grading";
import { byIds, poolFor, saveRound, type RoundAnswer } from "@/lib/game/train";
import { buzz, sfx, useGameSettings } from "@/lib/game/sound";
import type { RenderableQuestion } from "@/types/question.types";

export type RoundSpec =
  | { kind: "rush"; title: string; subjects: string[] }
  | { kind: "set"; title: string; questionIds: string[]; battleId: string; owner?: boolean };

export type RoundResult = { answered: number; correct: number; wrong: number; skipped: number; marks: number | null; max: number | null; stored: boolean; checked: number };

const RUSH_SECONDS = 300, STRIKES = 3, FREE_SKIPS = 2, STREAK_BONUS = 10, RUSH_CAP = 40;

const fmt = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, Math.floor(s)) % 60).padStart(2, "0")}`;

export function Round({ spec, onClose }: { spec: RoundSpec; onClose: (r: RoundResult | null) => void }) {
  const reduceOs = useReducedMotion();
  const reduce = useGameSettings((s) => s.reducedMotion) || !!reduceOs;
  const questions = useMemo<RenderableQuestion[]>(() => (spec.kind === "rush" ? poolFor(spec.subjects).slice(0, RUSH_CAP) : byIds(spec.questionIds)), [spec]);
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<string[]>([]);
  const [nat, setNat] = useState("");
  const [phase, setPhase] = useState<"ready" | "play" | "checking" | "feedback" | "saving" | "done">("ready");
  const [verdict, setVerdict] = useState<null | { ok: boolean; marks: number; unchecked?: boolean }>(null);
  const [strikes, setStrikes] = useState(0);
  const [skips, setSkips] = useState(0);
  const [streak, setStreak] = useState(0);
  const [left, setLeft] = useState(RUSH_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const answers = useRef<RoundAnswer[]>([]);
  const local = useRef({ correct: 0, wrong: 0, checked: 0, marks: 0 });
  const qStart = useRef(0);
  const startedAt = useRef(new Date().toISOString());
  const q = questions[i];
  const rush = spec.kind === "rush";

  // battle bookkeeping: the server records that this player started (progress pings are best effort)
  const ping = useCallback((body: object) => {
    if (spec.kind !== "set") return;
    void fetch(`/api/battles/${spec.battleId}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});
  }, [spec]);

  const finish = useCallback(async () => {
    if (phase === "saving" || phase === "done") return;
    setPhase("saving");
    const shown = answers.current;
    const res = await saveRound({ title: spec.title, answers: shown, startedAt: startedAt.current, elapsed, battleId: spec.kind === "set" ? spec.battleId : undefined }).catch(() => null);
    const answered = shown.filter((a) => a.selected?.length || (a.nat ?? "").trim()).length;
    const r: RoundResult = {
      answered, skipped: shown.length - answered, correct: local.current.correct, wrong: local.current.wrong, checked: local.current.checked,
      marks: res?.score ? res.score.score : null, max: res?.score ? res.score.max : null, stored: !!res?.score?.stored,
    };
    setResult(r);
    setPhase("done");
    sfx("end"); buzz([18, 40, 25, 40, 45]);
  }, [phase, spec, elapsed]);

  // clocks
  useEffect(() => {
    if (phase === "ready" || phase === "saving" || phase === "done") return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      if (rush) setLeft((l) => l - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [phase, rush]);
  useEffect(() => {
    if (!rush || phase === "ready" || phase === "saving" || phase === "done") return;
    if (left <= 15 && left > 0) sfx("tick");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time ran out: end the round once
    if (left <= 0) void finish();
  }, [left, rush, phase, finish]);

  const begin = () => {
    sfx("door-open"); buzz(10);
    setPhase("play"); qStart.current = Date.now();
    if (spec.kind === "set") ping({ action: "start", total: questions.length });
  };

  const record = (skip: boolean) => {
    const a: RoundAnswer = { id: q.question_id, selected: skip || q.question_type === "NAT" ? undefined : sel, nat: skip || q.question_type !== "NAT" ? undefined : nat, seconds: (Date.now() - qStart.current) / 1000 };
    answers.current = [...answers.current.filter((x) => x.id !== a.id), a];
    return a;
  };

  const next = () => {
    setVerdict(null); setSel([]); setNat("");
    if (i + 1 >= questions.length) { void finish(); return; }
    setI(i + 1); setPhase("play"); qStart.current = Date.now();
  };

  const lockIn = async () => {
    if (!q) return;
    const empty = q.question_type === "NAT" ? !nat.trim() : sel.length === 0;
    if (empty) return;
    sfx("lock"); buzz(18);
    const a = record(false);
    if (!rush) { ping({ action: "progress", answered: answers.current.length }); next(); return; }
    setPhase("checking");
    const ok = await ensureAnswers([q.question_id], { timeoutMs: 6000 }).catch(() => false);
    if (!ok) { setVerdict({ ok: false, marks: 0, unchecked: true }); setPhase("feedback"); return; }
    const right = isResponseCorrect(q, a.selected, a.nat);
    const m = marksFor(q.question_type, q.marks, true, right);
    local.current.checked++; local.current.marks += m;
    if (right) {
      local.current.correct++;
      const s = streak + 1; setStreak(s);
      if (s % 4 === 0) setLeft((l) => l + STREAK_BONUS);
      sfx("correct"); buzz([12, 30, 22]);
    } else {
      local.current.wrong++;
      setStreak(0);
      const st = strikes + 1; setStrikes(st);
      sfx("strike"); buzz([35, 25, 35]);
    }
    setVerdict({ ok: right, marks: m });
    setPhase("feedback");
  };

  // a right answer moves on by itself; a wrong one waits so the player can read the right option
  useEffect(() => {
    if (phase !== "feedback" || !verdict?.ok) return;
    const t = setTimeout(() => (strikes >= STRIKES ? void finish() : next()), reduce ? 500 : 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per verdict
  }, [phase, verdict]);

  const skip = () => {
    if (!q || phase !== "play") return;
    sfx("tap");
    record(true);
    if (rush) {
      const n = skips + 1; setSkips(n);
      if (n > FREE_SKIPS) { const st = strikes + 1; setStrikes(st); sfx("strike"); if (st >= STRIKES) { void finish(); return; } }
      setStreak(0);
    } else ping({ action: "progress", answered: answers.current.length });
    next();
  };

  const toggle = (id: string) => {
    if (phase !== "play") return;
    sfx("select"); buzz(10);
    setSel((s) => (q.question_type === "MSQ" ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]));
  };

  const quit = () => {
    if (phase === "ready" || phase === "done") { onClose(result); return; }
    if (!answers.current.length) { onClose(null); return; }
    void confirmDialog({ title: "End this round?", message: "The questions you answered are saved and graded. The rest are left out.", confirmLabel: "End round", tone: "danger" })
      .then((yes) => { if (yes) void finish(); });
  };

  // keyboard: 1-4 pick, Enter lock in / next, S skip
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) { if (e.key === "Enter") void lockIn(); return; }
      if (phase === "play" && q && q.question_type !== "NAT" && /^[1-6]$/.test(e.key)) { const o = q.options[Number(e.key) - 1]; if (o) toggle(o.option_id); }
      if (e.key === "Enter") { if (phase === "play") void lockIn(); else if (phase === "feedback") (strikes >= STRIKES ? void finish() : next()); }
      if ((e.key === "s" || e.key === "S") && phase === "play") skip();
      if (e.key === "Escape") quit();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const correctIds = verdict && !verdict.unchecked ? q?.options.filter((o) => o.is_correct).map((o) => o.option_id) ?? [] : [];

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={spec.title} className="g-round fixed inset-0 z-[90] flex flex-col"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.15 : 0.28, ease: [0.22, 1, 0.36, 1] }}>
      {/* top bar */}
      <header className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-3 sm:gap-4 sm:px-6 sm:pt-4">
        <button type="button" onClick={quit} aria-label="Leave the round" className="g-orb !min-w-0" style={{ ["--c" as string]: "#6b3f22" }}><span className="g-orb-face !h-11 !w-11 !rounded-2xl"><X className="h-5 w-5" aria-hidden /></span></button>
        <div className="min-w-0 flex-1">
          <p className="g-title truncate text-lg sm:text-2xl">{spec.title}</p>
          {phase !== "ready" && phase !== "done" && <p className="text-xs font-bold text-[var(--g-muted)] sm:text-sm">Question {Math.min(i + 1, questions.length)}{rush ? "" : ` of ${questions.length}`}{rush && streak >= 2 ? `, ${streak} right in a row` : ""}</p>}
        </div>
        {rush && phase !== "ready" && phase !== "done" && (
          <div className="flex items-center gap-1" aria-label={`${STRIKES - strikes} of ${STRIKES} shields left`}>
            {Array.from({ length: STRIKES }, (_, k) => (
              <motion.span key={k} animate={k < STRIKES - strikes ? { scale: 1, opacity: 1 } : { scale: reduce ? 1 : [1.3, 0.9], opacity: 0.35 }} transition={{ duration: 0.3 }}
                className={`grid h-9 w-9 place-items-center rounded-xl ${k < STRIKES - strikes ? "bg-[var(--g-brass)] text-[var(--g-ink)]" : "bg-[var(--g-felt-deep)] text-[var(--g-danger)]"}`}>
                <Shield className="h-5 w-5" aria-hidden fill="currentColor" />
              </motion.span>
            ))}
          </div>
        )}
        {phase !== "ready" && phase !== "done" && (
          <span className={`g-hud g-num !pl-3 text-lg ${rush && left <= 30 ? "text-[var(--g-danger)]" : ""}`} aria-label={rush ? `${left} seconds left` : `${elapsed} seconds`}>
            <Timer className="h-4 w-4" aria-hidden />{fmt(rush ? left : elapsed)}
          </span>
        )}
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-36 sm:px-6 lg:px-10">
        {phase === "ready" && (
          <div className="grid min-h-full place-items-center py-6">
            <div className="w-full max-w-xl text-center">
              <p className="g-title text-3xl sm:text-5xl">{rush ? "Blitz Rush" : "Ready?"}</p>
              {questions.length === 0 ? (
                <p className="mt-4 g-text-2">No questions for this building are in your bank yet.</p>
              ) : rush ? (
                <ul className="mx-auto mt-5 grid max-w-md gap-2 text-left text-[var(--g-text)]">
                  <li className="g-rule"><Timer className="h-5 w-5 shrink-0" aria-hidden /> 5 minutes. Four right in a row adds 10 seconds.</li>
                  <li className="g-rule"><Shield className="h-5 w-5 shrink-0" aria-hidden /> 3 shields. A wrong answer breaks one.</li>
                  <li className="g-rule"><SkipForward className="h-5 w-5 shrink-0" aria-hidden /> 2 free skips, then a skip breaks a shield.</li>
                  <li className="g-rule"><Check className="h-5 w-5 shrink-0" aria-hidden /> Real GATE marking. Every answer counts toward this building.</li>
                </ul>
              ) : (
                <p className="mt-4 g-text-2">{questions.length} questions. Answers and marks are shown at the end, graded by the server.</p>
              )}
              <div className="mt-7 flex justify-center gap-3">
                {questions.length > 0 && <button type="button" onClick={begin} className="g-play !min-h-[56px] !px-10 !text-xl">Start</button>}
                <button type="button" onClick={() => onClose(null)} className="g-btn-quiet">Back</button>
              </div>
            </div>
          </div>
        )}

        {q && (phase === "play" || phase === "checking" || phase === "feedback") && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={q.question_id} initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -28 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto grid w-full max-w-5xl gap-4">
              <motion.div className="g-parchment" animate={verdict && !verdict.ok && !verdict.unchecked && !reduce ? { x: [0, -5, 5, -3, 0] } : { x: 0 }} transition={{ duration: 0.28 }}>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide opacity-70">{q.subject}, {q.marks} mark{q.marks > 1 ? "s" : ""}, {q.question_type}{q.question_type === "MSQ" ? " (pick all that apply)" : ""}</p>
                <AstNodeRenderer nodes={q.contentAst} className="text-[17px] leading-relaxed" />
              </motion.div>
              <div className={`grid gap-2.5 ${q.question_type === "NAT" ? "" : "md:grid-cols-2"}`}>
                {q.question_type === "NAT" ? (
                  <label className="g-parchment block">
                    <span className="text-sm font-bold">Your answer (a number)</span>
                    <input value={nat} onChange={(e) => setNat(e.target.value.replace(/[^0-9.\-]/g, "").slice(0, 16))} inputMode="decimal" autoFocus disabled={phase !== "play"}
                      className="field-bare mt-2 w-full rounded-xl border-2 border-[#8c5732] bg-white/70 px-3 py-3 font-[family-name:var(--font-chakra)] text-2xl text-[var(--g-ink)] outline-none focus:border-[var(--g-brass-dark)]" aria-label="Numerical answer" />
                  </label>
                ) : q.options.map((o, k) => {
                  const on = sel.includes(o.option_id);
                  const isRight = correctIds.includes(o.option_id);
                  const state = verdict && !verdict.unchecked ? (isRight ? "right" : on ? "wrong" : "") : on ? "on" : "";
                  return (
                    <button key={o.option_id} type="button" onClick={() => toggle(o.option_id)} disabled={phase !== "play"} aria-pressed={on}
                      className={`g-opt ${state ? `is-${state}` : ""}`}>
                      <span className="g-opt-key" aria-hidden>{q.question_type === "MSQ" ? (on ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + k)) : String.fromCharCode(65 + k)}</span>
                      <span className="min-w-0 flex-1"><AstNodeRenderer nodes={o.contentAst} /></span>
                      {state === "right" && <Check className="h-5 w-5 shrink-0" aria-label="Correct option" />}
                      {state === "wrong" && <X className="h-5 w-5 shrink-0" aria-label="Your pick, wrong" />}
                    </button>
                  );
                })}
                <AnimatePresence>
                  {verdict && (
                    <motion.p initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} role="status"
                      className={`rounded-2xl px-4 py-3 text-base font-extrabold md:col-span-2 ${verdict.unchecked ? "bg-[var(--g-felt-deep)] text-[var(--g-text)]" : verdict.ok ? "bg-[#2e6b3b] text-[#eaf6e6]" : "bg-[#8e2f1f] text-[#fbe7df]"}`}>
                      {verdict.unchecked ? "Couldn't check this one right now. It is saved and graded at the end." : verdict.ok ? `Right. +${verdict.marks} mark${verdict.marks === 1 ? "" : "s"}` : `Wrong. ${verdict.marks < 0 ? `${verdict.marks.toFixed(2)} marks` : "No negative marks for this type"}${q.question_type === "NAT" ? "" : ". The right option is marked."}`}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          </AnimatePresence>
        )}

        {(phase === "saving" || phase === "done") && (
          <div className="grid min-h-full place-items-center py-6">
            <div className="w-full max-w-xl text-center">
              {phase === "saving" ? (
                <p className="flex items-center justify-center gap-2 g-title text-2xl"><Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" aria-hidden /> Grading your round</p>
              ) : result && (
                <>
                  <p className="g-title text-3xl sm:text-5xl">{rush ? (strikes >= STRIKES ? "Shields broken" : left <= 0 ? "Time" : "Round over") : "Done"}</p>
                  <dl className="mt-6 grid grid-cols-3 gap-2">
                    <Stat label="Answered" value={String(result.answered)} />
                    <Stat label={rush ? "Right" : "Skipped"} value={String(rush ? result.correct : result.skipped)} />
                    <Stat label="Marks" value={result.marks === null ? "–" : `${Math.round(result.marks * 100) / 100}/${result.max}`} />
                  </dl>
                  <p className="mt-4 text-sm g-text-2">
                    {result.stored ? "Saved to your account and graded by the server." : result.marks !== null ? "Graded. Sign in on this device to save it to your account." : "Saved on this device. It is graded when you are back online."}
                    {rush ? " Your building's level updates from it." : spec.kind === "set" && !spec.owner ? " The challenger sees your result in their inbox." : spec.kind === "set" ? " Your friend gets the same questions; you will see who won in your inbox." : ""}
                  </p>
                  <div className="mt-7 flex justify-center gap-3">
                    <button type="button" onClick={() => onClose(result)} className="g-play !min-h-[56px] !px-10 !text-xl">Back to the citadel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* thumb-zone actions */}
      {q && (phase === "play" || phase === "checking" || phase === "feedback") && (
        <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.9rem)] pt-6 [background:linear-gradient(transparent,var(--g-felt-deep)_45%)]">
          <div className="pointer-events-auto flex w-full max-w-xl gap-2">
            {phase === "feedback" && !verdict?.ok ? (
              <button type="button" onClick={() => (strikes >= STRIKES ? void finish() : next())} className="g-play !min-h-[56px] flex-1 !text-xl">{strikes >= STRIKES ? "See result" : "Next"}</button>
            ) : (
              <>
                <button type="button" onClick={skip} disabled={phase !== "play"} className="g-btn-quiet !min-h-[56px] shrink-0 !px-5">{rush && skips >= FREE_SKIPS ? "Skip (−1 shield)" : "Skip"}</button>
                <button type="button" onClick={() => void lockIn()} disabled={phase !== "play" || (q.question_type === "NAT" ? !nat.trim() : sel.length === 0)} className="g-play !min-h-[56px] flex-1 !text-xl disabled:opacity-50">
                  {phase === "checking" ? <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" aria-label="Checking" /> : rush ? "Lock in" : i + 1 >= questions.length ? "Finish" : "Lock in"}
                </button>
              </>
            )}
          </div>
        </footer>
      )}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[linear-gradient(180deg,var(--g-wood),var(--g-wood-dark))] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,220,170,0.3)]">
      <dd className="g-num text-3xl font-black text-[var(--g-text)]">{value}</dd>
      <dt className="text-xs font-bold text-[var(--g-muted)]">{label}</dt>
    </div>
  );
}
