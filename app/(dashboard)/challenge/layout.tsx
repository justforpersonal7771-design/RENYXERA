import type { Metadata } from "next";

// The preview a friend sees when the link is pasted into chat: generic on purpose, the score is on the page itself.
export const metadata: Metadata = {
  title: "Beat my score | RENYXERA",
  description: "A friend shared a GATE practice set and their score. Take the same questions in the real exam interface and see if you can beat it.",
  robots: { index: false, follow: false },
  openGraph: { title: "Can you beat my score?", description: "Take the same GATE questions in the real exam interface.", type: "website" },
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
