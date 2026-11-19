"use client";

/** Infinite-scroll footer for long lists (speed pass, 19 Nov): loads the next page when it scrolls near view, with a button as a
 *  fallback (keyboard, or if the observer never fires). Renders nothing when everything is shown. */
import { useEffect, useRef } from "react";

export function LoadMore({ shown, total, step, onMore, label = "items" }: { shown: number; total: number; step: number; onMore: () => void; label?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const more = shown < total;
  useEffect(() => {
    if (!more || !ref.current) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) onMore(); }, { rootMargin: "600px 0px" });
    io.observe(ref.current); return () => io.disconnect();
  }, [more, shown, onMore]);
  if (!more) return null;
  return (
    <div ref={ref} className="p-3">
      <button type="button" onClick={onMore} className="btn-soft w-full justify-center text-xs">Show {Math.min(step, total - shown)} more {label} ({shown} of {total})</button>
    </div>
  );
}
