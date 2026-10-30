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
export function ShareResultButton({ title, subtitle, stats, getLink, className = "" }: { title: string; subtitle: string; stats: ShareStat[]; getLink?: () => string | Promise<string>; className?: string }) {
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
    const url = (await getLink?.()) ?? "https://gate.renyxera.workers.dev/";
    const text = `${title}: ${stats.map((s) => `${s.label} ${s.value}`).join(", ")} on RENYXERA. Can you beat it?`;
    try {
      if (navigator.share) await navigator.share({ title: "My RENYXERA result", text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); toast("Link copied. Paste it anywhere to share.", "success"); }
    } catch (e) {
      const name = (e as Error)?.name;
      if (name === "NotAllowedError") { // the share sheet needs a fresh tap after a server round trip: copy instead
        try { await navigator.clipboard.writeText(`${text} ${url}`); toast("Link copied. Paste it anywhere to share.", "success"); return; } catch { /* fall through */ }
      }
      if (name !== "AbortError") toast("Couldn't share the link. Try again.", "error");
    }
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
        <div role="menu" aria-label="Share your result" className="absolute bottom-full left-0 z-30 mb-2 w-60 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 popover-surface">
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

  // Social-card style (scripts/make-og.py result_base): branch-tinted background, RENYXERA lockup, glowing
  // branch logo and URL come from the base image; title, branch line and scores are drawn here in the app fonts.
  const fam = (v: string) => { const el = document.createElement("span"); el.style.fontFamily = `var(${v})`; document.body.appendChild(el); const f = getComputedStyle(el).fontFamily; el.remove(); return f || font; };
  const display = fam("--font-display"), serif = fam("--font-serif");
  const INK = "#16123a", MUTED = "#58508c";
  const BR: Record<string, [string, string, string]> = {
    CS: ["gate-cse", "Computer Science & IT", "#4f46e5"], EC: ["gate-ece", "Electronics & Communication", "#0891b2"], EE: ["gate-ee", "Electrical Engineering", "#d97706"],
    ME: ["gate-me", "Mechanical Engineering", "#dc2626"], CE: ["gate-ce", "Civil Engineering", "#059669"], DA: ["gate-da", "Data Science & AI", "#7c3aed"],
  };
  const [slug, branchName, accent] = BR[paperLabel()] ?? BR.CS;
  const base = new Image(); base.src = `/og/result/${slug}.png`;
  try { await base.decode(); g.drawImage(base, 0, 0, W, H); } catch { g.fillStyle = "#faf8ff"; g.fillRect(0, 0, W, H); }

  g.fillStyle = accent; g.font = `italic 600 44px ${serif}`; g.fillText(branchName, 72, 520);
  g.fillStyle = INK; g.font = `800 72px ${display}`; wrap(g, title, 72, 330, 700, 82);
  g.fillStyle = MUTED; g.font = `600 30px ${font}`; g.fillText(subtitle, 72, 580);

  // Score tiles: white plates with soft accent shadow, like the social-card chips.
  const tw = (W - 144 - 28) / 2, th = 210;
  stats.slice(0, 4).forEach((st, i) => {
    const x = 72 + (i % 2) * (tw + 28), y = 640 + Math.floor(i / 2) * (th + 28);
    g.save(); g.shadowColor = accent + "40"; g.shadowBlur = 30; g.shadowOffsetY = 10;
    g.fillStyle = "rgba(255,255,255,0.94)"; round(g, x, y, tw, th, 40); g.fill(); g.restore();
    g.strokeStyle = accent + "55"; g.lineWidth = 2; round(g, x, y, tw, th, 40); g.stroke();
    g.fillStyle = MUTED; g.font = `600 28px ${font}`; g.fillText(st.label.charAt(0).toUpperCase() + st.label.slice(1).toLowerCase(), x + 36, y + 64);
    g.fillStyle = i === 0 ? accent : INK; g.font = `800 84px ${display}`; g.fillText(st.value, x + 36, y + 162);
  });

  g.fillStyle = INK; g.font = `700 38px ${display}`; g.fillText(who, 72, 1180);
  g.fillStyle = MUTED; g.font = `500 28px ${font}`; g.fillText("Practise free with every official GATE question", 72, 1222);

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
