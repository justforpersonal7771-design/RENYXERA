import { challengeUrl, parseChallenge } from "../lib/growth/challenge";

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };

const ids = ["GATE_CS_2024_FN_Q1", "GATE_CS_2024_FN_Q2", "GATE_CS_2024_FN_Q3", "GATE_CS_2024_FN_Q4"];
const url = challengeUrl("https://gate.renyxera.workers.dev", { ids, score: 9.3333333, max: 16, by: "Adil <script>", title: "Algorithms topic test" });
const parsed = parseChallenge(new URL(url).searchParams);
check("a challenge survives the round trip", !!parsed && parsed.ids.join() === ids.join() && parsed.score === 9.33 && parsed.max === 16);
check("the name is cleaned of markup characters", parsed?.by === "Adil script", parsed?.by);
check("the link carries campaign tags", url.includes("utm_campaign=beat_my_score"));
check("too few questions is rejected", parseChallenge(new URLSearchParams({ q: "a1234,b1234", s: "1", m: "2" })) === null);
check("a score above the maximum is rejected", parseChallenge(new URLSearchParams({ q: ids.join(","), s: "20", m: "16" })) === null);
check("nonsense ids are dropped", parseChallenge(new URLSearchParams({ q: `${ids.join(",")},<img src=x>,../etc`, s: "1", m: "4" }))?.ids.length === 4);
check("a missing score is rejected", parseChallenge(new URLSearchParams({ q: ids.join(",") })) === null);
check("a negative score within range is allowed", parseChallenge(new URLSearchParams({ q: ids.join(","), s: "-0.67", m: "16" }))?.score === -0.67);
console.log(failed ? `\n${failed} check(s) failed` : "\nAll challenge checks passed");
process.exit(failed ? 1 : 0);
