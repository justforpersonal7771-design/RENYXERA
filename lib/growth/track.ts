// Minimal anonymous product events (docs/GROWTH_TASKS.md G-3). Fire-and-forget: never blocks,
// never throws, sends nothing but a random per-browser id, the event name, branch and first-touch
// source. "visit" is sent at most once per browser per day (for D1/D7 return rates).
export type TrackEvent = "visit" | "test_started" | "test_submitted" | "review_opened" | "ai_used" | "invite_shared" | "share_clicked" | "telegram_join";

const ID = "renyxera:anon";
const DAY = "renyxera:visit-day";

function anonId(): string | null {
  try {
    let id = localStorage.getItem(ID);
    if (!id) { id = crypto.randomUUID().replace(/-/g, "").slice(0, 24); localStorage.setItem(ID, id); }
    return id;
  } catch { return null; }
}

export function track(event: TrackEvent, branch?: string | null, detail?: string) {
  try {
    const anon = anonId();
    if (!anon) return;
    if (event === "visit") {
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem(DAY) === today) return;
      localStorage.setItem(DAY, today);
    }
    let source: string | null = null;
    try { source = JSON.parse(localStorage.getItem("renyxera:acq") ?? "null")?.source ?? null; } catch {}
    const body = JSON.stringify({ anon, event, branch: branch ?? null, source: event === "telegram_join" && detail ? `tg:${detail}` : source });
    if (navigator.sendBeacon?.("/api/events", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch { /* never break the app for analytics */ }
}
