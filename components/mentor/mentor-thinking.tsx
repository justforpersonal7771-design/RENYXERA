"use client";

import { useEffect, useState } from "react";
import { MentorLogo } from "@/components/brand/mentor-logo";

/** The Mentor's "working on it" state: the flame breathes, the words change, placeholder lines pulse. Shared by the Mentor chat and the Tutor. */
export function MentorThinking({ label = "The Mentor is thinking", lines = true }: { label?: string; lines?: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep((s) => s + 1), 2200); return () => clearInterval(t); }, []);
  const words = ["Thinking", "Working it out", "Putting the answer together", "Almost there"];
  return (
    <div className="flex items-start gap-3" role="status" aria-live="polite" aria-label={label}>
      <MentorLogo className="mt-0.5 h-12" mode="think" />
      <div className="min-w-0 flex-1 pt-1">
        <p className="flex items-center gap-3"><span className="shimmer-text text-sm font-bold">{words[Math.min(step, words.length - 1)]}…</span></p>
        {lines && (
          <div className="mt-2 space-y-2" aria-hidden>
            {[92, 78, 55].map((w, i) => <span key={w} className="block h-2.5 rounded-full bg-[var(--surface-secondary)] motion-safe:animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 160}ms` }} />)}
          </div>
        )}
      </div>
    </div>
  );
}
