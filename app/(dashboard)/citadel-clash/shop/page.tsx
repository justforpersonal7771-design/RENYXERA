"use client";

/** Shop (R31B-5): daily reward and the coin shop. Coins are earned only; they can't be bought or cashed out. */
import { CoinShop, DailyReward } from "@/components/battles/clubs-coins";

export default function ShopPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="g-title text-3xl sm:text-4xl">Shop</h1>
        <p className="mt-1 g-text-2">Spend the coins you earn from battles and daily rewards.</p>
      </header>
      <DailyReward />
      <CoinShop />
    </div>
  );
}
