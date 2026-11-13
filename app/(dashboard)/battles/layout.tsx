import "./game.css";
import { GameShell } from "@/components/game/game-shell";

/** Battles is a game (R31): every /battles screen renders inside the full-screen game shell. */
export default function BattlesLayout({ children }: { children: React.ReactNode }) {
  return <GameShell>{children}</GameShell>;
}
