"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useCalendarStore } from "@/store/use-calendar-store";

const nextDay = (d: string) => { const t = new Date(`${d}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); };

/**
 * Applies what the member did in Telegram (marked a block done, rolled unfinished blocks to tomorrow) to the calendar on
 * this device, then tells the server it has been applied. Runs when the app opens and whenever the tab comes back.
 */
export function TelegramActionsSync() {
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    const run = async () => {
      try {
        const r = await fetch("/api/telegram/actions", { cache: "no-store" });
        if (!r.ok) return;
        const { actions } = (await r.json()) as { actions: { id: number; kind: "done" | "roll"; event_id: string }[] };
        if (!alive || !actions.length) return;
        const cal = useCalendarStore.getState();
        if (!cal.loaded) await cal.loadEvents();
        for (const a of actions) {
          const ev = useCalendarStore.getState().events.find((e) => e.id === a.event_id);
          if (!ev) continue;
          if (a.kind === "done") await cal.updateEvent(ev.id, { completed: true, status: "Completed" });
          else if (!ev.completed) await cal.updateEvent(ev.id, { date: nextDay(ev.date) });
        }
        await fetch("/api/telegram/actions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: actions.map((a) => a.id) }) });
      } catch { /* try again next time */ }
    };
    void run();
    const onVis = () => { if (document.visibilityState === "visible") void run(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { alive = false; document.removeEventListener("visibilitychange", onVis); };
  }, [user]);
  return null;
}
