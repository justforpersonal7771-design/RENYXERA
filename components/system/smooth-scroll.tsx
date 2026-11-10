"use client";

/**
 * Smooth, inertial wheel scrolling for the app's scroll area (#app-scroll in client-layout).
 * Off in the exam engine (exact, instant scrolling matters there) and for reduced motion.
 * Touch keeps the native scroll; in-page anchor links glide to their target.
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();
  const off = pathname?.startsWith("/exam/session");
  useEffect(() => {
    const wrapper = document.getElementById("app-scroll");
    if (!wrapper || off || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ wrapper, content: wrapper.firstElementChild as HTMLElement, lerp: 0.1, smoothWheel: true, allowNestedScroll: true, anchors: { offset: -16 } });
    let raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [off, pathname]);
  // Every screen change starts at the top (tools, tabs, any link). One-screen pages (data-fill-height)
  // mark the scroll box so it doesn't scroll on desktop (set here instead of a costly CSS :has rule).
  useEffect(() => {
    const sc = document.getElementById("app-scroll");
    if (!sc) return;
    sc.scrollTo({ top: 0 });
    const mark = () => sc.toggleAttribute("data-one-screen", !!sc.querySelector(".page-shell > [data-fill-height]"));
    mark(); const t = setTimeout(mark, 400);
    return () => clearTimeout(t);
  }, [pathname]);

  // After a new deploy, an open tab can ask for a code file that no longer exists ("Failed to load
  // chunk") and the next screen hangs on its spinner. Reload once to pick up the new version.
  useEffect(() => {
    const isChunk = (m: unknown) => /Loading chunk|Failed to load chunk|ChunkLoadError|dynamically imported module/i.test(String(m));
    const recover = (m: unknown) => {
      if (!isChunk(m)) return;
      try { if (sessionStorage.getItem("chunk_reload") === location.pathname) return; sessionStorage.setItem("chunk_reload", location.pathname); } catch { /* ignore */ }
      location.reload();
    };
    const onErr = (e: ErrorEvent) => recover(e.message);
    const onRej = (e: PromiseRejectionEvent) => recover((e.reason as Error)?.message ?? e.reason);
    window.addEventListener("error", onErr); window.addEventListener("unhandledrejection", onRej);
    return () => { window.removeEventListener("error", onErr); window.removeEventListener("unhandledrejection", onRej); };
  }, []);
  return null;
}
