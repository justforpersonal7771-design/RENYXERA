"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2 } from "lucide-react";

const KEY = "mentor_wide"; // the Mentor's own setting: one choice for the whole AI Desk
const get = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } };
const set = (v: boolean) => { try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* private mode */ } };

/** The "fill the app" setting, shared by the Mentor chat and the Tutor so the choice follows you from one to the other. */
export function useWide() {
  const [wide, setWide] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the saved choice once after mount
  useEffect(() => { setWide(get()); }, []);
  const toggle = useCallback(() => setWide((v) => { set(!v); return !v; }), []);
  return { wide, toggle };
}

/** The button that turns "fill the app" on and off; same look and size as the Mentor's. */
export function WideButton({ wide, onToggle }: { wide: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={wide} aria-label={wide ? "Shrink to the page" : "Fill the whole app"} title={wide ? "Shrink to the page" : "Fill the whole app"} className="btn-soft !h-10 !px-3">
      {wide ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    </button>
  );
}

/**
 * Holds a screen that can fill the whole window. Turning it on MOVES one container to <body> (above the top bar, which the page's own transform would otherwise trap it under)
 * and turning it off moves it back, so React never remounts the screen: no flash, no lost typing, no reloaded questions. Same method as the Mentor chat.
 */
export function WideFrame({ wide, children }: { wide: boolean; children: ReactNode }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- created after mount, so the server and the first client render agree
  useEffect(() => { setHost(document.createElement("div")); }, []);
  const slot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host) return;
    if (wide) { host.className = "mentor-wide fixed inset-0 z-[320] bg-[var(--background)] p-2 sm:p-3"; document.body.appendChild(host); }
    else { host.className = "flex min-h-0 flex-1 flex-col"; slot.current?.appendChild(host); }
    return () => { host.remove(); };
  }, [host, wide]);
  return (
    <>
      <div ref={slot} className="mentor-fill-slot" />
      {host ? createPortal(<div className={wide ? "flex h-full min-h-0 flex-col rounded-[var(--card-radius)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--tint-sky)_55%,var(--surface))] p-3 shadow-sm sm:p-4" : "flex min-h-0 flex-1 flex-col"}>{children}</div>, host) : null}
    </>
  );
}
