// Shared tokens, icons, data and components for the dashboard variant mockups.
// All numbers are EXAMPLE DATA for design review only.
import fs from "node:fs";

const R = "D:/0-UI/r2ma-stable/";
const b64 = (p) => "data:image/png;base64," + fs.readFileSync(R + p).toString("base64");
export const LOCKUP = { light: b64("public/brand/lockup-light.png"), dark: b64("public/brand/lockup-dark.png") };
export const MARK = { light: b64("public/brand/mark-light.png"), dark: b64("public/brand/mark-dark.png") };

export const DATA = {
  name: "Aarav", days: 91, streak: 12, accuracy: 68, readiness: 64, solved: 412, total: 3250, due: 14, rank: 1284, ranked: 9420,
  next: { title: "Operating Systems: Deadlocks", sub: "12 questions left, about 18 min", pct: 58 },
  plan: [
    { t: "7:00 pm", title: "Algorithms: DP drill", sub: "15 questions", min: 25, done: true },
    { t: "7:40 pm", title: "Revise 14 due mistakes", sub: "OS, DBMS, COA", min: 20, done: false },
    { t: "8:30 pm", title: "Aptitude section", sub: "10 questions, timed", min: 15, done: false },
  ],
  weak: [["Deadlocks", 41], ["Normalization", 48], ["Pipelining", 52]],
  subjects: [["Algorithms", 72, 76], ["Databases", 61, 66], ["Operating Systems", 54, 58], ["Networks", 47, 55], ["Theory of Computation", 58, 61], ["Computer Organisation", 49, 52]],
  week: [["Mon", 3], ["Tue", 4], ["Wed", 2], ["Thu", 5], ["Fri", 3], ["Sat", 1], ["Sun", 0]],
  mock: { title: "All-India Mock 6", when: "Sun 8 Nov, 10:00 am IST" },
};

export const ICONS = {
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  test: "M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2M9 14l2 2 4-4",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  swords: "M4 4l16 16M20 4L4 20",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  todo: "M4 6l2 2 3-3M12 7h8M4 14l2 2 3-3M12 15h8",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 21h8M10 17h4",
  wrench: "M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-2z",
  moon: "M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
  flame: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  check: "M5 12l4 4 10-10",
  plus: "M12 5v14M5 12h14",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  send: "M4 12l16-8-6 16-3-6z",
  play: "M7 4l13 8-13 8z",
  flag: "M5 21V4M5 4h12l-2 4 2 4H5",
};
export const ic = (n, s = 18, sw = 1.8) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[n]}"/></svg>`;

export const ring = (pct, size = 120, stroke = 12, track = "var(--line)", col = "var(--powder)") => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * pct) / 100} ${c}"/></svg>`;
};
export const bar = (pct, col = "var(--powder)", h = 8) => `<span class="bar" style="height:${h}px"><i style="width:${pct}%;background:${col}"></i></span>`;
export const heat = (cols = 26, rows = 7, seed = 3, size = 11, gap = 3) => {
  let s = seed, out = "";
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let c = 0; c < cols; c++) { for (let r = 0; r < rows; r++) { const v = rnd(); const lvl = v < 0.28 ? 0 : v < 0.5 ? 1 : v < 0.72 ? 2 : v < 0.9 ? 3 : 4; out += `<i class="h${lvl}" style="width:${size}px;height:${size}px"></i>`; } }
  return `<span class="heat" style="grid-template-rows:repeat(${rows},${size}px);gap:${gap}px">${out}</span>`;
};
export const spark = (pts, w = 120, h = 36, col = "var(--powder-d)") => {
  const mx = Math.max(...pts), mn = Math.min(...pts);
  const p = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - 3 - ((v - mn) / (mx - mn || 1)) * (h - 6)}`).join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${p}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

export const logo = (t, h = 40, pro = true) => `<span class="lg"><img class="logo" src="${MARK[t]}" style="height:${Math.round(h * 0.92)}px" alt=""><span class="wm" style="font-size:${Math.round(h * 0.66)}px"><b>RENYX</b><i>ERA</i></span>${pro ? '<span class="probadge">PRO</span>' : ""}</span>`;

// tools cluster: the small gliding group (top right). `on` = index of the highlighted tool.
export const tools = (t, on = 2, extra = "") => {
  const items = ["search", "calendar", "todo", "target", "trophy", "wrench", t === "dark" ? "sun" : "moon"];
  return `<div class="tools ${extra}">${items.map((n, i) => `<span class="tool ${i === on ? "on" : ""}">${ic(n, 17)}${n === "trophy" ? '<b class="dot"></b>' : ""}</span>`).join("")}<span class="chip-paper">GATE CS</span><span class="avatar">AK</span></div>`;
};
export const toolsMobile = (t) => `<div class="tools tools-m"><span class="tool">${ic("search", 18)}</span><span class="tool">${ic("calendar", 18)}</span><span class="tool">${ic("trophy", 18)}<b class="dot"></b></span><span class="avatar">AK</span></div>`;

export const PAGES = [["Practice", "test"], ["Study", "book"], ["AI Mentor", "spark"], ["Review", "layers"], ["Analytics", "chart"], ["Battles", "swords"]];
export const pagePill = (on = -1) => `<nav class="pagepill">${PAGES.map(([l], i) => `<span class="pp ${i === on ? "on" : ""}">${l}</span>`).join("")}</nav>`;
export const railIcons = (on = 0, withHome = true) => `<nav class="rail">${(withHome ? [["Home", "home"]] : []).concat(PAGES.slice(0, 5)).map(([l, n], i) => `<span class="ri ${i === on ? "on" : ""}">${ic(n, 19)}<em>${l}</em></span>`).join("")}</nav>`;
export const bottomPill = (on = 0) => `<nav class="bpill">${[["Home", "home"], ["Practice", "test"], ["Mentor", "spark"], ["Review", "layers"], ["More", "more"]].map(([l, n], i) => `<span class="bp ${i === on ? "on" : ""}">${ic(n, 20)}<em>${l}</em></span>`).join("")}</nav>`;

export const btn = (label, kind = "main", icon = "") => `<span class="btn ${kind}">${label}${icon ? ic(icon, 15, 2) : ""}</span>`;

export const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#E9E8F8;--ink:#1A1C29;--ink2:#3E455B;--muted:#566379;--card:rgba(255,255,255,.74);--card2:rgba(255,255,255,.5);--line:rgba(26,28,41,.09);--powder:#8DB9F0;--powder-d:#2F5F9F;--peach:#F5B69E;--peach-d:#9A4527;--btn:#1A1C29;--btnfg:#fff;--soft:rgba(141,185,240,.36);--shadow:0 18px 40px -16px rgba(26,28,41,.16);--hot:rgba(245,182,158,.5);--glass:rgba(255,255,255,.66)}
[data-t=dark]{--bg:#0E1020;--ink:#ECEEF8;--ink2:#C3C9DC;--muted:#98A2BA;--card:rgba(255,255,255,.07);--card2:rgba(255,255,255,.045);--line:rgba(255,255,255,.1);--powder-d:#9CC4F4;--peach-d:#F5B69E;--btn:#8DB9F0;--btnfg:#0E1020;--soft:rgba(141,185,240,.2);--shadow:0 18px 40px -16px rgba(0,0,0,.6);--hot:rgba(245,182,158,.22);--glass:rgba(26,29,52,.7)}
html,body{width:100%;height:100%;overflow:hidden}
body{font-family:'Outfit',system-ui,sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased;font-size:15px;line-height:1.4;position:relative}
.aur{position:absolute;inset:0;z-index:0;background:radial-gradient(40vmax 40vmax at 14% 12%,rgba(141,185,240,.6),transparent 70%),radial-gradient(36vmax 36vmax at 88% 86%,rgba(245,182,158,.55),transparent 70%),radial-gradient(30vmax 30vmax at 74% 8%,rgba(255,255,255,.75),transparent 70%),radial-gradient(28vmax 28vmax at 6% 92%,rgba(198,208,246,.65),transparent 70%)}
[data-t=dark] .aur{background:radial-gradient(40vmax 40vmax at 14% 12%,rgba(141,185,240,.22),transparent 70%),radial-gradient(36vmax 36vmax at 88% 86%,rgba(245,182,158,.15),transparent 70%),radial-gradient(30vmax 30vmax at 74% 8%,rgba(112,124,230,.15),transparent 70%)}
.grain{position:absolute;inset:0;z-index:0;opacity:.06;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
[data-t=dark] .grain{mix-blend-mode:screen;opacity:.05}
.page{position:relative;z-index:1;width:100%;height:100%}
.ic{flex:none}
.logo{display:block;width:auto}.lg{display:inline-flex;align-items:center;gap:10px}.wm{font-family:'Bruno Ace SC','Outfit',sans-serif;letter-spacing:.04em;line-height:1;white-space:nowrap}.wm b{font-weight:400;color:var(--ink)}.wm i{font-style:normal;background:linear-gradient(90deg,#06c2fb,#5b21e0 70%,#8b4df0);-webkit-background-clip:text;background-clip:text;color:transparent}[data-t=dark] .wm i{background:linear-gradient(90deg,#5edcff,#8b5cf6 70%,#c084fc);-webkit-background-clip:text;background-clip:text}.probadge{margin-left:2px;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:800;letter-spacing:.04em;color:#5a3a00;background:linear-gradient(180deg,#fde68a,#f5b93a);box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 2px 6px rgba(245,185,58,.35)}
.num{font-variant-numeric:tabular-nums}
.muted{color:var(--muted)}
.card{background:var(--card);border:1px solid var(--line);border-radius:28px;box-shadow:var(--shadow)}
.card2{background:var(--card2);border:1px solid var(--line);border-radius:22px}
.btn{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 20px;border-radius:999px;font-weight:600;font-size:14px;white-space:nowrap}
.btn.main{background:var(--btn);color:var(--btnfg)}
.btn.soft{background:var(--soft);color:var(--ink)}
.btn.ghost{border:1px solid var(--line);color:var(--ink)}
.btn.peach{background:var(--peach);color:#1A1C29}
.btn.sm{height:34px;padding:0 14px;font-size:13px}
.bar{display:block;width:100%;background:var(--line);border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;border-radius:99px}
.heat{display:grid;grid-auto-flow:column;width:max-content}.heat i{border-radius:3px;display:block}
.h0{background:var(--line)}.h1{background:rgba(141,185,240,.35)}.h2{background:rgba(141,185,240,.65)}.h3{background:rgba(141,185,240,.95)}.h4{background:#3A6FB8}
[data-t=dark] .h4{background:#C8DEFA}
.tools{display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);box-shadow:var(--shadow)}
.tool{position:relative;display:grid;place-items:center;width:36px;height:36px;border-radius:99px;color:var(--ink2)}
.tool.on{background:var(--soft);color:var(--ink)}
.dot{position:absolute;right:7px;top:7px;width:7px;height:7px;border-radius:99px;background:#E8765A}
.chip-paper{margin:0 4px 0 6px;padding:6px 12px;border-radius:99px;background:var(--soft);font-size:12px;font-weight:700}
.avatar{display:grid;place-items:center;width:34px;height:34px;border-radius:99px;background:var(--btn);color:var(--btnfg);font-size:12px;font-weight:700;margin-left:2px}
.tools-m{padding:3px;gap:0}.tools-m .tool{width:34px;height:34px}.tools-m .avatar{width:30px;height:30px}
.pagepill{display:flex;gap:2px;padding:5px;border-radius:999px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);box-shadow:var(--shadow)}
.pp{padding:9px 16px;border-radius:99px;font-weight:600;font-size:14px;color:var(--ink2)}.pp.on{background:var(--powder);color:#1A1C29}
.rail{display:flex;flex-direction:column;gap:6px;padding:10px 8px;border-radius:36px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);box-shadow:var(--shadow)}
.ri{position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:99px;color:var(--ink2)}.ri em{display:none}.ri.on{background:var(--powder);color:#1A1C29}
.bpill{position:absolute;left:12px;right:12px;bottom:14px;display:flex;padding:5px;border-radius:999px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);box-shadow:var(--shadow);z-index:5}
.bp{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;padding:7px 0;border-radius:99px;color:var(--ink2);font-style:normal}.bp em{font-style:normal;font-size:10.5px;font-weight:600}.bp.on{background:var(--powder);color:#1A1C29}
.tag{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:99px;background:var(--soft);font-size:12.5px;font-weight:600}
.tag.peach{background:var(--hot)}
.row{display:flex;align-items:center}.col{display:flex;flex-direction:column}.sp{flex:1}
.h1x{font-weight:300;letter-spacing:-.025em;line-height:1.04}
.small{font-size:13px}.xs{font-size:12px}
.pad{padding:22px}
.ex{position:absolute;right:14px;bottom:8px;font-size:11px;color:var(--muted);z-index:9}@media (max-width:500px){.ex{right:auto;left:50%;transform:translateX(-50%);bottom:2px;font-size:9px}}
`;
export const shell = (t, bodyCss, inner, fonts = "") => `<!doctype html><html data-t="${t}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Bruno+Ace+SC&family=Fraunces:opsz,wght@9..144,300;9..144,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>${BASE_CSS}${bodyCss}</style></head><body><div class="aur"></div><div class="grain"></div><div class="page">${inner}</div><div class="ex">Example data</div></body></html>`;
