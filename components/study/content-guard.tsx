"use client";

/**
 * Keeps bought lessons from being lifted wholesale (owner, 23 Nov 2026), while highlights and notes keep working.
 *  - Copy, cut, drag, right-click, print and save are blocked on the lesson; selecting text still works, because the highlight
 *    toolbar and notes are built on a selection. Typing fields (notes, search) are left alone.
 *  - A faint watermark carrying a short code of the reader's account and today's date sits over the page: a screenshot or a photo of
 *    the screen then points back to the account it came from.
 * Honest limit: anything a browser can show, a determined person can still copy by hand or photograph. This raises the cost, makes
 * leaks traceable and, with the server-side checks in app/api/study/chapter, stops bulk downloading. The licence terms back it up.
 */
import { useEffect, useMemo, type ReactNode } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { istDateStr } from "@/lib/time/ist";

const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function ContentGuard({ children }: { children: ReactNode }) {
  const uid = useAuthStore((s) => s.user?.id ?? null);
  useEffect(() => {
    let last = 0;
    const say = () => { const n = Date.now(); if (n - last > 4000) { last = n; useToastStore.getState().show("Lesson text can't be copied. Use Highlight and Notes to keep what matters.", "info"); } };
    const stop = (e: Event) => { if (typing(e.target)) return; e.preventDefault(); say(); };
    const key = (e: KeyboardEvent) => {
      if (typing(e.target) || !(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "p" || k === "s") { e.preventDefault(); say(); }
    };
    const quiet = (e: Event) => { if (!typing(e.target)) e.preventDefault(); };
    document.addEventListener("copy", stop); document.addEventListener("cut", stop);
    document.addEventListener("contextmenu", quiet); document.addEventListener("dragstart", quiet);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("copy", stop); document.removeEventListener("cut", stop); document.removeEventListener("contextmenu", quiet); document.removeEventListener("dragstart", quiet); document.removeEventListener("keydown", key); };
  }, []);
  const mark = useMemo(() => {
    const code = (uid ?? "guest").replace(/-/g, "").slice(0, 8).toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='190'><text x='20' y='110' transform='rotate(-24 160 95)' font-family='sans-serif' font-size='15' font-weight='700' fill='%23000' fill-opacity='.55'>RENYXERA · ${code} · ${istDateStr(new Date())}</text></svg>`;
    return `url("data:image/svg+xml,${svg.replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E")}")`;
  }, [uid]);
  return (
    <>
      {children}
      <div aria-hidden className="rx-watermark pointer-events-none fixed inset-0 z-[5] opacity-[0.018] dark:opacity-[0.03] dark:invert" style={{ backgroundImage: mark }} />
    </>
  );
}
