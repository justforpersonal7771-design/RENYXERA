import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { C, brandFont, ribbon, uiFont } from "./theme";
import { FPS, LEAD, VARIANTS, VariantId, Scene, rateOf, totalFrames, vo } from "./script";
import { UI } from "./ui";

const inOut = Easing.inOut(Easing.cubic);
const out = Easing.bezier(0.22, 1, 0.36, 1);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// ---------- helpers ----------
const Blobs: React.FC<{ tone?: "light" | "dark" }> = ({ tone = "light" }) => {
  const f = useCurrentFrame();
  const dark = tone === "dark";
  return (
    <AbsoluteFill style={{ background: dark ? "#0e0a2b" : `linear-gradient(135deg, #f7f4ff, #eef6ff 60%, #fbf1ff)` }}>
      <div style={{ position: "absolute", left: -200 + Math.sin(f / 70) * 80, top: -260 + Math.cos(f / 90) * 60, width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.cyan}${dark ? "55" : "30"}, transparent 65%)` }} />
      <div style={{ position: "absolute", right: -260 + Math.cos(f / 80) * 80, bottom: -300 + Math.sin(f / 60) * 60, width: 1000, height: 1000, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.magenta}${dark ? "50" : "2a"}, transparent 65%)` }} />
      <div style={{ position: "absolute", left: 700 + Math.sin(f / 100) * 120, top: 300, width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.violet}${dark ? "45" : "18"}, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{ mode: "in" | "out"; frames?: number; total: number }> = ({ mode, frames = 16, total }) => {
  const f = useCurrentFrame();
  const t = mode === "in" ? clamp01(f / frames) : clamp01((f - (total - frames)) / frames);
  const x = mode === "in" ? interpolate(inOut(t), [0, 1], [0, 112]) : interpolate(inOut(t), [0, 1], [-112, 0]);
  if ((mode === "in" && t >= 1) || (mode === "out" && t <= 0)) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: -40, transform: `translateX(${x}%) skewX(-10deg)`, background: ribbon, boxShadow: "0 0 120px rgba(91,33,224,.5)" }} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ kicker?: string; text?: string; total: number; delay: number }> = ({ kicker, text, total, delay }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame: f - Math.round(delay * fps), fps, config: { damping: 18, stiffness: 140 } });
  const fade = interpolate(f, [total - 8, total], [1, 0], { extrapolateLeft: "clamp" });
  if (!text) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 918, textAlign: "center", opacity: inSpring * fade, transform: `translateY(${(1 - inSpring) * 26}px)` }}>
      {kicker && <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 24, letterSpacing: 6, backgroundImage: ribbon, WebkitBackgroundClip: "text", color: "transparent", marginBottom: 8 }}>{kicker}</div>}
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 60, color: C.ink, letterSpacing: -1 }}>{text}</div>
    </div>
  );
};

// ---------- scenes ----------
const UiScene: React.FC<{ s: Scene; frames: number }> = ({ s, frames }) => {
  const Screen = UI[s.ui!];
  const f = useCurrentFrame();
  const note = interpolate(f, [20, 34, frames - 12, frames - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Blobs />
      <Screen s={s} />
      {s.note && <div style={{ position: "absolute", right: 200, top: 8, fontFamily: uiFont, fontWeight: 700, fontSize: 18, color: C.muted, opacity: note }}>{s.note}</div>}
      <Caption kicker={s.kicker} text={s.caption} total={frames} delay={s.delay + 0.1} />
    </AbsoluteFill>
  );
};

const CHIPS = [
  { t: "Old notes.pdf", x: 180, y: 190, r: -8 }, { t: "Lecture playlist", x: 1180, y: 140, r: 6 }, { t: "Formula sheet", x: 640, y: 120, r: -3 },
  { t: "Group chat", x: 1480, y: 420, r: 9 }, { t: "Mock link", x: 90, y: 560, r: 5 }, { t: "Study plan v7", x: 1230, y: 800, r: -6 },
  { t: "Previous papers", x: 330, y: 820, r: 4 }, { t: "Reminder?", x: 1560, y: 700, r: -9 }, { t: "Topic list", x: 760, y: 880, r: 3 },
];

const ProblemScene: React.FC<{ s: Scene; frames: number }> = ({ s, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const converge = clamp01((f - (frames - 1.3 * fps)) / (1.0 * fps));
  const words = (s.caption ?? "Too many tabs for one exam?").split(" ");
  return (
    <AbsoluteFill>
      <Blobs />
      {CHIPS.map((c, i) => {
        const appear = spring({ frame: f - i * 3, fps, config: { damping: 16, stiffness: 120 } });
        const dx = Math.sin(f / 38 + i) * 22, dy = Math.cos(f / 44 + i * 1.7) * 16;
        const e = inOut(converge);
        const x = c.x + dx + (960 - 90 - c.x) * e, y = c.y + dy + (540 - 28 - c.y) * e;
        return (
          <div key={c.t} style={{ position: "absolute", left: x, top: y, transform: `rotate(${c.r * (1 - e)}deg) scale(${appear * (1 - 0.7 * e)})`, opacity: appear * (1 - e * 0.9),
            padding: "16px 28px", borderRadius: 20, background: "rgba(255,255,255,.92)", boxShadow: "0 18px 40px -16px rgba(76,29,149,.45)", border: "1px solid rgba(91,33,224,.12)",
            fontFamily: uiFont, fontWeight: 700, fontSize: 32, color: C.muted, whiteSpace: "nowrap" }}>
            {c.t}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", opacity: 1 - converge }}>
        {words.map((w, i) => {
          const a = spring({ frame: f - 10 - i * 5, fps, config: { damping: 15, stiffness: 150 } });
          return <span key={i} style={{ display: "inline-block", margin: "0 16px", fontFamily: uiFont, fontWeight: 800, fontSize: 118, letterSpacing: -3, color: C.ink,
            opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const common = { width: 76, height: 76, viewBox: "0 0 24 24", fill: "none", stroke: "url(#g)", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const defs = <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset=".55" stopColor={C.violet} /><stop offset="1" stopColor={C.magenta} /></linearGradient></defs>;
  if (name === "plan") return <svg {...common}>{defs}<rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M3 9.5h18M8 3v3M16 3v3M8 14h3M13 14h3" /></svg>;
  if (name === "tg") return <svg {...common}>{defs}<path d="M21 4 3 11l6 2 2 6 3-4 5 3z" /><path d="m9 13 7-5" /></svg>;
  if (name === "ai") return <svg {...common}>{defs}<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>;
  return <svg {...common}>{defs}<path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>;
};

const CARDS = [
  { i: "plan", t: "Study planner", d: "Built around your free hours" },
  { i: "tg", t: "Telegram reminders", d: "Study blocks and mock alerts" },
  { i: "ai", t: "AI Mentor", d: "Help when you are stuck" },
  { i: "chart", t: "Weak-topic analytics", d: "Accuracy and time per question" },
];

const CardsScene: React.FC<{ s: Scene; frames: number }> = ({ s, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame: f - 6, fps, config: { damping: 18, stiffness: 120 } });
  const hold = interpolate(f, [frames - 10, frames], [1, 0], { extrapolateLeft: "clamp" });
  const stagger = Math.round(1.8 * fps);
  return (
    <AbsoluteFill style={{ opacity: hold }}>
      <Blobs />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 96, letterSpacing: -2, color: C.ink, opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>
        Plan. Remind. Ask. <span style={{ backgroundImage: ribbon, WebkitBackgroundClip: "text", color: "transparent" }}>Improve.</span>
      </div>
      <div style={{ position: "absolute", top: 330, left: 100, right: 100, display: "flex", gap: 36, justifyContent: "center" }}>
        {CARDS.map((c, i) => {
          const a = spring({ frame: f - Math.round(1.3 * fps) - i * stagger, fps, config: { damping: 15, stiffness: 120 } });
          return (
            <div key={c.t} style={{ width: 400, height: 520, borderRadius: 36, background: "rgba(255,255,255,.94)", border: "1px solid rgba(91,33,224,.14)", padding: 44, boxSizing: "border-box",
              boxShadow: "0 40px 80px -30px rgba(76,29,149,.5)", opacity: a, transform: `translateY(${(1 - a) * 90}px) scale(${0.9 + 0.1 * a})` }}>
              <div style={{ width: 128, height: 128, borderRadius: 34, background: "linear-gradient(135deg,#eef6ff,#fbf1ff)", display: "grid", placeItems: "center" }}><Icon name={c.i} /></div>
              <div style={{ marginTop: 40, fontFamily: uiFont, fontWeight: 800, fontSize: 44, lineHeight: 1.1, color: C.ink, letterSpacing: -1 }}>{c.t}</div>
              <div style={{ marginTop: 18, fontFamily: uiFont, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: C.muted }}>{c.d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const EndScene: React.FC<{ s: Scene; frames: number }> = ({ s, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (d: number) => spring({ frame: f - d, fps, config: { damping: 17, stiffness: 110 } });
  const logo = a(14), word = a(26), tag = a(44), cta = a(64);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - 90) / 9) * clamp01((f - 90) / 20);
  return (
    <AbsoluteFill>
      <Blobs tone="dark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("mark-dark.png")} style={{ width: 190, height: 190, objectFit: "contain", opacity: logo, transform: `scale(${0.6 + 0.4 * logo}) rotate(${(1 - logo) * -25}deg)` }} />
        <div style={{ marginTop: 26, fontFamily: brandFont, fontSize: 150, letterSpacing: 6, color: "#fff", opacity: word, transform: `translateY(${(1 - word) * 30}px)` }}>
          RENYX<span style={{ backgroundImage: `linear-gradient(90deg, #5edcff, #8b5cf6 55%, #e879f9)`, WebkitBackgroundClip: "text", color: "transparent" }}>ERA</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: uiFont, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "rgba(255,255,255,.72)", opacity: tag }}>A NEW ERA OF INTELLIGENT LEARNING</div>
        <div style={{ marginTop: 70, opacity: cta, transform: `translateY(${(1 - cta) * 24}px) scale(${pulse})`, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "26px 56px", borderRadius: 999, background: ribbon, fontFamily: uiFont, fontWeight: 800, fontSize: 46, color: "#fff", boxShadow: "0 30px 70px -20px rgba(221,66,251,.7)" }}>
            Start your next practice session
          </div>
          <div style={{ marginTop: 28, fontFamily: uiFont, fontWeight: 700, fontSize: 40, color: "#fff", letterSpacing: 1 }}>gate.renyxera.workers.dev</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- the film ----------
export const Film: React.FC<{ variant: VariantId }> = ({ variant }) => {
  const scenes = VARIANTS[variant];
  const total = totalFrames(variant);
  let start = 0;
  const placed = scenes.map((s) => { const frames = Math.round(s.dur * FPS); const p = { s, start, frames }; start += frames; return p; });
  const ranges = placed.map(({ s, start: st }) => [st + Math.round(s.delay * FPS), st + Math.round((s.delay + vo[s.voice]) * FPS)] as const);

  const musicVol = (f: number) => {
    const dist = Math.min(...ranges.map(([a, b]) => (f < a ? a - f : f > b ? f - b : 0)));
    const base = interpolate(dist, [0, 18], [0.2, 0.55], { extrapolateRight: "clamp" });
    return base * interpolate(f, [0, 20, total - 60, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {placed.map(({ s, start: st, frames }, i) => (
        <Sequence key={i} from={st} durationInFrames={frames}>
          {s.kind === "ui" && <UiScene s={s} frames={frames} />}
          {s.kind === "problem" && <ProblemScene s={s} frames={frames} />}
          {s.kind === "cards" && <CardsScene s={s} frames={frames} />}
          {s.kind === "end" && <EndScene s={s} frames={frames} />}
          {s.wipeIn && <Wipe mode="in" total={frames} />}
          {s.wipeOut && <Wipe mode="out" total={frames} />}
          <Sequence from={Math.round(s.delay * FPS)}><Audio src={staticFile(`audio/vo_${s.voice}.wav`)} volume={1} /></Sequence>
          {(s.sfx ?? []).map((x, k) => {
            const at = x.at ?? (LEAD + (x.n ?? 0) / rateOf(s));
            return at >= 0 && at < s.dur ? <Sequence key={k} from={Math.round(at * FPS)}><Audio src={staticFile(`audio/sfx_${x.name}.wav`)} volume={(x.vol ?? 0.5) * 1.5} /></Sequence> : null;
          })}
          {(s.wipeIn) && <Sequence from={0}><Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.65} /></Sequence>}
          {(s.wipeOut) && <Sequence from={frames - 16}><Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.65} /></Sequence>}
        </Sequence>
      ))}
      <Audio src={staticFile("audio/music.wav")} volume={musicVol} />
    </AbsoluteFill>
  );
};
