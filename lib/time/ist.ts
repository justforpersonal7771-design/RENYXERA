/**
 * India Standard Time is the app's only time zone (Asia/Kolkata, UTC+5:30, no daylight saving).
 * Every "today", greeting hour and shown date or time is computed here, never from the device's or the server's own zone,
 * so a student abroad, a server in UTC and a phone with a wrong zone all agree (and the page renders identically on both sides).
 */
export const IST = "Asia/Kolkata";

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export function istParts(d: Date = new Date()): { y: string; m: string; d: string; hour: number; minute: number } {
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(d)) p[x.type] = x.value;
  return { y: p.year, m: p.month, d: p.day, hour: Number(p.hour), minute: Number(p.minute) };
}
/** YYYY-MM-DD of this moment in IST. */
export const istDateStr = (d: Date = new Date()) => { const p = istParts(d); return `${p.y}-${p.m}-${p.d}`; };
/** 0 to 23, the hour in IST. */
export const istHour = (d: Date = new Date()) => istParts(d).hour;
/** Minutes since midnight in IST. */
export const istMinutes = (d: Date = new Date()) => { const p = istParts(d); return p.hour * 60 + p.minute; };
/** "HH:MM" (24 hour) in IST. */
export const istTime = (d: Date = new Date()) => { const p = istParts(d); return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`; };
