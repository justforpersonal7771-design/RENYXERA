"use client";

import { useState } from "react";
import { Download, Share2, UserRound } from "lucide-react";
import { track } from "@/lib/growth/track";

/**
 * Share card with optional personalisation. The default card is the plain brand card. Name, username and student ID
 * are added only if the student ticks the box for that field and types it; nothing is read from the account or sent
 * anywhere. The image is drawn in the browser, then shared as a file (or downloaded).
 */
export function ShareCard({ link, text }: { link: string; text: string }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", username: "", sid: "" });
  const [on, setOn] = useState({ name: false, username: false, sid: false });
  const [busy, setBusy] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const draw = async (): Promise<Blob | null> => {
    const img = new Image();
    img.src = "/og/default.png";
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 1200; c.height = 630;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0, 1200, 630);
    const parts = [on.name && f.name.trim(), on.username && f.username.trim() && `@${f.username.trim().replace(/^@/, "")}`, on.sid && f.sid.trim() && `ID ${f.sid.trim()}`].filter(Boolean) as string[];
    if (avatar) {
      const av = new Image(); av.src = avatar; await av.decode();
      g.save(); g.beginPath(); g.arc(1040, 140, 80, 0, Math.PI * 2); g.clip();
      const m = Math.min(av.width, av.height); g.drawImage(av, (av.width - m) / 2, (av.height - m) / 2, m, m, 960, 60, 160, 160); g.restore();
      g.lineWidth = 6; g.strokeStyle = "#6366f1"; g.beginPath(); g.arc(1040, 140, 80, 0, Math.PI * 2); g.stroke();
    }
    if (parts.length) {
      // replace the call-to-action pill with the sender line
      g.fillStyle = "#faf8ff"; g.fillRect(40, 456, 640, 96);
      g.fillStyle = "#6366f1"; g.beginPath(); g.roundRect(64, 470, 640, 68, 34); g.fill();
      g.fillStyle = "#fff"; g.font = "700 27px Manrope, system-ui, sans-serif";
      g.fillText(`Shared by ${parts.join(" · ")}`.slice(0, 54), 96, 513);
    }
    return new Promise((r) => c.toBlob((b) => r(b), "image/png"));
  };

  const go = async (mode: "share" | "download") => {
    setBusy(true);
    try {
      const blob = await draw();
      if (!blob) return;
      track("share_clicked", null, "share_card");
      const file = new File([blob], "renyxera-gate-2027.png", { type: "image/png" });
      if (mode === "share" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${text} ${link}` });
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
      }
    } catch { /* cancelled */ } finally { setBusy(false); }
  };

  const field = (k: "name" | "username" | "sid", label: string) => (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={on[k]} onChange={(e) => setOn({ ...on, [k]: e.target.checked })} className="h-4 w-4 accent-violet-600" />
      <span className="w-28 shrink-0 text-[var(--text-secondary)]">{label}</span>
      <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} disabled={!on[k]} maxLength={30} className="min-w-0 flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm disabled:opacity-40" />
    </label>
  );

  return (
    <div className="mt-3">
      <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:border-violet-400/60 cursor-pointer">
        <UserRound className="w-4 h-4" /> Share as an image
      </button>
      {open && (
        <div className="mt-3 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Optional: tick what you want to show on the card. Leave all unticked for the standard RENYXERA card. Nothing is saved or uploaded.</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="w-28 shrink-0 pl-6 text-[var(--text-secondary)]">Avatar</span>
            <input type="file" accept="image/*" onChange={(e) => { const fl = e.target.files?.[0]; setAvatar(fl ? URL.createObjectURL(fl) : null); }} className="min-w-0 flex-1 text-xs" />
          </label>
          {field("name", "Name")}{field("username", "Username")}{field("sid", "Student ID")}
          <div className="flex gap-2 pt-1">
            <button type="button" disabled={busy} onClick={() => go("share")} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-violet-600 text-white text-sm font-bold cursor-pointer disabled:opacity-60"><Share2 className="w-4 h-4" /> Share</button>
            <button type="button" disabled={busy} onClick={() => go("download")} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[var(--border)] text-sm font-semibold cursor-pointer disabled:opacity-60"><Download className="w-4 h-4" /> Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
