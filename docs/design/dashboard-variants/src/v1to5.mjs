import { DATA as D, ic, ring, bar, heat, spark, logo, tools, toolsMobile, pagePill, railIcons, bottomPill, btn, PAGES } from "./common.mjs";

const hdr = (t, center = "", pad = "22px 32px") => `<header class="hdr" style="padding:${pad}"><div>${logo(t, 40)}</div><div class="hc">${center}</div><div>${tools(t, 2)}</div></header>`;
const mhdr = (t) => `<header class="mhdr"><div>${logo(t, 30)}</div>${toolsMobile(t)}</header>`;
const HDR_CSS = `.hdr{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;z-index:4}.hdr .hc{position:absolute;left:50%;transform:translateX(-50%)}.mhdr{position:absolute;left:0;right:0;top:0;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;z-index:4}`;

/* ---------- V1 Focus Stream: today as one timeline, pulse on the side ---------- */
const v1css = `${HDR_CSS}
.v1{position:absolute;inset:92px 0 0 0;display:grid;grid-template-columns:1fr 440px;gap:56px;padding:20px 56px 0}
.v1 h1{font-size:60px;margin:10px 0 6px}
.v1 .next{display:flex;align-items:center;gap:26px;margin:30px 0 34px}
.v1 .next .t{font-size:30px;font-weight:500;letter-spacing:-.02em;line-height:1.1}
.v1 .rg{position:relative;width:96px;height:96px;flex:none}.v1 .rg b{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;font-weight:600}
.v1 .tl{position:relative;padding-left:34px}.v1 .tl:before{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:2px;background:var(--line)}
.v1 .it{position:relative;display:flex;align-items:center;gap:16px;padding:14px 0}
.v1 .nd{position:absolute;left:-34px;width:24px;height:24px;border-radius:99px;display:grid;place-items:center;background:var(--bg);border:2px solid var(--powder)}
.v1 .nd.done{background:var(--powder);color:#1A1C29}
.v1 .tm{width:74px;color:var(--muted);font-size:13px}
.v1 .tt{font-size:19px;font-weight:500}
.v1 .pulse{align-self:start;padding:30px 30px 26px;margin-top:6px}
.v1 .big{font-size:96px;font-weight:200;letter-spacing:-.04em;line-height:.9}
.v1 .sep{height:1px;background:var(--line);margin:22px 0}
.v1 .imp{margin:26px 0 0 0;padding-top:24px;border-top:1px solid var(--line)}.v1 .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.v1 .dots{display:flex;gap:6px}.v1 .dots i{width:22px;height:22px;border-radius:99px;background:var(--soft);display:block}.v1 .dots i.f{background:var(--peach)}
`;
export const V1 = {
  id: "01", slug: "focus-stream", name: "Focus Stream",
  idea: "Today as one timeline. One next step, then the evening in order; the numbers sit quietly on the side.",
  d: (t) => ({ css: v1css, html: `${hdr(t, pagePill(-1))}<main class="v1"><section>
    <div class="muted">Saturday 7 November</div><h1 class="h1x">Good evening, Aarav.</h1>
    <div class="muted" style="font-size:18px">Three things tonight, about 60 minutes.</div>
    <div class="next"><div class="rg">${ring(D.next.pct, 96, 9)}<b class="num">${D.next.pct}%</b></div><div class="col" style="gap:10px"><div class="t">${D.next.title}</div><div class="muted">${D.next.sub}</div><div class="row" style="gap:10px;margin-top:4px">${btn("Resume", "main", "arrow")}${btn("Choose something else", "ghost")}</div></div></div>
    <div class="tl">${D.plan.map((p) => `<div class="it"><span class="nd ${p.done ? "done" : ""}">${p.done ? ic("check", 13, 2.6) : ""}</span><span class="tm">${p.t}</span><div class="sp"><div class="tt" style="${p.done ? "text-decoration:line-through;color:var(--muted)" : ""}">${p.done ? p.title : p.title}</div><div class="muted small">${p.sub}</div></div><span class="tag">${ic("clock", 13)}${p.min} min</span></div>`).join("")}</div>
    <div class="imp"><div style="font-size:19px;font-weight:500;margin-bottom:14px">Where your next marks are</div><div class="g3">${D.weak.map(([n, a]) => `<div><div class="row small"><span class="sp" style="font-weight:600">${n}</span><span class="num muted">${a}%</span></div>${bar(a, "var(--peach)", 8)}<div class="muted xs" style="margin-top:6px">12 questions, 15 min</div></div>`).join("")}</div></div>
  </section><aside class="card pulse"><div class="row" style="align-items:flex-end;gap:14px"><div class="big num">${D.days}</div><div class="muted" style="padding-bottom:8px">days to GATE 2027<br>Syllabus pass 1: 54%</div></div>${bar(54, "var(--powder)", 8)}
    <div class="sep"></div><div class="row"><div class="sp"><div class="small muted">Streak</div><div style="font-size:26px;font-weight:600">${ic("flame", 20)} ${D.streak} days</div></div><div class="dots">${[1, 1, 1, 1, 1, 1, 0].map((f) => `<i class="${f ? "f" : ""}"></i>`).join("")}</div></div>
    <div class="sep"></div><div class="row"><div class="sp"><div class="small muted">All-India rank</div><div style="font-size:26px;font-weight:600" class="num">#${D.rank.toLocaleString("en-IN")}</div><div class="small muted">of ${D.ranked.toLocaleString("en-IN")}</div></div>${spark([40, 44, 43, 52, 58, 61, 66])}</div>
    <div class="sep"></div><div class="row"><div class="sp"><div class="small muted">Accuracy, 30 days</div><div style="font-size:26px;font-weight:600" class="num">${D.accuracy}%</div></div>${spark([58, 60, 59, 63, 64, 66, 68], 120, 36, "var(--peach-d)")}</div>
    <div class="sep"></div><div class="row" style="gap:10px"><span class="tag peach">${ic("spark", 14)} Ask the Mentor about deadlocks</span></div><div class="sep"></div><div style="overflow:hidden">${heat(25, 7, 7, 11, 3)}</div></aside></main>` }),
  m: (t) => ({ css: v1css + `.m1,.m1.v1{position:absolute;inset:70px 0 96px 0;padding:6px 20px;overflow:hidden;display:block;grid-template-columns:none;gap:0}.m1 h1{font-size:38px;margin:6px 0 4px}.m1 .next{display:flex;gap:16px;align-items:center;margin:18px 0 20px}.m1 .t{font-size:21px;font-weight:500;line-height:1.15}.m1 .rg{width:72px;height:72px}.m1 .tl{margin-top:4px}.m1 .it{padding:11px 0}.m1 .tt{font-size:16px}.m1 .tm{width:56px;font-size:12px}.m1 .pulse{margin-top:14px;padding:18px;display:grid;grid-template-columns:1fr 1fr;gap:14px}.m1 .big{font-size:56px}`, html: `${mhdr(t)}<main class="m1 v1"><div class="muted">Saturday 7 November</div><h1 class="h1x">Good evening, Aarav.</h1><div class="muted">Three things tonight, about 60 minutes.</div>
    <div class="next"><div class="rg">${ring(D.next.pct, 72, 8)}<b class="num" style="font-size:17px">${D.next.pct}%</b></div><div class="col" style="gap:6px"><div class="t">${D.next.title}</div><div class="muted small">${D.next.sub}</div>${btn("Resume", "main sm", "arrow")}</div></div>
    <div class="tl">${D.plan.map((p) => `<div class="it"><span class="nd ${p.done ? "done" : ""}">${p.done ? ic("check", 12, 2.6) : ""}</span><span class="tm">${p.t}</span><div class="sp"><div class="tt">${p.title}</div><div class="muted xs">${p.sub}</div></div></div>`).join("")}</div>
    <div class="card pulse"><div><div class="big num" style="line-height:.9">${D.days}</div><div class="small muted">days to GATE</div></div><div><div class="small muted">Streak</div><div style="font-size:22px;font-weight:600">${ic("flame", 18)} ${D.streak}</div><div class="small muted">Rank #${D.rank.toLocaleString("en-IN")}</div></div></div></main>${bottomPill(0)}` }),
};

/* ---------- V2 Bento Mosaic: asymmetric tiles, size = priority ---------- */
const v2css = `${HDR_CSS}
.v2{position:absolute;inset:88px 32px 96px 32px;display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:repeat(6,1fr);gap:16px}
.v2 > div{border-radius:30px;padding:22px;position:relative;overflow:hidden}
.v2 .hero{grid-column:1/6;grid-row:1/4;background:var(--btn);color:var(--btnfg)}
.v2 .hero h2{font-size:42px;font-weight:300;letter-spacing:-.02em;line-height:1.05;margin:8px 0 14px}
.v2 .hero .btn.main{background:var(--peach);color:#1A1C29}
.v2 .ringt{grid-column:6/9;grid-row:1/4}
.v2 .mist{grid-column:9/13;grid-row:1/3;background:var(--hot)}
.v2 .forge{grid-column:9/13;grid-row:3/5}
.v2 .heat{grid-column:1/6;grid-row:4/7}
.v2 .mock{grid-column:6/9;grid-row:4/7;background:var(--soft)}
.v2 .ment{grid-column:9/13;grid-row:5/7}
.dock{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);display:flex;gap:4px;padding:8px;border-radius:999px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);box-shadow:var(--shadow);z-index:5}
.dock .di{display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:99px;font-weight:600;color:var(--ink2);font-size:14px}.dock .di.on{background:var(--powder);color:#1A1C29}
.v2 .lab{font-size:13px;opacity:.75}
.v2 .bn{font-size:68px;font-weight:200;letter-spacing:-.04em;line-height:1}
`;
const dockBar = () => `<nav class="dock">${[["Home", "home"], ["Practice", "test"], ["Study", "book"], ["Mentor", "spark"], ["Review", "layers"], ["Analytics", "chart"]].map(([l, n], i) => `<span class="di ${i === 0 ? "on" : ""}">${ic(n, 18)}${i === 0 ? l : ""}</span>`).join("")}</nav>`;
export const V2 = {
  id: "02", slug: "bento-mosaic", name: "Bento Mosaic",
  idea: "Tile size equals priority. The navy tile is the one thing to do; every other tile answers one question.",
  d: (t) => ({ css: v2css, html: `${hdr(t, "", "20px 32px")}<main class="v2">
    <div class="hero"><div class="lab">Next step · 18 min</div><h2>${D.next.title}</h2><div style="opacity:.8;margin-bottom:22px">${D.next.sub}</div>${btn("Resume now", "main", "arrow")}<div style="position:absolute;right:22px;bottom:22px;opacity:.9">${ring(D.next.pct, 84, 9, "rgba(255,255,255,.2)", "var(--peach)")}</div></div>
    <div class="card ringt col"><div class="lab muted">Readiness</div><div class="sp" style="display:grid;place-items:center;position:relative">${ring(D.readiness, 168, 14)}<div style="position:absolute;text-align:center"><div style="font-size:44px;font-weight:300" class="num">${D.readiness}%</div><div class="small muted">${D.days} days left</div></div></div></div>
    <div class="mist col"><div class="lab">Due today</div><div class="bn num">${D.due}</div><div class="sp"></div><div class="row"><span class="sp small" style="font-weight:600">Mistakes ready to revise</span>${btn("Revise", "main sm")}</div></div>
    <div class="card forge col"><div class="lab muted">Daily Forge</div><div style="font-size:28px;font-weight:500;margin:6px 0">3 of 5 solved</div>${bar(60, "var(--powder)", 10)}<div class="sp"></div><div class="small muted">Plus: 15 a day. Resets at midnight IST.</div></div>
    <div class="card heat col"><div class="row"><div class="sp"><div class="lab muted">Last 26 weeks</div><div style="font-size:24px;font-weight:500">${D.streak}-day streak</div></div>${spark([2, 3, 2, 4, 5, 4, 6], 110, 32)}</div><div class="sp" style="display:grid;align-items:center">${heat(34, 7, 5, 15, 4)}</div></div>
    <div class="mock col"><div class="lab">Sunday</div><div style="font-size:26px;font-weight:500;line-height:1.1;margin:6px 0">${D.mock.title}</div><div class="small">${D.mock.when}</div><div class="sp"></div><div class="row">${btn("Registered", "main sm", "check")}</div></div>
    <div class="card ment col"><div class="lab muted">AI Mentor</div><div style="font-size:19px;font-weight:500;margin:6px 0 10px">Why does a deadlock need all four conditions?</div><div class="sp"></div><div class="row card2" style="padding:10px 14px;gap:10px"><span class="sp muted small">Ask anything about your mistakes</span>${ic("send", 16)}</div></div>
  </main>${dockBar()}` }),
  m: (t) => ({ css: v2css + `.m2{position:absolute;inset:66px 12px 92px 12px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:min-content;gap:10px;overflow:hidden}.m2>div{border-radius:24px;padding:16px;position:relative}.m2 .hero{grid-column:1/3;background:var(--btn);color:var(--btnfg)}.m2 .hero h2{font-size:26px;font-weight:300;margin:4px 0 6px;line-height:1.1}.m2 .hero .btn.main{background:var(--peach);color:#1A1C29}.m2 .bn{font-size:48px;font-weight:200}`, html: `${mhdr(t)}<main class="m2">
    <div class="hero"><div class="lab" style="font-size:12px;opacity:.75">Next step · 18 min</div><h2>${D.next.title}</h2><div style="opacity:.8;font-size:13px;margin-bottom:14px">${D.next.sub}</div>${btn("Resume now", "main sm", "arrow")}</div>
    <div class="card"><div class="small muted">Readiness</div><div style="display:grid;place-items:center;position:relative;margin-top:6px">${ring(D.readiness, 100, 10)}<b class="num" style="position:absolute;font-size:24px;font-weight:400">${D.readiness}%</b></div></div>
    <div style="background:var(--hot)"><div class="small">Due today</div><div class="bn num">${D.due}</div><div class="small" style="font-weight:600">Mistakes</div></div>
    <div class="card"><div class="small muted">Daily Forge</div><div style="font-size:20px;font-weight:500;margin:4px 0 8px">3 of 5</div>${bar(60, "var(--powder)", 8)}</div>
    <div style="background:var(--soft)"><div class="small">Sunday 10:00</div><div style="font-size:18px;font-weight:500;line-height:1.1;margin-top:4px">${D.mock.title}</div></div>
    <div class="card" style="grid-column:1/3"><div class="small muted">${D.streak}-day streak</div><div style="margin-top:8px;overflow:hidden">${heat(21, 7, 5, 11, 3)}</div></div>
  </main>${bottomPill(0)}` }),
};

/* ---------- V3 Command Home: type what you want; the rest is quiet ---------- */
const v3css = `${HDR_CSS}
.v3{position:absolute;inset:92px 0 0 0;display:flex;flex-direction:column;align-items:center;padding-top:70px}
.v3 h1{font-size:64px;text-align:center;margin-bottom:12px}
.v3 .cmd{display:flex;align-items:center;gap:14px;width:820px;height:80px;padding:0 28px;border-radius:999px;background:var(--glass);border:1px solid var(--line);box-shadow:var(--shadow);margin:26px 0 18px;font-size:19px;color:var(--muted)}
.v3 kbd{font:600 12px 'Outfit';padding:5px 9px;border-radius:8px;background:var(--soft);color:var(--ink)}
.v3 .chips{display:flex;gap:10px;margin-bottom:46px}
.v3 .chip{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:99px;background:var(--card);border:1px solid var(--line);font-weight:500}
.v3 .cols{display:grid;grid-template-columns:repeat(3,1fr);gap:48px;width:1120px}
.v3 .cols h3{font-size:15px;font-weight:600;margin-bottom:10px;display:flex;justify-content:space-between}
.v3 .li{display:flex;align-items:center;gap:14px;padding:17px 0;border-top:1px solid var(--line)}
.v3 .li .ico{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--soft)}
.v3 .stat{display:flex;gap:34px;color:var(--ink2);margin-top:2px}
`;
export const V3 = {
  id: "03", slug: "command-home", name: "Command Home",
  idea: "Say what you want to do. The command bar is the page; three plain lists stay under it for people who prefer to click.",
  d: (t) => ({ css: v3css, html: `${hdr(t, pagePill(-1))}<main class="v3"><h1 class="h1x">What are you practising tonight?</h1>
    <div class="stat"><span class="num"><b>${D.days}</b> days to GATE</span><span class="num"><b>${D.streak}</b>-day streak</span><span class="num"><b>${D.accuracy}%</b> accuracy</span></div>
    <div class="cmd">${ic("search", 22)}<span class="sp">Search a topic, start a test, or ask the Mentor</span><kbd>Ctrl</kbd><kbd>K</kbd></div>
    <div class="chips"><span class="chip">${ic("play", 15)}Resume Deadlocks</span><span class="chip">${ic("layers", 15)}Revise 14 mistakes</span><span class="chip">${ic("bolt", 15)}10-minute Forge</span><span class="chip">${ic("spark", 15)}Ask the Mentor</span></div>
    <div class="cols"><div><h3>Continue <span class="muted small" style="font-weight:400">2</span></h3><div class="li"><span class="ico">${ic("test", 18)}</span><div class="sp"><div style="font-weight:500">Operating Systems: Deadlocks</div><div class="muted small">12 left</div></div>${ic("arrow", 16)}</div><div class="li"><span class="ico">${ic("book", 18)}</span><div class="sp"><div style="font-weight:500">Normalization notes</div><div class="muted small">Page 4 of 9</div></div>${ic("arrow", 16)}</div><div class="li"><span class="ico">${ic("test", 18)}</span><div class="sp"><div style="font-weight:500">Aptitude: Section 2</div><div class="muted small">8 left</div></div>${ic("arrow", 16)}</div></div>
    <div><h3>Due today <span class="muted small" style="font-weight:400">14</span></h3><div class="li"><span class="ico" style="background:var(--hot)">${ic("layers", 18)}</span><div class="sp"><div style="font-weight:500">Operating Systems</div><div class="muted small">6 mistakes</div></div>${ic("arrow", 16)}</div><div class="li"><span class="ico" style="background:var(--hot)">${ic("layers", 18)}</span><div class="sp"><div style="font-weight:500">Databases</div><div class="muted small">5 mistakes</div></div>${ic("arrow", 16)}</div><div class="li"><span class="ico" style="background:var(--hot)">${ic("layers", 18)}</span><div class="sp"><div style="font-weight:500">Computer Organisation</div><div class="muted small">3 mistakes</div></div>${ic("arrow", 16)}</div></div>
    <div><h3>Suggested <span class="muted small" style="font-weight:400">from your weak topics</span></h3><div class="li"><span class="ico">${ic("target", 18)}</span><div class="sp"><div style="font-weight:500">Normalization drill</div><div class="muted small">48% accuracy</div></div>${ic("arrow", 16)}</div><div class="li"><span class="ico">${ic("flag", 18)}</span><div class="sp"><div style="font-weight:500">All-India Mock 6</div><div class="muted small">Sunday 10:00 am</div></div>${ic("arrow", 16)}</div><div class="li"><span class="ico">${ic("target", 18)}</span><div class="sp"><div style="font-weight:500">Subnetting drill</div><div class="muted small">52% accuracy</div></div>${ic("arrow", 16)}</div></div></div></main>` }),
  m: (t) => ({ css: v3css + `.m3{position:absolute;inset:66px 0 96px 0;padding:14px 18px;overflow:hidden}.m3 h1{font-size:34px;margin:10px 0}.m3 .cmd{width:100%;height:56px;margin:16px 0 12px;font-size:15px;padding:0 18px}.m3 .chips{overflow:hidden;margin-bottom:20px;gap:8px}.m3 .chip{padding:9px 13px;font-size:13.5px;white-space:nowrap}.m3 .stat{gap:16px;font-size:13px;margin:0}.m3 h3{margin:14px 0 4px}`, html: `${mhdr(t)}<main class="m3 v3" style="display:block;padding-top:14px"><h1 class="h1x">What are you practising tonight?</h1><div class="stat"><span class="num"><b>${D.days}</b> days</span><span class="num"><b>${D.streak}</b>-day streak</span><span class="num"><b>${D.accuracy}%</b></span></div>
    <div class="cmd">${ic("search", 19)}<span class="sp">Search, start a test, ask</span></div><div class="chips"><span class="chip">${ic("play", 14)}Resume Deadlocks</span><span class="chip">${ic("layers", 14)}Revise 14</span><span class="chip">${ic("bolt", 14)}Forge</span></div>
    <div class="cols" style="display:block;width:auto"><h3 style="font-size:14px">Due today <span class="muted small" style="font-weight:400">14</span></h3><div class="li"><span class="ico" style="background:var(--hot)">${ic("layers", 17)}</span><div class="sp"><div style="font-weight:500">Operating Systems</div><div class="muted xs">6 mistakes</div></div>${ic("arrow", 15)}</div><div class="li"><span class="ico" style="background:var(--hot)">${ic("layers", 17)}</span><div class="sp"><div style="font-weight:500">Databases</div><div class="muted xs">5 mistakes</div></div>${ic("arrow", 15)}</div>
    <h3 style="font-size:14px">Continue</h3><div class="li"><span class="ico">${ic("test", 17)}</span><div class="sp"><div style="font-weight:500">Deadlocks</div><div class="muted xs">12 left</div></div>${ic("arrow", 15)}</div></div></main>${bottomPill(0)}` }),
};

/* ---------- V4 Readiness Orbit: one dial, satellites around it, light left rail ---------- */
const v4css = `${HDR_CSS}
.v4rail{position:absolute;left:28px;top:50%;transform:translateY(-50%);z-index:4}
.v4{position:absolute;inset:96px 40px 40px 120px;display:grid;grid-template-columns:1fr 420px;gap:34px}
.v4 .stage{position:relative}
.v4 .dial{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center}
.v4 .dial b{position:absolute;text-align:center;font-weight:300}
.v4 .sat{position:absolute;width:240px;padding:16px 18px;border-radius:24px}
.v4 .sat .k{font-size:13px;color:var(--muted)}.v4 .sat .v{font-size:26px;font-weight:500;margin-top:2px}
.v4 .side{align-self:stretch;display:flex;flex-direction:column;gap:14px;padding-top:18px}
.v4 .side h3{font-size:19px;font-weight:600}
.v4 .nx{display:flex;gap:14px;align-items:center;padding:16px;border-radius:24px}
.v4 .nx .n{width:40px;height:40px;border-radius:99px;display:grid;place-items:center;background:var(--soft);font-weight:700}
`;
const lines = `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" preserveAspectRatio="none"><g stroke="var(--line)" stroke-width="1.5" fill="none" stroke-dasharray="4 6"><path d="M 28% 24% L 40% 42%"/><path d="M 72% 22% L 60% 42%"/><path d="M 28% 78% L 40% 60%"/><path d="M 72% 80% L 60% 60%"/></g></svg>`;
export const V4 = {
  id: "04", slug: "readiness-orbit", name: "Readiness Orbit",
  idea: "One dial answers 'am I on track?'. Everything else orbits it as a satellite you can open.",
  d: (t) => ({ css: v4css, html: `${hdr(t, "")}<div class="v4rail">${railIcons(0)}</div><main class="v4"><section class="stage">${lines}
    <div class="dial">${ring(88, 360, 6, "var(--line)", "var(--peach)")}<div style="position:absolute">${ring(D.readiness, 296, 18, "var(--line)", "var(--powder)")}</div><div style="position:absolute">${ring(72, 224, 10, "var(--line)", "var(--powder-d)")}</div><b><div style="font-size:72px;letter-spacing:-.04em" class="num">${D.readiness}%</div><div class="muted">ready for GATE 2027</div><div class="small muted">${D.days} days left</div></b></div>
    <div class="card sat" style="left:2%;top:8%"><div class="k">Weak topics</div><div class="v">Deadlocks 41%</div><div class="small muted">and 2 more</div></div>
    <div class="card sat" style="right:2%;top:6%"><div class="k">Due mistakes</div><div class="v num">${D.due}</div><div class="small muted">about 20 minutes</div></div>
    <div class="card sat" style="left:2%;bottom:6%"><div class="k">Streak</div><div class="v">${D.streak} days</div><div class="small muted">Best: 19 days</div></div>
    <div class="card sat" style="right:2%;bottom:4%"><div class="k">Mock on Sunday</div><div class="v">10:00 am</div><div class="small muted">${D.mock.title}</div></div>
  </section><aside class="side"><div class="muted">Saturday 7 November</div><h3 style="font-size:34px;font-weight:300;letter-spacing:-.02em;line-height:1.1">Good evening, Aarav. Next up:</h3>
    <div class="card nx"><span class="n">1</span><div class="sp"><div style="font-weight:600">${D.next.title}</div><div class="muted small">${D.next.sub}</div></div>${btn("Go", "main sm")}</div>
    <div class="card2 nx"><span class="n">2</span><div class="sp"><div style="font-weight:600">Revise 14 due mistakes</div><div class="muted small">20 min</div></div>${ic("arrow", 16)}</div>
    <div class="card2 nx"><span class="n">3</span><div class="sp"><div style="font-weight:600">Aptitude section</div><div class="muted small">10 questions, timed</div></div>${ic("arrow", 16)}</div>
    <div style="margin-top:6px;font-size:17px;font-weight:600">Where your next marks are</div>${D.weak.map(([n, a]) => `<div><div class="row small"><span class="sp" style="font-weight:600">${n}</span><span class="num muted">${a}%</span></div>${bar(a, "var(--peach)", 8)}</div>`).join("")}<div class="sp"></div><div class="row card2" style="padding:12px 16px;gap:10px"><span class="tag peach">${ic("spark", 14)}Mentor</span><span class="sp muted small">Ask about deadlocks</span>${ic("send", 16)}</div></aside></main>` }),
  m: (t) => ({ css: v4css + `.m4{position:absolute;inset:66px 0 96px 0;padding:6px 18px;overflow:hidden}.m4 .dialw{position:relative;display:grid;place-items:center;height:290px}.m4 .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}.m4 .grid .card{padding:14px 16px;border-radius:22px}.m4 .grid .k{font-size:12px;color:var(--muted)}.m4 .grid .v{font-size:20px;font-weight:500}.m4 .nx{display:flex;gap:14px;align-items:center}`, html: `${mhdr(t)}<main class="m4"><div class="muted small">Saturday 7 November</div><div style="font-size:30px;font-weight:300;letter-spacing:-.02em;margin:2px 0 0">Good evening, Aarav.</div>
    <div class="dialw">${ring(88, 270, 5, "var(--line)", "var(--peach)")}<div style="position:absolute">${ring(D.readiness, 224, 14, "var(--line)", "var(--powder)")}</div><div style="position:absolute">${ring(72, 168, 8, "var(--line)", "var(--powder-d)")}</div><b style="position:absolute;text-align:center;font-weight:300"><div style="font-size:52px;letter-spacing:-.04em" class="num">${D.readiness}%</div><div class="muted small">${D.days} days left</div></b></div>
    <div class="grid"><div class="card"><div class="k">Weak topics</div><div class="v">Deadlocks 41%</div></div><div class="card"><div class="k">Due mistakes</div><div class="v num">${D.due}</div></div><div class="card"><div class="k">Streak</div><div class="v">${D.streak} days</div></div><div class="card"><div class="k">Mock Sunday</div><div class="v">10:00 am</div></div></div>
    <div class="card nx" style="margin-top:12px;padding:14px"><div class="sp"><div style="font-weight:600">${D.next.title}</div><div class="muted xs">${D.next.sub}</div></div>${btn("Go", "main sm")}</div></main>${bottomPill(0)}` }),
};

/* ---------- V5 Week Strip: the dashboard is a calendar first ---------- */
const v5css = `${HDR_CSS}
.v5side{position:absolute;left:28px;top:100px;bottom:28px;width:208px;display:flex;flex-direction:column;gap:4px;padding:14px;border-radius:30px;background:var(--glass);border:1px solid var(--line);backdrop-filter:blur(18px);box-shadow:var(--shadow);z-index:4}
.v5side .si{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:99px;font-weight:500;color:var(--ink2)}.v5side .si.on{background:var(--powder);color:#1A1C29;font-weight:600}
.v5{position:absolute;left:268px;right:32px;top:92px;bottom:28px;display:grid;grid-template-rows:auto 1fr;gap:20px}
.v5 .strip{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
.v5 .day{padding:14px 16px;border-radius:26px;background:var(--card);border:1px solid var(--line)}
.v5 .day.today{background:var(--peach);color:#1A1C29;border-color:transparent;box-shadow:var(--shadow)}
.v5 .day .dn{font-size:13px;opacity:.75}.v5 .day .dd{font-size:30px;font-weight:300;letter-spacing:-.02em}
.v5 .day .dots{display:flex;gap:4px;margin-top:8px}.v5 .day .dots i{width:8px;height:8px;border-radius:99px;background:var(--powder);display:block}.v5 .day.today .dots i{background:#1A1C29}
.v5 .main{display:grid;grid-template-columns:1.3fr 1fr;gap:20px;min-height:0}
.v5 .ag{padding:24px 26px}.v5 .ag h3{font-size:22px;font-weight:500;margin-bottom:6px}
.v5 .blk{display:grid;grid-template-columns:78px 1fr auto;gap:14px;align-items:center;padding:16px 0;border-top:1px solid var(--line)}
.v5 .blk .b{border-left:4px solid var(--powder);padding-left:14px}
.v5 .glance{padding:24px 26px;display:flex;flex-direction:column;gap:14px}
.v5 .sr{display:grid;grid-template-columns:150px 1fr 38px;align-items:center;gap:12px;font-size:14px}
`;
export const V5 = {
  id: "05", slug: "week-strip", name: "Week Strip",
  idea: "Exam prep is a schedule. The week is the header; tonight's agenda and the week's balance sit under it.",
  d: (t) => ({ css: v5css, html: `${hdr(t, "")}<aside class="v5side"><div class="si on">${ic("home", 18)}Home</div>${PAGES.map(([l, n]) => `<div class="si">${ic(n, 18)}${l}</div>`).join("")}<div class="sp"></div><div class="card2" style="padding:14px;border-radius:22px"><div class="small muted">GATE 2027</div><div style="font-size:34px;font-weight:300" class="num">${D.days} days</div></div></aside>
    <main class="v5"><div class="strip">${D.week.map(([d, n], i) => `<div class="day ${i === 5 ? "today" : ""}"><div class="dn">${d}${i === 5 ? ", today" : ""}</div><div class="dd num">${2 + i}</div><div class="dots">${Array.from({ length: n }, () => "<i></i>").join("")}</div>${i === 6 ? '<div class="small" style="margin-top:6px;font-weight:600">Mock 10:00</div>' : '<div class="small muted" style="margin-top:6px">' + (n ? n + " blocks" : "Rest") + "</div>"}</div>`).join("")}</div>
    <div class="main"><section class="card ag"><div class="row"><h3 class="sp">Tonight</h3>${btn("Start 7:40 block", "main sm", "arrow")}</div>${D.plan.map((p) => `<div class="blk"><span class="muted small">${p.t}</span><div class="b"><div style="font-weight:600;font-size:17px">${p.title}</div><div class="muted small">${p.sub}</div></div><span class="tag">${p.min} min</span></div>`).join("")}<div class="muted small" style="margin-top:6px">Total 60 min · Next block: Revise 14 due mistakes</div></section>
    <section class="card glance"><div class="row"><h3 style="font-size:22px;font-weight:500" class="sp">This week</h3><span class="tag">${D.streak}-day streak</span></div>${D.subjects.map(([n, a, b]) => `<div class="sr"><span>${n.length > 17 ? n.slice(0, 16) + "…" : n}</span>${bar(a, "var(--powder)", 9)}<span class="num muted">${a}%</span></div>`).join("")}<div class="sp"></div><div class="row card2" style="padding:12px 16px;gap:10px"><span class="tag peach">${ic("spark", 14)}Mentor</span><span class="muted small sp">Your plan puts Networks at 47%. Add a block?</span>${btn("Add", "soft sm")}</div></section></div></main>` }),
  m: (t) => ({ css: v5css + `.m5,.m5.v5{position:absolute;inset:66px 0 96px 0;left:0;right:0;top:66px;bottom:96px;padding:6px 14px;overflow:hidden;display:block}.m5 .blk{display:grid;gap:12px;align-items:center;border-top:1px solid var(--line)}.m5 .sr{display:grid;align-items:center;gap:10px}.m5 .day .dots{display:flex;gap:3px;margin-top:6px}.m5 .day .dots i{width:6px;height:6px;border-radius:99px;background:var(--powder);display:block}.m5 .day.today .dots i{background:#1A1C29}.m5 .day.today{background:var(--peach);color:#1A1C29;border-color:transparent}.m5 .st{display:flex;gap:8px;overflow:hidden;margin-bottom:14px}.m5 .day{flex:none;width:60px;padding:10px 0;text-align:center;border-radius:20px}.m5 .day .dd{font-size:22px}.m5 .blk{grid-template-columns:62px 1fr auto;padding:12px 0}`, html: `${mhdr(t)}<main class="m5 v5"><div class="row" style="margin:4px 4px 10px"><div class="sp"><div style="font-size:26px;font-weight:300;letter-spacing:-.02em">Saturday 7 Nov</div><div class="muted small">${D.days} days to GATE 2027</div></div><span class="tag">${D.streak}-day streak</span></div>
    <div class="st">${D.week.map(([d, n], i) => `<div class="day ${i === 5 ? "today" : ""}" style="${i === 5 ? "" : "background:var(--card);border:1px solid var(--line)"}"><div class="dn xs">${d}</div><div class="dd num">${2 + i}</div><div class="dots" style="justify-content:center">${Array.from({ length: n }, () => "<i></i>").join("")}</div></div>`).join("")}</div>
    <section class="card ag" style="padding:16px 18px;border-radius:26px"><div class="row"><h3 class="sp" style="font-size:19px;font-weight:500">Tonight</h3>${btn("Start", "main sm", "arrow")}</div>${D.plan.map((p) => `<div class="blk"><span class="muted xs">${p.t}</span><div class="b" style="border-left:4px solid var(--powder);padding-left:10px"><div style="font-weight:600;font-size:15px">${p.title}</div><div class="muted xs">${p.sub}</div></div><span class="tag xs">${p.min}m</span></div>`).join("")}</section>
    <section class="card" style="margin-top:12px;padding:16px 18px;border-radius:26px">${D.subjects.slice(0, 4).map(([n, a]) => `<div class="sr" style="grid-template-columns:118px 1fr 34px;margin:7px 0;font-size:13px"><span>${n.length > 14 ? n.slice(0, 13) + "…" : n}</span>${bar(a, "var(--powder)", 8)}<span class="num muted">${a}%</span></div>`).join("")}</section></main>${bottomPill(0)}` }),
};
export const SET_A = [V1, V2, V3, V4, V5];
