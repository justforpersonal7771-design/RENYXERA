"use client";

/**
 * Cross-browser full screen with a fallback. Uses the Fullscreen API (standard or the
 * webkit-prefixed one older Safari needs); where it's unavailable or refused — iPhone
 * Safari has no element full screen at all — the element is pinned over the whole
 * viewport instead ("pseudo" full screen). Either way the rest of the app hears about it
 * through the "renyxera:fullscreen" event, so one state drives every control.
 */
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

export const FS_EVENT = "renyxera:fullscreen";
const PSEUDO = "pseudo-fullscreen";

export function nativeFullscreenElement(): Element | null {
  const d = document as FsDoc;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

export function fullscreenElement(): Element | null {
  return nativeFullscreenElement() ?? document.querySelector(`.${PSEUDO}`);
}

export function isFullscreen(): boolean {
  return !!fullscreenElement();
}

function announce() {
  window.dispatchEvent(new CustomEvent(FS_EVENT, { detail: { active: isFullscreen() } }));
}

function enterPseudo(el: HTMLElement) {
  el.classList.add(PSEUDO);
  document.documentElement.classList.add("has-pseudo-fullscreen");
  announce();
}

function exitPseudo() {
  document.querySelectorAll(`.${PSEUDO}`).forEach((e) => e.classList.remove(PSEUDO));
  document.documentElement.classList.remove("has-pseudo-fullscreen");
  announce();
}

export async function enterFullscreen(el: HTMLElement | null) {
  if (!el) return;
  const f = el as FsEl;
  const request = f.requestFullscreen?.bind(f) ?? f.webkitRequestFullscreen?.bind(f);
  if (request) {
    try {
      await request();
      return;
    } catch { /* refused (iframe, policy, iOS) — fall back below */ }
  }
  enterPseudo(el);
}

export async function exitFullscreen() {
  if (document.querySelector(`.${PSEUDO}`)) exitPseudo();
  if (nativeFullscreenElement()) {
    const d = document as FsDoc;
    try { await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.()); } catch { /* already out */ }
  }
}

let wired = false;
/** Re-broadcast native changes (incl. Esc / system gestures) as FS_EVENT; Esc also exits pseudo mode. */
export function wireFullscreenEvents() {
  if (wired || typeof document === "undefined") return;
  wired = true;
  document.addEventListener("fullscreenchange", announce);
  document.addEventListener("webkitfullscreenchange", announce as EventListener);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector(`.${PSEUDO}`)) exitPseudo();
  });
}
