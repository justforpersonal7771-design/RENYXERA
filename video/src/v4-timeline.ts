// Timeline of film v4, derived from the real length of every voice line, so nothing overlaps and every scene is as long as
// its words need. All values are frames at 30 fps; scene lengths are rounded up to whole beats (15 frames = 120 BPM).
import vo from "./v4-vo.json";

export const FPS = 30;
export const BEAT = 15;
export type VoId = keyof typeof vo;
type Spec = { id: string; voices: VoId[]; head: number; gap?: number; tail: number; min?: number };

export const SPECS: Spec[] = [
  { id: "night", voices: ["p1", "p2"], head: 12, gap: 10, tail: 8 },
  { id: "wrong", voices: ["p3", "p4"], head: 16, gap: 22, tail: 12 },
  { id: "cost", voices: ["p5", "p6", "p7"], head: 6, gap: 8, tail: 12 },
  { id: "bridge", voices: ["b1", "b2"], head: 8, gap: 8, tail: 8 },
  { id: "reveal", voices: ["r1", "r2"], head: 20, gap: 6, tail: 12 },
  { id: "dash", voices: ["a1"], head: 10, tail: 20, min: 105 },
  { id: "tutor", voices: ["a2", "a3"], head: 8, gap: 24, tail: 60, min: 300 },
  { id: "mentor", voices: ["a4"], head: 10, tail: 26, min: 195 },
  { id: "mistakes", voices: ["a5"], head: 10, tail: 20, min: 135 },
  { id: "practice", voices: ["a6"], head: 10, tail: 30, min: 180 },
  { id: "analytics", voices: ["a7"], head: 10, tail: 30, min: 105 },
  { id: "challenge", voices: ["a8"], head: 10, tail: 14, min: 105 },
  { id: "plan", voices: ["a9"], head: 10, tail: 36, min: 165 },
  { id: "profile", voices: ["a10"], head: 8, tail: 24, min: 75 },
  { id: "plans", voices: ["m1", "m2"], head: 10, gap: 10, tail: 22, min: 180 },
  { id: "pitch", voices: ["c1", "c2"], head: 10, gap: 14, tail: 30, min: 255 },
  { id: "end", voices: ["c3", "c4"], head: 14, gap: 24, tail: 54, min: 195 },
];

export type Placed = { id: string; at: number; dur: number; voice: { id: VoId; at: number; len: number }[] };
const vf = (id: VoId) => Math.ceil(vo[id].dur * FPS);

export function timeline() {
  let at = 0;
  const scenes: Placed[] = [];
  for (const s of SPECS) {
    let t = s.head;
    const voice = s.voices.map((id, i) => { const v = { id, at: t, len: vf(id) }; t += v.len + (i < s.voices.length - 1 ? s.gap ?? 14 : 0); return v; });
    const dur = Math.ceil(Math.max(s.min ?? 0, t + s.tail) / BEAT) * BEAT;
    scenes.push({ id: s.id, at, dur, voice });
    at += dur;
  }
  const get = (id: string) => scenes.find((x) => x.id === id)!;
  const markers = {
    bridge: get("bridge").at,
    reveal: get("reveal").at + get("reveal").voice[0].at - 2,
    close: get("end").at + get("end").voice[0].at,
    logo: get("end").at + get("end").voice[1].at - 2,
  };
  return { scenes, total: at, markers };
}
