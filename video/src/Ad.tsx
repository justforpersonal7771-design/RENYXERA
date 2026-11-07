import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brandFont, uiFont } from "./theme";

/**
 * RENYXERA ad. Brief, script and the senior-reviewer critique: docs/growth/marketing/AD-CREATIVE-BRIEF.md.
 * Two separate builds from one script: AdVertical (1080x1920, Reels and Shorts, 19 s) and AdLandscape (1920x1080, YouTube, 22 s).
 * Flat colour only (no gradients, glows or particles). The interface is drawn here as design, not recorded from the app.
 * Pure function of the frame. Scene starts must match video/scripts/make_ad_audio.py.
 */
export const AD_FPS = 30;
const P = {
  cream: "#FAF8F5", ink: "#18181B", blue: "#0A4FD0", white: "#FFFFFF", mute: "#6B6B73", line: "#E4DFD6",
  rose: "#FFE0E3", roseInk: "#BE123C", roseSoft: "#FF8DA1", mint: "#DCF5E5", mintInk: "#047857", butter: "#FFF3C4", butterInk: "#854D0E",
  sky: "#DBEFFF", skyInk: "#0369A1", peri: "#E1E7FF", periInk: "#4338ca",
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * AD_FPS);

type SceneKey = "hook" | "loop" | "night" | "until" | "reveal" | "papers" | "forge" | "battle" | "stack" | "cta";
const SCENES_V: [SceneKey, number, number][] = [["hook", 0, 2], ["loop", 2, 6], ["night", 6, 8], ["until", 8, 10], ["reveal", 10, 17], ["papers", 17, 19], ["forge", 19, 21], ["stack", 21, 25], ["cta", 25, 30]];
const SCENES_H: [SceneKey, number, number][] = [["hook", 0, 2], ["loop", 2, 6], ["night", 6, 8], ["until", 8, 10], ["reveal", 10, 17], ["papers", 17, 19], ["forge", 19, 21], ["battle", 21, 23.5], ["stack", 23.5, 26.5], ["cta", 26.5, 30]];
export const AD_V_TOTAL = sec(30);
export const AD_H_TOTAL = sec(30);

const NIGHT = "#10131A";
const BG: Record<SceneKey, string> = { hook: P.cream, loop: P.cream, night: P.ink, until: P.blue, reveal: NIGHT, papers: P.butter, forge: P.mint, battle: P.rose, stack: P.blue, cta: P.ink };
const DARK = new Set<SceneKey>(["night", "until", "reveal", "stack", "cta"]);

/** The wordmark as flat text in the brand display face (the supplied logo files carry a purple-pink gradient, which this ad avoids). */
const Wordmark: React.FC<{ size: number; color: string }> = ({ size, color }) => <span style={{ fontFamily: brandFont, fontSize: size, letterSpacing: size * 0.12, color, lineHeight: 1 }}>RENYXERA</span>;

const useH = () => { const { width, height } = useVideoConfig(); return width > height; };

const Words: React.FC<{ text: string; size: number; color?: string; delay?: number; stagger?: number; weight?: number; align?: "left" | "center"; max?: number }> = ({ text, size, color = P.ink, delay = 0, stagger = 3, weight = 800, align = "left", max }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.24}px`, justifyContent: align === "center" ? "center" : "flex-start", maxWidth: max, fontFamily: uiFont, fontWeight: weight, fontSize: size, lineHeight: 1.02, letterSpacing: -size * 0.03, color }}>
      {text.split(" ").map((w, i) => {
        const p = ease(interpolate(f - delay - i * stagger, [0, 8], [0, 1], clamp));
        return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 0.4 * size}px)` }}>{w}</span>;
      })}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; bg: string; color: string; size?: number }> = ({ children, bg, color, size = 30 }) => (
  <span style={{ display: "inline-block", background: bg, color, fontFamily: uiFont, fontWeight: 800, fontSize: size, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: 999, letterSpacing: 0.5 }}>{children}</span>
);

/* ---------- interface drawn as design (the app's own look: ink-edged cards, offset shadow, pastel tints) ---------- */
const CARD_W = 920;
const card = (sh: string = P.ink): React.CSSProperties => ({ width: CARD_W, background: P.white, border: `4px solid ${P.ink}`, borderRadius: 40, boxShadow: `10px 10px 0 ${sh}`, boxSizing: "border-box" });

const QuestionCard: React.FC<{ f: number }> = ({ f }) => {
  const tap = 34, wrongAt = 40;
  const state = f >= wrongAt ? "wrong" : f >= tap ? "picked" : "none";
  const opts = ["2", "3", "4", "5"];
  const stamp = ease(interpolate(f, [wrongAt + 2, wrongAt + 10], [0, 1], clamp));
  const ripple = interpolate(f, [tap, tap + 14], [0, 1], clamp);
  return (
    <div style={{ ...card(P.blue), padding: 44, position: "relative" }}>
      <div style={{ display: "flex", gap: 16 }}><Chip bg={P.peri} color={P.periInk}>GATE CS</Chip><Chip bg={P.butter} color={P.butterInk}>2 marks</Chip></div>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 50, lineHeight: 1.2, color: P.ink, marginTop: 30, letterSpacing: -1 }}>Minimum states in a DFA that accepts binary strings divisible by 3?</div>
      <div style={{ marginTop: 34, display: "grid", gap: 18 }}>
        {opts.map((o, i) => {
          const isPick = i === 2;
          const bg = isPick && state === "wrong" ? P.rose : isPick && state === "picked" ? "#EEF1FF" : P.white;
          const bd = isPick && state === "wrong" ? P.roseInk : P.ink;
          return (
            <div key={o} style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, border: `3px solid ${bd}`, background: bg, borderRadius: 24, padding: "22px 28px" }}>
              <span style={{ width: 56, height: 56, borderRadius: 16, background: isPick && state === "wrong" ? P.roseInk : P.ink, color: P.white, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 32 }}>{"ABCD"[i]}</span>
              <span style={{ fontFamily: uiFont, fontWeight: 700, fontSize: 46, color: P.ink }}>{o}</span>
              <span style={{ marginLeft: "auto", width: 34, height: 34, borderRadius: 17, border: `3px solid ${bd}`, background: isPick && state !== "none" ? bd : "transparent" }} />
              {isPick && f >= tap && f < tap + 14 && <span style={{ position: "absolute", right: 60, top: "50%", width: 40 + ripple * 150, height: 40 + ripple * 150, marginLeft: -20, marginTop: -(40 + ripple * 150) / 2, borderRadius: "50%", background: P.ink, opacity: 0.16 * (1 - ripple), pointerEvents: "none" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 36, top: -40, transform: `rotate(-8deg) scale(${0.4 + 0.6 * stamp})`, opacity: stamp, background: P.roseInk, color: P.white, fontFamily: uiFont, fontWeight: 800, fontSize: 68, padding: "10px 30px", borderRadius: 20, border: `4px solid ${P.ink}`, boxShadow: `6px 6px 0 ${P.ink}` }}>−0.67</div>
    </div>
  );
};

const MentorCard: React.FC<{ f: number }> = ({ f }) => {
  const line = (at: number) => ({ opacity: ease(interpolate(f, [at, at + 8], [0, 1], clamp)), transform: `translateY(${(1 - ease(interpolate(f, [at, at + 8], [0, 1], clamp))) * 24}px)` });
  const rem = ["0", "1", "2"];
  const done = ease(interpolate(f, [86, 94], [0, 1], clamp));
  return (
    <div style={{ ...card(P.blue), padding: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ width: 64, height: 64, borderRadius: 20, background: P.ink, color: P.cream, display: "grid", placeItems: "center", fontFamily: brandFont, fontSize: 40 }}>R</span>
        <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 38, color: P.ink }}>AI Mentor</span>
        <span style={{ marginLeft: "auto" }}><Chip bg={P.mint} color={P.mintInk} size={26}>explains why</Chip></span>
      </div>
      <div style={{ marginTop: 30, background: P.cream, borderRadius: 28, padding: "30px 34px" }}>
        <div style={{ ...line(10), fontFamily: uiFont, fontWeight: 800, fontSize: 48, color: P.ink }}>Not quite.</div>
        <div style={{ ...line(26), marginTop: 14, fontFamily: uiFont, fontWeight: 600, fontSize: 42, lineHeight: 1.3, color: "#3F3F46" }}>The DFA only has to remember one thing: the remainder when you divide by 3.</div>
        <div style={{ ...line(48), marginTop: 26, display: "flex", gap: 16, alignItems: "center" }}>
          {rem.map((r) => <span key={r} style={{ width: 84, height: 84, borderRadius: 24, background: P.butter, border: `3px solid ${P.ink}`, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 46, color: P.ink }}>{r}</span>)}
          <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 44, color: P.ink, marginLeft: 8, opacity: ease(interpolate(f, [62, 72], [0, 1], clamp)) }}>= 3 states</span>
        </div>
      </div>
      <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, opacity: done, transform: `scale(${0.9 + 0.1 * done})`, transformOrigin: "left center" }}>
        <span style={{ width: 70, height: 70, borderRadius: 20, background: P.mintInk, color: P.white, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 40 }}>B</span>
        <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 50, color: P.mintInk }}>Answer: 3</span>
      </div>
    </div>
  );
};

const BattleCard: React.FC<{ f: number }> = ({ f }) => {
  const p = ease(interpolate(f, [8, 22], [0, 1], clamp));
  const r = ease(interpolate(f, [34, 44], [0, 1], clamp));
  return (
    <div style={{ ...card(), padding: 44 }}>
      <Chip bg={P.rose} color={P.roseInk}>Challenge result</Chip>
      <div style={{ marginTop: 36, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: uiFont, fontWeight: 800, color: P.ink }}>
        <div style={{ fontSize: 50 }}>You</div>
        <div style={{ fontSize: 190, letterSpacing: -6, opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>18<span style={{ color: P.mute }}>:</span>15</div>
        <div style={{ fontSize: 50 }}>A friend</div>
      </div>
      <div style={{ marginTop: 34, display: "flex", gap: 16, opacity: r, transform: `translateY(${(1 - r) * 20}px)` }}><Chip bg={P.mint} color={P.mintInk} size={38}>You won</Chip><Chip bg={P.butter} color={P.butterInk} size={38}>Rating +12</Chip></div>
    </div>
  );
};

/* ---------- scenes ---------- */
/** A huge faded word behind the action: the pattern the reference ad uses for its questions ("Wrong App?", "Paid / That's it?"). */
const Ghost: React.FC<{ text: string; size: number; color?: string; top: number; left?: number; rot?: number }> = ({ text, size, color = P.ink, top, left = -20, rot = -4 }) => (
  <div style={{ position: "absolute", top, left, fontFamily: uiFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.05, lineHeight: 0.9, color, opacity: 0.07, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", pointerEvents: "none" }}>{text}</div>
);

/** One word per shot, hard cut, blurred in over six frames. */
const Slam: React.FC<{ text: string; size: number; color?: string; f: number }> = ({ text, size, color = P.ink, f }) => {
  const p = ease(interpolate(f, [0, 6], [0, 1], clamp));
  return <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 0.95, color, filter: `blur(${(1 - p) * 18}px)`, transform: `translateX(${(1 - p) * 140}px)`, opacity: Math.min(1, p * 2) }}>{text}</div>;
};

const Notif: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 11, stiffness: 200 }, from: 0, to: 1 });
  return (
    <div style={{ ...card(P.blue), width: 900, padding: 40, transform: `rotate(-5deg) scale(${s}) translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 3) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ width: 76, height: 76, borderRadius: 22, background: P.roseInk, color: P.white, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 52 }}>!</span>
        <div>
          <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 46, color: P.ink }}>Marks deducted</div>
          <div style={{ fontFamily: uiFont, fontWeight: 600, fontSize: 34, color: P.mute, marginTop: 4 }}>GATE CS · wrong answer · −0.67</div>
        </div>
      </div>
      <div style={{ marginTop: 22, display: "flex", gap: 30, fontFamily: uiFont, fontWeight: 700, fontSize: 32, color: P.mute }}><span>Mark as read</span><span style={{ color: P.ink }}>Why?</span></div>
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const H = useH();
  const pop = spring({ frame: f, fps, config: { damping: 9, stiffness: 230 }, from: 1.2, to: 1 });
  const shake = f < 7 ? Math.sin(f * 5) * (7 - f) * 1.6 : 0;
  return (
    <AbsoluteFill>
      <Ghost text="Wrong?" size={H ? 820 : 600} top={H ? 40 : 330} />
      <div style={{ position: "absolute", left: H ? 140 : 70, top: H ? 200 : 380, transform: `scale(${pop}) translateX(${shake}px)`, transformOrigin: "left center" }}>
        <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: H ? 460 : 370, letterSpacing: H ? -16 : -13, lineHeight: 0.95, color: P.roseInk, whiteSpace: "nowrap" }}>−0.67</div>
        <div style={{ marginTop: 6 }}><Words text="marks. Gone." size={H ? 140 : 124} delay={9} /></div>
      </div>
      <div style={{ position: "absolute", left: H ? 1000 : 150, top: H ? 640 : 1080 }}><Notif f={Math.max(0, f - 16)} /></div>
    </AbsoluteFill>
  );
};

const LOOP_WORDS: [string, string, string, string, string][] = [["Solve.", P.sky, P.ink, "Mock test 12", P.peri], ["Check.", P.butter, P.ink, "Answer key", P.mint], ["Wrong.", P.rose, P.roseInk, "Score  −0.67", P.white], ["Again.", P.cream, P.ink, "Retry", P.sky]];
const Loop: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const i = Math.min(3, Math.floor(f / 30)); const lf = f - i * 30;
  const [word, field, color, chip, chipBg] = LOOP_WORDS[i];
  return (
    <AbsoluteFill style={{ background: field, justifyContent: "center", padding: H ? "0 150px" : "0 80px" }}>
      <div style={{ position: "absolute", left: H ? 150 : 80, top: H ? 120 : 230 }}><Chip bg={chipBg} color={P.ink} size={H ? 40 : 42}>{chip}</Chip></div>
      <Slam text={word} size={H ? 440 : 300} color={color} f={lf} />
      <div style={{ position: "absolute", right: H ? 150 : 80, bottom: H ? 110 : 420, fontFamily: uiFont, fontWeight: 800, fontSize: 46, color: P.mute }}>{i + 1} / 4</div>
    </AbsoluteFill>
  );
};

const Night: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const cx = H ? 1440 : 540, cy = H ? 540 : 1230, R = H ? 230 : 190;
  const minute = 282 + ease(interpolate(f, [34, 40], [0, 1], clamp)) * 6; // 46 -> 47 min
  const hand = (deg: number, len: number, w: number, color: string) => <line x1={cx} y1={cy} x2={cx + Math.sin((deg * Math.PI) / 180) * len} y2={cy - Math.cos((deg * Math.PI) / 180) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: H ? 140 : 80, top: H ? 300 : 230 }}>
        <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: H ? 250 : 210, letterSpacing: -8, color: P.cream, opacity: ease(interpolate(f, [0, 8], [0, 1], clamp)), lineHeight: 1 }}>11:47 PM</div>
        <div style={{ marginTop: 26 }}><Words text="Nobody to ask why." size={H ? 110 : 96} color={P.roseSoft} delay={16} /></div>
      </div>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={P.cream} strokeOpacity={0.9} strokeWidth={8} />
        {hand(353.5, R * 0.5, 14, P.cream)}{hand(minute, R * 0.78, 9, P.roseSoft)}
        <circle cx={cx} cy={cy} r={14} fill={P.cream} />
      </svg>
    </AbsoluteFill>
  );
};

const Until: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const H = useH();
  const pop = spring({ frame: f - 12, fps, config: { damping: 11, stiffness: 190 }, from: 0.6, to: 1 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 140px" : "0 80px" }}>
      <Words text="Until now." size={H ? 250 : 200} color={P.cream} delay={2} />
      <div style={{ marginTop: H ? 50 : 60, transform: `scale(${pop})`, opacity: f >= 12 ? 1 : 0, transformOrigin: "left center" }}><Wordmark size={H ? 96 : 92} color={P.cream} /></div>
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const up = ease(interpolate(f, [4, 18], [0, 1], clamp));
  const swap = ease(interpolate(f, [92, 104], [0, 1], clamp)); // the question card leaves left, the Mentor card arrives from the right
  const place = { position: "absolute" as const, left: H ? 930 : 80, top: H ? 140 : 610, transformOrigin: "top left" as const };
  const sc = H ? 0.92 : 1;
  const dist = H ? 2300 : 1200; // far enough to clear the screen from where each card sits
  return (
    <AbsoluteFill>
      <Ghost text="Mentor" size={H ? 640 : 520} color={P.cream} top={H ? 360 : 760} left={H ? -40 : -30} />
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 300 : 210, width: H ? 700 : 920 }}><Words text="Meet your AI Mentor." size={H ? 128 : 118} color={P.cream} delay={1} /></div>
      <div style={{ ...place, opacity: up, transform: `translateX(${-swap * dist}px) translateY(${(1 - up) * 100}px) scale(${sc})` }}><QuestionCard f={f} /></div>
      <div style={{ ...place, transform: `translateX(${(1 - swap) * dist}px) scale(${sc})`, opacity: swap > 0 ? 1 : 0 }}><MentorCard f={Math.max(0, f - 100)} /></div>
    </AbsoluteFill>
  );
};

const Papers: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const years = Array.from({ length: 10 }, (_, i) => 2017 + i);
  const cols = H ? 10 : 5, cw = H ? 150 : 170, gap = H ? 14 : 16;
  return (
    <AbsoluteFill style={{ padding: H ? "0 130px" : "0 80px", justifyContent: "center" }}>
      <Words text="10 years of real GATE papers." size={H ? 134 : 124} delay={1} max={H ? 1500 : 920} />
      <div style={{ marginTop: H ? 70 : 90, display: "grid", gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap }}>
        {years.map((y, i) => {
          const on = ease(interpolate(f - 8 - i * 3, [0, 6], [0, 1], clamp));
          return <div key={y} style={{ height: H ? 120 : 130, borderRadius: 26, border: `3px solid ${P.ink}`, background: on > 0.5 ? P.ink : P.white, color: on > 0.5 ? P.cream : P.ink, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: H ? 40 : 42, transform: `scale(${0.9 + 0.1 * on})` }}>{y}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Forge: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const big = ease(interpolate(f, [2, 14], [0, 1], clamp));
  const stack = [0, 1, 2].map((i) => ease(interpolate(f - 6 - i * 5, [0, 10], [0, 1], clamp)));
  return (
    <AbsoluteFill style={{ padding: H ? "0 130px" : "0 80px", justifyContent: "center" }}>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: H ? 380 : 330, letterSpacing: -14, lineHeight: 0.95, color: P.ink, opacity: big, transform: `translateY(${(1 - big) * 60}px)` }}>300+</div>
      <Words text="original questions." size={H ? 120 : 110} delay={6} />
      <div style={{ marginTop: 14 }}><Words text="In no past paper." size={H ? 120 : 110} color={P.mintInk} delay={14} /></div>
      <div style={{ position: "absolute", right: H ? 150 : 90, ...(H ? { bottom: 140 } : { top: 230 }), width: 300, height: 260 }}>
        {stack.map((s, i) => <div key={i} style={{ position: "absolute", left: i * 34, top: i * 26, width: 230, height: 170, borderRadius: 28, background: P.white, border: `4px solid ${P.ink}`, boxShadow: `8px 8px 0 ${P.ink}`, opacity: s, transform: `translateY(${(1 - s) * 40}px) rotate(${(i - 1) * 5}deg)` }}><div style={{ margin: 22, height: 16, width: 120, borderRadius: 8, background: P.ink }} /><div style={{ margin: 22, marginTop: 0, height: 12, width: 160, borderRadius: 6, background: P.line }} /><div style={{ margin: 22, marginTop: 14, height: 12, width: 130, borderRadius: 6, background: P.line }} /></div>)}
      </div>
    </AbsoluteFill>
  );
};

const Battle: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const up = ease(interpolate(f, [3, 16], [0, 1], clamp));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 330 : 210, width: H ? 700 : 920 }}><Words text="Challenge a friend." size={H ? 128 : 118} delay={1} /></div>
      <div style={{ position: "absolute", left: H ? 930 : 80, top: H ? 220 : 560, opacity: up, transform: `translateY(${(1 - up) * 90}px) scale(${H ? 0.92 : 1})`, transformOrigin: "top left" }}><BattleCard f={f} /></div>
    </AbsoluteFill>
  );
};

/** CheQ's strongest move, adapted: a three-word stack whose last word is slammed over ("Done." became "Earn."). Ours: "Wrong." becomes "Understand." */
const Stack: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const swapAt = H ? 50 : 62;
  const size = H ? 230 : 150;
  const after = f >= swapAt; const q = f - swapAt;
  const row = (word: string, color: string, i: number) => {
    const p = ease(interpolate(f - i * 12, [0, 8], [0, 1], clamp));
    return <div key={word} style={{ fontFamily: uiFont, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1.04, color, opacity: p, transform: `translateX(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 14}px)` }}>{word}</div>;
  };
  const sp = ease(interpolate(q, [0, 6], [0, 1], clamp));
  const shake = q >= 0 && q < 5 ? Math.sin(q * 6) * (5 - q) * 6 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 150px" : "0 80px" }}>
      {row("Solve.", P.cream, 0)}
      {row("Check.", P.cream, 1)}
      {!after ? row("Wrong.", P.roseSoft, 2) : (
        <div style={{ position: "relative" }}>
          {q < 4 && <span style={{ position: "absolute", left: 12, top: 0, fontFamily: uiFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1.04, color: P.roseSoft, opacity: 0.6 }}>Understand.</span>}
          <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1.04, color: P.butter, transformOrigin: "left center", transform: `translateX(${shake}px) scale(${1 + (1 - sp) * 0.5})`, filter: `blur(${(1 - sp) * 10}px)` }}>Understand.</div>
        </div>
      )}
      <div style={{ marginTop: H ? 50 : 40, fontFamily: uiFont, fontWeight: 600, fontSize: H ? 64 : 52, color: P.cream, opacity: after ? ease(interpolate(q, [14, 22], [0, 0.85], clamp)) : 0 }}>…and the Mentor tells you why.</div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const H = useH();
  const btn = spring({ frame: f - 14, fps, config: { damping: 11, stiffness: 190 }, from: 0.5, to: 1 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 140px" : "0 80px" }}>
      <Words text="Start free." size={H ? 250 : 210} color={P.cream} delay={2} />
      <div style={{ marginTop: H ? 60 : 70, display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
        <div style={{ transform: `scale(${btn})`, transformOrigin: "left center", background: P.blue, color: P.white, fontFamily: uiFont, fontWeight: 800, fontSize: H ? 76 : 84, padding: H ? "34px 76px" : "40px 80px", borderRadius: 100 }}>{H ? "Start free" : "Link in bio"}</div>
        {H && <div style={{ fontFamily: uiFont, fontWeight: 700, fontSize: 60, color: P.cream, opacity: interpolate(f, [24, 34], [0, 1], clamp) }}>gate.renyxera.workers.dev</div>}
      </div>
      <div style={{ marginTop: H ? 80 : 100, opacity: interpolate(f, [28, 40], [0, 1], clamp) }}><Wordmark size={H ? 76 : 72} color={P.cream} /></div>
    </AbsoluteFill>
  );
};

const COMP: Record<SceneKey, React.FC> = { hook: Hook, loop: Loop, night: Night, until: Until, reveal: Reveal, papers: Papers, forge: Forge, battle: Battle, stack: Stack, cta: Cta };

/** A flat colour block that sweeps over the cut on the beat: it covers the old scene, the new one is already behind it, then it uncovers. */
const Wipe: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame(); const { width } = useVideoConfig();
  const x = f < 5 ? (1 - interpolate(f, [0, 5], [0, 1], clamp)) * width : -interpolate(f, [5, 10], [0, 1], clamp) * width;
  return <AbsoluteFill style={{ background: color, transform: `translateX(${x}px)` }} />;
};

const Film: React.FC<{ scenes: [SceneKey, number, number][]; audio: string }> = ({ scenes, audio }) => (
  <AbsoluteFill style={{ background: P.cream }}>
    <Audio src={staticFile(`audio/${audio}`)} volume={0.9} />
    {scenes.map(([key, a, b], i) => {
      const Scene = COMP[key];
      return (
        <React.Fragment key={key}>
          <Sequence from={sec(a)} durationInFrames={sec(b) - sec(a)}><AbsoluteFill style={{ background: BG[key], color: DARK.has(key) ? P.cream : P.ink }}><Scene /></AbsoluteFill></Sequence>
          {i > 0 && <Sequence from={sec(a) - 5} durationInFrames={10}><Wipe color={key === "cta" || key === "reveal" ? P.blue : P.ink} /></Sequence>}
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);

export const AdVertical: React.FC = () => <Film scenes={SCENES_V} audio="ad-vertical.wav" />;
export const AdLandscape: React.FC = () => <Film scenes={SCENES_H} audio="ad-landscape.wav" />;
