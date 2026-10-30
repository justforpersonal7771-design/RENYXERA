import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "./reel-top5.json";
import { C, brandFont, ribbon, uiFont } from "./theme";

/**
 * "5 CS topics that give the most marks": a vertical countdown (5 to 1) built from OUR measured numbers
 * (video/scripts/make-reel-data.mjs). Format learned from the MadeToScale reels in New folder/: one number per card,
 * word-by-word captions, a running tally, a proof chip. All numbers are real; no invented stats.
 */
export const REEL_FPS = 30;
const HOOK = 80; // 2.7 s
const ITEM = 100; // 3.3 s each
const OUTRO = 96; // 3.2 s
export const REEL_TOTAL = HOOK + ITEM * 5 + OUTRO;

const SAFE_X = 80;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Words appear one after another (stagger frames apart). */
const Words: React.FC<{ text: string; size: number; weight?: number; color?: string; stagger?: number; delay?: number; align?: "left" | "center" }> = ({
  text, size, weight = 800, color = C.ink, stagger = 4, delay = 0, align = "left",
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.28}px`, justifyContent: align === "center" ? "center" : "flex-start", fontFamily: uiFont, fontSize: size, fontWeight: weight, color, lineHeight: 1.08, letterSpacing: -1 }}>
      {text.split(" ").map((w, i) => {
        const f = frame - delay - i * stagger;
        return (
          <span key={i} style={{
            display: "inline-block",
            opacity: interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
            transform: `translateY(${interpolate(f, [0, 12], [36, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })}px)`,
            filter: `blur(${interpolate(f, [0, 10], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: C.soft }}>
    <AbsoluteFill style={{ background: `radial-gradient(900px 700px at 90% 8%, ${C.cyan}33, transparent 60%), radial-gradient(900px 800px at 5% 95%, ${C.magenta}2b, transparent 60%)` }} />
  </AbsoluteFill>
);

/** Brand row and a ribbon that fills across the whole reel. */
const TopBar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 100, left: SAFE_X, right: SAFE_X }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: brandFont, fontSize: 46, color: C.ink, letterSpacing: 2 }}>RENYXERA</span>
        <span style={{ fontFamily: uiFont, fontSize: 32, fontWeight: 700, color: C.muted }}>GATE CS</span>
      </div>
      <div style={{ marginTop: 26, height: 10, borderRadius: 6, background: `${C.violet}1f`, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(frame / REEL_TOTAL) * 100}%`, background: ribbon, borderRadius: 6 }} />
      </div>
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px`, justifyContent: "center" }}>
      <div style={{ fontFamily: uiFont, fontSize: 44, fontWeight: 700, color: C.violet, marginBottom: 34, opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>
        Where the marks are
      </div>
      <Words text="5 topics that give the most marks" size={132} />
      <div style={{ marginTop: 56, fontFamily: uiFont, fontSize: 44, fontWeight: 500, color: C.muted, lineHeight: 1.3, opacity: interpolate(frame, [36, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Average over {data.papers} official GATE CS papers, {data.yearFrom} to {data.yearTo}.
      </div>
    </AbsoluteFill>
  );
};

const Item: React.FC<{ item: (typeof data.items)[number] }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const count = interpolate(frame, [10, 44], [0, item.marksPerPaper], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // Running tally: how many marks the topics revealed so far (from #5 down to this one) are worth together.
  const revealed = data.items.filter((i) => i.rank >= item.rank).reduce((s, i) => s + i.marksPerPaper, 0);
  const before = data.items.filter((i) => i.rank > item.rank).reduce((s, i) => s + i.marksPerPaper, 0);
  const tally = interpolate(frame, [30, 60], [before, revealed], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px`, justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ width: 210, height: 210, borderRadius: 52, background: ribbon, display: "grid", placeItems: "center", color: C.white, fontFamily: brandFont, fontSize: 130, scale: pop, boxShadow: `0 28px 60px ${C.violet}40` }}>
          {item.rank}
        </div>
        <div style={{ fontFamily: uiFont, fontSize: 44, fontWeight: 700, color: C.violet, lineHeight: 1.15, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          Number {item.rank}<br /><span style={{ color: C.muted, fontWeight: 500 }}>{item.subject}</span>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <Words text={item.name} size={104} delay={8} />
      </div>
      <div style={{ marginTop: 28, fontFamily: uiFont, fontSize: 44, fontWeight: 500, color: C.muted, lineHeight: 1.3, opacity: interpolate(frame, [22, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {item.tagline}
      </div>

      <div style={{ marginTop: 64, display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontFamily: uiFont, fontSize: 190, fontWeight: 800, color: C.ink, letterSpacing: -6, fontVariantNumeric: "tabular-nums" }}>{count.toFixed(2)}</span>
        <span style={{ fontFamily: uiFont, fontSize: 48, fontWeight: 700, color: C.muted, lineHeight: 1.1 }}>marks<br />per paper</span>
      </div>

      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [40, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {Array.from({ length: data.yearsCount }, (_, i) => (
          <span key={i} style={{ width: 34, height: 34, borderRadius: 17, background: i < item.yearsAsked ? C.violet : `${C.violet}26` }} />
        ))}
        <span style={{ marginLeft: 12, fontFamily: uiFont, fontSize: 40, fontWeight: 700, color: C.ink }}>Asked in {item.yearsAsked} of {data.yearsCount} years</span>
      </div>

      <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, bottom: 150 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: uiFont, fontSize: 40, fontWeight: 700, color: C.ink }}>
          <span>{item.rank === 5 ? "So far" : `Top ${6 - item.rank} together`}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{tally.toFixed(1)} of 100 marks</span>
        </div>
        <div style={{ marginTop: 16, height: 18, borderRadius: 9, background: `${C.violet}1f`, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(tally / 100) * 100}%`, background: ribbon, borderRadius: 9 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: `0 ${SAFE_X}px`, justifyContent: "center" }}>
      <Words text={`These 5 are about ${data.totalMarks} of 100 marks`} size={116} />
      <div style={{ marginTop: 52, fontFamily: uiFont, fontSize: 48, fontWeight: 500, color: C.muted, lineHeight: 1.3, opacity: interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Practise them with real past questions, free on RENYXERA.
      </div>
      <div style={{ marginTop: 56, alignSelf: "flex-start", padding: "26px 44px", borderRadius: 60, background: C.ink, color: C.white, fontFamily: uiFont, fontSize: 48, fontWeight: 800, scale: spring({ frame: frame - 44, fps: REEL_FPS, config: { damping: 13 } }) }}>
        Link in bio
      </div>
      <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, bottom: 130, fontFamily: uiFont, fontSize: 32, fontWeight: 500, color: C.muted }}>
        Averages over {data.papers} official papers ({data.yearFrom} to {data.yearTo}); estimates, not a promise for any one year.
      </div>
    </AbsoluteFill>
  );
};

export const CountdownReel: React.FC = () => {
  // Items run 5 -> 1, so the biggest topic is revealed last.
  const order = [...data.items].sort((a, b) => b.rank - a.rank);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Sequence name="Hook" from={0} durationInFrames={HOOK}><Hook /></Sequence>
      {order.map((item, i) => (
        <Sequence key={item.rank} name={`Number ${item.rank}`} from={HOOK + i * ITEM} durationInFrames={ITEM}><Item item={item} /></Sequence>
      ))}
      <Sequence name="Outro" from={HOOK + ITEM * 5} durationInFrames={OUTRO}><Outro /></Sequence>
      <TopBar />
    </AbsoluteFill>
  );
};
