"use client";

import { useState } from "react";
import { Check, Link2, Send } from "lucide-react";

/** "Can you solve this?" share row for public question pages (growth loop L-1). Links carry
 *  utm_medium=share so shared visits are attributed; nothing is tracked beyond that. */
export function ShareQuestion({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const tagged = (source: string) => `${url}?utm_source=${source}&utm_medium=share&utm_campaign=share_q`;
  const text = `Can you solve this GATE question? ${label}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(tagged("copy")); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const btn = "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] transition hover:border-violet-400/60 hover:text-[var(--text-primary)] hover:-translate-y-px";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold text-[var(--text-muted)]">Challenge a friend:</span>
      <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${text} ${tagged("whatsapp")}`)}`}>
        <Send className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp
      </a>
      <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(tagged("telegram"))}&text=${encodeURIComponent(text)}`}>
        <Send className="w-3.5 h-3.5 text-sky-500" /> Telegram
      </a>
      <button type="button" onClick={copy} className={`${btn} cursor-pointer`}>
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
