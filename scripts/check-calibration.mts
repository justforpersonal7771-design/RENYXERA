// Integrity checks for the calibration data (checklist 4J). Runs in CI:
//   npm run check:calibration
import { CALIBRATION, CURVE, gateScore, calibratedMarksForRank, calibratedRankForMarks, rankBandForMarks } from "../lib/calibration.ts";

let failed = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (!cond) failed++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
};

ok("at least 3 years of data", CALIBRATION.length >= 3, CALIBRATION.map((c) => c.year).join(", "));
for (const y of CALIBRATION) {
  const q = y.qualifying_marks;
  ok(`${y.year}: OBC-NCL/EWS = 90% of General`, Math.abs(q.obc_ncl_ews - q.general * 0.9) <= 0.11, `${q.obc_ncl_ews} vs ${(q.general * 0.9).toFixed(2)}`);
  ok(`${y.year}: SC/ST/PwD = 2/3 of General`, Math.abs(q.sc_st_pwd - (q.general * 2) / 3) <= 0.11, `${q.sc_st_pwd} vs ${((q.general * 2) / 3).toFixed(2)}`);
  ok(`${y.year}: qualifying mark within 20–40`, q.general >= 20 && q.general <= 40, String(q.general));
  for (const t of y.marks_vs_rank) for (const r of t.rows) {
    ok(`${y.year}/${t.source}: row ranges valid`, r.marks[0] <= r.marks[1] && r.rank[0] <= r.rank[1], JSON.stringify(r));
  }
}

let mono = true, inBand = true;
for (let i = 1; i < CURVE.length; i++) {
  if (!(CURVE[i].rank > CURVE[i - 1].rank && CURVE[i].marks <= CURVE[i - 1].marks)) mono = false;
}
for (const c of CURVE) if (!(c.low <= c.marks && c.marks <= c.high)) inBand = false;
ok("curve: marks never rise as rank worsens", mono);
ok("curve: estimate always inside its band", inBand);

for (const rank of [10, 100, 1000, 5000]) {
  const m = calibratedMarksForRank(rank);
  const back = calibratedRankForMarks(m);
  ok(`round trip AIR ${rank} → ${m} marks → AIR ${back}`, Math.abs(back - rank) / rank <= 0.1);
}
const band = rankBandForMarks(60);
ok("60 marks: best rank ≤ worst rank", band.best <= band.worst, `${band.best}–${band.worst}`);

const latest = CALIBRATION[CALIBRATION.length - 1];
ok("score at the qualifying mark = 350", gateScore(latest.qualifying_marks.general) === 350, String(gateScore(latest.qualifying_marks.general)));
ok("score is clamped to 0–1000", gateScore(0) >= 0 && gateScore(100) <= 1000, `${gateScore(0)}, ${gateScore(100)}`);

console.log(failed ? `\n${failed} FAILED` : "\nCalibration data is consistent");
process.exitCode = failed ? 1 : 0;
