/** Same paper for everyone, different order per person: General Aptitude first, then Maths +
 *  Core CS mixed. Seeded by user + mock, so a reload or another device gives the same order.
 *  Grading is by question id, so order never affects scores or answers. */
export function mockOrder(ids: string[], userId: string, mockId: string, isGA: (id: string) => boolean): string[] {
  let h = 2166136261;
  for (const ch of `${userId}:${mockId}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const shuffle = (a: string[]) => {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  return [...shuffle(ids.filter(isGA)), ...shuffle(ids.filter((id) => !isGA(id)))];
}
