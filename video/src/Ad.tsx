import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brandFont, displayFont, uiFont } from "./theme";

/**
 * RENYXERA ad, 75 s, Plus and Pro focused (owner brief, 7 Nov 2026). Brief: docs/growth/marketing/AD-BLUEPRINT-V3.md, CHEQ-ANALYSIS.md and the owner's 75-second build brief (7 Nov 2026).
 * Two separate builds: AdVertical (1080x1920, Reels and Shorts, centred stacks) and AdLandscape (1920x1080, YouTube, bold type on the left,
 * drawn interface on the right). Flat colour only. The interface is drawn here as design, never recorded from the app.
 * Pure function of the frame. Scene times must match video/scripts/make_ad_sound.py.
 */
export const AD_FPS = 30;
const P = {
  cream: "#FAF8F5", ink: "#16123A", blue: "#0A5FF2", white: "#FFFFFF", mute: "#6B6B73", line: "#E4DFD6",
  rose: "#FFCDD2", roseInk: "#BE123C", roseSoft: "#FF8DA1", mint: "#C8E6C9", mintInk: "#047857", butter: "#FFF9C4", butterInk: "#854D0E",
  sky: "#DBEFFF", skyInk: "#0369A1", peri: "#E1E7FF", periInk: "#4338ca", grey: "#B9B7C9", silver: "#E2E8F0",
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * AD_FPS);
const rise = (f: number, at: number, len = 8) => ease(interpolate(f - at, [0, len], [0, 1], clamp));

type SceneKey = "hook" | "loop" | "night" | "until" | "mentor" | "papers" | "forge" | "analytics" | "battles" | "plans" | "stack" | "cta";
const SCENES_V: [SceneKey, number, number][] = [["hook", 0, 3.5], ["loop", 3.5, 9.5], ["night", 9.5, 14], ["until", 14, 18], ["mentor", 18, 28], ["papers", 28, 36], ["forge", 36, 45], ["plans", 45, 58], ["stack", 58, 68], ["cta", 68, 75]];
const SCENES_H: [SceneKey, number, number][] = [["hook", 0, 4], ["loop", 4, 10], ["night", 10, 14], ["until", 14, 18], ["mentor", 18, 28], ["papers", 28, 36], ["forge", 36, 45], ["plans", 45, 58], ["stack", 58, 68], ["cta", 68, 75]];
export const AD_V_TOTAL = sec(75);
export const AD_H_TOTAL = sec(75);

const BG: Record<SceneKey, string> = { hook: P.cream, loop: P.cream, night: P.ink, until: P.blue, mentor: P.ink, papers: P.butter, forge: P.mint, analytics: P.cream, battles: P.rose, plans: P.ink, stack: P.blue, cta: P.ink };
const DARK = new Set<SceneKey>(["night", "until", "mentor", "plans", "stack", "cta"]);
const useH = () => { const { width, height } = useVideoConfig(); return width > height; };

/** The wordmark as flat text in the brand display face (the supplied logo files carry a purple-pink gradient, which this ad avoids). */
const Wordmark: React.FC<{ size: number; color: string }> = ({ size, color }) => <span style={{ fontFamily: brandFont, fontSize: size, letterSpacing: size * 0.12, color, lineHeight: 1 }}>RENYXERA</span>;

const Words: React.FC<{ text: string; size: number; color?: string; delay?: number; stagger?: number; weight?: number; max?: number }> = ({ text, size, color = P.ink, delay = 0, stagger = 3, weight = 800, max }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.24}px`, maxWidth: max, fontFamily: displayFont, fontWeight: weight, fontSize: size, lineHeight: 1.02, letterSpacing: -size * 0.03, color }}>
      {text.split(" ").map((w, i) => {
        const p = rise(f, delay + i * stagger);
        return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 0.4 * size}px)` }}>{w}</span>;
      })}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; bg: string; color: string; size?: number }> = ({ children, bg, color, size = 30 }) => (
  <span style={{ display: "inline-block", background: bg, color, fontFamily: uiFont, fontWeight: 800, fontSize: size, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: 999, letterSpacing: 0.5, border: `3px solid ${P.ink}` }}>{children}</span>
);

const Ghost: React.FC<{ text: string; size: number; color?: string; top: number; left?: number; rot?: number }> = ({ text, size, color = P.ink, top, left = -20, rot = -4 }) => (
  <div style={{ position: "absolute", top, left, fontFamily: displayFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.05, lineHeight: 0.9, color, opacity: 0.07, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", pointerEvents: "none" }}>{text}</div>
);

/** One word per shot, hard cut, blurred in over six frames. */
const Slam: React.FC<{ text: string; size: number; color?: string; f: number }> = ({ text, size, color = P.ink, f }) => {
  const p = ease(interpolate(f, [0, 6], [0, 1], clamp));
  return <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 0.95, color, filter: `blur(${(1 - p) * 18}px)`, transform: `translateY(${(1 - p) * 40}px) scale(${0.95 + 0.05 * p})`, opacity: Math.min(1, p * 2) }}>{text}</div>;
};

/* ---------- interface drawn as design: ink-edged cards with a flat offset, pastel tints ---------- */
const CARD_W = 920;
const card = (w = CARD_W): React.CSSProperties => ({ width: w, background: P.white, border: `4px solid ${P.ink}`, borderRadius: 40, boxShadow: `8px 8px 0 ${P.ink}`, boxSizing: "border-box" });
const sprng = (f: number, fps: number, from = 0.5) => spring({ frame: f, fps, config: { damping: 12, stiffness: 200, mass: 0.8 }, from, to: 1 });

const QuestionCard: React.FC<{ f: number; fixAt?: number }> = ({ f, fixAt = 9999 }) => {
  const tap = 20, wrongAt = 25;
  const wrong = f >= wrongAt, fixed = f >= fixAt;
  const opts = ["2", "3", "4", "5"];
  const stamp = ease(interpolate(f, [wrongAt + 2, wrongAt + 10], [0, 1], clamp));
  const ripple = interpolate(f, [tap, tap + 14], [0, 1], clamp);
  return (
    <div style={{ ...card(), padding: 44, position: "relative" }}>
      <div style={{ display: "flex", gap: 16 }}><Chip bg={P.peri} color={P.periInk}>GATE CS</Chip><Chip bg={P.butter} color={P.butterInk}>2 marks</Chip></div>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 50, lineHeight: 1.2, color: P.ink, marginTop: 30, letterSpacing: -1 }}>Minimum states in a DFA that accepts binary strings divisible by 3?</div>
      <div style={{ marginTop: 34, display: "grid", gap: 18 }}>
        {opts.map((o, i) => {
          const isWrong = i === 0 && wrong, isRight = i === 1 && fixed, picking = i === 0 && f >= tap && !wrong;
          const bg = isRight ? P.mint : isWrong ? P.rose : picking ? "#EEF1FF" : P.white;
          const bd = isRight ? P.mintInk : isWrong ? P.roseInk : P.ink;
          return (
            <div key={o} style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, border: `3px solid ${bd}`, background: bg, borderRadius: 24, padding: "22px 28px" }}>
              <span style={{ width: 56, height: 56, borderRadius: 16, background: isRight ? P.mintInk : isWrong ? P.roseInk : P.ink, color: P.white, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 32 }}>{"ABCD"[i]}</span>
              <span style={{ fontFamily: uiFont, fontWeight: 700, fontSize: 46, color: P.ink }}>{o}</span>
              <span style={{ marginLeft: "auto", width: 34, height: 34, borderRadius: 17, border: `3px solid ${bd}`, background: isWrong || isRight || picking ? bd : "transparent" }} />
              {i === 0 && f >= tap && f < tap + 14 && <span style={{ position: "absolute", right: 60, top: "50%", width: 40 + ripple * 150, height: 40 + ripple * 150, marginTop: -(40 + ripple * 150) / 2, borderRadius: "50%", background: P.ink, opacity: 0.16 * (1 - ripple), pointerEvents: "none" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 36, top: -40, transform: `rotate(-8deg) scale(${0.4 + 0.6 * stamp})`, opacity: stamp, background: P.roseInk, color: P.white, fontFamily: uiFont, fontWeight: 800, fontSize: 68, padding: "10px 30px", borderRadius: 20, border: `4px solid ${P.ink}`, boxShadow: `6px 6px 0 ${P.ink}` }}>−0.67</div>
    </div>
  );
};

const MentorCard: React.FC<{ f: number }> = ({ f }) => {
  const line = (at: number): React.CSSProperties => { const p = rise(f, at); return { opacity: p, transform: `translateY(${(1 - p) * 24}px)` }; };
  const done = rise(f, 70);
  return (
    <div style={{ ...card(), padding: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ width: 64, height: 64, borderRadius: 20, background: P.ink, color: P.cream, display: "grid", placeItems: "center", fontFamily: brandFont, fontSize: 40 }}>R</span>
        <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 38, color: P.ink }}>AI Mentor</span>
        <span style={{ marginLeft: "auto" }}><Chip bg={P.mint} color={P.mintInk} size={26}>explains why</Chip></span>
      </div>
      <div style={{ marginTop: 30, background: P.cream, borderRadius: 28, padding: "30px 34px" }}>
        <div style={{ ...line(6), fontFamily: uiFont, fontWeight: 800, fontSize: 52, color: P.ink }}>DFA states = 3.</div>
        <div style={{ ...line(24), marginTop: 14, fontFamily: uiFont, fontWeight: 600, fontSize: 42, lineHeight: 1.3, color: "#3F3F46" }}>You forgot the remainder 0 state.</div>
        <div style={{ ...line(44), marginTop: 26, display: "flex", gap: 16, alignItems: "center" }}>
          {["0", "1", "2"].map((r) => <span key={r} style={{ width: 84, height: 84, borderRadius: 24, background: P.butter, border: `3px solid ${P.ink}`, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 46, color: P.ink }}>{r}</span>)}
          <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 44, color: P.ink, marginLeft: 8, opacity: rise(f, 56) }}>= 3 states</span>
        </div>
      </div>
      <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, opacity: done, transform: `scale(${0.9 + 0.1 * done})`, transformOrigin: "left center" }}>
        <span style={{ width: 70, height: 70, borderRadius: 20, background: P.mintInk, color: P.white, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 40 }}>B</span>
        <span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 50, color: P.mintInk }}>Answer: 3</span>
      </div>
    </div>
  );
};

/** A simplified question (skeleton lines and four option bars) for the landscape pain loop. state: 0 plain, 1 C green, 2 A red, 3 reset. */
const MiniQuestion: React.FC<{ state: number; f: number }> = ({ state, f }) => {
  const opt = (i: number) => {
    const green = state === 1 && i === 2, red = state === 2 && i === 0;
    return (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, border: `3px solid ${green ? P.mintInk : red ? P.roseInk : P.ink}`, background: green ? P.mint : red ? P.rose : P.white, borderRadius: 22, padding: "20px 26px" }}>
        <span style={{ width: 52, height: 52, borderRadius: 14, background: green ? P.mintInk : red ? P.roseInk : P.ink, color: P.white, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 30 }}>{"ABCD"[i]}</span>
        <span style={{ height: 18, borderRadius: 9, background: P.line, flex: 1, maxWidth: [300, 240, 280, 200][i] }} />
      </div>
    );
  };
  const pop = rise(f, 0, 10);
  return (
    <div style={{ ...card(860), padding: 40, opacity: pop, transform: `translateY(${(1 - pop) * 40}px)` }}>
      <div style={{ display: "flex", gap: 14 }}><Chip bg={P.peri} color={P.periInk} size={26}>GATE CS</Chip><Chip bg={P.butter} color={P.butterInk} size={26}>2 marks</Chip></div>
      <div style={{ marginTop: 26, display: "grid", gap: 12 }}><span style={{ height: 22, borderRadius: 11, background: P.ink, width: "86%" }} /><span style={{ height: 22, borderRadius: 11, background: P.ink, width: "62%" }} /></div>
      <div style={{ marginTop: 30, display: "grid", gap: 16 }}>{[0, 1, 2, 3].map(opt)}</div>
    </div>
  );
};

const PaletteGrid: React.FC<{ f: number; size: number }> = ({ f, size }) => {
  const st = "ggrggggrgrggngnn".split(""); // g answered, r not answered, n not visited
  const col = (c: string) => (c === "g" ? P.mintInk : c === "r" ? P.roseInk : P.grey);
  return (
    <div style={{ ...card(size * 4 + 3 * 18 + 88), padding: 44 }}>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 34, color: P.ink, marginBottom: 22 }}>Question palette</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(4, ${size}px)`, gap: 18 }}>
        {st.map((c, i) => {
          const p = rise(f, i * 3, 6);
          return <div key={i} style={{ height: size, borderRadius: 22, background: col(c), border: `3px solid ${P.ink}`, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: size * 0.4, color: P.white, transform: `scale(${0.4 + 0.6 * p})`, opacity: p }}>{i + 1}</div>;
        })}
      </div>
      <div style={{ marginTop: 26, display: "flex", gap: 22, fontFamily: uiFont, fontWeight: 700, fontSize: 28, color: P.mute }}>
        <span><b style={{ color: P.mintInk }}>■</b> Answered</span><span><b style={{ color: P.roseInk }}>■</b> Not answered</span><span><b style={{ color: P.grey }}>■</b> Not visited</span>
      </div>
    </div>
  );
};

const Anvil: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80"><path d="M6 14 H62 L88 24 V34 H72 C72 43 64 48 58 50 V60 H78 V72 H24 V60 H42 V50 C34 48 26 43 26 34 H6 Z" fill={P.ink} /></svg>
);

const ForgeCard: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const s = sprng(f, fps, 0.5);
  return (
    <div style={{ ...card(780), padding: 44, transform: `scale(${s})`, opacity: Math.min(1, s * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <span style={{ width: 150, height: 150, borderRadius: 36, background: P.butter, border: `4px solid ${P.ink}`, display: "grid", placeItems: "center" }}><Anvil size={96} /></span>
        <div>
          <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 84, color: P.ink, letterSpacing: -3, lineHeight: 1 }}>Forge</div>
          <div style={{ fontFamily: uiFont, fontWeight: 600, fontSize: 36, color: P.mute, marginTop: 8 }}>Original GATE-level questions</div>
        </div>
      </div>
      <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}><Chip bg={P.mint} color={P.mintInk} size={30}>Worked solution</Chip><Chip bg={P.rose} color={P.roseInk} size={30}>Trap noted</Chip><Chip bg={P.sky} color={P.skyInk} size={30}>Shortcut</Chip></div>
    </div>
  );
};

const StatCard: React.FC<{ f: number }> = ({ f }) => {
  const p = rise(f, 0, 10), bar = rise(f, 10, 20);
  return (
    <div style={{ ...card(820), padding: 44, opacity: p, transform: `translateX(${(1 - p) * 300}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Chip bg={P.rose} color={P.roseInk} size={30}>Weakness</Chip><Chip bg={P.white} color={P.mute} size={24}>Example</Chip></div>
      <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 74, color: P.ink, letterSpacing: -2, marginTop: 22, lineHeight: 1.05 }}>Operating Systems</div>
      <div style={{ marginTop: 28, height: 34, borderRadius: 17, background: P.line, border: `3px solid ${P.ink}`, overflow: "hidden" }}><div style={{ height: "100%", width: `${34 * bar}%`, background: P.roseInk }} /></div>
      <div style={{ marginTop: 14, fontFamily: uiFont, fontWeight: 700, fontSize: 32, color: P.mute }}>Revise this next</div>
    </div>
  );
};

const CalendarCard: React.FC<{ f: number }> = ({ f }) => {
  const p = rise(f, 0, 10);
  const days = Array.from({ length: 28 }, (_, i) => i + 1); // February 2027 starts on a Monday and has 28 days
  return (
    <div style={{ ...card(820), padding: 40, opacity: p, transform: `translateX(${(1 - p) * -300}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 56, color: P.ink, letterSpacing: -2 }}>February 2027</span>
        <Chip bg={P.butter} color={P.butterInk} size={28}>GATE starts 6 Feb</Chip>
      </div>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, textAlign: "center", fontFamily: uiFont, fontWeight: 800 }}>
        {"MTWTFSS".split("").map((d, i) => <span key={i} style={{ fontSize: 26, color: P.mute }}>{d}</span>)}
        {days.map((d) => {
          const on = d === 6, inExam = d >= 6 && d <= 21;
          const pop = rise(f, 8 + d * 1.2, 6);
          return <span key={d} style={{ height: 78, borderRadius: 18, display: "grid", placeItems: "center", fontSize: 34, background: on ? P.ink : inExam ? P.butter : P.cream, color: on ? P.cream : P.ink, border: `3px solid ${on ? P.ink : P.line}`, opacity: pop }}>{d}</span>;
        })}
      </div>
    </div>
  );
};

const Avatar: React.FC<{ letter: string; bg: string; size?: number }> = ({ letter, bg, size = 150 }) => (
  <span style={{ width: size, height: size, borderRadius: size / 2, background: bg, border: `4px solid ${P.ink}`, display: "grid", placeItems: "center", fontFamily: displayFont, fontWeight: 800, fontSize: size * 0.5, color: P.ink }}>{letter}</span>
);

const BattleCard: React.FC<{ f: number }> = ({ f }) => {
  const join = rise(f, 0, 10), vs = rise(f, 10, 8), res = rise(f, 60, 12);
  return (
    <div style={{ ...card(860), padding: 44 }}>
      <Chip bg={P.rose} color={P.roseInk}>Challenge</Chip>
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ textAlign: "center" }}><Avatar letter="Y" bg={P.sky} /><div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 36, color: P.ink, marginTop: 12 }}>You</div></div>
        <div style={{ opacity: vs, transform: `scale(${0.5 + 0.5 * vs})`, background: P.ink, color: P.cream, fontFamily: displayFont, fontWeight: 800, fontSize: 64, padding: "10px 36px", borderRadius: 999 }}>VS</div>
        <div style={{ textAlign: "center", opacity: join, transform: `translateX(${(1 - join) * 200}px)` }}><Avatar letter="F" bg={P.butter} /><div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 36, color: P.ink, marginTop: 12 }}>A friend</div></div>
      </div>
      <div style={{ marginTop: 34, display: "flex", gap: 16, opacity: res, transform: `translateY(${(1 - res) * 20}px)` }}><Chip bg={P.mint} color={P.mintInk} size={40}>You won!</Chip><Chip bg={P.butter} color={P.butterInk} size={40}>Rating +12</Chip></div>
    </div>
  );
};

const SearchBar: React.FC<{ f: number }> = ({ f }) => {
  const url = "gate.renyxera.workers.dev";
  const n = Math.min(url.length, Math.max(0, Math.floor((f - 4) / 1.6)));
  const caret = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, background: P.white, border: `4px solid ${P.ink}`, borderRadius: 999, padding: "26px 46px", width: 1200, boxSizing: "border-box", boxShadow: `8px 8px 0 ${P.blue}` }}>
      <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={P.ink} strokeWidth="2.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M16 16l5 5" /></svg>
      <span style={{ fontFamily: uiFont, fontWeight: 700, fontSize: 62, color: P.ink }}>{url.slice(0, n)}<span style={{ opacity: caret ? 1 : 0, color: P.blue }}>|</span></span>
    </div>
  );
};

/* ---------- scenes (local frame f from the start of each scene) ---------- */
const Notif: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const { fps } = useVideoConfig();
  const s = sprng(f, fps, 0);
  return (
    <div style={{ ...card(w), padding: 40, transform: `rotate(-5deg) scale(${s}) translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 3) }}>
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
  const num = <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: H ? 460 : 370, letterSpacing: H ? -16 : -13, lineHeight: 0.95, color: P.roseInk, whiteSpace: "nowrap", transform: `scale(${pop}) translateX(${shake}px)`, transformOrigin: "left center" }}>−0.67</div>;
  if (H) {
    return (
      <AbsoluteFill>
        <Ghost text="Wrong?" size={820} top={40} />
        <div style={{ position: "absolute", left: 130, top: 330 }}><Words text="One guess." size={150} delay={2} /><Words text="Marks gone." size={150} delay={14} color={P.roseInk} /></div>
        <div style={{ position: "absolute", left: 1000, top: 140 }}>{num}</div>
        <div style={{ position: "absolute", left: 1000, top: 600 }}><Notif f={Math.max(0, f - 18)} w={820} /></div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Ghost text="Wrong?" size={600} top={330} />
      <div style={{ position: "absolute", left: 70, top: 380 }}>{num}<div style={{ marginTop: 6 }}><Words text="marks. Gone." size={124} delay={9} /></div></div>
      <div style={{ position: "absolute", left: 90, top: 1080 }}><Notif f={Math.max(0, f - 16)} w={900} /></div>
    </AbsoluteFill>
  );
};

const LOOP: [string, string, string, string, string][] = [["Solve.", P.cream, P.ink, "Mock test 12", P.peri], ["Check Key.", P.butter, P.ink, "Answer: C", P.mint], ["Wrong.", P.rose, P.roseInk, "Score −0.67", P.white], ["Again.", P.ink, P.cream, "Retry", P.sky]];
const Loop: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const i = Math.min(3, Math.floor(f / 45)); const lf = f - i * 45;
  const [word, field, color, chip, chipBg] = LOOP[i];
  return (
    <AbsoluteFill style={{ background: field, justifyContent: "center", padding: H ? "0 130px" : "0 80px" }}>
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 120 : 230 }}><Chip bg={chipBg} color={P.ink} size={H ? 40 : 42}>{chip}</Chip></div>
      <div style={{ width: H ? 820 : undefined }}><Slam text={word} size={H ? (word.length > 7 ? 230 : 300) : word.length > 7 ? 210 : 290} color={color} f={lf} /></div>
      {H && <div style={{ position: "absolute", left: 1000, top: 140 }}><MiniQuestion state={i} f={lf} /></div>}
      <div style={{ position: "absolute", right: H ? 130 : 80, bottom: H ? 90 : 420, fontFamily: uiFont, fontWeight: 800, fontSize: 46, color: i === 3 ? P.grey : P.mute }}>{i + 1} / 4</div>
    </AbsoluteFill>
  );
};

const Night: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const beat = f < 45 ? 0 : f < 90 ? 1 : 2;
  const lines = ["11:47 PM.", "You know the answer is C.", "But nobody tells you why."];
  const cx = H ? 1480 : 540, cy = H ? 540 : 1330, R = H ? 220 : 180;
  const minute = 282 + rise(f, 20, 10) * 6;
  const hand = (deg: number, len: number, w: number, color: string) => <line x1={cx} y1={cy} x2={cx + Math.sin((deg * Math.PI) / 180) * len} y2={cy - Math.cos((deg * Math.PI) / 180) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  const lf = f - beat * 45;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 300 : 360, width: H ? 1100 : 920 }}>
        <Slam text={lines[beat]} size={beat === 0 ? (H ? 250 : 200) : H ? 130 : 110} color={beat === 2 ? P.roseSoft : P.cream} f={lf} />
      </div>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={P.cream} strokeWidth={8} />
        {hand(353.5, R * 0.5, 14, P.cream)}{hand(minute, R * 0.78, 9, P.roseSoft)}
        <circle cx={cx} cy={cy} r={14} fill={P.cream} />
      </svg>
    </AbsoluteFill>
  );
};

const Until: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const H = useH();
  const pop = spring({ frame: f - 14, fps, config: { damping: 12, stiffness: 200, mass: 0.8 }, from: H ? 2 : 0.6, to: 1 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 140px" : "0 80px" }}>
      <Words text="Until now." size={H ? 250 : 200} color={P.cream} delay={2} />
      <div style={{ marginTop: H ? 50 : 60, transform: `scale(${pop})`, opacity: f >= 14 ? 1 : 0, transformOrigin: "left center" }}><Wordmark size={H ? 110 : 92} color={P.cream} /></div>
    </AbsoluteFill>
  );
};

const Mentor: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const title = f < 270 ? "Meet your AI Mentor." : "It explains exactly why.";
  const tf = f < 270 ? f : f - 270;
  const qIn = rise(f, 60, 14);                                      // 20 s: the question card appears
  const shift = ease(interpolate(f, [150, 168], [0, 1], clamp));    // 23 s: it moves up and shrinks, the Mentor card slides in below
  const mIn = ease(interpolate(f, [150, 170], [0, 1], clamp));
  const qScale = H ? 0.9 - 0.34 * shift : 1 - 0.38 * shift;
  const qTop = H ? 90 - 40 * shift : 590 - 150 * shift;
  const mScale = H ? 0.7 : 0.8;
  const left = H ? 970 : 80;
  return (
    <AbsoluteFill>
      <Ghost text="Mentor" size={H ? 640 : 520} color={P.cream} top={H ? 380 : 780} left={H ? -40 : -30} />
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 330 : 210, width: H ? 760 : 920 }}><Words key={title} text={title} size={H ? 126 : 116} color={P.cream} delay={tf < 4 ? 1 : 0} /></div>
      <div style={{ position: "absolute", left, top: qTop, opacity: qIn, transformOrigin: "top left", transform: `translateY(${(1 - qIn) * 100}px) scale(${qScale})` }}><QuestionCard f={Math.max(0, f - 76)} fixAt={270 - 76} /></div>
      <div style={{ position: "absolute", left, top: H ? 560 : 1010, opacity: mIn > 0 ? 1 : 0, transformOrigin: "top left", transform: `translateY(${(1 - mIn) * 700}px) scale(${mScale})` }}><MentorCard f={Math.max(0, f - 172)} /></div>
    </AbsoluteFill>
  );
};

const Papers: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const second = f >= 120, lf = second ? f - 120 : f;
  const years = Array.from({ length: 10 }, (_, i) => 2017 + i);
  const text = second ? "Exam-identical simulator." : "10 years of official GATE papers.";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 300 : 210, width: H ? 760 : 920 }}><Words key={text} text={text} size={H ? 130 : 120} delay={1} /></div>
      {!second && (
        <div style={{ position: "absolute", left: H ? 970 : 80, top: H ? 240 : 760, display: "grid", gridTemplateColumns: H ? "repeat(4, 170px)" : "repeat(5, 170px)", gap: 14 }}>
          {years.map((y, i) => { const on = rise(lf, 10 + i * 4, 6); return <div key={y} style={{ height: 130, borderRadius: 26, border: `3px solid ${P.ink}`, background: on > 0.5 ? P.ink : P.white, color: on > 0.5 ? P.cream : P.ink, display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 42, transform: `scale(${0.9 + 0.1 * on})` }}>{y}</div>; })}
        </div>
      )}
      {second && <div style={{ position: "absolute", left: H ? 1000 : 150, top: H ? 150 : 700, transform: `scale(${H ? 0.95 : 1})`, transformOrigin: "top left" }}><PaletteGrid f={lf} size={H ? 150 : 170} /></div>}
    </AbsoluteFill>
  );
};

const Forge: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const phase = f < 120 ? 0 : f < 180 ? 1 : 2;
  const text = ["Run out of past papers?", "original questions.", "Inside The Forge."][phase];
  const lf = f - [0, 120, 180][phase];
  const big = phase === 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 290 : 240, width: H ? 760 : 920 }}>
        {big ? <Slam key="b" text="300+" size={H ? 330 : 300} color={P.ink} f={lf} /> : null}
        <Words key={text} text={text} size={H ? (big ? 100 : 124) : big ? 96 : 120} color={phase === 2 ? P.mintInk : P.ink} delay={big ? 6 : 1} />
      </div>
      {phase === 0 && H && (
        <div style={{ position: "absolute", left: 1000, top: 280, width: 780, height: 520, borderRadius: 40, border: `5px dashed ${P.ink}`, display: "grid", placeItems: "center", opacity: rise(lf, 6, 12) }}>
          <div style={{ textAlign: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 56, color: P.mute }}>Nothing new to solve</div>
        </div>
      )}
      {phase === 2 && <div style={{ position: "absolute", left: H ? 1000 : 150, top: H ? 280 : 950 }}><ForgeCard f={lf} /></div>}
    </AbsoluteFill>
  );
};

const Analytics: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < 90 ? 0 : f < 180 ? 1 : 2;
  const text = phase < 2 ? "Know your weak topics..." : "...before exam day.";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 210, width: 920 }}><Words key={text} text={text} size={118} delay={1} /></div>
      {phase === 1 && <div style={{ position: "absolute", left: 130, top: 760 }}><StatCard f={f - 90} /></div>}
      {phase === 2 && <div style={{ position: "absolute", left: 130, top: 640 }}><CalendarCard f={f - 180} /></div>}
    </AbsoluteFill>
  );
};

const Battles: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < 90 ? 0 : f < 210 ? 1 : 2;
  const text = ["Studying alone?", "Challenge a friend.", "Climb the ranks."][phase];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 330, width: 760 }}><Words key={text} text={text} size={126} delay={1} /></div>
      {phase === 0 && <div style={{ position: "absolute", left: 1200, top: 330 }}><Avatar letter="Y" bg={P.sky} size={260} /><div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 48, color: P.ink, marginTop: 18, marginLeft: 60 }}>You</div></div>}
      {phase >= 1 && <div style={{ position: "absolute", left: 980, top: 230, transformOrigin: "top left", transform: "scale(0.95)" }}><BattleCard f={f - 90} /></div>}
    </AbsoluteFill>
  );
};


/** Plus and Pro, as sold (prices and limits from lib/billing/plans.ts, 7 Nov 2026). Compact (name and price) in the vertical build; with feature lines in the landscape build. */
const PlanCard: React.FC<{ f: number; w: number; name: string; price: string; per: string; tint: string; tag?: string; items?: string[]; itemsAt?: number }> = ({ f, w, name, price, per, tint, tag, items, itemsAt = 0 }) => {
  const { fps } = useVideoConfig();
  const s = sprng(f, fps, 0.6);
  return (
    <div style={{ ...card(w), padding: 36, background: tint, transform: `scale(${s})`, opacity: Math.min(1, s * 2), transformOrigin: "top left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 64, color: P.ink, letterSpacing: -2, lineHeight: 1 }}>{name}</span>
        {tag && <Chip bg={P.white} color={P.ink} size={24}>{tag}</Chip>}
      </div>
      <div style={{ marginTop: 14, fontFamily: displayFont, fontWeight: 800, fontSize: 84, color: P.ink, letterSpacing: -3, lineHeight: 1 }}>{price}<span style={{ fontFamily: uiFont, fontSize: 30, fontWeight: 700, color: P.mute, letterSpacing: 0 }}> {per}</span></div>
      {items && (
        <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
          {items.map((it, i) => {
            const p = rise(f, itemsAt + i * 40, 8);
            return <div key={it} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: uiFont, fontWeight: 700, fontSize: 38, color: P.ink, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}><span style={{ width: 36, height: 36, borderRadius: 18, background: P.mintInk, display: "grid", placeItems: "center", flex: "none" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P.white} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l5 5L19 7" /></svg></span>{it}</div>;
          })}
        </div>
      )}
    </div>
  );
};

/** The Plus and Pro pitch, 45 to 58 s: a question, the two cards, the Pro features popping in one by one, then the cards drop away on the price. */
const Plans: React.FC = () => {
  const f = useCurrentFrame(); const H = useH();
  const drop = ease(interpolate(f, [330, 352], [0, 1], clamp));
  const title = f < 90 ? "Want more power?" : f < 330 ? "Unlock Plus & Pro." : "Plus from ₹29 a month. Pro from ₹99.";
  const bullets = ["150 AI requests daily.", "Unlimited Forge.", "Offline downloads."];
  const cardsF = f - 90;
  if (f < 90 || f >= 330 + 22) {
    return (
      <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 140px" : "0 80px" }}>
        <Words key={title} text={title} size={H ? (f < 90 ? 230 : 140) : f < 90 ? 190 : 120} color={P.cream} delay={1} max={H ? 1500 : 920} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 320 : 210, width: H ? 760 : 920, opacity: 1 - drop }}><Words key={title} text={title} size={H ? 130 : 112} color={P.cream} delay={1} /></div>
      {f >= 330 && <div style={{ position: "absolute", left: H ? 130 : 80, top: H ? 320 : 210, width: H ? 760 : 920, opacity: drop }}><Words text="Plus from ₹29 a month. Pro from ₹99." size={H ? 110 : 100} color={P.cream} delay={1} /></div>}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: `translateY(${drop * 2200}px)` }}>
        {H ? (
          <>
            <div style={{ position: "absolute", left: 980, top: 70 }}><PlanCard f={cardsF} w={800} name="Plus" price="₹29" per="a month" tint={P.silver} items={["15 Forge questions a day", "75 AI requests a day"]} itemsAt={60} /></div>
            <div style={{ position: "absolute", left: 980, top: 470 }}><PlanCard f={cardsF - 10} w={800} name="Pro" price="₹99" per="a month" tint={P.butter} tag="Most loved" items={bullets.map((b) => b.replace(".", ""))} itemsAt={120} /></div>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 80, top: 520 }}><PlanCard f={cardsF} w={450} name="Plus" price="₹29" per="a month" tint={P.silver} /></div>
            <div style={{ position: "absolute", left: 550, top: 520 }}><PlanCard f={cardsF - 8} w={450} name="Pro" price="₹99" per="a month" tint={P.butter} tag="Most loved" /></div>
            <div style={{ position: "absolute", left: 80, top: 980, display: "grid", gap: 22 }}>
              {bullets.map((b, i) => {
                const p = rise(f, 210 + i * 40, 8), pop = sprng(f - (210 + i * 40), 30, 0.6);
                return <div key={b} style={{ opacity: p, transform: `scale(${pop})`, transformOrigin: "left center", display: "flex", alignItems: "center", gap: 22, background: P.white, border: `4px solid ${P.ink}`, borderRadius: 999, padding: "22px 44px 22px 26px", boxShadow: `6px 6px 0 ${P.mintInk}`, width: "fit-content" }}><span style={{ width: 62, height: 62, borderRadius: 31, background: P.mintInk, display: "grid", placeItems: "center" }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={P.white} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l5 5L19 7" /></svg></span><span style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 54, color: P.ink }}>{b}</span></div>;
              })}
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

const Stack: React.FC = () => {
  const f = useCurrentFrame(); const H = useH(); const { fps } = useVideoConfig();
  const swapAt = 180; // 64 s into the film: the slam
  const size = H ? 230 : 150;
  const after = f >= swapAt; const q = f - swapAt;
  const row = (word: string, color: string, i: number) => { const p = rise(f, i * 60); return <div key={word} style={{ fontFamily: displayFont, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1.04, color, opacity: p, transform: `translateX(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 14}px)` }}>{word}</div>; };
  const sp = ease(interpolate(q, [0, 6], [0, 1], clamp));
  const shake = q >= 0 && q < 5 ? Math.sin(q * 6) * (5 - q) * 3 : 0;
  const badge = spring({ frame: q - 4, fps, config: { damping: 11, stiffness: 190, mass: 0.8 }, from: 0, to: 1 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 150px" : "0 80px" }}>
      {row("Solve.", P.cream, 0)}{row("Check.", P.cream, 1)}
      {!after ? row("Wrong.", P.roseSoft, 2) : (
        <div style={{ position: "relative" }}>
          {q < 4 && <span style={{ position: "absolute", left: 12, top: 0, fontFamily: displayFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1.04, color: P.roseSoft, opacity: 0.6 }}>Understand.</span>}
          <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1.04, color: P.butter, transformOrigin: "left center", transform: `translateX(${shake}px) scale(${1 + (1 - sp) * 0.5}, ${(1 + (1 - sp) * 0.5) * (q < 4 ? 0.95 : 1)})`, filter: `blur(${(1 - sp) * 10}px)` }}>Understand.</div>
        </div>
      )}
      <div style={{ marginTop: H ? 50 : 40, fontFamily: uiFont, fontWeight: 600, fontSize: H ? 64 : 52, color: P.cream, opacity: f >= 240 ? rise(f, 240, 10) * 0.9 : 0 }}>…with your AI Mentor.</div>
      {H && after && <div style={{ position: "absolute", right: 200, top: 340, width: 400, height: 400, borderRadius: 200, background: P.mint, border: `6px solid ${P.ink}`, display: "grid", placeItems: "center", transform: `scale(${badge})` }}><svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke={P.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg></div>}
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const H = useH();
  const second = f >= 90, lf = f - 90;
  const btn = spring({ frame: lf - 10, fps, config: { damping: 12, stiffness: 200, mass: 0.8 }, from: 0.5, to: 1 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: H ? "0 150px" : "0 80px" }}>
      {!second ? <Words text="Official papers free forever." size={H ? 170 : 150} color={P.cream} delay={2} max={H ? 1500 : 920} /> : (
        <>
          <Words key="s" text="Start free." size={H ? 240 : 210} color={P.cream} delay={0} />
          <div style={{ marginTop: H ? 6 : 4 }}><Words key="u" text="Upgrade when ready." size={H ? 110 : 96} color={P.butter} delay={10} /></div>
          <div style={{ marginTop: H ? 40 : 50 }}>
            {H ? <SearchBar f={lf} /> : <div style={{ display: "inline-block", transform: `scale(${btn})`, transformOrigin: "left center", background: P.blue, color: P.white, fontFamily: uiFont, fontWeight: 800, fontSize: 84, padding: "40px 80px", borderRadius: 100, border: `4px solid ${P.cream}` }}>Link in bio</div>}
          </div>
          <div style={{ marginTop: H ? 40 : 50, fontFamily: uiFont, fontWeight: 700, fontSize: H ? 44 : 40, color: P.cream, opacity: rise(lf, 24, 12) * 0.85 }}>Plus ₹29 · Pro ₹99 a month.</div>
          <div style={{ marginTop: H ? 60 : 70, opacity: rise(lf, 30, 12) }}><Wordmark size={H ? 76 : 72} color={P.cream} /></div>
        </>
      )}
    </AbsoluteFill>
  );
};

const COMP: Record<SceneKey, React.FC> = { hook: Hook, loop: Loop, night: Night, until: Until, mentor: Mentor, papers: Papers, forge: Forge, analytics: Analytics, battles: Battles, plans: Plans, stack: Stack, cta: Cta };

/** A flat colour block that sweeps over the cut on the beat: it covers the old scene, the new one is already behind it, then it uncovers. */
const Wipe: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame(); const { width } = useVideoConfig();
  const x = f < 5 ? (1 - interpolate(f, [0, 5], [0, 1], clamp)) * width : -interpolate(f, [5, 10], [0, 1], clamp) * width;
  return <AbsoluteFill style={{ background: color, transform: `translateX(${x}px)` }} />;
};

const Film: React.FC<{ scenes: [SceneKey, number, number][]; audio: string }> = ({ scenes, audio }) => (
  <AbsoluteFill style={{ background: P.cream }}>
    <Audio src={staticFile(`audio/${audio}`)} volume={1} />
    {scenes.map(([key, a, b], i) => {
      const Scene = COMP[key];
      return (
        <React.Fragment key={key}>
          <Sequence from={sec(a)} durationInFrames={sec(b) - sec(a)}><AbsoluteFill style={{ background: BG[key], color: DARK.has(key) ? P.cream : P.ink }}><Scene /></AbsoluteFill></Sequence>
          {i > 0 && <Sequence from={sec(a) - 5} durationInFrames={10}><Wipe color={key === "cta" || key === "mentor" ? P.blue : P.ink} /></Sequence>}
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);

export const AdVertical: React.FC = () => <Film scenes={SCENES_V} audio="ad-vertical.wav" />;
export const AdLandscape: React.FC = () => <Film scenes={SCENES_H} audio="ad-landscape.wav" />;
