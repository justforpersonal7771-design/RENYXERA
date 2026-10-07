import { ImageResponse } from "next/og";

// Site-wide social card (WhatsApp, Telegram, X, LinkedIn previews). Rendered once at build
// time — a static PNG, no runtime cost. Pages without their own image inherit it.
export const alt = "RENYXERA — GATE CS preparation: every official paper, weightage and mocks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "linear-gradient(135deg, #0b0a1a 0%, #1e1b4b 55%, #4c1d95 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #06c2fb, #5b21e0 55%, #dd42fb)", display: "flex" }} />
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 6 }}>RENYXERA</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#c4b5fd", fontWeight: 700, letterSpacing: 2 }}>GATE CS &amp; IT · FREE TO START</div>
          <div style={{ marginTop: 12, fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>Every official paper.</div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, background: "linear-gradient(90deg, #22d3ee, #a78bfa, #f0abfc)", backgroundClip: "text", color: "transparent" }}>Real weightage. Live mocks.</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["2,470 official PYQs · 5 papers", "Official 2027 syllabus", "Score & rank predictor", "All-India mocks"].map((t) => (
            <div key={t} style={{ display: "flex", padding: "10px 18px", borderRadius: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", fontSize: 24 }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
