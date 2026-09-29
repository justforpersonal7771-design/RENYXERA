"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/** 7E: invite link. Remembers the code (claimed after sign-up) and opens the app. */
export default function InviteLink() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  useEffect(() => {
    try { if (/^[a-z0-9]{6,12}$/i.test(code ?? "")) localStorage.setItem("renyxera:ref", String(code).toLowerCase()); } catch {}
    router.replace("/?invited=1");
  }, [code, router]);
  return <div className="h-dvh grid place-items-center text-sm text-[var(--text-muted)]">Opening RENYXERA…</div>;
}
