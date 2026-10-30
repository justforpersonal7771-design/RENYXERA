// Builds video/src/reel-top5.json for the "5 CS topics that give the most marks" reel from OUR measured data
// (data/forge/CS/profile.json: marks per paper and years asked, over the official papers). Real numbers only.
//   node video/scripts/make-reel-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

const profile = JSON.parse(readFileSync(new URL("../../data/forge/CS/profile.json", import.meta.url), "utf8"));
// Short on-screen names and one honest tagline per topic (matched by the start of the topic name).
const COPY = [
  ["Memory Hierarchy", "Cache mapping", "Direct and set-associative caches, hits and misses"],
  ["Lexical Analysis", "Parsing: LL, LR, LALR", "FIRST/FOLLOW sets, parse tables, conflicts"],
  ["Functions, Parameter", "C: functions and recursion", "Scope, parameter passing, tracing recursive calls"],
  ["Regular Expressions & Finite", "DFA and NFA", "Minimal DFAs, conversions, regular expressions"],
  ["Regular and Context-Free", "Regular and context-free languages", "Closure, pumping lemma, grammars"],
];
const top = [...profile.topics].sort((a, b) => b.marks_per_paper - a.marks_per_paper).slice(0, 5);
const items = top.map((t, i) => {
  const c = COPY.find(([k]) => t.topic.startsWith(k));
  if (!c) throw new Error(`Add on-screen copy for: ${t.topic}`);
  return { rank: i + 1, name: c[1], tagline: c[2], subject: t.subject.replace(/\s*\(.*\)$/, ""), marksPerPaper: Math.round(t.marks_per_paper * 100) / 100, yearsAsked: t.years_asked };
});
const years = profile.years;
const out = {
  papers: profile.papers, yearFrom: years[0], yearTo: years[years.length - 1], yearsCount: years.length,
  totalMarks: Math.round(items.reduce((s, i) => s + i.marksPerPaper, 0) * 10) / 10,
  items,
};
writeFileSync(new URL("../src/reel-top5.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
