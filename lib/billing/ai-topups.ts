// AI Mentor recharge packs (owner decision 1 Nov 2026, docs/roadmap/R27-MENTOR-CHAT-FEATURES.md section 3).
// Display data only for now: buying needs the pack ledger table and a "topup" order type (not built yet), so the screens show
// the packs with "Notify me" and count the taps. A pack never unlocks Pro features; it only adds Mentor tokens, valid for 90 days,
// used after the daily allowance runs out. Free students can buy too.
export type TopupPack = { id: "small" | "medium" | "large"; name: string; pricePaise: number; tokens: number; questions: number; tag?: string };

export const TOPUP_EXPIRY_DAYS = 90;
export const TOPUP_PACKS: TopupPack[] = [
  { id: "small", name: "Small", pricePaise: 1900, tokens: 150_000, questions: 90 },
  { id: "medium", name: "Medium", pricePaise: 4900, tokens: 450_000, questions: 270 },
  { id: "large", name: "Large", pricePaise: 7900, tokens: 1_200_000, questions: 720, tag: "Best value" },
];

/** What the same tokens would cost in Small packs, rounded up to whole packs: the honest comparison line for a bigger pack. */
export const costInSmallPacksPaise = (p: TopupPack) => Math.ceil(p.tokens / TOPUP_PACKS[0].tokens) * TOPUP_PACKS[0].pricePaise;
