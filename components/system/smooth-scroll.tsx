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
  return null;
}
