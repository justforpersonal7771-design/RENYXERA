import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "./reel-top5.json";
import { C, brandFont, ribbon, uiFont } from "./theme";

/**
 * Film A: "5 topics = 14 of 100 marks" (shot list: docs/growth/marketing/VIDEO-REBUILD-SHOTLIST.md).
 * 1080x1920, 30 fps, 18 s at 120 BPM (one beat = 15 frames, every cut lands on a beat). Every number comes from reel-top5.json
 * (our own measured topic weights). Built as a pure function of the frame: no state, no timers.
 * Phone safe zone: nothing important above 180 px or below 340 px from the bottom (app UI covers it).
 */
export const REEL_A_FPS = 30;
const BEAT = 15;
const WHIP = 9; // frames a scene takes to slide in or out
const SAFE_X = 80;
const W = 1080;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scene starts in frames. Items run from rank 5 up to rank 1 (rank 1 gets 3 s).
const HOOK = { start: 0, len: BEAT * 4 };
const ITEMS = [5, 4, 3, 2, 1].map((rank, i) => ({ rank, start: BEAT * (4 + i * 4), len: rank === 1 ? BEAT * 6 : BEAT * 4 }));
const TOTAL = { start: BEAT * 26, len: BEAT * 6 };
const END = { start: BEAT * 32, len: BEAT * 4 };
export const REEL_A_TOTAL = END.start + END.len; // 540 frames = 18 s

const sorted = [...data.items].sort((a, b) => b.rank - a.rank); // 5 .. 1
const totalMarks = data.items.reduce((s, i) => s + i.marksPerPaper, 0);

/** Slides a whole scene in from the right and out to the left. Both scenes are on screen during the whip, so there is never an empty frame. */
const Scene: React.FC<{ start: number; len: number; first?: boolean; last?: boolean; children: React.ReactNode }> = ({ start, len, first, last, children }) => {
  const f = useCurrentFrame();
  const enter = first ? 0 : (1 - ease(interpolate(f, [0, WHIP], [0, 1], clamp))) * W;
  const exit = last ? 0 : -ease(interpolate(f, [len, len + WHIP], [0, 1], clamp)) * W;
  const x = enter + exit;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: `blur(${Math.min(10, Math.abs(x) / 70)}px)` }}>{children}</AbsoluteFill>;
};

/** One shared background so the whip never shows a seam. Slow glow drift keeps it alive without drawing the eye. */
const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 90) * 60, b = Math.cos(f / 110) * 70;
  return (
    <AbsoluteFill style={{ background: "#0a0618" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 800px at ${78 + a / 6}% ${14 + b / 10}%, ${C.violet}66, transparent 62%), radial-gradient(800px 700px at ${12 - a / 8}% ${88 - b / 10}%, ${C.cyan}30, transparent 60%)` }} />
    </AbsoluteFill>
  );
};

const GradText: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.03, background: ribbon, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>{children}</span>
);

/** A word-by-word reveal: each word rises 40 px and de-blurs on its own frame. */
const Words: React.FC<{ text: string; size: number; delay?: number; stagger?: number; color?: string; weight?: number }> = ({ text, size, delay = 0, stagger = 3, color = "#fff", weight = 800 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, fontFamily: uiFont, fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.02, color }}>
      {text.split(" ").map((w, i) => {
        const p = ease(interpolate(f - delay - i * stagger, [0, 9], [0, 1], clamp));
        return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - p) * 8}px)` }}>{w}</span>;
      })}
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 11, stiffness: 170 }, from: 1.7, to: 1 });
  const shake = f < 8 ? Math.sin(f * 4) * (8 - f) * 1.4 : 0;
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px`, justifyContent: "center" }}>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 42, color: "#fff9", letterSpacing: 6, marginBottom: 30, opacity: interpolate(f, [4, 14], [0, 1], clamp) }}>GATE CS · {data.yearsCount} YEARS OF PAPERS</div>
      <div style={{ transform: `scale(${pop}) translateX(${shake}px)`, transformOrigin: "left center", display: "flex", alignItems: "baseline", gap: 20 }}>
        <GradText size={400}>{totalMarks.toFixed(1)}</GradText>
      </div>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 120, color: "#fff", marginTop: 14, lineHeight: 1, opacity: interpolate(f, [8, 18], [0, 1], clamp) }}>of 100 marks</div>
      <div style={{ marginTop: 56 }}><Words text="come from just 5 topics." size={78} delay={20} color="#ffffffcc" weight={700} /></div>
    </AbsoluteFill>
  );
};

const Item: React.FC<{ item: (typeof data.items)[number] }> = ({ item }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 6, fps, config: { damping: 12, stiffness: 190 }, from: 0.6, to: 1 });
  const numIn = ease(interpolate(f, [6, 16], [0, 1], clamp));
  const revealed = sorted.filter((i) => i.rank >= item.rank).reduce((s, i) => s + i.marksPerPaper, 0);
  const fill = ease(interpolate(f, [14, 34], [0, 1], clamp));
  const before = revealed - item.marksPerPaper;
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px` }}>
      <div style={{ position: "absolute", left: SAFE_X, top: 200, right: SAFE_X }}>
        <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 40, color: "#fff9", letterSpacing: 8 }}>NUMBER</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 36, marginTop: 4 }}>
          <div style={{ transform: `scale(${pop})`, transformOrigin: "left bottom" }}><GradText size={460}>{item.rank}</GradText></div>
          <div style={{ paddingBottom: 38, fontFamily: uiFont, fontWeight: 700, fontSize: 40, color: "#ffffffb3", lineHeight: 1.2, opacity: interpolate(f, [8, 20], [0, 1], clamp) }}>{item.subject}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 760 }}>
        <Words text={item.name} size={104} delay={5} stagger={3} />
        <div style={{ marginTop: 28, fontFamily: uiFont, fontWeight: 500, fontSize: 42, color: "#ffffff99", lineHeight: 1.3, opacity: interpolate(f, [18, 30], [0, 1], clamp) }}>{item.tagline}</div>
      </div>
      <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 1150, display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 250, letterSpacing: -8, color: "#fff", fontVariantNumeric: "tabular-nums", display: "inline-block", opacity: numIn, transform: `scale(${0.85 + 0.15 * numIn}) translateY(${(1 - numIn) * 30}px)`, transformOrigin: "left bottom" }}>{item.marksPerPaper.toFixed(2)}</span>
        <span style={{ fontFamily: uiFont, fontWeight: 700, fontSize: 46, color: "#ffffffaa", lineHeight: 1.1, opacity: numIn }}>marks<br />per paper</span>
      </div>
      <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 1430, display: "flex", alignItems: "center", gap: 12 }}>
        {Array.from({ length: data.yearsCount }, (_, i) => {
          const p = ease(interpolate(f - 20 - i * 2, [0, 6], [0, 1], clamp));
          return <span key={i} style={{ width: 40, height: 40, borderRadius: 20, background: i < item.yearsAsked ? ribbon : "#ffffff22", transform: `scale(${p})` }} />;
        })}
        <span style={{ marginLeft: 14, fontFamily: uiFont, fontWeight: 700, fontSize: 38, color: "#fff", opacity: interpolate(f, [30, 40], [0, 1], clamp) }}>{item.yearsAsked} of {data.yearsCount} years</span>
      </div>
      <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: 1520 }}>
        <div style={{ height: 22, borderRadius: 11, background: "#ffffff1c", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((before + (revealed - before) * fill) / totalMarks) * 100}%`, background: ribbon, borderRadius: 11 }} />
        </div>
        <div style={{ marginTop: 14, fontFamily: uiFont, fontWeight: 700, fontSize: 34, color: "#ffffffaa" }}>{item.rank === 5 ? "So far" : `Top ${6 - item.rank} together`}: {revealed.toFixed(1)} marks</div>
      </div>
    </AbsoluteFill>
  );
};

const Total: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 30, fps, config: { damping: 11, stiffness: 160 }, from: 0.5, to: 1 });
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px`, justifyContent: "center" }}>
      <Words text="Add them up." size={110} delay={2} />
      <div style={{ marginTop: 70, display: "flex", height: 170, borderRadius: 30, overflow: "hidden", gap: 6 }}>
        {sorted.map((it, i) => {
          const p = ease(interpolate(f - 8 - i * 5, [0, 12], [0, 1], clamp));
          return <div key={it.rank} style={{ flex: it.marksPerPaper, background: ribbon, opacity: 0.55 + 0.09 * (5 - i), transform: `translateY(${(1 - p) * 220}px)`, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 56, color: "#fff" }}>{it.rank}</div>;
        })}
      </div>
      <div style={{ marginTop: 70, transform: `scale(${Math.max(0.01, pop)})`, transformOrigin: "left center", opacity: interpolate(f, [30, 36], [0, 1], clamp) }}>
        <GradText size={300}>{totalMarks.toFixed(1)}</GradText>
        <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 84, color: "#fff", marginTop: 8 }}>of 100 marks</div>
      </div>
      <div style={{ marginTop: 40, fontFamily: uiFont, fontWeight: 600, fontSize: 46, color: "#ffffffaa", opacity: interpolate(f, [50, 62], [0, 1], clamp) }}>About 1 mark in 7, every single year.</div>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = spring({ frame: f - 14, fps, config: { damping: 10, stiffness: 190 }, from: 0.3, to: 1 });
  const flash = interpolate(f, [10, 12, 20], [0, 0.85, 0], clamp); // the one full flash in the film
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px`, justifyContent: "center", alignItems: "flex-start" }}>
      <Words text="Study these first." size={126} delay={2} />
      <div style={{ marginTop: 90, transform: `scale(${btn})`, transformOrigin: "left center", background: ribbon, padding: "40px 80px", borderRadius: 100, fontFamily: uiFont, fontWeight: 800, fontSize: 84, color: "#fff", boxShadow: `0 30px 80px ${C.violet}80` }}>Start free</div>
      <div style={{ marginTop: 56, fontFamily: uiFont, fontWeight: 700, fontSize: 50, color: "#fff", opacity: interpolate(f, [22, 32], [0, 1], clamp) }}>gate.renyxera.workers.dev</div>
      <div style={{ marginTop: 22, fontFamily: brandFont, fontSize: 56, color: "#ffffffcc", opacity: interpolate(f, [28, 40], [0, 1], clamp), letterSpacing: 4 }}>RENYXERA</div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const ReelMarks: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <Audio src={staticFile("audio/reel-a-beat.wav")} volume={0.9} />
    <Sequence from={HOOK.start} durationInFrames={HOOK.len + WHIP}><Scene start={HOOK.start} len={HOOK.len} first><Hook /></Scene></Sequence>
    {ITEMS.map((it) => (
      <React.Fragment key={it.rank}>
        <Sequence from={it.start} durationInFrames={it.len + WHIP}><Scene start={it.start} len={it.len}><Item item={sorted.find((s) => s.rank === it.rank)!} /></Scene></Sequence>
        <Sequence from={it.start}><Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.5} /></Sequence>
      </React.Fragment>
    ))}
    <Sequence from={TOTAL.start} durationInFrames={TOTAL.len + WHIP}><Scene start={TOTAL.start} len={TOTAL.len}><Total /></Scene></Sequence>
    <Sequence from={TOTAL.start}><Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.5} /></Sequence>
    <Sequence from={END.start} durationInFrames={END.len}><Scene start={END.start} len={END.len} last><End /></Scene></Sequence>
    <Sequence from={END.start}><Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.5} /></Sequence>
    <Sequence from={END.start + 14}><Audio src={staticFile("audio/sfx_pop.wav")} volume={0.7} /></Sequence>
    <Sequence from={END.start + 24}><Audio src={staticFile("audio/sfx_chime.wav")} volume={0.6} /></Sequence>
  </AbsoluteFill>
);
