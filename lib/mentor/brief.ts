/** AI Mentor: the learner brief (real data only) and the number post-check. Pure functions, no I/O. */
export interface BriefInput {
  firstName: string; targetYear: number | null; daysToExam: number | null;
  accuracy: number | null; attempted: number;
  subjects: { subject: string; accuracy: number; attempted: number }[];
  weakTopics: { subject: string; topic: string; score: number }[];
  openMistakes: number; mistakeSamples: { id: string; subject: string; topic: string; times: number }[];
  testsTaken: number; lastTest: { when: string; marks?: number; max?: number; answered: number; total: number } | null;
  plannerDone: number | null; eventsNext7: number; burnout: string | null;
  readiness: { marks: number; rank: number; rating: string } | null;
  notes: string[];
}

export function buildBrief(i: BriefInput): string {
  const L: string[] = [];
  L.push(`Student: ${i.firstName || "the student"}. Target: GATE ${i.targetYear ?? "unknown"}${i.daysToExam != null ? `, ${i.daysToExam} days to go` : ""}.`);
  L.push(i.attempted > 0 ? `Overall: ${i.attempted} questions attempted, ${i.accuracy}% accuracy.` : "No questions attempted yet: say so and suggest a short test.");
  if (i.subjects.length) L.push("Subjects (accuracy, attempted): " + i.subjects.map((s) => `${s.subject} ${s.accuracy}% (${s.attempted})`).join("; "));
  if (i.weakTopics.length) L.push("Weakest topics (mastery score out of 100): " + i.weakTopics.map((t) => `${t.topic} [${t.subject}] ${t.score}`).join("; "));
  L.push(`Open mistakes: ${i.openMistakes}.`);
  if (i.mistakeSamples.length) L.push("Mistake questions you may reference by id: " + i.mistakeSamples.map((m) => `${m.id} (${m.topic}, missed ${m.times}x)`).join("; "));
  L.push(`Tests taken: ${i.testsTaken}.`);
  if (i.lastTest) L.push(`Last test on ${i.lastTest.when}: answered ${i.lastTest.answered} of ${i.lastTest.total}${i.lastTest.marks != null ? `, scored ${i.lastTest.marks} of ${i.lastTest.max}` : ""}.`);
  if (i.plannerDone != null) L.push(`Planner completion: ${i.plannerDone}%. Calendar events in the next 7 days: ${i.eventsNext7}.`);
  if (i.burnout) L.push(`Burnout risk: ${i.burnout}.`);
  if (i.readiness) L.push(`Readiness estimate: about ${i.readiness.marks} marks of 100, expected rank about ${i.readiness.rank}, rating ${i.readiness.rating}. This is an estimate, say so.`);
  if (i.notes.length) L.push("Things the student told the Mentor: " + i.notes.join(" | "));
  return L.join("\n");
}

const numsOf = (t: string) => (t.replace(/,/g, "").match(/\d+(?:\.\d+)?/g) ?? []);
/** Numbers in the reply that appear nowhere in the brief or the conversation. Small ones (10 or less) are ignored. */
export function unverifiedNumbers(reply: string, ...sources: string[]): string[] {
  const known = new Set(sources.flatMap(numsOf));
  return [...new Set(numsOf(reply))].filter((n) => !known.has(n) && Number(n) > 10);
}

export interface PlanItem { title: string; reason?: string; subject?: string; topic?: string; studyType?: string; minutes?: number; daysFromToday?: number }
export type MentorCard =
  | { type: "plan"; title?: string; items: PlanItem[] }
  | { type: "practice"; title?: string; subject?: string; topic?: string }
  | { type: "lesson"; title?: string; subject?: string; topic?: string }
  | { type: "question"; questionId: string };
export interface MentorReply { reply: string; cards: MentorCard[]; followUps: string[] }

export function parseReply(raw: unknown): MentorReply {
  const o = (typeof raw === "object" && raw ? raw : {}) as Record<string, unknown>;
  const cards = (Array.isArray(o.cards) ? o.cards : []).filter((c: any) => c && ["plan", "practice", "lesson", "question"].includes(c.type)).slice(0, 2) as MentorCard[];
  return { reply: String(o.reply ?? "").slice(0, 2500), cards, followUps: (Array.isArray(o.followUps) ? o.followUps : []).map(String).slice(0, 3) };
}
