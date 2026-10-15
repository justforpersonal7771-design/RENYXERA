// RENYXERA film v4 (4K, about 104 s). Story: studying alone at 1 AM -> the turn -> the app answers each pain -> pitch.
// Product shots are takes: frame-accurate simulations of the real app (scripts/simulate-app.mjs), signed in.
// Every spoken line appears on screen word by word, on the frame each word is spoken (timings from make_v4_audio.py).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brandFont, uiFont } from "./theme";
import vo from "./v4-vo.json";
import { BEAT, FPS, timeline, VoId, Placed } from "./v4-timeline";

const TL = timeline();
export const TOTAL4 = TL.total;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.inOut(Easing.cubic);
const c01 = (n: number) => Math.max(0, Math.min(1, n));
const INK = "#16123a", MUTED = "#5b5784", VIOLET = "#6d28d9";
const RIBBON = "linear-gradient(95deg,#22d3ee,#6366f1 45%,#a855f7 70%,#ec4899)";
const RIBBON_TXT = { backgroundImage: RIBBON, WebkitBackgroundClip: "text", color: "transparent" } as const;

// ============ shared ============
const SceneCtx = React.createContext<Placed | null>(null);
const useScene = () => React.useContext(SceneCtx)!;
const voAt = (s: Placed, id: VoId) => s.voice.find((v) => v.id === id)!.at;

/** Line of the script, revealed word by word on the frame each word is spoken: blur-in, rise, current word in the ribbon. */
const Words: React.FC<{ id: VoId; size: number; top: number; left?: number; width?: number; align?: "center" | "left"; dark?: boolean; grad?: string[]; weight?: number; out?: number }> = ({ id, size, top, left, width, align = "center", dark, grad = [], weight = 800, out }) => {
  const f = useCurrentFrame();
  const s = useScene();
  const start = voAt(s, id);
  const line = vo[id];
  const fadeOut = out != null ? 1 - c01((f - out) / 8) : 1;
  return (
    <div style={{ position: "absolute", top, left: left ?? (width ? (3840 - width) / 2 : 0), right: left == null && !width ? 0 : undefined, width, textAlign: align, opacity: fadeOut,
      fontFamily: uiFont, fontWeight: weight, fontSize: size, lineHeight: 1.12, letterSpacing: -size * 0.03 }}>
      {line.words.map((w, i) => {
        const wt = start + line.t[i] * FPS;
        const next = i + 1 < line.words.length ? start + line.t[i + 1] * FPS : start + line.dur * FPS;
        const a = ease(c01((f - wt + 2) / 9));
        const speaking = f >= wt && f < next + 2;
        const isGrad = grad.some((g) => w.toLowerCase().replace(/[^a-z0-9₹,]/g, "").startsWith(g.toLowerCase()));
        const color = dark ? "#ffffff" : INK;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: size * 0.26, opacity: a, filter: `blur(${(1 - a) * 18}px)`, transform: `translateY(${(1 - a) * size * 0.35}px)`,
            ...(isGrad || speaking ? RIBBON_TXT : { color: dark && !speaking ? color : color }), ...(speaking && !isGrad ? { filter: `blur(${(1 - a) * 18}px) brightness(1.15)` } : {}) }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Chip: React.FC<{ t: string; top?: number; left?: number; dark?: boolean; at?: number }> = ({ t, top = 96, left, dark, at = 0 }) => {
  const f = useCurrentFrame();
  const a = ease(c01((f - at) / 12));
  return (
    <div style={{ position: "absolute", top, left: left ?? 0, right: left != null ? undefined : 0, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "14px 34px", borderRadius: 999, fontFamily: uiFont, fontWeight: 800, fontSize: 34, letterSpacing: 8,
        background: dark ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.65)", border: dark ? "2px solid rgba(255,255,255,.16)" : "2px solid rgba(124,58,237,.18)",
        backdropFilter: "blur(24px)", color: dark ? "#c4b5fd" : VIOLET, boxShadow: dark ? "none" : "0 20px 60px -30px rgba(76,29,149,.5)" }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: RIBBON }} />{t}
      </span>
    </div>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${f % 8}'/></filter><rect width='400' height='400' filter='url(%23n)'/></svg>")` }} />;
};

const Night: React.FC<{ lamp?: number; orb?: number }> = ({ lamp = 1, orb = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 0%, #15103a 0%, #090719 55%, #04030d 100%)" }}>
      <div style={{ position: "absolute", width: 2600, height: 2600, left: -900, top: -1500, borderRadius: "50%", background: `radial-gradient(circle, rgba(251,191,36,${0.16 * lamp}), transparent 60%)` }} />
      <div style={{ position: "absolute", width: 3000, height: 3000, right: -1300, bottom: -1800, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,${0.22 + 0.2 * orb}), transparent 62%)`, transform: `translate(${Math.sin(f / 90) * 60}px, ${Math.cos(f / 110) * 40}px)` }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.06) 2px, transparent 2px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(60% 55% at 50% 50%, #000, transparent)", opacity: 0.7 }} />
    </AbsoluteFill>
  );
};

const Day: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(140deg, #f1ecff 0%, #f8f5ff 45%, #fdf0fa 100%)" }}>
      <div style={{ position: "absolute", width: 2600, height: 2600, borderRadius: "50%", left: -900 + Math.sin(f / 90) * 140, top: -1400 + Math.cos(f / 110) * 100, background: "radial-gradient(circle, #a78bfa38, transparent 62%)" }} />
      <div style={{ position: "absolute", width: 2800, height: 2800, borderRadius: "50%", right: -1100 + Math.cos(f / 80) * 140, bottom: -1600 + Math.sin(f / 95) * 100, background: "radial-gradient(circle, #f0abfc38, transparent 62%)" }} />
      <div style={{ position: "absolute", width: 1600, height: 1600, borderRadius: "50%", left: 1300 + Math.sin(f / 70) * 200, top: 700, background: "radial-gradient(circle, #67e8f924, transparent 62%)" }} />
    </AbsoluteFill>
  );
};

// ============ takes ============
type TakeData = { frames: number; cursor: [number, number][]; clicks: number[]; marks: Record<string, number> };
const cache: Record<string, TakeData> = {};
function useTake(name: string) {
  const [d, setD] = useState<TakeData | null>(cache[name] ?? null);
  const [h] = useState(() => (cache[name] ? null : delayRender(`take ${name}`)));
  useEffect(() => {
    if (cache[name]) return;
    fetch(staticFile(`takes/${name}.json`)).then((r) => r.json()).then((x) => { cache[name] = x; setD(x); if (h) continueRender(h); }).catch(() => h && continueRender(h));
  }, [name, h]);
  return d;
}
const frameSrc = (take: string, i: number) => staticFile(`takes/${take}/${String(i).padStart(5, "0")}.jpg`);

/** Film frame -> take frame through a list of segments (cut out waiting time), never slower than 0.75x. */
function seqMap(segs: [number, number][], dur: number, lead = 6) {
  const total = segs.reduce((a, [x, y]) => a + (y - x + 1), 0);
  const rate = Math.max(0.75, total / Math.max(1, dur - lead - 8));
  return (f: number) => {
    let k = Math.min(total - 1, Math.max(0, Math.floor((f - lead) * rate)));
    for (const [x, y] of segs) { const len = y - x + 1; if (k < len) return x + k; k -= len; }
    return segs[segs.length - 1][1];
  };
}

type Cam = { t: number; s: number; x: number; y: number };
function camAt(keys: Cam[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t < b.t) { const u = inOut(c01((t - a.t) / (b.t - a.t))); return { t, s: a.s + (b.s - a.s) * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  }
  return keys[keys.length - 1];
}
type Callout = { from: number; to: number; x: number; y: number; n?: number; label: string; side?: "left" | "right" };
type Spot = { from: number; to: number; x: number; y: number; w: number; h: number };
type WinProps = { take: string; segs?: [number, number][]; cam: Cam[]; callouts?: Callout[]; spots?: Spot[]; url: string; dur: number; box?: { left: number; top: number; width: number }; tilt?: number };

const Window: React.FC<WinProps> = ({ take, segs, cam, callouts = [], spots = [], url, dur, box = { left: 570, top: 520, width: 2700 }, tilt = 1 }) => {
  const data = useTake(take);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!data) return null;
  const tf = seqMap(segs ?? [[0, data.frames - 1]], dur)(f);
  const H = (box.width * 9) / 16;
  const c = camAt(cam, tf);
  const k = (box.width / 1600) * c.s;
  const clampPan = (boxSize: number, size: number, focus: number) => Math.min(0, Math.max(boxSize - size * k, boxSize / 2 - focus * size * k));
  const tx = clampPan(box.width, 1600, c.x), ty = clampPan(H, 900, c.y);
  const enter = spring({ frame: f, fps, config: { damping: 22, stiffness: 95, mass: 1.1 } });
  const exit = c01((f - (dur - 10)) / 10);
  const [cx, cy] = data.cursor[Math.min(tf, data.cursor.length - 1)] ?? [800, 450];
  const pressed = data.clicks.some((q) => tf >= q && tf < q + 3);
  const sweep = interpolate(f, [6, 34], [-120, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spot = spots.find((s) => tf >= s.from - 6 && tf <= s.to + 6);
  const spotA = spot ? c01((tf - spot.from + 6) / 8) * (1 - c01((tf - spot.to) / 6)) : 0;
  return (
    <div style={{ position: "absolute", left: box.left, top: box.top - 64, width: box.width, height: H + 64, perspective: 3000,
      opacity: c01(enter * 1.5) * (1 - exit), filter: `blur(${(1 - c01(enter * 1.3)) * 24 + exit * 18}px)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "#fff",
        transform: `translateY(${(1 - enter) * 160}px) rotateX(${(1 - enter) * 16 * tilt}deg) scale(${0.92 + 0.08 * enter - exit * 0.04})`,
        boxShadow: "0 140px 240px -90px rgba(60,20,140,.55), 0 0 0 2px rgba(255,255,255,.6), 0 0 0 4px rgba(124,58,237,.10)" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", background: "linear-gradient(#fdfcff,#f3f0fb)", borderBottom: "2px solid #ece8f7" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((col) => <span key={col} style={{ width: 20, height: 20, borderRadius: 10, background: col }} />)}
          <div style={{ marginLeft: 30, width: 900, height: 40, borderRadius: 12, background: "#fff", border: "2px solid #ebe7f6", display: "flex", alignItems: "center", gap: 12, padding: "0 22px", fontFamily: uiFont, fontWeight: 600, fontSize: 24, color: MUTED }}>
            <span style={{ fontSize: 20 }}>🔒</span>{url}
          </div>
        </div>
        <div style={{ position: "relative", width: box.width, height: H, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 900, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>
            <Img src={frameSrc(take, tf)} style={{ position: "absolute", width: 1600, height: 900 }} />
            {spot && spotA > 0 && (
              <div style={{ position: "absolute", left: spot.x - 12, top: spot.y - 12, width: spot.w + 24, height: spot.h + 24, borderRadius: 22, opacity: spotA,
                boxShadow: "0 0 0 4000px rgba(20,12,60,.42), 0 0 0 3px rgba(167,139,250,.9), 0 0 40px 6px rgba(167,139,250,.55)" }} />
            )}
            {data.clicks.map((q, i) => {
              const u = c01((tf - q) / 12);
              if (u <= 0 || u >= 1) return null;
              const [px, py] = data.cursor[q] ?? [cx, cy];
              return <div key={i} style={{ position: "absolute", left: px - 16, top: py - 16, width: 32, height: 32, borderRadius: 16, border: "3px solid rgba(124,58,237,.9)", transform: `scale(${0.7 + u * 2.6})`, opacity: 1 - u }} />;
            })}
            {callouts.map((o, i) => {
              const a = ease(c01((tf - o.from) / 8)) * (1 - c01((tf - o.to) / 6));
              if (a <= 0) return null;
              const left = o.side === "left";
              const dx = left ? -130 : 130;
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
                  <svg style={{ position: "absolute", overflow: "visible" }} width={1} height={1}>
                    <path d={`M ${o.x} ${o.y} C ${o.x + dx * 0.5} ${o.y}, ${o.x + dx * 0.6} ${o.y - 54}, ${o.x + dx * a} ${o.y - 54}`} fill="none" stroke="#a855f7" strokeWidth={2.4} />
                    <circle cx={o.x} cy={o.y} r={6 + 3 * Math.sin(f / 4)} fill="#a855f7" opacity={0.35} />
                    <circle cx={o.x} cy={o.y} r={5} fill="#7c3aed" />
                  </svg>
                  <div style={{ position: "absolute", left: o.x + dx * a + (left ? -8 : 8), top: o.y - 54 - 24, transform: `translateX(${left ? "-100%" : "0"}) scale(${0.7 + 0.3 * a})`, transformOrigin: left ? "right center" : "left center",
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 8px", borderRadius: 14, background: "rgba(255,255,255,.86)", backdropFilter: "blur(14px)",
                    border: "1.5px solid rgba(168,85,247,.35)", boxShadow: "0 14px 34px -10px rgba(76,29,149,.45)", whiteSpace: "nowrap", fontFamily: uiFont, fontWeight: 800, fontSize: 20, color: INK }}>
                    {o.n != null && <span style={{ width: 30, height: 30, borderRadius: 9, background: RIBBON, color: "#fff", display: "grid", placeItems: "center", fontSize: 16 }}>{o.n}</span>}
                    {o.label}
                  </div>
                </div>
              );
            })}
            <svg viewBox="0 0 24 24" style={{ position: "absolute", left: cx - 3, top: cy - 2, width: 32, height: 32, transform: `scale(${pressed ? 0.85 : 1})`, transformOrigin: "10% 10%", filter: "drop-shadow(0 4px 6px rgba(76,29,149,.4))" }}>
              <path d="M3 2l7.6 18.2 2.4-7.6 7.6-2.4z" fill="#111827" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,.55) 50%, transparent 62%)", transform: `translateX(${sweep}%)`, mixBlendMode: "soft-light" }} />
        </div>
      </div>
    </div>
  );
};

/** Feature scene: chapter chip, the spoken line word by word, the live app window. */
const Feature: React.FC<{ chip: string; lines: { id: VoId; grad?: string[] }[]; win: Omit<WinProps, "dur">; children?: React.ReactNode; textSize?: number }> = ({ chip, lines, win, children, textSize }) => {
  const s = useScene();
  const f = useCurrentFrame();
  // when there are two lines, the first gives way to the second
  return (
    <AbsoluteFill>
      <Day />
      <Chip t={chip} top={90} />
      {lines.map((l, i) => {
        const next = lines[i + 1] ? voAt(s, lines[i + 1].id) - 7 : undefined;
        const prevEnd = i > 0 ? voAt(s, l.id) + 1 : -1;
        if (f < prevEnd) return null;
        const len = vo[l.id].text.length;
        const size = textSize ?? (len > 62 ? 92 : len > 44 ? 108 : 124);
        return f < (next ?? 1e9) + 8 ? <Words key={l.id} id={l.id} size={size} top={220} width={3300} grad={l.grad} out={next} /> : null;
      })}
      <Window {...win} dur={s.dur} />
      {children}
      <Grain />
    </AbsoluteFill>
  );
};

// ============ Act 1: the problem ============
const S_Night: React.FC = () => {
  const f = useCurrentFrame();
  const s = useScene();
  const p2 = voAt(s, "p2");
  const colon = Math.floor(f / BEAT) % 2 === 0 ? 1 : 0.25;
  const shrink = ease(c01((f - p2 + 10) / 18));
  const subjects = ["Algorithms", "Operating Systems", "DBMS", "TOC", "Computer Networks", "COA", "Compiler Design", "Discrete Maths", "Digital Logic", "Aptitude", "Linear Algebra", "Probability"];
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: "absolute", left: 0, right: 0, top: 540 - 300 * shrink, textAlign: "center", transform: `scale(${1 - 0.45 * shrink})`, opacity: ease(c01(f / 16)) }}>
        <span style={{ fontFamily: uiFont, fontWeight: 300, fontSize: 420, letterSpacing: -10, color: "#fff", textShadow: "0 0 80px rgba(167,139,250,.45)" }}>1<span style={{ opacity: colon }}>:</span>12</span>
        <span style={{ fontFamily: uiFont, fontWeight: 600, fontSize: 120, color: "rgba(255,255,255,.55)", marginLeft: 30 }}>AM</span>
      </div>
      <Words id="p1" size={170} top={1150} dark out={p2 - 8} />
      {f >= p2 - 10 && subjects.map((t, i) => {
        const a = ease(c01((f - p2 - i * 3) / 14));
        const ang = (i / subjects.length) * Math.PI * 2 + f / 120;
        const r = 1250 + (i % 3) * 180;
        const sy = Math.sin(ang);
        return <div key={t} style={{ position: "absolute", left: 1920 + Math.cos(ang) * r * 1.2 - 200, top: 1130 + Math.sign(sy || 1) * (430 + Math.abs(sy) * 380) - 40, opacity: a * 0.85, filter: `blur(${(i % 4) * 1.5}px)`,
          padding: "18px 36px", borderRadius: 999, border: "2px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.06)", fontFamily: uiFont, fontWeight: 700, fontSize: 44, color: "rgba(255,255,255,.75)", whiteSpace: "nowrap" }}>{t}</div>;
      })}
      <Words id="p2" size={150} top={1040} dark width={3500} grad={["today"]} />
      <Grain />
    </AbsoluteFill>
  );
};

const QCard: React.FC<{ stamp?: number; shake?: number; picked: number; label: string }> = ({ stamp = 0, shake = 0, picked, label }) => {
  const opts = ["I only", "II only", "Both I and II", "Neither I nor II"];
  return (
    <div style={{ width: 2100, padding: 80, borderRadius: 56, background: "rgba(255,255,255,.07)", border: "2px solid rgba(255,255,255,.16)", backdropFilter: "blur(30px)",
      boxShadow: "0 80px 160px -60px rgba(0,0,0,.7)", transform: `translateX(${Math.sin(shake * 40) * 26 * (1 - shake)}px)`, position: "relative", fontFamily: uiFont }}>
      <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 6, color: "#a5b4fc" }}>{label}</div>
      <div style={{ marginTop: 30, fontWeight: 500, fontSize: 52, lineHeight: 1.35, color: "rgba(255,255,255,.92)" }}>A circular queue is implemented with a singly linked list. Which pointer link keeps insert and delete at O(1)?</div>
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {opts.map((o, i) => {
          const bad = i === 0 && picked > 0;
          return (
            <div key={o} style={{ height: 110, borderRadius: 26, display: "flex", alignItems: "center", gap: 28, padding: "0 34px", fontSize: 46, fontWeight: 600,
              background: bad ? `rgba(244,63,94,${0.18 * picked})` : "rgba(255,255,255,.05)", border: `3px solid ${bad ? `rgba(244,63,94,${0.9 * picked})` : "rgba(255,255,255,.12)"}`, color: "#fff" }}>
              <span style={{ width: 62, height: 62, borderRadius: 31, display: "grid", placeItems: "center", fontSize: 32, fontWeight: 800, background: bad ? "#f43f5e" : "rgba(255,255,255,.12)" }}>{"ABCD"[i]}</span>
              {o}{bad && <span style={{ marginLeft: "auto", fontSize: 52, color: "#fb7185", opacity: picked }}>✕</span>}
            </div>
          );
        })}
      </div>
      {stamp > 0 && (
        <div style={{ position: "absolute", right: -60, top: -70, padding: "20px 60px", borderRadius: 26, border: "10px solid #f43f5e", color: "#f43f5e", fontWeight: 900, fontSize: 130, letterSpacing: 10,
          transform: `rotate(-10deg) scale(${2.2 - 1.2 * stamp})`, opacity: stamp, background: "rgba(10,6,25,.6)" }}>AGAIN</div>
      )}
    </div>
  );
};

const S_Wrong: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScene();
  const p3 = voAt(s, "p3"), p4 = voAt(s, "p4");
  const pick = c01((f - p3 - 30) / 6);
  const shake = c01((f - p3 - 30) / 16);
  const out1 = ease(c01((f - p4 + 18) / 14));
  const in2 = spring({ frame: f - p4 + 4, fps, config: { damping: 18, stiffness: 120 } });
  const pick2 = c01((f - p4 - 22) / 6);
  const stamp = ease(c01((f - p4 - 30) / 10));
  return (
    <AbsoluteFill>
      <Night lamp={0.6} />
      <Words id="p3" size={140} top={170} dark out={p4 - 10} grad={["why"]} />
      <Words id="p4" size={140} top={170} dark grad={["again"]} />
      <div style={{ position: "absolute", left: 870, top: 560, opacity: 1 - out1, transform: `translateX(${-out1 * 900}px) rotate(${-out1 * 8}deg) scale(${1 - 0.1 * out1})`, filter: `blur(${out1 * 12}px)` }}>
        <QCard picked={pick} shake={shake} label="PRACTICE · DATA STRUCTURES" />
      </div>
      {f >= p4 - 6 && (
        <div style={{ position: "absolute", left: 870, top: 560, opacity: in2, transform: `translateX(${(1 - in2) * 900}px) rotate(${(1 - in2) * 6}deg)` }}>
          <QCard picked={pick2} shake={c01((f - p4 - 22) / 16)} stamp={stamp} label="MOCK TEST · Q14" />
        </div>
      )}
      <Grain />
    </AbsoluteFill>
  );
};

const S_Cost: React.FC = () => {
  const f = useCurrentFrame();
  const s = useScene();
  const p5 = voAt(s, "p5"), p6 = voAt(s, "p6"), p7 = voAt(s, "p7");
  const count = Math.round(211020 * ease(c01((f - p5) / 40)));
  const lit = Math.round(19 * c01((f - p6) / 30));
  const away = ease(c01((f - p7 + 12) / 14));
  return (
    <AbsoluteFill>
      <Night lamp={0.3} />
      <div style={{ opacity: 1 - away, filter: `blur(${away * 16}px)`, transform: `scale(${1 - 0.06 * away})` }}>
        <div style={{ position: "absolute", left: 300, top: 470, fontFamily: uiFont }}>
          <div style={{ fontWeight: 800, fontSize: 300, letterSpacing: -12, color: "#fff", lineHeight: 1 }}>{count.toLocaleString("en-IN")}</div>
          <div style={{ marginTop: 30, fontWeight: 600, fontSize: 70, color: "rgba(255,255,255,.7)" }}>wrote GATE CS 2026</div>
          <div style={{ marginTop: 120, fontWeight: 800, fontSize: 200, letterSpacing: -8, lineHeight: 1, ...RIBBON_TXT, opacity: c01((f - p6) / 10) }}>{Math.round(40661 * c01((f - p6) / 30)).toLocaleString("en-IN")}</div>
          <div style={{ marginTop: 24, fontWeight: 600, fontSize: 70, color: "rgba(255,255,255,.7)", opacity: c01((f - p6) / 10) }}>qualified</div>
        </div>
        <div style={{ position: "absolute", left: 2300, top: 470, display: "grid", gridTemplateColumns: "repeat(10, 96px)", gap: 34 }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const on = i < lit;
            const a = c01((f - p5 - i * 0.35) / 8);
            return <div key={i} style={{ width: 96, height: 96, borderRadius: 48, opacity: a, transform: `scale(${on ? 1.08 : 0.7})`, background: on ? RIBBON : "rgba(255,255,255,.14)", boxShadow: on ? "0 0 30px rgba(168,85,247,.7)" : "none" }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 2300, top: 1830, fontFamily: uiFont, fontWeight: 700, fontSize: 52, color: "rgba(255,255,255,.75)", opacity: c01((f - p6 - 20) / 10) }}>Fewer than 1 in 5</div>
        <div style={{ position: "absolute", left: 300, bottom: 110, fontFamily: uiFont, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,.4)" }}>Source: GATE 2026 statistical report, IIT Guwahati</div>
      </div>
      {f >= p7 - 4 && <Words id="p7" size={190} top={820} dark width={3300} grad={["direction"]} />}
      <Grain />
    </AbsoluteFill>
  );
};

// ============ Act 2: the turn ============
const S_Bridge: React.FC = () => {
  const f = useCurrentFrame();
  const s = useScene();
  const b2 = voAt(s, "b2");
  const conv = ease(c01((f - (s.dur - 40)) / 36));
  return (
    <AbsoluteFill>
      <Night lamp={0.15} orb={conv} />
      {Array.from({ length: 70 }).map((_, i) => {
        const ang = i * 2.399, r0 = 600 + (i * 53) % 1300;
        const r = r0 * (1 - conv);
        return <div key={i} style={{ position: "absolute", left: 1920 + Math.cos(ang + f / 200) * r * 1.4, top: 1080 + Math.sin(ang + f / 200) * r * 0.75, width: 8 + (i % 4) * 4, height: 8 + (i % 4) * 4, borderRadius: 10, background: i % 3 ? "#a78bfa" : "#22d3ee", opacity: 0.25 + 0.6 * conv, filter: "blur(1px)" }} />;
      })}
      <div style={{ position: "absolute", left: 1920 - 220, top: 1080 - 220, width: 440, height: 440, borderRadius: 220, background: "radial-gradient(circle, #fff, #a78bfa 40%, transparent 70%)", opacity: conv, transform: `scale(${0.3 + conv})` }} />
      <Words id="b1" size={180} top={740} dark width={3500} out={b2 - 8} grad={["never", "sleeps"]} />
      <Words id="b2" size={180} top={740} dark width={3500} grad={["think"]} out={s.dur - 30} />
      <Grain />
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ at: number; size: number; top: number }> = ({ at, size, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 120 } });
  const w = spring({ frame: f - at - 5, fps, config: { damping: 18, stiffness: 110 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.24 }}>
      <Img src={staticFile("mark-dark.png")} style={{ width: size * 1.1, height: size * 1.1, objectFit: "contain", transform: `scale(${0.3 + 0.7 * a}) rotate(${(1 - a) * -60}deg)`, opacity: c01(a * 2), filter: `drop-shadow(0 0 ${60 * a}px rgba(168,85,247,.6))` }} />
      <div style={{ fontFamily: brandFont, fontSize: size, letterSpacing: size * 0.05, color: "#fff", opacity: w, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, filter: `blur(${(1 - w) * 10}px)` }}>
        RENYX<span style={{ backgroundImage: "linear-gradient(90deg,#5edcff,#8b5cf6 55%,#e879f9)", WebkitBackgroundClip: "text", color: "transparent" }}>ERA</span>
      </div>
    </div>
  );
};

const S_Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const s = useScene();
  const r1 = voAt(s, "r1"), r2 = voAt(s, "r2");
  const flash = 1 - c01((f - r1 + 2) / 10);
  return (
    <AbsoluteFill>
      <Night lamp={0} orb={0.6} />
      <Logo at={r1 - 4} size={230} top={640} />
      <Words id="r2" size={118} top={1110} dark grad={["mentor", "practise", "understand", "improve"]} />
      {f >= r1 - 2 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.8 }} />}
      <Grain />
    </AbsoluteFill>
  );
};

// ============ Act 3: the product ============
const S_Dash: React.FC = () => (
  <Feature chip="DASHBOARD · 1:12 AM" lines={[{ id: "a1", grad: ["every", "single", "day"] }]}
    win={{ take: "dash", url: "gate.renyxera.workers.dev", cam: [{ t: 0, s: 1, x: 0.5, y: 0.35 }, { t: 30, s: 1.22, x: 0.62, y: 0.3 }, { t: 90, s: 1.22, x: 0.75, y: 0.38 }, { t: 130, s: 1.1, x: 0.5, y: 0.35 }],
      callouts: [{ from: 10, to: 60, x: 210, y: 145, label: "Burning the midnight oil", side: "right" }, { from: 32, to: 70, x: 1050, y: 230, n: 1, label: "Streak", side: "left" }, { from: 70, to: 130, x: 1443, y: 437, n: 2, label: "Readiness", side: "left" }] }} />
);

const S_Tutor: React.FC = () => {
  const s = useScene();
  const f = useCurrentFrame();
  const a2 = voAt(s, "a2");
  // "Remember that question?" — the Act 1 card flies in and shrinks into the tutor's question panel
  const fly = ease(c01((f - a2 - 34) / 22)), gone = c01((f - a2 - 60) / 10);
  return (
    <Feature chip="AI TUTOR" lines={[{ id: "a2", grad: ["why"] }, { id: "a3", grad: ["exact", "mistake", "eight", "expert", "coaches"] }]}
      win={{ take: "tutor", segs: [[0, 120], [126, 205], [244, 317]], url: "gate.renyxera.workers.dev/ai-tutor",
        cam: [{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 30, s: 1.3, x: 0.45, y: 0.4 }, { t: 90, s: 1.3, x: 0.6, y: 0.25 }, { t: 126, s: 1.3, x: 0.6, y: 0.25 }, { t: 140, s: 1.25, x: 0.5, y: 0.9 }, { t: 205, s: 1.25, x: 0.55, y: 0.85 }, { t: 250, s: 1.25, x: 0.5, y: 0.5 }, { t: 317, s: 1.25, x: 0.5, y: 0.6 }],
        callouts: [{ from: 20, to: 90, x: 520, y: 362, n: 1, label: "Knows you picked A", side: "left" }, { from: 104, to: 126, x: 985, y: 300, n: 2, label: "8 coaches", side: "right" }, { from: 150, to: 205, x: 640, y: 832, n: 3, label: "Ask anything", side: "left" }, { from: 262, to: 317, x: 500, y: 650, n: 4, label: "Why you made this mistake", side: "left" }],
        spots: [{ from: 104, to: 126, x: 910, y: 160, w: 160, h: 240 }] }}>
      {f >= a2 - 2 && gone < 1 && (
        <div style={{ position: "absolute", left: 830 - fly * 140, top: 560 + fly * 160, transform: `scale(${1 - 0.72 * fly})`, transformOrigin: "left top", opacity: 1 - gone, filter: `drop-shadow(0 60px 120px rgba(30,10,80,.5))` }}>
          <div style={{ padding: 30, borderRadius: 40, background: "#0d0a24" }}><QCard picked={1} label="REMEMBER THIS ONE?" /></div>
        </div>
      )}
    </Feature>
  );
};

const S_Mentor: React.FC = () => (
  <Feature chip="AI MENTOR" lines={[{ id: "a4", grad: ["weak", "spots", "exactly"] }]}
    win={{ take: "mentor", url: "gate.renyxera.workers.dev/ai-mentor",
      cam: [{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 34, s: 1.3, x: 0.3, y: 0.3 }, { t: 72, s: 1.35, x: 0.82, y: 0.28 }, { t: 126, s: 1.25, x: 0.35, y: 0.35 }, { t: 174, s: 1.1, x: 0.5, y: 0.6 }, { t: 206, s: 1.1, x: 0.5, y: 0.65 }],
      callouts: [{ from: 34, to: 72, x: 400, y: 240, n: 1, label: "Reads your last session", side: "right" }, { from: 74, to: 126, x: 1258, y: 212, n: 2, label: "Readiness 59", side: "left" }, { from: 94, to: 126, x: 1360, y: 240, n: 3, label: "Expected rank", side: "left" }, { from: 178, to: 206, x: 700, y: 610, n: 4, label: "Burnout risk", side: "right" }],
      spots: [{ from: 74, to: 126, x: 1200, y: 125, w: 340, h: 205 }] }} />
);

const S_Mistakes: React.FC = () => (
  <Feature chip="LEARN FROM MISTAKES" lines={[{ id: "a5", grad: ["saved", "comes", "back"] }]}
    win={{ take: "mistakes", url: "gate.renyxera.workers.dev/mistakes",
      cam: [{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 20, s: 1.3, x: 0.62, y: 0.68 }, { t: 60, s: 1.3, x: 0.62, y: 0.68 }, { t: 74, s: 1.15, x: 0.5, y: 0.35 }, { t: 90, s: 1.2, x: 0.7, y: 0.3 }],
      callouts: [{ from: 20, to: 62, x: 923, y: 653, n: 1, label: "Your past mistake", side: "left" }, { from: 76, to: 90, x: 1133, y: 242, n: 2, label: "Due today", side: "left" }],
      spots: [{ from: 20, to: 62, x: 420, y: 625, w: 556, h: 62 }] }} />
);

const S_Practice: React.FC = () => {
  const s = useScene();
  const half = Math.round(s.dur * 0.45);
  return (
    <AbsoluteFill>
      <Day />
      <Chip t="PRACTICE · REAL EXAM SCREEN" top={90} />
      <Words id="a6" size={108} top={220} width={3300} grad={["2,400", "official", "real"]} />
      <Sequence durationInFrames={half}>
        <Window take="setup" segs={[[60, 206]]} url="gate.renyxera.workers.dev/setup" dur={half}
          cam={[{ t: 60, s: 1.3, x: 0.3, y: 0.42 }, { t: 130, s: 1.3, x: 0.45, y: 0.42 }, { t: 168, s: 1.1, x: 0.7, y: 0.45 }]}
          callouts={[{ from: 86, to: 130, x: 200, y: 356, n: 1, label: "Section", side: "right" }, { from: 130, to: 170, x: 760, y: 356, n: 2, label: "Subject", side: "right" }]} />
      </Sequence>
      <Sequence from={half - 6}>
        <Window take="exam" segs={[[30, 186]]} url="gate.renyxera.workers.dev/exam" dur={s.dur - half + 6}
          cam={[{ t: 30, s: 1.2, x: 0.4, y: 0.75 }, { t: 60, s: 1.35, x: 0.8, y: 0.28 }, { t: 120, s: 1.35, x: 0.8, y: 0.28 }, { t: 150, s: 1.1, x: 0.6, y: 0.7 }]}
          callouts={[{ from: 70, to: 125, x: 1300, y: 137, n: 3, label: "GATE virtual calculator", side: "left" }]} />
      </Sequence>
      <Grain />
    </AbsoluteFill>
  );
};

const S_Analytics: React.FC = () => (
  <Feature chip="ANALYTICS" lines={[{ id: "a7", grad: ["leaking"] }]}
    win={{ take: "analytics", url: "gate.renyxera.workers.dev/analytics",
      cam: [{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 30, s: 1.3, x: 0.35, y: 0.62 }, { t: 90, s: 1.3, x: 0.35, y: 0.62 }, { t: 150, s: 1.05, x: 0.5, y: 0.6 }],
      callouts: [{ from: 50, to: 100, x: 470, y: 603, n: 1, label: "Smart insight", side: "right" }],
      spots: [{ from: 50, to: 100, x: 58, y: 582, w: 965, h: 44 }] }} />
);

const S_Challenge: React.FC = () => (
  <Feature chip="WEEKLY CHALLENGE" lines={[{ id: "a8", grad: ["rank"] }]}
    win={{ take: "challenge", url: "gate.renyxera.workers.dev/mocks",
      cam: [{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 40, s: 1.35, x: 0.5, y: 0.66 }, { t: 88, s: 1.35, x: 0.7, y: 0.66 }],
      callouts: [{ from: 50, to: 88, x: 1500, y: 600, n: 1, label: "Ranks", side: "left" }],
      spots: [{ from: 44, to: 88, x: 32, y: 540, w: 1536, h: 125 }] }} />
);

const Phone: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - at, fps, config: { damping: 18, stiffness: 110 } });
  const msg = spring({ frame: f - at - 16, fps, config: { damping: 15, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", right: 260, top: 560, width: 760, height: 1440, borderRadius: 110, background: "#0b0b12", padding: 26, boxSizing: "border-box",
      transform: `translateX(${(1 - a) * 1200}px) rotate(${(1 - a) * 12 - 4}deg)`, boxShadow: "0 120px 200px -60px rgba(30,10,80,.6)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 86, overflow: "hidden", background: "linear-gradient(#e7eef7,#dbe6f2)", position: "relative", fontFamily: uiFont }}>
        <div style={{ height: 150, background: "#fff", display: "flex", alignItems: "center", gap: 22, padding: "40px 40px 0" }}>
          <Img src={staticFile("mark-dark.png")} style={{ width: 76, height: 76, borderRadius: 38, background: "#1b1450", padding: 10, boxSizing: "border-box" }} />
          <div><div style={{ fontWeight: 800, fontSize: 36, color: "#111" }}>RENYXERA</div><div style={{ fontSize: 26, color: "#3b82f6" }}>bot</div></div>
        </div>
        <div style={{ position: "absolute", left: 34, right: 70, top: 420, padding: "28px 32px", borderRadius: "34px 34px 34px 8px", background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          transform: `translateY(${(1 - msg) * 60}px) scale(${0.9 + 0.1 * msg})`, opacity: msg, transformOrigin: "left bottom" }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#111" }}>⏰ Starting soon</div>
          <div style={{ marginTop: 10, fontSize: 32, color: "#222", lineHeight: 1.35 }}>Revise: Boolean Algebra, Minimization, K-Maps</div>
          <div style={{ marginTop: 8, fontSize: 28, fontStyle: "italic", color: "#555" }}>21:00–22:30 · 1.5 h</div>
        </div>
        {[["✅ Done", "⏰ +15 min"], ["Open Study Planner"]].map((row, r) => (
          <div key={r} style={{ position: "absolute", left: 34, right: 70, top: 790 + r * 92, display: "flex", gap: 14, opacity: msg }}>
            {row.map((b) => <div key={b} style={{ flex: 1, height: 78, borderRadius: 20, background: "rgba(255,255,255,.7)", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 700, color: "#2563eb" }}>{b}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
};

const S_Plan: React.FC = () => {
  const s = useScene();
  const a9 = voAt(s, "a9");
  const tg = a9 + Math.round(vo.a9.t[vo.a9.words.findIndex((w) => w.startsWith("nudge"))] * FPS) - 10;
  return (
    <Feature chip="STUDY PLANNER · TELEGRAM" lines={[{ id: "a9", grad: ["fits", "telegram"] }]}
      win={{ take: "planner", url: "gate.renyxera.workers.dev/tools/gate-study-plan", box: { left: 260, top: 560, width: 2500 }, tilt: 0.7,
        cam: [{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 14, s: 1.3, x: 0.4, y: 0.45 }, { t: 120, s: 1.25, x: 0.45, y: 0.55 }, { t: 160, s: 1.2, x: 0.5, y: 0.85 }],
        callouts: [{ from: 30, to: 90, x: 735, y: 405, n: 1, label: "Hours a day", side: "right" }, { from: 90, to: 150, x: 710, y: 494, n: 2, label: "Weak sections", side: "right" }] }}>
      <Phone at={tg} />
    </Feature>
  );
};

const S_Profile: React.FC = () => (
  <Feature chip="PROFILE · ACHIEVEMENTS" lines={[{ id: "a10", grad: ["level"] }]}
    win={{ take: "profile", url: "gate.renyxera.workers.dev/profile",
      cam: [{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 30, s: 1.2, x: 0.5, y: 0.55 }, { t: 106, s: 1.25, x: 0.55, y: 0.75 }] }} />
);

const S_Plans: React.FC = () => {
  const s = useScene();
  const f = useCurrentFrame();
  const m2 = voAt(s, "m2");
  const chip = ease(c01((f - m2 - 10) / 12));
  return (
    <Feature chip="PLUS & PRO" lines={[{ id: "m1", grad: ["plus", "pro"] }, { id: "m2", grad: ["chai"] }]}
      win={{ take: "plans", url: "gate.renyxera.workers.dev/pro",
        cam: [{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 30, s: 1.25, x: 0.62, y: 0.6 }, { t: 102, s: 1.25, x: 0.62, y: 0.62 }],
        callouts: [{ from: 34, to: 102, x: 640, y: 424, n: 1, label: "Plus · ₹29 a month", side: "left" }, { from: 52, to: 102, x: 1160, y: 424, n: 2, label: "Pro · ₹99 a month", side: "left" }, { from: 70, to: 102, x: 1180, y: 485, n: 3, label: "150 AI requests a day", side: "left" }] }}>
      <div style={{ position: "absolute", left: 300, bottom: 120, opacity: chip, transform: `translateY(${(1 - chip) * 40}px)`, padding: "28px 48px", borderRadius: 32,
        background: "rgba(255,255,255,.75)", backdropFilter: "blur(20px)", border: "2px solid rgba(168,85,247,.3)", fontFamily: uiFont, fontWeight: 800, fontSize: 56, color: INK, boxShadow: "0 40px 90px -40px rgba(76,29,149,.5)" }}>
        Plus ₹29/month <span style={{ color: MUTED, fontWeight: 600 }}>≈</span> <span style={RIBBON_TXT}>₹7 a week</span>
      </div>
    </Feature>
  );
};

// ============ the pitch ============
const PAPERS: [string, number][] = [["CS", 211020], ["EC", 95752], ["DA", 69242], ["EE", 65801], ["ME", 59612]];
const TILES: { take: string; frame: number; crop: [number, number, number, number]; word: string; label: string }[] = [
  { take: "exam", frame: 120, crop: [0, 60, 1260, 780], word: "practises", label: "Practises" },
  { take: "tutor", frame: 300, crop: [330, 140, 680, 470], word: "explains", label: "Explains" },
  { take: "mistakes", frame: 30, crop: [395, 155, 1175, 715], word: "remembers", label: "Remembers" },
  { take: "planner", frame: 150, crop: [32, 270, 1536, 540], word: "plans", label: "Plans" },
  { take: "mentor", frame: 100, crop: [32, 96, 1536, 265], word: "explains", label: "Coaches" },
  { take: "analytics", frame: 60, crop: [32, 196, 1536, 510], word: "practises", label: "Measures" },
];
const S_Pitch: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScene();
  const c1 = voAt(s, "c1"), c2 = voAt(s, "c2");
  const sum = PAPERS.reduce((a, [, n]) => a + n, 0);
  const shown = Math.round(sum * ease(c01((f - c1) / 45)));
  const toGrid = ease(c01((f - c2 + 16) / 18));
  const wordAt = (w: string) => c2 + vo.c2.t[vo.c2.words.findIndex((x) => x.toLowerCase().startsWith(w))] * FPS;
  const cells = [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 2, 1], [0, 2, 2, 1], [2, 2, 2, 1]];
  const CW = 820, CH = 460, G = 40, OX = 220, OY = 520;
  return (
    <AbsoluteFill>
      <Night lamp={0} orb={0.4} />
      <div style={{ opacity: 1 - toGrid, filter: `blur(${toGrid * 16}px)` }}>
        <Words id="c1" size={140} top={280} dark width={3500} grad={["five", "lakh"]} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 340, letterSpacing: -14, ...RIBBON_TXT }}>{shown.toLocaleString("en-IN")}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", gap: 40 }}>
          {PAPERS.map(([p, n], i) => {
            const a = spring({ frame: f - c1 - 20 - i * 5, fps, config: { damping: 16, stiffness: 120 } });
            return <div key={p} style={{ opacity: a, transform: `translateY(${(1 - a) * 60}px)`, padding: "30px 46px", borderRadius: 36, background: "rgba(255,255,255,.07)", border: "2px solid rgba(255,255,255,.14)", fontFamily: uiFont, color: "#fff", textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 64 }}>{p}</div><div style={{ fontWeight: 600, fontSize: 40, color: "rgba(255,255,255,.65)" }}>{n.toLocaleString("en-IN")}</div></div>;
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: uiFont, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,.4)" }}>Candidates who sat each paper, GATE 2026 (IIT Guwahati report)</div>
      </div>
      {f >= c2 - 16 && (
        <>
          <Words id="c2" size={100} top={200} dark width={3400} grad={["practises", "explains", "remembers", "plans"]} />
          {TILES.map((t, i) => {
            const [gx, gy, gw, gh] = cells[i];
            const a = spring({ frame: f - c2 + 12 - i * 4, fps, config: { damping: 17, stiffness: 120 } });
            const w = gw * CW + (gw - 1) * G, h = gh * CH + (gh - 1) * G;
            const lit = c01((f - wordAt(t.word)) / 6) * (1 - c01((f - wordAt(t.word) - 26) / 10));
            const [x, y, cw, ch] = t.crop;
            const k = Math.max(w / cw, h / ch);
            return (
              <div key={i} style={{ position: "absolute", left: OX + gx * (CW + G), top: OY + gy * (CH + G), width: w, height: h, borderRadius: 44, overflow: "hidden", opacity: a,
                transform: `translateY(${(1 - a) * 140}px) scale(${0.9 + 0.1 * a + 0.03 * lit})`, background: "#fff",
                boxShadow: `0 60px 120px -50px rgba(0,0,0,.7), 0 0 0 ${3 + 4 * lit}px rgba(168,85,247,${0.25 + 0.7 * lit}), 0 0 ${90 * lit}px rgba(168,85,247,.6)` }}>
                <Img src={frameSrc(t.take, t.frame)} style={{ position: "absolute", width: 1600 * k, height: 900 * k, left: -x * k, top: -y * k, maxWidth: "none" }} />
                <div style={{ position: "absolute", left: 28, bottom: 28, padding: "12px 26px", borderRadius: 999, background: "rgba(13,10,36,.78)", backdropFilter: "blur(10px)", color: "#fff", fontFamily: uiFont, fontWeight: 800, fontSize: 38 }}>{t.label}</div>
              </div>
            );
          })}
        </>
      )}
      <Grain />
    </AbsoluteFill>
  );
};

const S_End: React.FC = () => {
  const f = useCurrentFrame();
  const s = useScene();
  const c3 = voAt(s, "c3"), c4 = voAt(s, "c4");
  const away = ease(c01((f - c4 + 14) / 12));
  return (
    <AbsoluteFill>
      <Night lamp={0.5} orb={0.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: 0.55 * (1 - away), fontFamily: uiFont, fontWeight: 300, fontSize: 180, color: "#fff" }}>1:12 <span style={{ fontSize: 70 }}>AM</span></div>
      <div style={{ opacity: 1 - away, filter: `blur(${away * 14}px)` }}><Words id="c3" size={200} top={820} dark grad={["direction"]} /></div>
      {f >= c4 - 16 && (
        <>
          <Logo at={c4 - 4} size={240} top={720} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 56, letterSpacing: 18, color: "#c4b5fd", opacity: c01((f - c4 - 30) / 12) }}>A NEW ERA OF INTELLIGENT LEARNING</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center", fontFamily: uiFont, fontWeight: 700, fontSize: 80, color: "#fff", opacity: c01((f - c4 - 54) / 12) }}>gate.renyxera.workers.dev</div>
        </>
      )}
      <Grain />
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC> = {
  night: S_Night, wrong: S_Wrong, cost: S_Cost, bridge: S_Bridge, reveal: S_Reveal, dash: S_Dash, tutor: S_Tutor, mentor: S_Mentor, mistakes: S_Mistakes,
  practice: S_Practice, analytics: S_Analytics, challenge: S_Challenge, plan: S_Plan, profile: S_Profile, plans: S_Plans, pitch: S_Pitch, end: S_End,
};

export const Film4: React.FC = () => {
  const allVoice = TL.scenes.flatMap((s) => s.voice.map((v) => ({ ...v, at: s.at + v.at })));
  const duck = (x: number) => (allVoice.some((v) => x >= v.at - 4 && x <= v.at + v.len + 6) ? 0.38 : 0.62);
  return (
    <AbsoluteFill style={{ background: "#04030d" }}>
      {TL.scenes.map((s) => {
        const C = SCENES[s.id];
        return (
          <Sequence key={s.id} from={s.at} durationInFrames={s.dur}>
            <SceneCtx.Provider value={s}><C /></SceneCtx.Provider>
          </Sequence>
        );
      })}
      <Audio src={staticFile("v4/music.wav")} volume={(x) => duck(x) * interpolate(x, [TOTAL4 - 50, TOTAL4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {allVoice.map((v, i) => <Sequence key={i} from={v.at}><Audio src={staticFile(`v4/vo_${v.id}.wav`)} /></Sequence>)}
      {TL.scenes.slice(1).map((s, i) => <Sequence key={`g${i}`} from={Math.max(0, s.at - 4)}><Audio src={staticFile("v4/glass.wav")} volume={0.45} /></Sequence>)}
    </AbsoluteFill>
  );
};
