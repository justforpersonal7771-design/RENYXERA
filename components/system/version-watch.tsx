"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useToastStore } from "@/store/use-toast-store";

const MINE = process.env.NEXT_PUBLIC_BUILD_ID;
const EVERY = 5 * 60_000;
const KEY = "renyxera_version_reload_at";

/** At most one automatic reload a minute, so a stubborn cache can never cause a loop. */
function reloadOnce() {
  try {
    const at = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - at < 60_000) return;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch { /* storage blocked: still reload once */ }
  window.location.reload();
}

/**
 * Keeps an open tab on the current version. If a page load ever falls back to an older
 * copy (the offline cache answers when the network blips, or a tab has been open across a
 * deploy), features added since would silently be missing. On focus and every few minutes
 * this compares the tab's build with the live one and reloads quietly when they differ —
 * except during a test, where it only says so (a reload mid-exam is never forced).
 */
export function VersionWatch() {
  const pathname = usePathname();

  useEffect(() => {
    if (!MINE) return;
    let last = 0;
    const check = async () => {
      if (Date.now() - last < 30_000 || document.hidden || !navigator.onLine) return;
      last = Date.now();
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { build } = (await res.json()) as { build: string | null };
        if (!build || build === MINE) return;
        if (window.location.pathname.startsWith("/exam/session")) {
          useToastStore.getState().show("A newer version is available — it will load after your test.", "info");
          return;
        }
        reloadOnce();
      } catch { /* offline: try again later */ }
    };
    void check();
    const t = setInterval(check, EVERY);
    const onVis = () => { if (!document.hidden) void check(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  // Also check on every in-app navigation (cheap: rate-limited above).
  useEffect(() => {
    if (!MINE || pathname?.startsWith("/exam/session")) return;
    (async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const { build } = (await res.json()) as { build: string | null };
        if (build && build !== MINE) reloadOnce();
      } catch { /* ignore */ }
    })();
  }, [pathname]);

  return null;
}
