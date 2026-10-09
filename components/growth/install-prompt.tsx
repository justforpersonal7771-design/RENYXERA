"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const DISMISS = "renyxera.install-dismissed";

/** Small, dismissible "install the app" card — only appears when the browser says the app can be installed. */
export function InstallPrompt() {
  const user = useAuthStore((s) => s.user);
  const [ev, setEv] = useState<InstallEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try { setHidden(localStorage.getItem(DISMISS) === "1"); } catch { setHidden(false); }
    const onPrompt = (e: Event) => { e.preventDefault(); setEv(e as InstallEvent); };
    const onInstalled = () => setEv(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  if (!user || !ev || hidden) return null;
  const dismiss = () => { setHidden(true); try { localStorage.setItem(DISMISS, "1"); } catch { /* ignore */ } };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-violet-500/25 bg-violet-500/5 px-4 py-3" role="region" aria-label="Install app">
      <Download className="h-5 w-5 shrink-0 text-violet-500" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-[var(--text-secondary)]"><span className="font-bold text-[var(--text-primary)]">Install RENYXERA</span> on your home screen for one-tap practice.</p>
      <button type="button" onClick={async () => { await ev.prompt(); const r = await ev.userChoice; if (r.outcome === "accepted") setEv(null); else dismiss(); }}
        className="h-9 shrink-0 rounded-lg bg-violet-600 px-3 text-xs font-bold text-white cursor-pointer">Install</button>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="shrink-0 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"><X className="h-4 w-4" /></button>
    </div>
  );
}
