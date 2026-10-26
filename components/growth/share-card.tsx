"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { generateAvatarDataUri, useAvatarStyles } from "@/lib/avatar/generate-avatar";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { Download, ImagePlus, RotateCcw, Share2, UserRound } from "lucide-react";
import { track } from "@/lib/growth/track";

/**
 * Share card with optional personalisation. The default card is the plain brand card. Name, username and student ID
 * are added only if the student ticks the box for that field and types it; nothing is read from the account or sent
 * anywhere. The image is drawn in the browser, then shared as a file (or downloaded).
 */
export function ShareCard({ link, text }: { link: string; text: string }) {
  const [open, setOpen] = useState(false);
  // null = not edited yet: show the value from the profile.
  const [edits, setF] = useState<{ name: string | null; username: string | null; sid: string | null }>({ name: null, username: null, sid: null });
  const [on, setOn] = useState({ name: false, username: false, sid: false });
  const [busy, setBusy] = useState(false);
  const [upload, setAvatar] = useState<string | null>(null);
  
  const [onAvatar, setOnAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // Fill from the student's own profile (they can edit before sharing; nothing is saved).
  const profile = useAuthStore((st) => st.profile);
  const style = profile && isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer";
  const loaded = useAvatarStyles([style]);
  const profileAvatar = profile ? generateAvatarDataUri(style, profile.avatar_seed || profile.id, { size: 256 }) : null;
  const f = {
    name: edits.name ?? profile?.display_name ?? "",
    username: edits.username ?? profile?.username ?? "",
    sid: edits.sid ?? profile?.student_id ?? "",
  };
  void loaded;
  // Uploaded photo wins; otherwise the profile avatar (recomputed once its style has loaded).
  const avatar = upload ?? profileAvatar;

  const draw = async (): Promise<Blob | null> => {
    const parts = [on.name && f.name.trim(), on.username && f.username.trim() && `@${f.username.trim().replace(/^@/, "")}`, on.sid && f.sid.trim() && `ID ${f.sid.trim()}`].filter(Boolean) as string[];
    const custom = parts.length > 0 || (!!avatar && onAvatar);
    const img = new Image();
    img.src = custom ? "/og/custom-base.png" : "/og/default.png";
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 1200; c.height = 630;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0, 1200, 630);
    if (custom) {
      // glass sender bar: avatar, name, then username and ID
      g.save(); g.shadowColor = "rgba(99,102,241,.35)"; g.shadowBlur = 24; g.shadowOffsetY = 8;
      g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(64, 462, 660, 96, 48); g.fill(); g.restore();
      g.lineWidth = 3; g.strokeStyle = "#6366f1"; g.beginPath(); g.roundRect(64, 462, 660, 96, 48); g.stroke();
      if (avatar && onAvatar) {
        const av = new Image(); av.src = avatar; await av.decode();
        g.save(); g.beginPath(); g.arc(112, 510, 34, 0, Math.PI * 2); g.clip();
        const m = Math.min(av.width, av.height); g.drawImage(av, (av.width - m) / 2, (av.height - m) / 2, m, m, 78, 476, 68, 68); g.restore();
      }
      const x = avatar ? 164 : 96;
      g.fillStyle = "#16123a"; g.font = "700 28px Sora, Manrope, system-ui, sans-serif";
      g.fillText((on.name && f.name.trim()) || "Shared on RENYXERA", x, 506);
      g.fillStyle = "#58508c"; g.font = "500 21px Sora, Manrope, system-ui, sans-serif";
      g.fillText(parts.filter((p) => p !== (on.name && f.name.trim())).join("  ·  ").slice(0, 46), x, 538);
    }
    return new Promise((r) => c.toBlob((b) => r(b), "image/png"));
  };

  // Live preview of exactly the image that will be shared.
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!open) return;
    let alive = true;
    const t = setTimeout(async () => {
      const b = await draw().catch(() => null);
      if (alive && b) setPreview((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(b); });
    }, 250);
    return () => { alive = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, f, on, onAvatar, avatar]);

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
      <input value={f[k]} onChange={(e) => setF({ ...edits, [k]: e.target.value })} disabled={!on[k]} maxLength={30} className="min-w-0 flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm disabled:opacity-40" />
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
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onAvatar} onChange={(e) => setOnAvatar(e.target.checked)} aria-label="Show avatar" className="h-4 w-4 accent-violet-600" />
            <span className="w-28 shrink-0 text-[var(--text-secondary)]">Avatar</span>
            <span className={`flex min-w-0 flex-1 items-center gap-2 ${onAvatar ? "" : "opacity-40"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {avatar ? <img src={avatar} alt="" className="h-9 w-9 rounded-full border border-[var(--border)] object-cover" /> : <span className="h-9 w-9 rounded-full bg-[var(--surface-secondary)]" />}
              <button type="button" disabled={!onAvatar} onClick={() => fileRef.current?.click()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-semibold cursor-pointer disabled:cursor-default"><ImagePlus className="h-3.5 w-3.5" /> Use a photo</button>
              {upload && <button type="button" disabled={!onAvatar} onClick={() => setAvatar(null)} className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-[var(--text-muted)] cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /> My avatar</button>}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) setAvatar(URL.createObjectURL(fl)); }} />
            </span>
          </div>
          {field("name", "Name")}{field("username", "Username")}{field("sid", "Student ID")}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview && <img src={preview} alt="Preview of your share card" className="mt-2 w-full rounded-xl border border-[var(--border)]" />}
          <div className="flex gap-2 pt-1">
            <button type="button" disabled={busy} onClick={() => go("share")} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-violet-600 text-white text-sm font-bold cursor-pointer disabled:opacity-60"><Share2 className="w-4 h-4" /> Share</button>
            <button type="button" disabled={busy} onClick={() => go("download")} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[var(--border)] text-sm font-semibold cursor-pointer disabled:opacity-60"><Download className="w-4 h-4" /> Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
