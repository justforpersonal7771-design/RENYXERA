// Checks the adaptive radar rules for any number of subjects: node --experimental-strip-types --no-warnings scripts/check-radar.mts
import { buildRadar, shortLabel, labelAnchor, labelRoom, polar, cleanName } from "../lib/analytics/radar.ts";

let fails = 0;
const ok = (cond: boolean, msg: string) => { if (!cond) { fails++; console.error("FAIL", msg); } };
const mk = (n: number, att = 20, cor = 12) => Array.from({ length: n }, (_, i) => ({ subject: `Subject number ${i + 1}`, attempted: att, correct: cor }));

// counts 0..20
ok(buildRadar([]).mode === "empty", "no subjects -> empty");
ok(buildRadar(mk(1)).mode === "bars", "1 subject -> bars");
ok(buildRadar(mk(2)).mode === "bars", "2 subjects -> bars");
for (const n of [3, 4, 5, 6, 7, 8]) { const m = buildRadar(mk(n)); ok(m.mode === "radar" && m.axes.length === n, `${n} subjects -> radar with ${n} axes`); }
for (const n of [9, 10, 12, 15, 20]) {
  const m = buildRadar(mk(n));
  ok(m.axes.length === 8, `${n} subjects -> capped at 8 axes (got ${m.axes.length})`);
  const o = m.axes[m.axes.length - 1];
  ok(o.label === "Others" && o.merged?.length === n - 7, `${n} subjects -> "Others" merges ${n - 7} (got ${o.merged?.length})`);
  ok(o.attempted === (n - 7) * 20, `${n} subjects -> Others keeps the summed attempts`);
}
// custom cap
ok(buildRadar(mk(12), { maxAxes: 6 }).axes.length === 6, "maxAxes 6 respected");
ok(buildRadar(mk(12), { maxAxes: 2 }).axes.length === 3, "maxAxes never below 3");

// no-data subjects stay as hollow axes while under the cap; enough real data decides the mode
const mixed = [{ subject: "A", attempted: 10, correct: 5 }, { subject: "B", attempted: 0, correct: 0 }, { subject: "C", attempted: 8, correct: 8 }, { subject: "D", attempted: 0, correct: 0 }, { subject: "E", attempted: 9, correct: 1 }];
const mm = buildRadar(mixed);
ok(mm.mode === "radar" && mm.axes.length === 5, "5 subjects, 3 with data -> radar of 5");
ok(mm.axes[1].hasData === false && mm.axes[1].value === 0, "empty subject is hollow, value 0");
ok(buildRadar(mixed.slice(0, 2)).mode === "bars", "2 with data of 2 -> bars");
ok(buildRadar([{ subject: "A", attempted: 10, correct: 5 }, { subject: "B", attempted: 0, correct: 0 }, { subject: "C", attempted: 0, correct: 0 }]).mode === "bars", "3 subjects but 1 with data -> bars");

// reliability, weakest and average
const rel = buildRadar([{ subject: "A", attempted: 3, correct: 0 }, { subject: "B", attempted: 20, correct: 10 }, { subject: "C", attempted: 20, correct: 16 }, { subject: "D", attempted: 20, correct: 4 }]);
ok(rel.axes[0].reliable === false && rel.axes[1].reliable === true, "reliability flag follows minAttempts");
ok(rel.weakest?.label === "D", "weakest prefers reliable axes (D, not the 3-answer A)");
ok(rel.strongest?.label === "C", "strongest is C");
ok(rel.average === Math.round(((0 + 10 + 16 + 4) / 63) * 100), "average is weighted by attempts");

// duplicates and parentheses merge
const dup = buildRadar([{ subject: "Algorithms (CS)", attempted: 10, correct: 5 }, { subject: "Algorithms", attempted: 10, correct: 7 }, { subject: "B", attempted: 5, correct: 5 }, { subject: "C", attempted: 5, correct: 1 }]);
ok(dup.axes.length === 3 && dup.axes[0].attempted === 20 && dup.axes[0].value === 60, "duplicate names merge");

// labels
ok(shortLabel("Operating Systems") === "OS" && shortLabel("Computer Organization and Architecture") === "COA", "known abbreviations");
ok(shortLabel("Theory of Computation") === "TOC" && shortLabel("Databases") === "DBMS", "known abbreviations 2");
ok(shortLabel("Thermodynamics") === "Thermodyn…" || shortLabel("Thermodynamics").length <= 11, "long single word is clipped");
ok(shortLabel("Fluid Mechanics and Hydraulic Machines").length <= 4, "long multi-word -> initials");
ok(shortLabel("Mathematics") === "Mathematics", "short words stay whole");
ok(cleanName("Control Systems (EE)") === "Control Systems", "parentheses removed");

// geometry
for (const n of [3, 4, 5, 6, 7, 8]) {
  const anchors = Array.from({ length: n }, (_, i) => labelAnchor(i, n));
  ok(anchors[0] === "middle", `${n} axes: first label centred above`);
  ok(anchors.includes("start") && anchors.includes("end"), `${n} axes: labels go both left and right of the chart`);
  const [x, y] = polar(100, 100, 50, 0, n);
  ok(Math.abs(x - 100) < 1e-9 && Math.abs(y - 50) < 1e-9, `${n} axes: axis 0 points straight up`);
}
ok(labelRoom(buildRadar(mk(6)).axes) > 30, "label room is positive");

console.log(fails ? `${fails} radar check(s) FAILED` : "radar checks: all passed");
process.exitCode = fails ? 1 : 0;
