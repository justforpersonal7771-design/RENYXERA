/**
 * Upcoming features shown with sample data while they are being built.
 *   "preview" — full screen with sample data and a "Sample data" banner (owner testing now)
 *   "soon"    — the same screen blurred behind a "Coming soon" card
 *   "live"    — real data (set when the feature ships)
 * Flip one value here; nothing else changes.
 */
export type PreviewState = "preview" | "soon" | "live";

export const UPCOMING: Record<"forge" | "study" | "battles", PreviewState> = {
  forge: "live",
  study: "preview",
  battles: "live",
};
