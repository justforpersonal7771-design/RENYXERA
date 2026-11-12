import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { generateJson } from "@/lib/ai/llm";
import { GEMINI_MODEL, GEMINI_LITE_MODEL } from "@/lib/ai/gemini";

export const runtime = "nodejs";
const NO = { "Cache-Control": "private, no-store" };

const SYSTEM = `You are an interview tutor for a software engineer preparing for jobs in .NET, SQL Server, Azure, React and TypeScript, data structures and algorithms, system design and applied AI. Be exact and practical. Teach the way a strong senior engineer would in a mock interview: short, concrete, with a tiny example when it helps, and say what an interviewer is really testing. Never invent facts; if unsure, say so. Reply ONLY as JSON: {"reply": "<markdown text>"} unless the task names another shape.`;

type Hist = { role: "user" | "tutor"; text: string };
const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);

export async function POST(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const b = (await req.json().catch(() => null)) as { mode?: string; text?: string; context?: string; title?: string; history?: Hist[]; track?: string; cardId?: string; answer?: string } | null;
  if (!b?.mode) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const db = createServiceRoleClient();
  const history = (b.history ?? []).slice(-8).map((h) => `${h.role === "user" ? "Student" : "Tutor"}: ${clip(h.text, 1500)}`).join("\n");
  const ctx = b.context ? `\n\nSource material (${clip(b.title, 120)}):\n${clip(b.context, 6000)}` : "";
  const sel = b.text ? `\n\nThe student selected: """${clip(b.text, 2500)}"""` : "";

  try {
    // Mock interviewer, step 1: the server picks a real question from the bank (not the model).
    if (b.mode === "mock_next") {
      let q = db.from("interview_cards").select("id,book,book_title,ch,front").in("type", ["Question", "Scenario"]).limit(3000);
      if (b.track) q = q.in("book", b.track.split(",").slice(0, 12));
      const { data } = await q;
      if (!data?.length) return NextResponse.json({ error: "No questions for that track yet." }, { status: 404 });
      const c = data[Math.floor(Math.random() * data.length)];
      return NextResponse.json({ card: { id: c.id, book: c.book, bookTitle: c.book_title, ch: c.ch, question: c.front } }, { headers: NO });
    }
    // Mock interviewer, step 2: score the answer against the book's own model answer.
    if (b.mode === "mock_score") {
      const { data: card } = await db.from("interview_cards").select("id,book,front,back,more").eq("id", String(b.cardId ?? "")).maybeSingle();
      if (!card) return NextResponse.json({ error: "Question not found." }, { status: 404 });
      const prompt = `Interview question: ${card.front}\n\nModel answer from the book:\n${clip(card.back + "\n" + card.more, 3000)}\n\nStudent's answer:\n"""${clip(b.answer, 3000)}"""\n\nScore the student's answer from 0 to 10 against the model answer (10 = complete and correct, 5 = partly right, 0 = wrong or empty). Reply ONLY as JSON: {"score": <integer 0-10>, "verdict": "<one short sentence>", "good": ["<what was right>"], "missing": ["<what was missing or wrong>"], "better": "<a tight model answer in 2-4 sentences>"}`;
      const raw = await generateJson({ geminiModel: GEMINI_MODEL, systemInstruction: SYSTEM, prompt, maxOutputTokens: 900 });
      const j = JSON.parse(raw) as { score?: number; verdict?: string; good?: string[]; missing?: string[]; better?: string };
      const score = Math.max(0, Math.min(10, Math.round(Number(j.score ?? 0))));
      await db.from("interview_attempts").insert({ user_id: userId, item_kind: "mock", item_id: card.id, ok: score >= 6, detail: { score, q: clip(card.front, 200), note: clip(j.verdict, 200), missing: (j.missing ?? []).slice(0, 4) } });
      return NextResponse.json({ score, verdict: j.verdict ?? "", good: j.good ?? [], missing: j.missing ?? [], better: j.better ?? "" }, { headers: NO });
    }

    const TASK: Record<string, string> = {
      explain: "Explain this clearly for an interview: the idea, why it matters, one tiny example, and the usual follow-up question.",
      simplify: "Explain this in the simplest words, like to a smart beginner, then give the one-line interview version.",
      quiz: "Ask exactly ONE interview-style question on this, then stop. Do not give the answer.",
      answer: "Write the strongest spoken interview answer to this (about 30 to 45 seconds when read aloud), then list two follow-up questions the interviewer may ask.",
      review: "Review this code or answer like an interviewer. List correctness problems first, then complexity, then style. Give the corrected version.",
      chat: "Continue the conversation helpfully.",
    };
    const task = TASK[b.mode] ?? TASK.chat;
    const prompt = `${task}${ctx}${sel}${history ? `\n\nConversation so far:\n${history}` : ""}\n\nStudent now says: ${clip(b.answer ?? b.text ?? "Go ahead.", 2500)}\n\nReply ONLY as JSON: {"reply": "<markdown>"}`;
    // quick modes use the fast model list (OpenRouter free fast models first, then Gemini Flash-Lite); code review and spoken answers use the stronger one
    const raw = await generateJson({ geminiModel: b.mode === "review" || b.mode === "answer" ? GEMINI_MODEL : GEMINI_LITE_MODEL, systemInstruction: SYSTEM, prompt, maxOutputTokens: 1400 });
    const j = JSON.parse(raw) as { reply?: string };
    return NextResponse.json({ reply: String(j.reply ?? "").slice(0, 8000) }, { headers: NO });
  } catch { return NextResponse.json({ error: "The tutor could not answer just now. Try again in a moment." }, { status: 502 }); }
}
