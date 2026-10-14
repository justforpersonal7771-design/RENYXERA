// Animated re-creations of the real RENYXERA screens. Layout, labels, questions, numbers and the score formula come from the
// product itself; only the cursor, the camera and the choreography are added. Nothing here is a feature the product lacks.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, brandFont, ribbon, uiFont } from "./theme";
import { FPS, LEAD, NOMINAL, Scene, rateOf } from "./script";

const inOut = Easing.inOut(Easing.cubic);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const W = 1600, H = 900; // app space; the window scales it to the film

// ---------- time and motion helpers ----------
function usePlay(s: Scene) {
  const f = useCurrentFrame();
  const rate = rateOf(s);
  return { f, tt: Math.max(0, f / FPS - LEAD) * rate, rate };
}
type K = { t: number; x: number; y: number };
function along(keys: K[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t < b.t) { const u = inOut(clamp01((t - a.t) / (b.t - a.t))); return { t, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  }
  return keys[keys.length - 1];
}
const between = (t: number, a: number, b: number) => t >= a && t < b;
const pop = (t: number, at: number, dur = 0.35) => inOut(clamp01((t - at) / dur));

const Cursor: React.FC<{ keys: K[]; clicks: number[]; tt: number }> = ({ keys, clicks, tt }) => {
  const p = along(keys, tt);
  const press = clicks.some((c) => tt >= c && tt < c + 0.12);
  return (
    <>
      {clicks.map((c, i) => {
        const u = clamp01((tt - c) / 0.55);
        const at = along(keys, c);
        return u > 0 && u < 1 ? <div key={i} style={{ position: "absolute", left: at.x - 14, top: at.y - 14, width: 28, height: 28, borderRadius: "50%", border: "4px solid rgba(124,58,237,.85)", transform: `scale(${1 + u * 3.6})`, opacity: 1 - u, pointerEvents: "none", zIndex: 99 }} /> : null;
      })}
      <svg viewBox="0 0 24 24" style={{ position: "absolute", left: p.x - 3, top: p.y - 2, width: 44, height: 44, zIndex: 100, transform: `scale(${press ? 0.88 : 1})`, filter: "drop-shadow(0 4px 8px rgba(76,29,149,.45))" }}>
        <path d="M3 2l7.6 18.2 2.4-7.6 7.6-2.4z" fill="#fff" stroke="#4c1d95" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </>
  );
};

// ---------- the window (a camera on the app) ----------
type Cam = { t: number; s: number; x: number; y: number };
function camAt(keys: Cam[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t < b.t) { const u = inOut(clamp01((t - a.t) / (b.t - a.t))); return { t, s: a.s + (b.s - a.s) * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  }
  return keys[keys.length - 1];
}

/** Pan so the focal point (a fraction of the app) sits in the middle of the window, without ever showing empty edges. */
const view = (c: Cam, box: number, size: number, focus: number) => {
  const scaled = size * (1536 / W) * c.s;
  return Math.min(0, Math.max(box - scaled, box / 2 - focus * scaled));
};

const Win: React.FC<{ s: Scene; cam: Cam[]; tt: number; children: React.ReactNode; dark?: boolean }> = ({ s, cam, tt, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 20, stiffness: 110 } });
  const c = camAt(cam, tt);
  const tiltY = (1 - a) * 9 + Math.sin(f / 90) * 0.7, tiltX = (1 - a) * -4 + Math.cos(f / 110) * 0.4;
  const exit = interpolate(f, [s.dur * fps - 8, s.dur * fps], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <div style={{ position: "absolute", left: 192, top: 36, width: 1536, height: 864, perspective: 2400, opacity: a * exit }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", background: "#fff", transform: `translateY(${(1 - a) * 40}px) rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(${0.95 + 0.05 * a})`,
        boxShadow: "0 60px 110px -30px rgba(76,29,149,.55), 0 0 0 1px rgba(91,33,224,.14)" }}>
        <div style={{ width: W, height: H, transformOrigin: "0 0", transform: `translate(${view(c, 1536, W, c.x)}px, ${view(c, 864, H, c.y)}px) scale(${(1536 / W) * c.s})`, position: "relative", background: "linear-gradient(135deg,#f7f4ff,#eef6ff 60%,#fbf1ff)", fontFamily: uiFont, color: C.ink }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ---------- shared pieces of the app chrome ----------
const NAV = ["Dashboard", "Exam Setup", "Mocks", "AI Mentor", "Review", "Analytics", "Tools"];
const AppNav: React.FC<{ active: string; glow?: number }> = ({ active, glow = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between" }}>
    <div style={{ fontFamily: brandFont, fontSize: 27, letterSpacing: 1.5 }}>RENYX<span style={{ backgroundImage: "linear-gradient(90deg,#06c2fb,#5b21e0 55%,#dd42fb)", WebkitBackgroundClip: "text", color: "transparent" }}>ERA</span></div>
    <div style={{ display: "flex", gap: 6, padding: 6, borderRadius: 18, background: "rgba(255,255,255,.85)", boxShadow: "0 8px 24px -12px rgba(76,29,149,.4)", border: "1px solid rgba(91,33,224,.08)" }}>
      {NAV.map((n) => (
        <div key={n} style={{ padding: "9px 18px", borderRadius: 13, fontSize: 15, fontWeight: 700, color: n === active ? "#fff" : C.muted, background: n === active ? ribbon : "transparent", boxShadow: n === active && glow ? `0 0 ${glow * 24}px rgba(124,58,237,.6)` : "none" }}>{n}</div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ padding: "7px 16px", borderRadius: 12, background: "#f1e9ff", fontSize: 13, fontWeight: 800, color: C.violet }}>GATE CS</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.muted }}>Sign In</div>
    </div>
  </div>
);

const Card: React.FC<{ style: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", borderRadius: 24, background: "rgba(255,255,255,.92)", boxShadow: "0 24px 60px -28px rgba(76,29,149,.45)", border: "1px solid rgba(91,33,224,.08)", ...style }}>{children}</div>
);

const Field: React.FC<{ x: number; y: number; w: number; label: string; value: string; open?: boolean; hl?: number; options?: string[]; opacity?: number }> = ({ x, y, w, label, value, open, hl = -1, options = [], opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity }}>
    <div style={{ fontSize: 15, fontWeight: 800, color: C.muted, marginBottom: 10 }}>{label}</div>
    <div style={{ height: 50, borderRadius: 14, background: "#f3f3f6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontSize: 19, fontWeight: 500, border: open ? `2px solid ${C.violet}66` : "2px solid transparent", boxShadow: open ? "0 0 0 5px rgba(124,58,237,.1)" : "none" }}>
      <span>{value}</span><span style={{ color: C.muted, fontSize: 14 }}>{open ? "▲" : "▼"}</span>
    </div>
    {open && (
      <div style={{ position: "absolute", top: 82, left: 0, right: 0, zIndex: 20, borderRadius: 14, background: "#fff", boxShadow: "0 24px 50px -16px rgba(76,29,149,.5)", padding: 6, border: "1px solid rgba(91,33,224,.1)" }}>
        {options.map((o, i) => (
          <div key={o} style={{ height: 40, display: "flex", alignItems: "center", padding: "0 14px", borderRadius: 10, fontSize: 17, fontWeight: 600, background: i === hl ? "#efe7ff" : "transparent", color: i === hl ? C.violet : C.ink }}>{o}</div>
        ))}
      </div>
    )}
  </div>
);

// ---------- HOME ----------
export const HomeUi: React.FC<{ s: Scene }> = ({ s }) => {
  const { tt } = usePlay(s);
  const tiles = [["Practice", "Real GATE questions by section, subject or topic"], ["Review", "Mistakes, bookmarks and revision"], ["AI Mentor", "A mentor for the questions you are stuck on"]];
  const keys: K[] = [{ t: 0, x: 1300, y: 640 }, { t: 1.4, x: 360, y: 440 }, { t: 2.6, x: 560, y: 32 }, { t: 5, x: 560, y: 32 }];
  return (
    <Win s={s} tt={tt} cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 3, s: 1.1, x: 0.4, y: 0.2 }, { t: 5, s: 1.1, x: 0.4, y: 0.12 }]}>
      <AppNav active={tt > 3.2 ? "Exam Setup" : "Dashboard"} glow={pop(tt, 3.2)} />
      <div style={{ position: "absolute", left: 80, top: 130, fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>Your GATE preparation,<br />in one place.</div>
      {tiles.map(([t, d], i) => {
        const a = pop(tt, 0.3 + i * 0.25, 0.5);
        const hover = between(tt, 1.2, 2.6) && i === 0;
        return (
          <Card key={t} style={{ left: 80 + i * 490, top: 400, width: 450, height: 300, opacity: a, transform: `translateY(${(1 - a) * 50}px) scale(${hover ? 1.03 : 1})`, boxShadow: hover ? "0 36px 70px -24px rgba(124,58,237,.6)" : undefined }}>
            <div style={{ position: "absolute", left: 36, top: 36, width: 84, height: 84, borderRadius: 24, background: ribbon, opacity: 0.92 }} />
            <div style={{ position: "absolute", left: 36, top: 150, fontSize: 38, fontWeight: 800 }}>{t}</div>
            <div style={{ position: "absolute", left: 36, top: 206, width: 370, fontSize: 21, color: C.muted, lineHeight: 1.35 }}>{d}</div>
          </Card>
        );
      })}
      <Cursor keys={keys} clicks={[3.2]} tt={tt} />
    </Win>
  );
};

// ---------- SETUP ----------
export const SetupUi: React.FC<{ s: Scene }> = ({ s }) => {
  const { tt } = usePlay(s);
  const kp: K[] = [
    { t: 0, x: 1250, y: 620 }, { t: 1.4, x: 184, y: 248 }, { t: 2.0, x: 184, y: 248 }, { t: 2.9, x: 184, y: 382 }, { t: 3.4, x: 300, y: 355 }, { t: 4.1, x: 313, y: 355 },
    { t: 5.1, x: 313, y: 452 }, { t: 5.8, x: 840, y: 355 }, { t: 6.3, x: 846, y: 355 }, { t: 7.2, x: 846, y: 412 }, { t: 8.5, x: 992, y: 246 }, { t: 11, x: 1100, y: 330 },
  ];
  const deployment = tt < 3.0 ? "Official Year Paper" : "Topic Spotlight";
  const picked = tt >= 3.0;
  const fields = pop(tt, 3.0, 0.5);
  const section = tt < 5.2 ? "CORE CS" : "GENERAL APTITUDE (GA)";
  const subject = tt < 7.3 ? "Analytical Aptitude" : "Analytical Aptitude";
  const topicShown = tt >= 7.3;
  const gen = tt >= 8.9;
  const press = between(tt, 8.7, 8.85);
  const blue = pop(tt, 8.9, 0.6);
  return (
    <Win s={s} tt={tt} cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 1.1, s: 1.3, x: 0.2, y: 0.3 }, { t: 3.4, s: 1.2, x: 0.37, y: 0.4 }, { t: 6.0, s: 1.2, x: 0.37, y: 0.4 }, { t: 8.0, s: 1.12, x: 0.6, y: 0.38 }, { t: 9.4, s: 1.05, x: 0.65, y: 0.5 }, { t: 11, s: 1, x: 0.5, y: 0.5 }]}>
      <AppNav active="Exam Setup" />
      <div style={{ position: "absolute", left: 84, top: 96, fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>Configuration Engine</div>
      <div style={{ position: "absolute", left: 84, top: 142, fontSize: 18, color: C.muted }}>Design your perfect test environment.</div>
      <Card style={{ left: 32, top: 190, width: 1096, height: 670 }}>
        <Field x={24} y={20} w={256} label="Deployment Type" value={deployment} open={between(tt, 1.5, 3.0)} hl={tt < 2.7 ? 1 : 2} options={["Official Year Paper", "Subject Mastery", "Topic Spotlight"]} />
        <div style={{ position: "absolute", left: 850, top: 38, width: 222, height: 46, borderRadius: 14, background: "linear-gradient(90deg,#4f46e5,#d946ef)", color: "#fff", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${press ? 0.95 : 1})`, boxShadow: "0 16px 34px -12px rgba(124,58,237,.7)" }}>Generate blueprint</div>
        {picked && (
          <>
            <Field x={24} y={150} w={514} label="Section" value={section} open={between(tt, 4.2, 5.2)} hl={1} options={["CORE CS", "GENERAL APTITUDE (GA)", "MATHEMATICAL FOUNDATIONS"]} opacity={fields} />
            <Field x={558} y={150} w={514} label="Target Subject" value={subject} open={between(tt, 6.4, 7.3)} hl={0} options={["Analytical Aptitude", "Quantitative Aptitude", "Spatial Aptitude", "Verbal Aptitude"]} opacity={fields} />
            <Field x={24} y={248} w={514} label="Target Topic" value={topicShown ? "Analogy and Relationship Matching" : "Select a subject"} opacity={fields} />
            <div style={{ position: "absolute", left: 558, top: 248, width: 514, opacity: fields }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.muted, marginBottom: 10, display: "flex", justifyContent: "space-between" }}><span>Volume (Questions)</span><span>{topicShown ? "Available: 10" : ""}</span></div>
              <div style={{ height: 50, borderRadius: 14, background: "#fff", border: "1px solid #e6e3f2", textAlign: "center", lineHeight: "50px", fontSize: 20, fontWeight: 700 }}>{topicShown ? 10 : "—"}</div>
            </div>
          </>
        )}
      </Card>
      <Card style={{ left: 1148, top: 190, width: 420, height: 670 }}>
        <div style={{ position: "absolute", left: 28, top: 26, fontSize: 24, fontWeight: 800 }}>Generated Blueprint</div>
        {!gen && <div style={{ position: "absolute", left: 28, right: 28, top: 90, bottom: 28, borderRadius: 20, border: "2px dashed #d9d4ec", display: "grid", placeItems: "center", textAlign: "center", color: C.muted, fontSize: 18, padding: 30 }}>Awaiting Configuration<br />Set your parameters and hit Generate</div>}
        {gen && (
          <div style={{ position: "absolute", left: 28, right: 28, top: 90, opacity: blue, transform: `translateY(${(1 - blue) * 30}px)` }}>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>10 <span style={{ fontSize: 24, color: C.muted, fontWeight: 700 }}>questions</span></div>
            <div style={{ marginTop: 16, fontSize: 20, fontWeight: 700 }}>Analytical Aptitude</div>
            <div style={{ marginTop: 6, fontSize: 18, color: C.muted }}>Analogy and Relationship Matching</div>
            <div style={{ marginTop: 30, height: 12, borderRadius: 8, background: "#eceaf6", overflow: "hidden" }}><div style={{ width: `${blue * 100}%`, height: "100%", background: ribbon }} /></div>
            <div style={{ marginTop: 40, height: 58, borderRadius: 16, background: "linear-gradient(90deg,#059669,#10b981)", color: "#fff", fontSize: 20, fontWeight: 800, display: "grid", placeItems: "center" }}>Deploy session</div>
          </div>
        )}
      </Card>
      <Cursor keys={kp} clicks={[1.5, 3.0, 4.1, 5.2, 6.3, 7.3, 8.7]} tt={tt} />
    </Win>
  );
};

// ---------- EXAM ----------
const KEYROWS: string[][] = [
  ["sinh", "cosh", "tanh", "Exp", "(", ")", "←", "C", "±", "√x"],
  ["sinh⁻¹", "cosh⁻¹", "tanh⁻¹", "logₓx", "ln", "log", "7", "8", "9", "+"],
  ["π", "e", "n!", "log_yx", "eˣ", "10ˣ", "4", "5", "6", "×"],
  ["sin", "cos", "tan", "xʸ", "x³", "x²", "1", "2", "3", "−"],
  ["sin⁻¹", "cos⁻¹", "tan⁻¹", "ʸ√x", "∛x", "|x|", "0", "0", ".", "+"],
];
const OPTS = ["Kennel", "Hammock", "Hive", "Lair"];

export const ExamUi: React.FC<{ s: Scene }> = ({ s }) => {
  const { tt } = usePlay(s);
  const kp: K[] = [
    { t: 0, x: 1100, y: 500 }, { t: 1.2, x: 1100, y: 560 }, { t: 2.3, x: 335, y: 786 }, { t: 3.2, x: 700, y: 400 }, { t: 3.9, x: 1336, y: 30 }, { t: 5.0, x: 1453, y: 360 },
    { t: 5.7, x: 1380, y: 400 }, { t: 6.4, x: 1105, y: 360 }, { t: 7.7, x: 1566, y: 84 }, { t: 9.2, x: 1158, y: 871 }, { t: 12, x: 1200, y: 700 },
  ];
  const timerSec = 21 * 60 + 40 - Math.floor(tt);
  const timer = `00:${String(Math.floor(timerSec / 60)).padStart(2, "0")}:${String(timerSec % 60).padStart(2, "0")}`;
  const answered = tt >= 2.4;
  const calcOpen = between(tt, 4.0, 7.9);
  const calcA = calcOpen ? pop(tt, 4.0, 0.35) * (1 - pop(tt, 7.5, 0.4)) + (tt > 7.5 ? 0 : 0) : 0;
  const display = tt < 5.2 ? "" : tt < 5.8 ? "3" : tt < 6.5 ? "30" : "0.866025403784";
  const sub = tt < 6.5 ? "" : "cos(30)";
  const saved = tt >= 9.4;
  const next = pop(tt, 9.4, 0.5);
  return (
    <Win s={s} tt={tt} cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 1.4, s: 1.25, x: 0.4, y: 0.85 }, { t: 3.3, s: 1.15, x: 0.4, y: 0.3 }, { t: 3.9, s: 1.3, x: 0.78, y: 0.3 }, { t: 7.6, s: 1.0, x: 0.5, y: 0.5 }, { t: 8.6, s: 1.3, x: 0.7, y: 0.9 }, { t: 12, s: 1.3, x: 0.8, y: 0.5 }]}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 58, background: "#fff", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
        <div style={{ padding: "5px 12px", borderRadius: 8, background: "#f1f1f5", fontSize: 15, fontWeight: 800 }}>{saved ? "2" : "1"}<span style={{ color: C.muted }}>/10</span></div>
        {["PRACTICE", "MCQ", "+1/-0.33", "EASY"].map((c, i) => <div key={c} style={{ padding: "5px 10px", borderRadius: 7, background: ["#e0f2fe", "#ede9fe", "#d1fae5", "#fef3c7"][i], fontSize: 12, fontWeight: 800, color: ["#0369a1", "#5b21b6", "#047857", "#b45309"][i] }}>{c}</div>)}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "7px 18px", borderRadius: 18, background: "#f6f6f8", border: "1px solid #eee", fontSize: 22, fontWeight: 800, display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 14, height: 14, borderRadius: 7, background: "#10b981" }} />{timer}</div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: calcOpen ? "#ede9fe" : "#f6f6f8" }} />
        <div style={{ padding: "9px 20px", borderRadius: 11, background: "linear-gradient(90deg,#4f46e5,#c026d3)", color: "#fff", fontWeight: 800, fontSize: 15 }}>Submit</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 58, width: 1260, height: 842, background: "#fff" }}>
        <div style={{ position: "absolute", left: 48, top: 52, fontSize: 30, lineHeight: 1.4, transform: `translateX(${next * -60}px)`, opacity: 1 - next }}>
          Bird : Nest :: Bee : ____________<br />Select the correct option to complete the analogy.
        </div>
        {OPTS.map((o, i) => {
          const sel = i === 2 && answered;
          const x = 48 + (i % 2) * 588, y = 624 + Math.floor(i / 2) * 74;
          return (
            <div key={o} style={{ position: "absolute", left: x, top: y, width: 574, height: 60, borderRadius: 14, border: `2px solid ${sel ? "#6366f1" : "#dedcf0"}`, background: sel ? "#eef0ff" : "#fff", display: "flex", alignItems: "center", gap: 18, padding: "0 16px", fontSize: 20, opacity: 1 - next }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: sel ? "#6366f1" : "#f1f1f5", color: sel ? "#fff" : C.muted, display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800 }}>{"ABCD"[i]}</div>{o}
              <div style={{ flex: 1 }} /><div style={{ width: 24, height: 24, borderRadius: 12, border: `2px solid ${sel ? "#6366f1" : "#d6d3e8"}`, background: sel ? "radial-gradient(#6366f1 45%, #fff 50%)" : "#fff" }} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 980, top: 790, width: 160, height: 44, borderRadius: 12, background: "linear-gradient(90deg,#059669,#10b981)", color: "#fff", fontSize: 17, fontWeight: 800, display: "grid", placeItems: "center", transform: `scale(${between(tt, 9.3, 9.45) ? 0.94 : 1})` }}>Save &amp; next →</div>
        <div style={{ position: "absolute", left: 470, top: 796, fontSize: 14, fontWeight: 800, color: "#059669" }}>{answered ? "1/10 answered" : "0/10 answered"}</div>
        <div style={{ position: "absolute", left: 48, top: 52, fontSize: 30, lineHeight: 1.4, opacity: next, transform: `translateX(${(1 - next) * 80}px)` }}>Water : P :: Food : Q<br />Choose the P and Q combination from the options below to form a meaningful analogy.</div>
        {["P = Thirst; Q = Hunger", "P = Drink; Q = Hunger", "P = Thirst; Q = Satiated", "P = Wet; Q = Critic"].map((o, i) => (
          <div key={o} style={{ position: "absolute", left: 48 + (i % 2) * 588, top: 624 + Math.floor(i / 2) * 74, width: 574, height: 60, borderRadius: 14, border: "2px solid #dedcf0", background: "#fff", display: "flex", alignItems: "center", gap: 18, padding: "0 16px", fontSize: 20, opacity: next }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: "#f1f1f5", color: C.muted, display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800 }}>{"ABCD"[i]}</div>{o}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1260, top: 58, right: 0, bottom: 0, background: "#f8f8fb", borderLeft: "1px solid #eee" }}>
        <div style={{ position: "absolute", left: 20, top: 24, fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 1 }}>CURRENT SECTION<div style={{ fontSize: 15, color: C.ink, marginTop: 4 }}>GENERAL APTITUDE (GA)</div></div>
        <div style={{ position: "absolute", left: 20, top: 82, fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 1 }}>CURRENT TOPIC<div style={{ fontSize: 15, color: C.ink, marginTop: 4 }}>Analogy and Relationship Matching</div></div>
        {Array.from({ length: 10 }).map((_, i) => {
          const done = i === 0 && saved, cur = i === (saved ? 1 : 0);
          return <div key={i} style={{ position: "absolute", left: 24 + (i % 5) * 62, top: 190 + Math.floor(i / 5) * 58, width: 48, height: 48, borderRadius: 12, border: "1px solid #e2e0ee", background: done ? "#10b981" : cur ? "linear-gradient(135deg,#ef4444,#6366f1)" : "#fff", color: done || cur ? "#fff" : C.muted, display: "grid", placeItems: "center", fontSize: 16, fontWeight: 800 }}>{i + 1}</div>;
        })}
      </div>
      {calcA > 0.01 && (
        <div style={{ position: "absolute", left: 1024, top: 70, width: 560, height: 360, borderRadius: 16, background: "#fff", boxShadow: "0 30px 70px -20px rgba(15,10,60,.55)", border: "1px solid #e8e6f2", opacity: calcA, transform: `translateY(${(1 - calcA) * 24}px) scale(${0.96 + 0.04 * calcA})` }}>
          <div style={{ position: "absolute", left: 10, top: 28, right: 10, height: 66, borderRadius: 10, background: "#f6f6f9", textAlign: "right", padding: "6px 14px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 15, color: C.muted, height: 22 }}>{sub}</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{display}</div>
          </div>
          {KEYROWS.map((row, r) => row.map((k, c) => {
            if (r === 4 && c === 6) return <div key={`${r}${c}`} style={{ position: "absolute", left: 10 + 6 * 50, top: 130 + r * 40, width: 94, height: 34, borderRadius: 8, background: "#fff", border: "1px solid #eee", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700 }}>0</div>;
            if (r === 4 && c === 7) return null;
            const pressed = (k === "3" && r === 3 && between(tt, 5.2, 5.4)) || (k === "0" && between(tt, 5.8, 6.0)) || (k === "cos" && between(tt, 6.5, 6.7));
            return <div key={`${r}${c}`} style={{ position: "absolute", left: 10 + c * 50, top: 130 + r * 40, width: 44, height: 34, borderRadius: 8, background: pressed ? "#c4b5fd" : "#f8f8fb", border: "1px solid #eee", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: ["+", "×", "−"].includes(k) ? C.violet : C.ink }}>{k}</div>;
          }))}
        </div>
      )}
      <Cursor keys={kp} clicks={[2.4, 4.0, 5.2, 5.8, 6.5, 7.9, 9.4]} tt={tt} />
    </Win>
  );
};

// ---------- RESULTS ----------
export const ResultsUi: React.FC<{ s: Scene }> = ({ s }) => {
  const { tt } = usePlay(s);
  const ring = inOut(clamp01((tt - 0.3) / 1.8));
  const R = 175, circ = 2 * Math.PI * R;
  const cards = [["Correct", "5", "#059669", "#d1fae5"], ["Wrong", "0", "#e11d48", "#ffe4e6"], ["Skipped", "5", "#475569", "#e2e8f0"], ["Penalty", "-0.0", "#d97706", "#fef3c7"]];
  const kp: K[] = [{ t: 0, x: 1200, y: 560 }, { t: 4.2, x: 1180, y: 600 }, { t: 5.8, x: 1140, y: 776 }, { t: 8, x: 1140, y: 776 }];
  return (
    <Win s={s} tt={tt} cam={[{ t: 0, s: 1, x: 0.5, y: 0.5 }, { t: 0.4, s: 1.25, x: 0.3, y: 0.45 }, { t: 3.4, s: 1.2, x: 0.65, y: 0.55 }, { t: 5.4, s: 1.2, x: 0.65, y: 0.8 }, { t: 8, s: 1.05, x: 0.5, y: 0.6 }]}>
      <AppNav active="Exam Setup" />
      <Card style={{ left: 32, top: 110, width: 1536, height: 740 }} />
      <div style={{ position: "absolute", left: 331, top: 160, padding: "8px 18px", borderRadius: 999, background: "#efe7ff", color: C.violet, fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>EVALUATION COMPLETE</div>
      <svg width={420} height={420} style={{ position: "absolute", left: 210, top: 215 }}>
        <circle cx={210} cy={210} r={R} fill="none" stroke="#ece6fb" strokeWidth={26} />
        <circle cx={210} cy={210} r={R} fill="none" stroke="url(#rg)" strokeWidth={26} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} transform="rotate(-90 210 210)" />
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d946ef" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
      </svg>
      <div style={{ position: "absolute", left: 210, top: 360, width: 420, textAlign: "center", fontSize: 110, fontWeight: 800, letterSpacing: -4, color: C.violet }}>{Math.round(ring * 100)}%</div>
      <div style={{ position: "absolute", left: 210, top: 490, width: 420, textAlign: "center", fontSize: 17, fontWeight: 800, letterSpacing: 4, color: C.violet }}>ACCURACY</div>
      <div style={{ position: "absolute", left: 830, top: 220, width: 660, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: C.muted }}>ATTEMPTED VS SKIPPED</div>
      <div style={{ position: "absolute", left: 830, top: 248, fontSize: 52, fontWeight: 800 }}>5<span style={{ fontSize: 22, color: C.muted }}> / 10</span></div>
      <div style={{ position: "absolute", left: 830, top: 330, width: 660, height: 14, borderRadius: 8, background: "#e4e2ef", overflow: "hidden" }}><div style={{ width: `${ring * 50}%`, height: "100%", background: "linear-gradient(90deg,#10b981,#34d399)" }} /></div>
      {cards.map(([l, v, col, bg], i) => {
        const a = pop(tt, 1.6 + i * 0.35, 0.5);
        return (
          <div key={l} style={{ position: "absolute", left: 830 + i * 170, top: 410, width: 156, height: 150, borderRadius: 20, background: bg as string, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
            <div style={{ marginTop: 34, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: col as string }}>{(l as string).toUpperCase()}</div>
            <div style={{ marginTop: 10, fontSize: 52, fontWeight: 800, color: C.ink }}>{v}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 830, top: 640, width: 280, height: 58, borderRadius: 16, background: "#fff", border: "1px solid #e4e0f2", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 800 }}>Retry test</div>
      <div style={{ position: "absolute", left: 1130, top: 640, width: 300, height: 58, borderRadius: 16, background: "linear-gradient(90deg,#4f46e5,#c026d3)", color: "#fff", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 800, boxShadow: between(tt, 5.8, 8) ? "0 0 40px rgba(124,58,237,.7)" : "none" }}>Review answers →</div>
      <Cursor keys={kp} clicks={[6.5]} tt={tt} />
    </Win>
  );
};

// ---------- TOOLS ----------
const PAPERS = [
  ["CS", "Computer Science & IT", 30, 27, 20, 211020, 40661, 77.03], ["DA", "Data Science & AI", 26.4, 23.7, 17.5, 69242, 12849, 72.01],
  ["EC", "Electronics & Communication", 26.4, 23.7, 17.5, 95752, 17392, 71.59], ["EE", "Electrical Engineering", 27.7, 24.9, 18.4, 65801, 13726, 75.45],
  ["ME", "Mechanical Engineering", 25.2, 22.6, 16.7, 59612, 10970, 74.58], ["CE", "Civil Engineering", 28.7, 25.8, 19.1, 76385, 13949, 83.23],
] as const;
const fmt = (n: number) => n.toLocaleString("en-IN");

export const ToolsUi: React.FC<{ s: Scene }> = ({ s }) => {
  const { tt } = usePlay(s);
  const v = interpolate(inOut(clamp01((tt - 4.2) / 3.4)), [0, 1], [45, 76.56]);
  const cs = PAPERS[0];
  const score = Math.round(Math.max(0, Math.min(1000, 350 + 550 * ((v - 30) / (cs[7] - 30)))));
  const kp: K[] = [{ t: 0, x: 1250, y: 300 }, { t: 1.6, x: 600, y: 238 }, { t: 3.0, x: 600, y: 238 }, { t: 3.8, x: 380 + 0.45 * 640, y: 706 }, { t: 7.7, x: 380 + 0.7656 * 640, y: 706 }, { t: 10, x: 1100, y: 640 }];
  return (
    <Win s={s} tt={tt} cam={[{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 1.4, s: 1.12, x: 0.5, y: 0.3 }, { t: 3.4, s: 1.2, x: 0.5, y: 0.75 }, { t: 7.8, s: 1.2, x: 0.5, y: 0.78 }, { t: 10, s: 1.0, x: 0.5, y: 0.5 }]}>
      <AppNav active="Tools" />
      <div style={{ position: "absolute", left: 40, top: 92, fontSize: 14, fontWeight: 800, letterSpacing: 3, color: C.violet }}>CUT-OFFS</div>
      <div style={{ position: "absolute", left: 40, top: 116, fontSize: 44, fontWeight: 800, letterSpacing: -1.5 }}>GATE 2026 cut-offs by branch</div>
      <Card style={{ left: 40, top: 186, width: 1520, height: 330, overflow: "hidden" }}>
        <div style={{ display: "flex", padding: "16px 28px", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: C.muted }}>
          <div style={{ width: 520 }}>PAPER</div><div style={{ width: 170 }}>GENERAL</div><div style={{ width: 200 }}>OBC-NCL / EWS</div><div style={{ width: 190 }}>SC / ST / PWD</div><div style={{ width: 200 }}>APPEARED</div><div>QUALIFIED</div>
        </div>
        {PAPERS.map((p, i) => {
          const a = pop(tt, 0.2 + i * 0.18, 0.4);
          const hl = i === 0 && tt > 1.6;
          return (
            <div key={p[0]} style={{ display: "flex", alignItems: "center", height: 44, padding: "0 28px", borderTop: "1px solid #eeeaf8", fontSize: 18, opacity: a, background: hl ? "#f5efff" : "transparent", transform: `translateX(${(1 - a) * 30}px)` }}>
              <div style={{ width: 520, fontWeight: 800 }}>{p[0]} <span style={{ fontWeight: 500, color: C.muted }}>{p[1]}</span></div>
              <div style={{ width: 170, fontWeight: 800 }}>{p[2]}</div><div style={{ width: 200, fontWeight: 800 }}>{p[3]}</div><div style={{ width: 190, fontWeight: 800 }}>{p[4]}</div>
              <div style={{ width: 200 }}>{fmt(p[5])}</div><div>{fmt(p[6])} <span style={{ color: C.muted }}>({(Math.round((p[6] / p[5]) * 1000) / 10).toFixed(1)}%)</span></div>
            </div>
          );
        })}
      </Card>
      <Card style={{ left: 40, top: 540, width: 1520, height: 320 }}>
        <div style={{ position: "absolute", left: 40, top: 34, fontSize: 15, fontWeight: 800, color: C.muted }}>Paper</div>
        <div style={{ position: "absolute", left: 40, top: 62, width: 520, height: 48, borderRadius: 12, border: "1px solid #e2dff0", background: "#fff", padding: "0 16px", lineHeight: "48px", fontSize: 18 }}>CS · Computer Science &amp; IT</div>
        <div style={{ position: "absolute", left: 40, top: 130, fontSize: 15, fontWeight: 800, color: C.muted }}>Your marks (out of 100)</div>
        <div style={{ position: "absolute", left: 340, top: 168, width: 640, height: 8, borderRadius: 4, background: "#ddd8ee" }}><div style={{ width: `${v}%`, height: "100%", borderRadius: 4, background: "#8b5cf6" }} /></div>
        <div style={{ position: "absolute", left: 340 + v * 6.4 - 14, top: 158, width: 28, height: 28, borderRadius: 14, background: "#6d28d9", border: "4px solid #fff", boxShadow: "0 4px 12px rgba(76,29,149,.5)" }} />
        <div style={{ position: "absolute", left: 1010, top: 150, width: 90, height: 44, borderRadius: 10, border: "1px solid #e2dff0", background: "#fff", textAlign: "center", lineHeight: "44px", fontSize: 18, fontWeight: 800 }}>{v.toFixed(2)}</div>
        <div style={{ position: "absolute", left: 1160, top: 34, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: C.muted }}>GATE SCORE (OUT OF 1000)</div>
        <div style={{ position: "absolute", left: 1160, top: 60, fontSize: 96, fontWeight: 800, letterSpacing: -3 }}>{score}</div>
        <div style={{ position: "absolute", left: 1160, top: 200, padding: "10px 18px", borderRadius: 12, background: "#d1fae5", color: "#047857", fontSize: 17, fontWeight: 800 }}>Qualified · {(v - 30).toFixed(2)} above the cut-off of 30</div>
        <div style={{ position: "absolute", left: 40, top: 250, fontSize: 15, color: C.muted }}>Official 2026 formula for CS: top 0.1% average 77.03, qualifying mark 30.</div>
      </Card>
      <Cursor keys={kp} clicks={[3.4]} tt={tt} />
    </Win>
  );
};

// ---------- PLANS ----------
const FREE = ["Every official PYQ in the bank for your paper", "Exam-like simulator & custom tests", "All-India mocks & leaderboards", "Analytics, mistakes bank & revision", "Cloud sync across devices"];
const PLUS = ["75 AI requests every day", "Smart insights & daily adaptive path", "Study Planner automation", "Telegram reminders", "Exam trends & AI Insights revision"];
const PRO = ["150 AI requests every day", "Deep analytics", "Offline downloads", "AI re-plan", "Smart Telegram"];

export const PlansUi: React.FC<{ s: Scene }> = ({ s }) => {
  const { tt } = usePlay(s);
  const kp: K[] = [{ t: 0, x: 1250, y: 700 }, { t: 2.2, x: 1250, y: 700 }, { t: 4.8, x: 800, y: 790 }, { t: 8, x: 800, y: 790 }];
  const cols: [string, string, string, string[], string, string][] = [
    ["FREE · FOREVER", "₹0", "", FREE, "#fff", ""], ["PLUS · SILVER", "₹29", "per month", PLUS, "linear-gradient(180deg,#fff,#eef0f8)", "Get Plus"], ["PRO · GOLD", "₹99", "per month", PRO, "linear-gradient(180deg,#fffaf0,#fff3d6)", "Get Pro"],
  ];
  return (
    <Win s={s} tt={tt} cam={[{ t: 0, s: 1, x: 0.5, y: 0.4 }, { t: 2.0, s: 1.1, x: 0.5, y: 0.45 }, { t: 4.4, s: 1.3, x: 0.5, y: 0.85 }, { t: 8, s: 1.05, x: 0.5, y: 0.6 }]}>
      <AppNav active="Dashboard" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", fontSize: 46, fontWeight: 800, letterSpacing: -1.5 }}>Prepare smarter with <span style={{ backgroundImage: ribbon, WebkitBackgroundClip: "text", color: "transparent" }}>Plus &amp; Pro</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 148, textAlign: "center", fontSize: 18, color: C.muted }}>One payment, no auto-renewal.</div>
      <div style={{ position: "absolute", left: 590, top: 196, display: "flex", padding: 5, borderRadius: 18, background: "#fff", border: "1px solid #e8e4f4" }}>
        {["Monthly", "Yearly", "GATE season pass"].map((t, i) => <div key={t} style={{ padding: "10px 22px", borderRadius: 13, fontSize: 16, fontWeight: 700, background: i === 0 ? "linear-gradient(90deg,#4f46e5,#7c3aed)" : "transparent", color: i === 0 ? "#fff" : C.muted }}>{t}</div>)}
      </div>
      {cols.map(([name, price, per, feats, bg, btn], i) => {
        const a = pop(tt, 0.4 + i * 0.3, 0.55);
        const hot = i === 1 && tt > 4.4;
        return (
          <div key={name} style={{ position: "absolute", left: 40 + i * 515, top: 276, width: 490, height: 580, borderRadius: 28, background: bg, border: `1px solid ${i === 2 ? "#f3d27a" : "#e1dff0"}`, boxShadow: hot ? "0 40px 80px -24px rgba(100,116,139,.7)" : "0 24px 60px -30px rgba(76,29,149,.4)", opacity: a, transform: `translateY(${(1 - a) * 70}px) scale(${hot ? 1.02 : 1})`, padding: 32, boxSizing: "border-box" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: C.muted }}>{name}</div>
            <div style={{ marginTop: 12, fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>{price} <span style={{ fontSize: 20, color: C.muted, fontWeight: 600 }}>{per}</span></div>
            <div style={{ marginTop: 18 }}>{feats.map((f) => <div key={f} style={{ display: "flex", gap: 12, fontSize: 18, fontWeight: 600, marginBottom: 14 }}><span style={{ color: i === 0 ? "#10b981" : C.violet }}>{i === 0 ? "✓" : "✦"}</span>{f}</div>)}</div>
            {btn && <div style={{ position: "absolute", left: 32, right: 32, bottom: 30, height: 56, borderRadius: 16, background: i === 1 ? "linear-gradient(180deg,#e2e8f0,#94a3b8)" : "linear-gradient(180deg,#fde68a,#f59e0b)", display: "grid", placeItems: "center", fontSize: 19, fontWeight: 800 }}>{btn}</div>}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 872, textAlign: "center", fontSize: 13, color: C.muted }}>Payments are processed securely by Razorpay (UPI, cards, net banking).</div>
      <Cursor keys={kp} clicks={[5.8]} tt={tt} />
    </Win>
  );
};

export const UI: Record<string, React.FC<{ s: Scene }>> = { home: HomeUi, setup: SetupUi, exam: ExamUi, results: ResultsUi, tools: ToolsUi, plans: PlansUi };
export { NOMINAL };
