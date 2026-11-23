import { Chakra_Petch, Russo_One } from "next/font/google";
import "./game.css";
import { GameShell } from "@/components/game/game-shell";

// Game faces, self-hosted by next/font (no runtime call to Google): Russo One for game titles, Chakra Petch for clock digits and numbers.
const russo = Russo_One({ subsets: ["latin"], weight: "400", variable: "--font-russo", display: "swap" });
const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-chakra", display: "swap" });

/** Battles is a game (R31): every /citadel-clash screen renders inside the full-screen Duel Table shell. */
export default function BattlesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${russo.variable} ${chakra.variable} contents`}><GameShell>{children}</GameShell></div>;
}
