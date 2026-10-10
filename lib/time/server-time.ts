// The device clock is user-controlled, so anything time-based in the UI (exam timers, mock embargoes,
// plan expiry, daily goals) reads `serverNow()` instead of Date.now(). The real authority is still the
// server and database (attempt start/finish, results embargo, entitlements all use server time);
// this keeps what the user *sees* honest too, and stops rolling the clock back to gain time offline.

let offsetMs = 0;
let synced = false;
let lastReturned = 0;
const FLOOR_KEY = "renyxera.time-floor";

/** Estimated true time in ms. Never goes backwards, even if the device clock is wound back. */
export function serverNow(): number {
  let floor = lastReturned;
  if (!lastReturned && typeof localStorage !== "undefined") {
    try { floor = Number(localStorage.getItem(FLOOR_KEY)) || 0; } catch { /* storage unavailable */ }
  }
  const t = Math.max(Date.now() + offsetMs, floor);
  lastReturned = t;
  return t;
}

export const serverDate = () => new Date(serverNow());
export const isTimeSynced = () => synced;

/** Local YYYY-MM-DD for the true current day. */
export function serverDayKey(d = serverDate()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Fetch the server time and compute the device offset (half the round trip is assumed one-way). */
export async function syncServerTime(): Promise<void> {
  try {
    const t0 = Date.now();
    const res = await fetch(`/api/time?_=${t0}`, { cache: "no-store" });
    if (!res.ok) return;
    const { now } = (await res.json()) as { now: number };
    const t1 = Date.now();
    if (typeof now !== "number") return;
    offsetMs = now + (t1 - t0) / 2 - t1;
    synced = true;
    lastReturned = Math.max(lastReturned, now);
    try { localStorage.setItem(FLOOR_KEY, String(lastReturned)); } catch { /* ignore */ }
  } catch { /* offline: keep the last offset and the never-backwards floor */ }
}

/** Keep the offset fresh: on load, when the tab becomes visible, and hourly. Returns a cleanup. */
export function startTimeSync(): () => void {
  void syncServerTime();
  const onVis = () => { if (document.visibilityState === "visible") void syncServerTime(); };
  document.addEventListener("visibilitychange", onVis);
  const t = setInterval(() => void syncServerTime(), 60 * 60_000);
  return () => { document.removeEventListener("visibilitychange", onVis); clearInterval(t); };
}
