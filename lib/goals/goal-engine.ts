import type { TopicFrequency } from "@/lib/analytics/goal-slider-engine";
import { CURVE, TYPICAL_TOPPER_MARKS } from "../calibration.ts";

/**
 * Dynamic Exam Goals Engine (master plan 4E-2).
 *
 * Turns the profile's goal fields into behaviour instead of stored strings:
 *   target rank → marks needed → how much of the syllabus (by PYQ marks weight) the
 *   learner must cover at their accuracy → a recommended Focus Target % and topic set,
 *   plus an honest feasibility check against days left × daily hours.
 *
 * Pure: every input is passed in (ranked topics, accuracy, dates), nothing is read from
 * storage, so the same numbers can be recomputed on the profile, in the Focus Target
 * panel, and in scripts/check-goal-engine.mts (the acceptance test).
 *
 * The rank ↔ marks curve comes from lib/calibration.ts (GATE CS results, general
 * category, marks out of 100). It is shown to users as an estimate band, never a promise.
 */

/** (AIR, marks) anchors, best rank first. Interpolated on log(rank). Derived from real
 *  published GATE CS results (median across sources/years) in lib/calibration.ts — the
 *  top anchor is the typical topper score, not the 100 cap of a portal's table. */
const RANK_MARKS: [number, number][] = CURVE.map((c) => [c.rank, c.rank === 1 ? TYPICAL_TOPPER_MARKS : c.marks]);

export const DEFAULT_ACCURACY = 0.72; // typical accuracy on topics actually studied
export const MIN_ATTEMPTS_FOR_MEASURED_ACCURACY = 40;
export const HOURS_PER_TOPIC = 7; // learn + PYQ practice for one topic, on average
export const USABLE_TIME_SHARE = 0.85; // the rest goes to revision and full mocks
const SAFETY_MARGIN = 1.08; // negative marking, silly slips, a harder-than-usual paper
const QUESTIONS_PER_STUDY_HOUR = 8;

export function marksForRank(rank: number): number {
  const r = Math.max(1, rank);
  if (r <= RANK_MARKS[0][0]) return RANK_MARKS[0][1];
  for (let i = 1; i < RANK_MARKS.length; i++) {
    const [r1, m1] = RANK_MARKS[i - 1];
    const [r2, m2] = RANK_MARKS[i];
    if (r <= r2) {
      const t = (Math.log(r) - Math.log(r1)) / (Math.log(r2) - Math.log(r1));
      return Math.round((m1 + t * (m2 - m1)) * 10) / 10;
    }
  }
  return RANK_MARKS[RANK_MARKS.length - 1][1];
}

export function rankForMarks(marks: number): number {
  if (marks >= RANK_MARKS[0][1]) return 1;
  for (let i = 1; i < RANK_MARKS.length; i++) {
    const [r1, m1] = RANK_MARKS[i - 1];
    const [r2, m2] = RANK_MARKS[i];
    if (marks >= m2) {
      const t = (m1 - marks) / (m1 - m2);
      return Math.max(1, Math.round(Math.exp(Math.log(r1) + t * (Math.log(r2) - Math.log(r1)))));
    }
  }
  return RANK_MARKS[RANK_MARKS.length - 1][0];
}

/** Estimates shouldn't look more precise than they are: ~10s under 1,000, ~100s under
 *  10,000, ~1,000s above. */
export function friendlyRank(rank: number): number {
  const step = rank < 1000 ? 10 : rank < 10000 ? 100 : 1000;
  return Math.max(1, Math.round(rank / step) * step);
}

/** GATE is usually held over the first two weekends of February; default to the second
 *  Saturday of February in the target year when the learner hasn't set an exact date. */
export function defaultExamDate(year: number): string {
  const d = new Date(Date.UTC(year, 1, 1));
  const firstSat = (6 - d.getUTCDay() + 7) % 7 + 1;
  return `${year}-02-${String(firstSat + 7).padStart(2, "0")}`;
}

export interface GoalInputs {
  targetRank: number | null;
  examDate: string; // YYYY-MM-DD
  today: string; // YYYY-MM-DD
  dailyHours: number;
  measuredAccuracy: number | null; // 0-100, overall
  questionsAttempted: number;
}

export interface GoalPlan {
  hasTarget: boolean;
  requiredMarks: number;
  accuracyUsed: number; // 0-1
  accuracyIsMeasured: boolean;
  coverageNeeded: number; // % of PYQ marks weight
  recommendedPercent: number; // Focus Target syllabus %, 5-100
  includedTopics: TopicFrequency[];
  totalTopics: number;
  daysLeft: number;
  hoursNeeded: number;
  hoursAvailable: number;
  dailyQuestions: number;
  /** "on-track": time and accuracy both work. "time": not enough hours. "accuracy": even
   *  the full syllabus can't reach the target at the current accuracy. */
  status: "on-track" | "time" | "accuracy" | "no-target";
  /** Best rank reachable with the hours available (only when status is "time"). */
  achievableRank: number | null;
  /** Accuracy needed on the full syllabus (only when status is "accuracy"). */
  accuracyNeeded: number | null;
}

function daysBetween(from: string, to: string): number {
  const ms = new Date(to + "T00:00:00Z").getTime() - new Date(from + "T00:00:00Z").getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

/** Smallest prefix of the ranked topics whose cumulative marks share reaches `pct`. */
function topicsForCoverage(ranked: TopicFrequency[], pct: number): number {
  let acc = 0;
  for (let i = 0; i < ranked.length; i++) {
    acc += ranked[i].marksShare;
    if (acc >= pct - 1e-9) return i + 1;
  }
  return ranked.length;
}

function coverageOfTop(ranked: TopicFrequency[], n: number): number {
  return ranked.slice(0, n).reduce((s, t) => s + t.marksShare, 0);
}

export function computeGoalPlan(ranked: TopicFrequency[], input: GoalInputs): GoalPlan {
  const totalTopics = ranked.length;
  const daysLeft = daysBetween(input.today, input.examDate);
  const hoursAvailable = Math.round(daysLeft * Math.max(0, input.dailyHours) * USABLE_TIME_SHARE);
  const dailyQuestions = Math.max(5, Math.round(Math.max(0, input.dailyHours) * QUESTIONS_PER_STUDY_HOUR));

  const accuracyIsMeasured = input.measuredAccuracy !== null && input.questionsAttempted >= MIN_ATTEMPTS_FOR_MEASURED_ACCURACY;
  // Clamp measured accuracy to a sane band so one bad (or lucky) week doesn't swing the plan wildly.
  const accuracyUsed = accuracyIsMeasured
    ? Math.min(0.95, Math.max(0.4, (input.measuredAccuracy as number) / 100))
    : DEFAULT_ACCURACY;

  const base = {
    accuracyUsed, accuracyIsMeasured, totalTopics, daysLeft, hoursAvailable, dailyQuestions,
    achievableRank: null, accuracyNeeded: null,
  };

  if (!input.targetRank || input.targetRank < 1 || totalTopics === 0) {
    return {
      ...base, hasTarget: false, requiredMarks: 0, coverageNeeded: 100, recommendedPercent: 100,
      includedTopics: ranked, hoursNeeded: totalTopics * HOURS_PER_TOPIC, status: "no-target",
    };
  }

  const requiredMarks = marksForRank(input.targetRank);
  const coverageNeeded = (requiredMarks * SAFETY_MARGIN) / accuracyUsed; // % of marks weight

  if (coverageNeeded > 100) {
    return {
      ...base, hasTarget: true, requiredMarks, coverageNeeded: 100, recommendedPercent: 100,
      includedTopics: ranked, hoursNeeded: totalTopics * HOURS_PER_TOPIC, status: "accuracy",
      accuracyNeeded: Math.min(100, Math.ceil(requiredMarks * SAFETY_MARGIN)),
    };
  }

  const includedCount = Math.max(1, topicsForCoverage(ranked, coverageNeeded));
  const recommendedPercent = Math.min(100, Math.max(5, Math.ceil((includedCount / totalTopics) * 100)));
  const hoursNeeded = includedCount * HOURS_PER_TOPIC;

  if (hoursNeeded > hoursAvailable) {
    const affordable = Math.floor(hoursAvailable / HOURS_PER_TOPIC);
    const projectedMarks = (coverageOfTop(ranked, affordable) * accuracyUsed) / SAFETY_MARGIN;
    return {
      ...base, hasTarget: true, requiredMarks, coverageNeeded, recommendedPercent,
      includedTopics: ranked.slice(0, includedCount), hoursNeeded, status: "time",
      achievableRank: affordable > 0 ? friendlyRank(rankForMarks(projectedMarks)) : null,
    };
  }

  return {
    ...base, hasTarget: true, requiredMarks, coverageNeeded, recommendedPercent,
    includedTopics: ranked.slice(0, includedCount), hoursNeeded, status: "on-track",
  };
}
