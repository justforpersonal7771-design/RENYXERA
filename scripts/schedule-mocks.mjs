// Step 11 (5E): schedule the weekly All-India Mock.
//   node --env-file=.env.local scripts/schedule-mocks.mjs [weeks=4]
// Creates one mock per Sunday for the next N weeks (skips Sundays already scheduled).
// Timing mirrors the real exam: paper 10:00–13:00 IST, exactly 180 minutes. If something
// goes wrong at 10:00 (server trouble, a slow network), starts are accepted until 10:30;
// every attempt still gets exactly 180 minutes, so the hard close is 13:30. Results 13:45. Each paper follows the GATE CS pattern and avoids questions used in
// recent mocks. Needs SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";

// One-off test mock at any time, same paper rules and timing (not numbered):
//   node --env-file=.env.local scripts/schedule-mocks.mjs --at=2026-09-27T13:00+05:30 --title="Test Mock"
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const AT = arg("at");
// Multi-branch: --branch=ECE schedules that branch's mocks (default CSE).
const BRANCH = (arg("branch") ?? "CSE").toUpperCase();
const TITLE = arg("title");
if (AT && Number.isNaN(Date.parse(AT))) throw new Error(`--at is not a valid date: ${AT}`);
const WEEKS = Math.max(1, Math.min(12, Number(process.argv[2]) || 4));
const SECONDS_PER_MARK = 108;
// GATE CS: GA 10 Q (5×1 + 5×2 = 15), technical 55 Q (25×1 + 30×2 = 85) ≈ 13 maths + 72 core.
// Every paper has the same shape (GA 10 Q, ~13 maths marks, core the rest); only the section
// names differ. `kind` groups sections: GA / MATH / CORE.
const MATH_SECTION = { CSE: "MATHEMATICAL FOUNDATIONS", ECE: "SECTION 1: ENGINEERING MATHEMATICS", EE: "SECTION 1: ENGINEERING MATHEMATICS", DA: "SECTION 2: LINEAR ALGEBRA" };
if (!MATH_SECTION[BRANCH]) throw new Error(`no mock blueprint for ${BRANCH}`);
const kindOf = (section) => section === "GENERAL APTITUDE (GA)" ? "GA" : section === MATH_SECTION[BRANCH] ? "MATH" : "CORE";
const BLUEPRINT = [
  { kind: "GA", marks: 1, count: 5 },
  { kind: "GA", marks: 2, count: 5 },
  { kind: "MATH", marks: 1, count: 5 },
  { kind: "MATH", marks: 2, count: 4 },
  { kind: "CORE", marks: 1, count: 20 },
  { kind: "CORE", marks: 2, count: 26 },
];

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function allQuestions() {
  const out = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await db.from("questions").select("id, section, marks, subject").eq("branch_code", BRANCH).range(f, f + 999);
    if (error) throw error;
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Pick `count` questions spreading across subjects (round-robin by subject). */
function pickSpread(pool, count) {
  const bySubject = new Map();
  for (const q of shuffle([...pool])) {
    if (!bySubject.has(q.subject)) bySubject.set(q.subject, []);
    bySubject.get(q.subject).push(q);
  }
  const lists = shuffle([...bySubject.values()]);
  const out = [];
  while (out.length < count && lists.some((l) => l.length)) {
    for (const l of lists) { if (l.length && out.length < count) out.push(l.shift()); }
  }
  return out;
}

/** Sundays 10:00 IST (= 04:30 UTC) for the next `n` weeks. */
function nextSundays(n) {
  const days = [];
  const d = new Date();
  d.setUTCHours(4, 30, 0, 0);
  while (days.length < n) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() === 0) days.push(new Date(d));
  }
  return days;
}

const questions = await allQuestions();
const { data: existing } = await db.from("mock_events").select("starts_at, question_ids").eq("branch_code", BRANCH).order("starts_at", { ascending: false }).limit(20);
const scheduled = new Set((existing ?? []).map((m) => new Date(m.starts_at).toISOString()));
const recentlyUsed = new Set((existing ?? []).slice(0, 8).flatMap((m) => m.question_ids));
const { count: total } = await db.from("mock_events").select("id", { count: "exact", head: true }).eq("branch_code", BRANCH);
let n = (total ?? 0);

for (const start of AT ? [new Date(AT)] : nextSundays(WEEKS)) {
  if (scheduled.has(start.toISOString())) { console.log("already scheduled:", start.toISOString()); continue; }
  const paper = [];
  for (const b of BLUEPRINT) {
    let pool = questions.filter((q) => kindOf(q.section) === b.kind && Number(q.marks) === b.marks && !recentlyUsed.has(q.id));
    if (pool.length < b.count) pool = questions.filter((q) => kindOf(q.section) === b.kind && Number(q.marks) === b.marks); // bank exhausted → allow repeats
    const picked = pickSpread(pool, b.count);
    picked.forEach((q) => recentlyUsed.add(q.id));
    paper.push(...picked);
  }
  const marks = paper.reduce((s, q) => s + Number(q.marks), 0);
  if (!TITLE) n += 1;
  const GRACE_MIN = 30;
  const DURATION = 180 * 60;
  const ends = new Date(start.getTime() + (GRACE_MIN * 60 + DURATION) * 1000); // 13:30 hard close
  const results = new Date(ends.getTime() + 15 * 60_000); // 13:45
  const label = start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const { error } = await db.from("mock_events").insert({
    title: TITLE ?? `All-India Mock #${n} — ${label}`,
    branch_code: BRANCH,
    starts_at: start.toISOString(),
    ends_at: ends.toISOString(),
    results_at: results.toISOString(),
    question_ids: paper.map((q) => q.id),
    duration_seconds: Math.min(DURATION, marks * SECONDS_PER_MARK),
    start_grace_minutes: GRACE_MIN,
  });
  if (error) throw error;
  console.log(`scheduled #${n}: ${label} · ${paper.length} questions · ${marks} marks`);
}
