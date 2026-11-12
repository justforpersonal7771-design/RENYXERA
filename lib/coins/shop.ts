/** Coin shop catalogue (shared by the API and the screen). Prices in coins; frames are cosmetic rings around your avatar. */
export type ShopItem = { id: string; kind: "mentor" | "frame"; name: string; blurb: string; cost: number; tokens?: number; days?: number; ring?: string };
export const SHOP: ShopItem[] = [
  { id: "mentor_30k", kind: "mentor", name: "Mentor boost", blurb: "30K Mentor tokens (about 20 questions), valid 30 days.", cost: 150, tokens: 30_000, days: 30 },
  { id: "mentor_80k", kind: "mentor", name: "Mentor boost+", blurb: "80K Mentor tokens (about 50 questions), valid 30 days.", cost: 350, tokens: 80_000, days: 30 },
  { id: "frame_gold", kind: "frame", name: "Gold frame", blurb: "A gold ring around your avatar.", cost: 200, ring: "linear-gradient(135deg,#fde68a,#f59e0b,#b45309)" },
  { id: "frame_neon", kind: "frame", name: "Neon frame", blurb: "A glowing violet and cyan ring.", cost: 300, ring: "linear-gradient(135deg,#22d3ee,#8b5cf6,#ec4899)" },
  { id: "frame_flame", kind: "frame", name: "Flame frame", blurb: "For a hot streak: red and orange.", cost: 400, ring: "linear-gradient(135deg,#fb923c,#ef4444,#be123c)" },
];
export const shopItem = (id: string) => SHOP.find((x) => x.id === id);
