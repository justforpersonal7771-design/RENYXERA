// Gentle, rule-based Plus/Pro prompts. Never during a test, never for paid accounts, at most one
// prompt every 3 days and 6 in total, each trigger once, and two "Not now" taps silence it for
// 14 days. State lives only in this browser (localStorage).
import { PLANS, formatPrice } from "@/lib/billing/plans";

const KEY = "renyxera:upsell";
const DAY = 864e5;
const GAP = 3 * DAY;
const SNOOZE = 14 * DAY;
const MAX_TOTAL = 6;

type State = { tests: number; visits: Record<string, number>; fired: string[]; shown: number; last: number; dismissals: number; snoozeUntil: number };
const fresh = (): State => ({ tests: 0, visits: {}, fired: [], shown: 0, last: 0, dismissals: 0, snoozeUntil: 0 });

function read(): State {
  try { return { ...fresh(), ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<State>) }; } catch { return fresh(); }
}
function write(s: State) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked */ } }

export type UpsellContext = "results" | "mistakes" | "analytics";
export type Upsell = { id: string; title: string; body: string };

export function noteTestCompleted() { const s = read(); s.tests++; write(s); }
export function noteVisit(page: string) { const s = read(); s.visits[page] = (s.visits[page] ?? 0) + 1; write(s); }

const plus = PLANS.find((p) => p.id === "plus_monthly");

export function pickUpsell(ctx: UpsellContext, pendingMistakes = 0, now = Date.now()): Upsell | null {
  const s = read();
  if (s.shown >= MAX_TOTAL || now < s.snoozeUntil || now - s.last < GAP) return null;
  const fresh1 = (id: string) => !s.fired.includes(id);
  if (ctx === "results") {
    if (s.tests >= 10 && fresh1("tests_10")) return { id: "tests_10", title: "10 tests done", body: `If the AI Mentor has been useful, Plus (${formatPrice(plus?.pricePaise ?? null)}/month) keeps it available every day.` };
    if (s.tests >= 5 && fresh1("tests_5")) return { id: "tests_5", title: "5 tests done", body: "Pro adds deep analytics: topic ladders and difficulty analysis, to see where marks leak." };
    if (s.tests >= 2 && fresh1("tests_2")) return { id: "tests_2", title: "2 tests done", body: "Plus gives the AI Mentor 75 requests a day, enough to explain every mistake. Practice stays free." };
  }
  if (ctx === "mistakes" && pendingMistakes >= 10 && fresh1("mistakes_10")) return { id: "mistakes_10", title: `${pendingMistakes} mistakes waiting`, body: "Plus lets the AI Mentor explain them quickly (75 requests a day). Re-solving them yourself stays free." };
  if (ctx === "analytics" && (s.visits.analytics ?? 0) >= 3 && fresh1("analytics_3")) return { id: "analytics_3", title: "Digging into your analytics?", body: "Pro adds detailed topic ladders and difficulty analysis." };
  return null;
}

export function markShown(id: string, now = Date.now()) { const s = read(); if (!s.fired.includes(id)) s.fired.push(id); s.shown++; s.last = now; write(s); }
export function dismissUpsell(now = Date.now()) {
  const s = read(); s.dismissals++;
  if (s.dismissals >= 2) { s.snoozeUntil = now + SNOOZE; s.dismissals = 0; }
  write(s);
}
export function acceptUpsell(now = Date.now()) { const s = read(); s.snoozeUntil = now + 7 * DAY; write(s); }
