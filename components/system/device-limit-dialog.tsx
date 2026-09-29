"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Laptop, Loader2, ShieldAlert, Smartphone } from "lucide-react";
import { deviceHeartbeat, isMobileLabel, type DeviceLimit } from "@/lib/devices/device";
import { useToastStore } from "@/store/use-toast-store";

const DISMISS_KEY = "renyxera:device-limit-dismissed";

/**
 * 7D: Pro is limited to a couple of devices. When a new device hits the limit, the student
 * chooses which device to sign out (that device's session ends — the "new login kicks the
 * old one out" pattern) or keeps using the free plan here.
 */
export function DeviceLimitDialog() {
  const [info, setInfo] = useState<DeviceLimit | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      try { if (sessionStorage.getItem(DISMISS_KEY)) return; } catch {}
      setInfo((e as CustomEvent<DeviceLimit>).detail);
    };
    window.addEventListener("renyxera:device-limit", on);
    return () => window.removeEventListener("renyxera:device-limit", on);
  }, []);

  const dismiss = () => { try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {} setInfo(null); };
  const signOutDevice = async (id: string) => {
    setBusy(id);
    try {
      const r = await fetch("/api/devices", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "revoke", id }) });
      if (!r.ok) throw new Error();
      setInfo(null);
      const again = await deviceHeartbeat();
      if (!again?.deviceLimit) useToastStore.getState().show("Done — Pro now works on this device.", "success");
    } catch {
      useToastStore.getState().show("Couldn't sign that device out. Please try again.", "error");
    } finally { setBusy(null); }
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {info && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div role="dialog" aria-modal="true" aria-label="Device limit" className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}>
            <span className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 grid place-items-center"><ShieldAlert className="w-5 h-5" /></span>
            {info.deviceLimit === "cooldown" ? (
              <>
                <h2 className="mt-3 text-lg font-extrabold text-[var(--text-primary)]">Too many new devices this month</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{info.message}</p>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-lg font-extrabold text-[var(--text-primary)]">Pro is active on {info.limit} devices</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">To use Pro here, sign one of them out. That device will be signed out right away.</p>
                <ul className="mt-4 space-y-2">
                  {(info.devices ?? []).map((d) => (
                    <li key={d.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3">
                      <span className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] grid place-items-center text-[var(--text-secondary)]">{isMobileLabel(d.label) ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}</span>
                      <span className="flex-1 min-w-0"><span className="block text-sm font-semibold text-[var(--text-primary)] truncate">{d.label}</span><span className="block text-[11px] text-[var(--text-muted)]">Last active {new Date(d.last_seen_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></span>
                      <button type="button" onClick={() => signOutDevice(d.id)} disabled={!!busy} className="h-9 px-3 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-500/20 disabled:opacity-60 inline-flex items-center gap-1.5 cursor-pointer">
                        {busy === d.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Sign out
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button type="button" onClick={dismiss} className="mt-5 w-full h-10 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Use the free plan on this device</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
