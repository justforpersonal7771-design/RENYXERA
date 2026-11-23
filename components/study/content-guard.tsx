"use client";

/**
 * Keeps bought lessons from being lifted wholesale (owner, 23 Nov 2026), while highlights and notes keep working.
 *  - Copy, cut, drag, right-click, print and save are blocked on the lesson; selecting text still works, because the highlight
 *    toolbar and notes are built on a selection. Typing fields (notes, search) are left alone.
 *  - Nothing is drawn over the lesson. Traceability is an invisible per-account fingerprint written into the prose by the server
 *    (lib/study/wire-guard.ts stampBlocks), so reading, highlights and notes look and behave exactly as before.
 * Honest limit: anything a browser can show, a determined person can still copy by hand or photograph. This raises the cost, makes
 * leaks traceable and, with the server-side checks in app/api/study/chapter, stops bulk downloading. The licence terms back it up.
 */
import { useEffect, type ReactNode } from "react";
import { useToastStore } from "@/store/use-toast-store";

const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function ContentGuard({ children }: { children: ReactNode }) {
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
  return (
    <>
      {children}
    </>
  );
}
