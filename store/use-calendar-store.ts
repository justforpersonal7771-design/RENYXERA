import { create } from "zustand";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { CalendarEvent } from "@/types/calendar.types";
import { useAuthStore } from "@/store/use-auth-store";

// Planner blocks (ids start with "plan-") may have a Telegram reminder; keep it in step with the calendar.
const isPlanBlock = (id: string) => id.startsWith("plan-");
const tgSync = (url: string, method: string, body: unknown) => {
  if (!useAuthStore.getState().user) return;
  void fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true }).catch(() => null);
};

interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  loaded: boolean;
  loadEvents: () => Promise<void>;
  addEvent: (event: CalendarEvent) => Promise<void>;
  addEvents: (events: CalendarEvent[]) => Promise<void>;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  reorderEvents: (draggedId: string, targetId: string) => Promise<void>;
}

// Calendar events are still persisted as a single JSON blob under the
// Metadata store (see IDBManager.getCalendarEvents/saveCalendarEvents) — this
// store exists so every screen that reads/writes calendar data (the Topbar
// quick panel, the full /calendar planner) shares one live, reactive copy
// instead of each doing its own out-of-sync IDB round trip.
export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  loading: false,
  loaded: false,

  loadEvents: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const data = await IDBManager.getCalendarEvents();
      // Migrate older events saved before the Study Schedule Engine fields existed.
      const migrated: CalendarEvent[] = data.map((e: any) => ({
        ...e,
        studyType: e.studyType || "Study",
        revisionCycle: e.revisionCycle || "One Time",
        status: e.status || (e.completed ? "Completed" : "Pending"),
        timeRangeType: e.timeRangeType || "start_time",
        startTime: e.startTime || e.time || "10:00",
      }));
      set({ events: migrated, loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  addEvent: async (event) => {
    const updated = [...get().events, event];
    set({ events: updated });
    await IDBManager.saveCalendarEvents(updated);
  },

  addEvents: async (events) => {
    const updated = [...get().events, ...events];
    set({ events: updated });
    await IDBManager.saveCalendarEvents(updated);
  },

  updateEvent: async (id, patch) => {
    const updated = get().events.map(e => (e.id === id ? { ...e, ...patch } : e));
    set({ events: updated });
    await IDBManager.saveCalendarEvents(updated);
    if (isPlanBlock(id) && patch.completed !== undefined) tgSync("/api/telegram/event-done", "POST", { eventId: id, done: patch.completed });
    // A block that moved gets a fresh reminder at its new time (and the old one is dropped).
    const moved = updated.find((e) => e.id === id);
    if (moved && isPlanBlock(id) && !moved.completed && (patch.date !== undefined || patch.startTime !== undefined) && useAuthStore.getState().user) {
      void fetch("/api/telegram/reminders", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventIds: [id] }), keepalive: true })
        .then(() => import("@/lib/planner/apply").then((m) => m.scheduleTelegramBlocks([moved], 10, false))).catch(() => null);
    }
  },

  deleteEvent: async (id) => {
    const updated = get().events.filter(e => e.id !== id);
    set({ events: updated });
    await IDBManager.saveCalendarEvents(updated);
    if (isPlanBlock(id)) tgSync("/api/telegram/reminders", "DELETE", { eventIds: [id] });
  },

  reorderEvents: async (draggedId, targetId) => {
    if (draggedId === targetId) return;
    const events = [...get().events];
    const fromIdx = events.findIndex(e => e.id === draggedId);
    const toIdx = events.findIndex(e => e.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = events.splice(fromIdx, 1);
    events.splice(toIdx, 0, moved);
    set({ events });
    await IDBManager.saveCalendarEvents(events);
  },
}));
