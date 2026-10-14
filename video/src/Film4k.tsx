// RENYXERA launch film v3, 4K (3840x2160), 120 BPM grid (1 beat = 15 frames, 1 bar = 60 frames).
// Product scenes play "takes": frame-accurate simulations of the real app captured by scripts/simulate-app.mjs
// (one 4K JPEG per frame, plus the cursor path and click frames). Each take is time-warped so its clicks land on beats,
// framed in a window on a soft brand stage, and directed with a gliding camera, numbered callouts and a loupe,
// in the visual language of the reference video (see docs/PROMO_VIDEO_MASTER_PROMPT.md, V3).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brandFont, uiFont } from "./theme";
import vo from "./launch-vo.json";

export const FPS = 30;
const BEAT = 15, BAR = 60;
const W = 3840, H = 2160;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.inOut(Easing.cubic);
const c01 = (n: number) => Math.max(0, Math.min(1, n));
const INK = "#16123a", MUTED = "#5b5784", VIOLET = "#6d28d9";
const RIBBON = "linear-gradient(95deg,#06c2fb,#5b21e0 55%,#dd42fb)";

// ---------- takes ----------
type TakeData = { frames: number; cursor: [number, number][]; clicks: number[]; marks: Record<string, number> };
function useTake(name: string): TakeData | null {
  const [data, setData] = useState<TakeData | null>(null);
  const [handle] = useState(() => delayRender(`take ${name}`));
  useEffect(() => {
    fetch(staticFile(`takes/${name}.json`)).then((r) => r.json()).then((d) => { setData(d); continueRender(handle); }).catch(() => continueRender(handle));
  }, [name, handle]);
  return data;
}
const frameSrc = (name: string, i: number) => staticFile(`takes/${name}/${String(i).padStart(5, "0")}.jpg`);

/** Film frame -> take frame. Clicks are pulled onto the nearest beat; between anchors the take plays linearly. */
function warp(t: TakeData, dur: number, lead: number) {
  const L = t.frames - 1;
  const span = dur - lead - 10;
  const anchors: [number, number][] = [[lead, 0]];
  for (const c of t.clicks) {
    const ideal = lead + (c / L) * span;
    const snapped = Math.round(ideal / BEAT) * BEAT;
    const prev = anchors[anchors.length - 1];
    if (snapped > prev[0] + 3 && c > prev[1]) anchors.push([snapped, c]);
  }
  anchors.push([lead + span, L]);
  return (f: number) => {
    if (f <= lead) return 0;
    for (let i = 0; i < anchors.length - 1; i++) {
      const [fa, ta] = anchors[i], [fb, tb] = anchors[i + 1];
      if (f <= fb) return Math.round(ta + (tb - ta) * ((f - fa) / Math.max(1, fb - fa)));
    }
    return L;
  };
}

// ---------- stage ----------
const Stage: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: dark ? "radial-gradient(120% 90% at 50% 0%, #1d1650 0%, #0b0822 60%, #06051a 100%)" : "linear-gradient(135deg, #efeaff 0%, #f6f2ff 45%, #fbefff 100%)" }}>
      <div style={{ position: "absolute", width: 2600, height: 2600, borderRadius: "50%", left: -900 + Math.sin(f / 90) * 160, top: -1300 + Math.cos(f / 110) * 120, background: `radial-gradient(circle, ${dark ? "#06c2fb33" : "#a78bfa40"}, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 2800, height: 2800, borderRadius: "50%", right: -1100 + Math.cos(f / 80) * 160, bottom: -1500 + Math.sin(f / 95) * 120, background: `radial-gradient(circle, ${dark ? "#dd42fb2e" : "#f0abfc40"}, transparent 62%)` }} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ kicker: string; text: string; at?: number; out: number }> = ({ kicker, text, at = 0, out }) => {
  const f = useCurrentFrame();
  const a = ease(c01((f - at) / 14)), b = ease(c01((f - at - 5) / 14));
  const gone = 1 - c01((f - out) / 8);
  return (
    <div style={{ position: "absolute", left: 480, top: 120, opacity: gone }}>
      <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 46, letterSpacing: 12, color: VIOLET, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>{kicker}</div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 132, letterSpacing: -4, color: INK, transform: `translateY(${(1 - b) * 105}%)` }}>{text}</div>
      </div>
    </div>
  );
};

// ---------- the app window, camera, cursor, callouts and loupe ----------
type Cam = { t: number; s: number; x: number; y: number }; // t = take frame
type Callout = { from: number; to: number; x: number; y: number; n: number; label?: string; side?: "left" | "right" };
type Loupe = { from: number; to: number; x: number; y: number; zoom?: number; at: [number, number] };
const WIN = { left: 480, top: 430, width: 2880 }; // 16:9 -> height 1620
const WIN_H = (WIN.width * 9) / 16;

function camAt(keys: Cam[], t: number) {
  if (!keys.length) return { s: 1, x: 0.5, y: 0.5 };
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t < b.t) { const u = inOut(c01((t - a.t) / (b.t - a.t))); return { s: a.s + (b.s - a.s) * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  }
  return keys[keys.length - 1];
}
/** App CSS px -> window px for the current camera. */
function camera(c: { s: number; x: number; y: number }) {
  const k = (WIN.width / 1600) * c.s;
  const clamp = (box: number, size: number, focus: number) => Math.min(0, Math.max(box - size * k, box / 2 - focus * size * k));
  return { k, tx: clamp(WIN.width, 1600, c.x), ty: clamp(WIN_H, 900, c.y) };
}

const AppWindow: React.FC<{ take: string; data: TakeData; tf: number; cam: Cam[]; callouts?: Callout[]; loupes?: Loupe[]; url?: string }> = ({ take, data, tf, cam, callouts = [], loupes = [], url = "gate.renyxera.workers.dev" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 24, stiffness: 110 } });
  const c = camera(camAt(cam, tf));
  const [cx, cy] = data.cursor[Math.min(tf, data.cursor.length - 1)] ?? [800, 450];
  const pressed = data.clicks.some((k) => tf >= k && tf < k + 3);
  return (
    <>
      <div style={{ position: "absolute", left: WIN.left, top: WIN.top - 64, width: WIN.width, height: WIN_H + 64, borderRadius: 40, background: "#fff", overflow: "hidden",
        boxShadow: "0 120px 220px -80px rgba(76,29,149,.45), 0 0 0 2px rgba(91,33,224,.10)", opacity: enter, transform: `translateY(${(1 - enter) * 120}px) scale(${0.96 + 0.04 * enter})` }}>
        {/* window bar */}
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", background: "linear-gradient(#fbfaff,#f3f0fb)", borderBottom: "2px solid #ece8f7" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((col) => <span key={col} style={{ width: 20, height: 20, borderRadius: 10, background: col }} />)}
          <div style={{ marginLeft: 30, flex: 1, maxWidth: 900, height: 40, borderRadius: 12, background: "#fff", border: "2px solid #ebe7f6", display: "flex", alignItems: "center", padding: "0 22px", fontFamily: uiFont, fontWeight: 600, fontSize: 24, color: MUTED }}>{url}</div>
        </div>
        <div style={{ position: "relative", width: WIN.width, height: WIN_H, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 900, transformOrigin: "0 0", transform: `translate(${c.tx}px, ${c.ty}px) scale(${c.k})` }}>
            <Img src={frameSrc(take, tf)} style={{ position: "absolute", width: 1600, height: 900 }} />
            {/* click ripple */}
            {data.clicks.map((k, i) => {
              const u = c01((tf - k) / 12);
              if (u <= 0 || u >= 1) return null;
              const [px, py] = data.cursor[k] ?? [cx, cy];
              return <div key={i} style={{ position: "absolute", left: px - 16, top: py - 16, width: 32, height: 32, borderRadius: 16, border: "3px solid rgba(124,58,237,.9)", transform: `scale(${0.7 + u * 2.6})`, opacity: 1 - u }} />;
            })}
            {/* callouts */}
            {callouts.map((o, i) => {
              const a = ease(c01((tf - o.from) / 8)) * (1 - c01((tf - o.to) / 6));
              if (a <= 0) return null;
              const dx = o.side === "left" ? -150 : 150;
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
                  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                    <line x1={o.x} y1={o.y} x2={o.x + dx * a} y2={o.y - 60 * a} stroke="#ef4444" strokeWidth={2.5} />
                    <circle cx={o.x} cy={o.y} r={6} fill="#ef4444" />
                  </svg>
                  <div style={{ position: "absolute", left: o.x + dx * a - (o.side === "left" ? 230 : 0), top: o.y - 60 * a - 26, display: "flex", alignItems: "center", gap: 10, flexDirection: o.side === "left" ? "row-reverse" : "row", transform: `scale(${0.6 + 0.4 * a})` }}>
                    <div style={{ width: 52, height: 52, borderRadius: 26, background: "#ef4444", color: "#fff", display: "grid", placeItems: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 26, boxShadow: "0 8px 20px rgba(239,68,68,.45)" }}>{o.n}</div>
                    {o.label && <div style={{ padding: "8px 16px", borderRadius: 12, background: "#fff", fontFamily: uiFont, fontWeight: 800, fontSize: 22, color: INK, boxShadow: "0 10px 24px rgba(30,20,80,.18)", whiteSpace: "nowrap" }}>{o.label}</div>}
                  </div>
                </div>
              );
            })}
            {/* cursor */}
            <svg viewBox="0 0 24 24" style={{ position: "absolute", left: cx - 3, top: cy - 2, width: 34, height: 34, transform: `scale(${pressed ? 0.85 : 1})`, transformOrigin: "10% 10%", filter: "drop-shadow(0 4px 6px rgba(76,29,149,.45))" }}>
              <path d="M3 2l7.6 18.2 2.4-7.6 7.6-2.4z" fill="#6d28d9" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {/* loupes sit on the stage, outside the window, reading the same frame */}
      {loupes.map((l, i) => {
        const a = ease(c01((tf - l.from) / 8)) * (1 - c01((tf - l.to) / 6));
        if (a <= 0) return null;
        const z = l.zoom ?? 2.6, R = 300;
        const src = { x: WIN.left + c.tx + l.x * c.k, y: WIN.top + c.ty + l.y * c.k };
        return (
          <React.Fragment key={i}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: a }} width={1} height={1}>
              <line x1={src.x} y1={src.y} x2={l.at[0]} y2={l.at[1]} stroke="#7c3aed" strokeWidth={4} strokeDasharray="12 10" />
              <circle cx={src.x} cy={src.y} r={46 * a} fill="none" stroke="#7c3aed" strokeWidth={5} />
            </svg>
            <div style={{ position: "absolute", left: l.at[0] - R, top: l.at[1] - R, width: 2 * R, height: 2 * R, borderRadius: R, overflow: "hidden", border: "10px solid #fff", boxShadow: "0 40px 90px rgba(76,29,149,.45)", transform: `scale(${a})`, background: "#fff" }}>
              <Img src={frameSrc(take, tf)} style={{ position: "absolute", width: 1600 * z, height: 900 * z, left: R - l.x * z - 10, top: R - l.y * z - 10, maxWidth: "none" }} />
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// A product scene: title + window, take time-warped onto the scene length.
const TakeScene: React.FC<{ take: string; dur: number; startMark?: string; startAt?: number; kicker: string; title: string; cam: Cam[]; callouts?: Callout[]; loupes?: Loupe[]; url?: string; extra?: (tf: number, d: TakeData) => React.ReactNode }> = (p) => {
  const data = useTake(p.take);
  const f = useCurrentFrame();
  if (!data) return <Stage />;
  // optionally start the take at a mark (e.g. when the results page has finished loading)
  const start = p.startAt ?? (p.startMark ? data.marks[p.startMark] ?? 0 : 0);
  const sub: TakeData = { ...data, frames: data.frames - start, clicks: data.clicks.filter((c) => c > start).map((c) => c - start) };
  const tf = start + warp(sub, p.dur, 8)(f);
  return (
    <AbsoluteFill>
      <Stage />
      <Title kicker={p.kicker} text={p.title} out={p.dur - 8} />
      <AppWindow take={p.take} data={data} tf={tf} cam={p.cam} callouts={p.callouts} loupes={p.loupes} url={p.url} />
      {p.extra?.(tf, data)}
    </AbsoluteFill>
  );
};

// ---------- type-only scenes ----------
const Count: React.FC<{ to: number; at: number; dur?: number }> = ({ to, at, dur = 36 }) => {
  const f = useCurrentFrame();
  const v = Math.round(to * ease(c01((f - at) / dur)));
  return <>{v.toLocaleString("en-IN")}</>;
};

const S_HOOK: React.FC = () => {
  const f = useCurrentFrame();
  const second = f >= 90;
  const a = ease(c01((f - (second ? 90 : 0)) / 14));
  return (
    <AbsoluteFill>
      <Stage dark />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
        <div style={{ fontFamily: uiFont, fontWeight: 800, fontSize: 420, letterSpacing: -16, color: second ? "transparent" : "#fff", backgroundImage: second ? RIBBON : undefined, WebkitBackgroundClip: second ? "text" : undefined, lineHeight: 1 }}>
          {second ? <Count to={40661} at={90} /> : <Count to={211020} at={0} />}
        </div>
        <div style={{ marginTop: 40, fontFamily: uiFont, fontWeight: 700, fontSize: 92, color: "rgba(255,255,255,.88)" }}>
          {second ? "qualified. Fewer than 1 in 5." : "students sat GATE CS 2026."}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: uiFont, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,.5)" }}>Source: GATE 2026 statistical report, IIT Guwahati</div>
    </AbsoluteFill>
  );
};

const Lines: React.FC<{ lines: { t: string; at: number; grad?: boolean }[]; size: number; top: number; dark?: boolean }> = ({ lines, size, top, dark }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center" }}>
      {lines.map((l, i) => {
        const a = ease(c01((f - l.at) / 14));
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 40 }}>
            <div style={{ display: "inline-block", fontFamily: uiFont, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.035, lineHeight: 1.05, transform: `translateY(${(1 - a) * 110}%)`, opacity: a,
              color: l.grad ? "transparent" : dark ? "#fff" : INK, ...(l.grad ? { backgroundImage: RIBBON, WebkitBackgroundClip: "text" } : {}) }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

const S_TURN: React.FC = () => (
  <AbsoluteFill><Stage dark /><Lines dark size={230} top={620} lines={[{ t: "Effort was never the problem.", at: 0 }, { t: "Direction was.", at: 30, grad: true }]} /></AbsoluteFill>
);

const Logo: React.FC<{ at?: number; top: number; size: number }> = ({ at = 0, top, size }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 140 } });
  const w = spring({ frame: f - at - 6, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.22 }}>
      <Img src={staticFile("mark-dark.png")} style={{ width: size * 1.05, height: size * 1.05, objectFit: "contain", transform: `scale(${0.4 + 0.6 * a}) rotate(${(1 - a) * -40}deg)`, opacity: c01(a * 2) }} />
      <div style={{ fontFamily: brandFont, fontSize: size, letterSpacing: size * 0.05, color: "#fff", opacity: w, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        RENYX<span style={{ backgroundImage: "linear-gradient(90deg,#5edcff,#8b5cf6 55%,#e879f9)", WebkitBackgroundClip: "text", color: "transparent" }}>ERA</span>
      </div>
    </div>
  );
};

const S_LOGO: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage dark />
      <Logo top={820} size={300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1280, textAlign: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 56, letterSpacing: 18, color: "#c4b5fd", opacity: c01((f - 20) / 12) }}>A NEW ERA OF INTELLIGENT LEARNING</div>
      <AbsoluteFill style={{ background: "#fff", opacity: (1 - c01(f / 8)) * 0.85 }} />
    </AbsoluteFill>
  );
};

const NEW = [
  { t: "Civil Engineering", d: "GATE CE joins CS, DA, EC, EE and ME" },
  { t: "GATE-level practice", d: "New questions built on the official pattern" },
];
const NEXT = [
  { t: "Flashcards", d: "Quick revision from your own mistakes" },
  { t: "College predictor", d: "From official closing scores" },
];
const FeatureCard: React.FC<{ t: string; d: string; tag: string; hot?: boolean; delay: number; x: number }> = ({ t, d, tag, hot, delay, x }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - delay, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", left: x, top: 820, width: 780, height: 560, borderRadius: 56, padding: 70, boxSizing: "border-box", opacity: a, transform: `translateY(${(1 - a) * 140}px)`,
      background: hot ? "linear-gradient(160deg,#ffffff,#f3ecff)" : "rgba(255,255,255,.88)", border: hot ? "4px solid #c4b5fd" : "2px solid #ece8f7", boxShadow: "0 80px 160px -60px rgba(76,29,149,.5)" }}>
      <div style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, background: hot ? RIBBON : "#efe7ff", color: hot ? "#fff" : VIOLET, fontFamily: uiFont, fontWeight: 800, fontSize: 34, letterSpacing: 4 }}>{tag}</div>
      <div style={{ marginTop: 60, fontFamily: uiFont, fontWeight: 800, fontSize: 84, lineHeight: 1.05, letterSpacing: -3, color: INK }}>{t}</div>
      <div style={{ marginTop: 30, fontFamily: uiFont, fontWeight: 500, fontSize: 46, lineHeight: 1.3, color: MUTED }}>{d}</div>
    </div>
  );
};
const S_COMING: React.FC = () => (
  <AbsoluteFill>
    <Stage />
    <Lines size={160} top={300} lines={[{ t: "New, and next.", at: 0, grad: true }]} />
    {NEW.map((c, i) => <FeatureCard key={c.t} {...c} tag="NEW" hot delay={10 + i * BEAT} x={200 + i * 860} />)}
    {NEXT.map((c, i) => <FeatureCard key={c.t} {...c} tag="COMING SOON" delay={40 + i * BEAT} x={1920 + i * 860} />)}
  </AbsoluteFill>
);

const S_END: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = spring({ frame: f - 40, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Stage dark />
      <Logo top={700} size={280} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", fontFamily: uiFont, fontWeight: 800, fontSize: 56, letterSpacing: 18, color: "#c4b5fd", opacity: c01((f - 20) / 12) }}>A NEW ERA OF INTELLIGENT LEARNING</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center", opacity: u, transform: `translateY(${(1 - u) * 40}px)`, fontFamily: uiFont, fontWeight: 700, fontSize: 84, color: "#fff" }}>gate.renyxera.workers.dev</div>
      <AbsoluteFill style={{ background: "#fff", opacity: (1 - c01(f / 8)) * 0.85 }} />
    </AbsoluteFill>
  );
};

// ---------- product scenes (camera keys and callouts are in take frames / app CSS px) ----------
const S_SETUP: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="setup" dur={dur} kicker="01 · PICK" title="Section. Subject. Topic." url="gate.renyxera.workers.dev/setup"
    cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 10, s: 1.45, x: 0.2, y: 0.35 }, { t: 60, s: 1.45, x: 0.22, y: 0.42 }, { t: 105, s: 1.4, x: 0.45, y: 0.42 }, { t: 150, s: 1.3, x: 0.62, y: 0.33 }, { t: 175, s: 1.05, x: 0.72, y: 0.5 }]}
    callouts={[{ from: 74, to: 122, x: 200, y: 356, n: 1, label: "Section" }, { from: 122, to: 170, x: 760, y: 356, n: 2, label: "Subject" }, { from: 146, to: 206, x: 300, y: 452, n: 3, label: "Topic" }]} />
);
const S_EXAM: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="exam" dur={dur} kicker="02 · SOLVE" title="Real questions. Real exam screen." url="gate.renyxera.workers.dev/exam"
    cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 16, s: 1.3, x: 0.4, y: 0.82 }, { t: 40, s: 1.3, x: 0.4, y: 0.82 }, { t: 58, s: 1.4, x: 0.8, y: 0.28 }, { t: 125, s: 1.4, x: 0.8, y: 0.28 }, { t: 140, s: 1.0, x: 0.5, y: 0.5 }, { t: 160, s: 1.3, x: 0.7, y: 0.9 }]}
    loupes={[{ from: 110, to: 142, x: 1300, y: 137, zoom: 2.4, at: [3460, 900] }]} />
);
const S_RESULTS: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="results" startAt={118} dur={dur} kicker="03 · KNOW" title="See exactly where you stand." url="gate.renyxera.workers.dev/exam/results"
    cam={[{ t: 118, s: 1, x: 0.5, y: 0.5 }, { t: 132, s: 1.3, x: 0.27, y: 0.5 }, { t: 150, s: 1.3, x: 0.27, y: 0.5 }, { t: 168, s: 1.25, x: 0.72, y: 0.6 }, { t: 210, s: 1.25, x: 0.72, y: 0.7 }]}
    callouts={[{ from: 150, to: 205, x: 1060, y: 560, n: 1, label: "Correct, wrong, penalty", side: "left" }, { from: 172, to: 210, x: 1140, y: 776, n: 2, label: "Review every answer" }]} />
);
const S_ANALYTICS: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="analytics" dur={dur} kicker="04 · IMPROVE" title="Your weak topics, found for you." url="gate.renyxera.workers.dev/analytics"
    cam={[{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 18, s: 1.3, x: 0.33, y: 0.6 }, { t: 60, s: 1.3, x: 0.8, y: 0.6 }, { t: 90, s: 1, x: 0.5, y: 0.5 }]}
    callouts={[{ from: 20, to: 70, x: 90, y: 603, n: 1, label: "Weak topic spotted" }]} />
);
const S_PLANNER: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="planner" dur={dur} kicker="05 · PLAN" title="A plan that fits your hours." url="gate.renyxera.workers.dev/tools/gate-study-plan"
    cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 10, s: 1.25, x: 0.35, y: 0.42 }, { t: 70, s: 1.25, x: 0.4, y: 0.55 }, { t: 115, s: 1.15, x: 0.5, y: 0.85 }, { t: 190, s: 1.1, x: 0.5, y: 0.9 }]}
    callouts={[{ from: 30, to: 110, x: 735, y: 405, n: 1, label: "Hours a day" }, { from: 85, to: 150, x: 710, y: 494, n: 2, label: "Mark weak sections", side: "left" }, { from: 120, to: 196, x: 845, y: 765, n: 3, label: "Plan updates live" }]} />
);
const S_TOOLS: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="tools" dur={dur} kicker="FREE TOOLS" title="Official cut-offs. Your GATE score." url="gate.renyxera.workers.dev/tools/gate-branch-cutoffs"
    cam={[{ t: 0, s: 1, x: 0.5, y: 0.45 }, { t: 40, s: 1.1, x: 0.5, y: 0.6 }, { t: 55, s: 1.25, x: 0.5, y: 0.8 }, { t: 125, s: 1.25, x: 0.55, y: 0.8 }]}
    callouts={[{ from: 95, to: 125, x: 1070, y: 650, n: 1, label: "Marks → GATE score", side: "left" }]} />
);
const S_PLANS: React.FC<{ dur: number }> = ({ dur }) => (
  <TakeScene take="plans" dur={dur} kicker="PLUS & PRO" title="Go further. Or go all in." url="gate.renyxera.workers.dev/pro"
    cam={[{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 30, s: 1.2, x: 0.62, y: 0.62 }, { t: 102, s: 1.2, x: 0.62, y: 0.62 }]}
    callouts={[{ from: 34, to: 110, x: 640, y: 424, n: 1, label: "Plus · ₹29 a month", side: "left" }, { from: 52, to: 110, x: 1160, y: 424, n: 2, label: "Pro · ₹99 a month" }]} />
);

// ---------- timeline (bars) ----------
type Item = { bars: number; C: React.FC<{ dur: number }> | React.FC; voice?: (keyof typeof vo)[]; vbeat?: number[] };
const PLAN: Item[] = [
  { bars: 3, C: S_HOOK, voice: ["a1", "a2"], vbeat: [1, 6] },
  { bars: 2, C: S_TURN, voice: ["a3"], vbeat: [0] },
  { bars: 1, C: S_LOGO, voice: ["a4"], vbeat: [1] },
  { bars: 4, C: S_SETUP, voice: ["a5"], vbeat: [1] },
  { bars: 3, C: S_EXAM, voice: ["a6"], vbeat: [1] },
  { bars: 2, C: S_RESULTS, voice: ["a7"], vbeat: [2] },
  { bars: 2, C: S_ANALYTICS, voice: ["a8"], vbeat: [1] },
  { bars: 3, C: S_PLANNER, voice: ["a9"], vbeat: [1] },
  { bars: 2, C: S_TOOLS, voice: ["a10"], vbeat: [1] },
  { bars: 2, C: S_PLANS, voice: ["a11"], vbeat: [1] },
  { bars: 2, C: S_COMING, voice: ["a12"], vbeat: [1] },
  { bars: 3, C: S_END, voice: ["a13"], vbeat: [1] },
];
export const TOTAL = PLAN.reduce((a, p) => a + p.bars * BAR, 0);

export const Film4k: React.FC = () => {
  let at = 0;
  const placed = PLAN.map((p) => { const s = { ...p, at, dur: p.bars * BAR }; at += s.dur; return s; });
  const voices: { at: number; id: keyof typeof vo }[] = [];
  for (const p of placed) (p.voice ?? []).forEach((id, i) => voices.push({ at: p.at + (p.vbeat?.[i] ?? 1) * BEAT, id }));
  const duck = (x: number) => (voices.some((v) => x >= v.at - 4 && x <= v.at + Math.round(vo[v.id] * FPS) + 6) ? 0.4 : 0.72);
  return (
    <AbsoluteFill style={{ background: "#06051a" }}>
      {placed.map((p, i) => {
        const C = p.C as React.FC<{ dur: number }>;
        return <Sequence key={i} from={p.at} durationInFrames={p.dur}><C dur={p.dur} /></Sequence>;
      })}
      <Audio src={staticFile("launch/music.wav")} volume={(x) => duck(x) * interpolate(x, [TOTAL - 50, TOTAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {voices.map((v, i) => <Sequence key={i} from={v.at}><Audio src={staticFile(`launch/vo_${v.id}.wav`)} /></Sequence>)}
      {placed.filter((p, i) => i > 0).map((p, i) => <Sequence key={`w${i}`} from={Math.max(0, p.at - 8)}><Audio src={staticFile("launch/swoosh.wav")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};
