"use client";

import { track } from "@/lib/growth/track";
import { useEffect, useRef, useState } from "react";
import { Download, Link2, Loader2, Share2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { paperLabel } from "@/lib/branch/current";

export type ShareStat = { label: string; value: string };

/**
 * Shareable result card (5E). Drawn on a canvas in the browser — nothing is uploaded —
 * and shared through the phone's share sheet, or downloaded as a PNG on desktop. The
 * name on it follows the person's leaderboard display choice (anonymous by default);
 * never an email.
 */
export function ShareResultButton({ title, subtitle, stats, getLink, className = "" }: { title: string; subtitle: string; stats: ShareStat[]; getLink?: () => string; className?: string }) {
  const profile = useAuthStore((s) => s.profile);
  const toast = useToastStore((s) => s.show);
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!menu) return;
    const out = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setMenu(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("pointerdown", out); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", out); document.removeEventListener("keydown", key); };
  }, [menu]);

  // A link anyone can open: it shows the score and lets them take the same questions (the "Beat my score" page).
  const shareLink = async () => {
    setMenu(false);
    track("share_clicked", null, "result_link");
    const url = getLink?.() ?? "https://gate.renyxera.workers.dev/";
    const text = `${title}: ${stats.map((s) => `${s.label} ${s.value}`).join(", ")} on RENYXERA. Can you beat it?`;
    try {
      if (navigator.share) await navigator.share({ title: "My RENYXERA result", text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); toast("Link copied. Paste it anywhere to share.", "success"); }
    } catch (e) { if ((e as Error)?.name !== "AbortError") toast("Couldn't share the link. Try again.", "error"); }
  };

  const who = (() => {
    const d = profile?.leaderboard_display ?? "anonymous";
    if (d === "username_student_id" && profile?.username) return `@${profile.username} · ${profile.student_id ?? ""}`;
    if (d === "username" && profile?.username) return `@${profile.username}`;
    return `Aspirant ${(profile?.student_id ?? "0000").slice(-4)}`;
  })();

  const share = async () => {
    setMenu(false);
    track("share_clicked");
    setBusy(true);
    try {
      const blob = await drawCard({ title, subtitle, stats, who });
      const file = new File([blob], "renyxera-result.png", { type: "image/png" });
      const text = `${title} — ${stats.map((s) => `${s.label} ${s.value}`).join(" · ")} on RENYXERA`;
      const download = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "renyxera-result.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast("Result card downloaded", "success");
      };
      // Share sheet on phones only: desktop share sheets (Windows/macOS) often fail silently
      // with files, so desktop always gets the PNG.
      const phone = matchMedia("(pointer: coarse)").matches;
      if (phone && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text, url: "https://gate.renyxera.workers.dev/mocks" });
        } catch (e) {
          if ((e as Error)?.name === "AbortError") return;
          download();
        }
      } else {
        download();
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") toast("Couldn't create the card — try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span ref={box} className="relative flex">
      <button type="button" onClick={() => setMenu((o) => !o)} disabled={busy} aria-haspopup="menu" aria-expanded={menu}
        className={`group inline-flex flex-1 items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--text-primary)] hover:border-violet-500/50 disabled:opacity-60 cursor-pointer ${className}`}>
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 text-violet-500 transition-transform group-hover:scale-110" />} <span className="whitespace-nowrap">Share<span className="hidden sm:inline"> result</span></span>
      </button>
      {menu && (
        <div role="menu" aria-label="Share your result" className="absolute bottom-full left-0 z-30 mb-2 w-60 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-2xl">
          <button type="button" role="menuitem" onClick={shareLink} className="flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-secondary)]"><Link2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden /><span><span className="block text-sm font-bold text-[var(--text-primary)]">Share a link</span><span className="block text-xs text-[var(--text-muted)]">Friends see your score and can take the same questions</span></span></button>
          <button type="button" role="menuitem" onClick={share} className="flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-secondary)]"><Download className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden /><span><span className="block text-sm font-bold text-[var(--text-primary)]">Download card</span><span className="block text-xs text-[var(--text-muted)]">A picture of your result to post</span></span></button>
        </div>
      )}
    </span>
  );
}

async function drawCard({ title, subtitle, stats, who }: { title: string; subtitle: string; stats: ShareStat[]; who: string }): Promise<Blob> {
  const W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const font = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  await document.fonts?.ready;

  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#3730a3"); bg.addColorStop(0.5, "#7c3aed"); bg.addColorStop(1, "#c026d3");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = (x: number, y: number, r: number, col: string) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, "transparent");
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
  };
  glow(900, 150, 420, "rgba(103,232,249,0.35)"); glow(150, 1250, 480, "rgba(252,211,77,0.25)");

  g.fillStyle = "#fff";
  g.font = `800 56px ${font}`; g.fillText("RENYXERA", 80, 130);
  g.font = `500 30px ${font}`; g.globalAlpha = 0.8; g.fillText(`GATE ${paperLabel()} · All-India practice platform`, 80, 180); g.globalAlpha = 1;

  g.font = `800 64px ${font}`; wrap(g, title, 80, 330, W - 160, 76);
  g.font = `500 34px ${font}`; g.globalAlpha = 0.85; g.fillText(subtitle, 80, 500); g.globalAlpha = 1;

  // Stat tiles, two per row
  const tw = (W - 160 - 40) / 2, th = 210;
  stats.slice(0, 4).forEach((s, i) => {
    const x = 80 + (i % 2) * (tw + 40), y = 580 + Math.floor(i / 2) * (th + 40);
    g.fillStyle = "rgba(255,255,255,0.14)"; round(g, x, y, tw, th, 36); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 2; g.stroke();
    g.fillStyle = "rgba(255,255,255,0.75)"; g.font = `700 28px ${font}`; g.fillText(s.label.toUpperCase(), x + 36, y + 64);
    g.fillStyle = "#fff"; g.font = `800 84px ${font}`; g.fillText(s.value, x + 36, y + 160);
  });

  g.fillStyle = "#fff"; g.font = `700 38px ${font}`; g.fillText(who, 80, 1170);
  g.globalAlpha = 0.8; g.font = `500 30px ${font}`; g.fillText("Free weekly All-India Mock · gate.renyxera.workers.dev", 80, 1230); g.globalAlpha = 1;

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob"))), "image/png"));
}

function round(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  // At most two lines; the second is cut with an ellipsis if it still doesn't fit.
  const words = text.split(" "); const lines: string[] = []; let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (g.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t;
  }
  lines.push(line);
  const out = lines.slice(0, 2);
  if (lines.length > 2) { let l = out[1]; while (l && g.measureText(`${l}…`).width > max) l = l.slice(0, -1); out[1] = `${l}…`; }
  out.forEach((l, i) => g.fillText(l, x, y + i * lh));
}
