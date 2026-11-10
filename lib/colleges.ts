/**
 * Indian colleges and universities for the profile's College picker: about 69,000 institutions from the Government of India's AISHE
 * directory (public data), as one text file (public/data/colleges.txt: "#State", "@District", then one name per line), fetched only when
 * the picker mounts. The picker filters State, then District, then College. The saved value is "Name, District, State" so students of one
 * college match exactly; anything missing is added with "Other college" and remembered on this device.
 */
export type CollegeRow = { name: string; state: string; district: string; value: string };
export type CollegeData = { rows: CollegeRow[]; states: string[]; districts: Map<string, string[]> };

let cache: CollegeData | null = null;
let pending: Promise<CollegeData> | null = null;
const EMPTY: CollegeData = { rows: [], states: [], districts: new Map() };

export function loadColleges(): Promise<CollegeData> {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch("/data/colleges.txt")
    .then((r) => (r.ok ? r.text() : ""))
    .then((txt) => {
      const rows: CollegeRow[] = [];
      const districts = new Map<string, string[]>();
      let state = "", district = "";
      for (const line of txt.split("\n")) {
        if (!line) continue;
        if (line[0] === "#") { state = line.slice(1); districts.set(state, []); }
        else if (line[0] === "@") { district = line.slice(1); districts.get(state)?.push(district); }
        else rows.push({ name: line, state, district, value: `${line}, ${district}, ${state}` });
      }
      if (!rows.length) { pending = null; return EMPTY; }
      cache = { rows, states: [...districts.keys()], districts };
      return cache;
    })
    .catch(() => { pending = null; return EMPTY; });
  return pending;
}

/** "Name, District, State" → its State and District (empty when it is a custom entry). */
export function partsOf(value: string, data: CollegeData): { state: string; district: string } {
  const parts = value.split(", ");
  if (parts.length < 3) return { state: "", district: "" };
  const state = parts[parts.length - 1], district = parts[parts.length - 2];
  return data.districts.get(state)?.includes(district) ? { state, district } : { state: "", district: "" };
}

const KEY = "renyxera.customColleges";
export function customColleges(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]; } catch { return []; }
}
export function rememberCustomCollege(v: string) {
  try { localStorage.setItem(KEY, JSON.stringify([v, ...customColleges().filter((x) => x !== v)].slice(0, 20))); } catch { /* storage unavailable */ }
}
