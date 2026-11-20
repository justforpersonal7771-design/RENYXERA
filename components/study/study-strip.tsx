"use client";

/** "Study materials" row for the Plus and Pro plans screen: study is bought on its own, so the plans screen says so and opens the study window. */
import { PremiumCard } from "@/components/ui/premium-card";
import { BUNDLES, FREE_TOPICS, PACKS, bundleSum, rupees } from "@/lib/study/packs";
import { openStudyShop } from "@/store/use-study-shop-store";

export function StudyStrip() {
  const core = BUNDLES.find((b) => b.id === "core")!, maths = BUNDLES.find((b) => b.id === "maths")!, all = BUNDLES.find((b) => b.id === "everything")!;
  const apt = PACKS.find((p) => p.id === "apt")!;
  return (
    <PremiumCard skin="study" compact eyebrow="Study materials" title="Textbook-depth books, bought on their own" cta="Unlock books" onClick={() => openStudyShop("Study packs and bundles")}
      body={`Not part of Plus or Pro. Every book opens with ${FREE_TOPICS} free topics. Core CS ${rupees(core.pricePaise)} (separately ${rupees(bundleSum(core))}), Maths ${rupees(maths.pricePaise)}, Aptitude ${rupees(apt.pricePaise)}, or Everything for ${rupees(all.pricePaise)}.`} />
  );
}
