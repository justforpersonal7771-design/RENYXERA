"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ShieldCheck, Loader2 } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => { scriptPromise = null; reject(new Error("Turnstile failed to load")); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export interface TurnstileHandle {
  /** Get a fresh token for the next submit (tokens are single-use). */
  reset: () => void;
}

/**
 * Cloudflare Turnstile (Module 4G bot gate). Supabase Auth has Captcha protection on, so
 * password sign-in, sign-up and reset must send this token — Supabase verifies it
 * server-side with the secret key. "Managed" mode: most people only see the small
 * "verified" line; suspicious traffic gets a quick check.
 */
export const TurnstileWidget = forwardRef<TurnstileHandle, { onToken: (token: string | null) => void }>(
  function TurnstileWidget({ onToken }, ref) {
    const box = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const [state, setState] = useState<"loading" | "ready" | "verified" | "error">("loading");
    const { resolvedTheme } = useTheme();
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenRef.current(null);
        setState("ready");
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      },
    }));

    useEffect(() => {
      if (!SITE_KEY) { setState("error"); return; }
      let cancelled = false;
      loadScript()
        .then(() => {
          if (cancelled || !box.current || !window.turnstile) return;
          widgetId.current = window.turnstile.render(box.current, {
            sitekey: SITE_KEY,
            theme: resolvedTheme === "dark" ? "dark" : "light",
            appearance: "interaction-only",
            callback: (t: string) => { setState("verified"); onTokenRef.current(t); },
            "expired-callback": () => { setState("ready"); onTokenRef.current(null); },
            "error-callback": () => { setState("error"); onTokenRef.current(null); },
          });
          setState("ready");
        })
        .catch(() => !cancelled && setState("error"));
      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resolvedTheme]);

    return (
      <div className="flex flex-col items-center gap-1.5">
        <div ref={box} />
        <p aria-live="polite" className={`flex items-center gap-1.5 text-[11px] font-medium ${
          state === "verified" ? "text-emerald-600 dark:text-emerald-400" : state === "error" ? "text-rose-500" : "text-[var(--text-muted)]"
        }`}>
          {state === "verified" ? <ShieldCheck className="w-3.5 h-3.5" /> : state === "error" ? null : <Loader2 className="w-3 h-3 animate-spin" />}
          {state === "verified" ? "Verified you're human" : state === "error" ? "Security check couldn't load. Refresh the page and try again." : "Running a quick security check…"}
        </p>
      </div>
    );
  }
);
