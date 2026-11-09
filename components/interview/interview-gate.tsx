"use client";

import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

/** Asks the server once per page load whether this account may see the Interview section. Everything else in the section is also checked on the server. */
let pending: Promise<boolean> | null = null;
const ask = () => (pending ??= fetch("/api/interview/access", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { ok: false })).then((d: { ok?: boolean }) => !!d.ok).catch(() => false));

export function useInterviewAccess(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => { let off = false; void ask().then((v) => { if (!off) setOk(v); }); return () => { off = true; }; }, []);
  return ok;
}

/** The page shows only for allowed accounts; everyone else sees what any unknown page shows. */
export function InterviewGate({ children }: { children: React.ReactNode }) {
  const ok = useInterviewAccess();
  if (ok === null) return <div className="skeleton-shimmer h-40 w-full rounded-3xl" aria-hidden />;
  if (!ok) return <div className="grid min-h-[50vh] place-items-center text-center"><div><p className="font-display text-5xl font-extrabold text-[var(--text-primary)]">404</p><p className="mt-2 text-[var(--text-secondary)]">This page could not be found.</p></div></div>;
  return <>{children}</>;
}

const Ctx = createContext<null>(null);
export const InterviewCtx = { Provider: Ctx.Provider, use: () => useContext(Ctx) };

/** Small client helpers shared by the Interview pages. */
export const ivPost = (body: unknown) => fetch("/api/interview/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => undefined);
export type IvDoc = { id: string; book: string; book_title: string; kind: string; ord: number; title: string; meta: { star?: boolean; minutes?: number; lang?: string; expected?: string; level?: number; likelihood?: string } };
