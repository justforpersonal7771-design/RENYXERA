"use client";

/**
 * Interview-date plan: set the day of the interview and get a daily pace from your own numbers.
 * Chapters left / days left, flashcards due today, and a mock every other day, with the last day kept for revision only.
 * The date is kept on this device (IST dates throughout).
 */
import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { istDateStr } from "@/lib/time/ist";

const KEY = "renyxera_interview_date";
const read = () => { try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; } };

export function InterviewDatePlan({ chaptersLeft, due }: { chaptersLeft: number; due: number }) {
  const [date, setDate] = useState<string>(() => (typeof window === "undefined" ? "" : read()));
  const save = (v: string) => { setDate(v); try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch { /* private mode */ } };
  const today = istDateStr();
  const days = date ? Math.round((Date.parse(`${date}T00:00:00+05:30`) - Date.parse(`${today}T00:00:00+05:30`)) / 86_400_000) : null;
  const studyDays = days != null ? Math.max(1, days - 1) : 0;                     // the day before is for revision only
  const perDay = days != null && days > 0 ? Math.ceil(chaptersLeft / studyDays) : 0;
  const mocks = days != null && days > 0 ? Math.max(1, Math.floor(studyDays / 2)) : 0;

  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="peri" aria-label="Interview date plan">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)]"><CalendarClock className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">Your interview date</p>
          <p className="text-sm text-[var(--text-secondary)]">Set it and get a daily pace that finishes on time.</p>
        </div>
        <div className="w-48"><DatePicker value={date} onChange={save} min={today} placeholder="Pick the day" /></div>
      </div>
      {days != null && (
        days < 0 ? <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">That date has passed. Pick the next one.</p>
        : days === 0 ? <p className="mt-4 font-display text-xl font-extrabold text-[var(--text-primary)]">It is today. Read your Last moments pack, then stop.</p>
        : (
          <>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[[`${days}`, days === 1 ? "day left" : "days left"], [`${perDay}`, perDay === 1 ? "chapter a day" : "chapters a day"], [`${due}`, "flashcards due today"], [`${mocks}`, mocks === 1 ? "mock before then" : "mocks before then"]].map(([v, l]) => (
                <li key={l} className="card-inset px-4 py-3"><p className="font-display text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">{v}</p><p className="text-xs font-bold text-[var(--text-secondary)]">{l}</p></li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {chaptersLeft ? `${chaptersLeft} chapters left. ` : "Every chapter read. "}Take a mock every other day; keep the day before for <Link href="/interview/last-moments" className="font-bold underline">Last moments</Link> only.
            </p>
          </>
        )
      )}
    </section>
  );
}
