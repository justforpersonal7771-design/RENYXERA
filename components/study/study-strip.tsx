"use client";

/** "Study materials" row for the Plus and Pro plans screen: study is bought on its own, so the plans screen says so and opens the study window. */
import { PremiumCard } from "@/components/ui/premium-card";
import { BUNDLES, FREE_TOPICS, PACKS, bundleSum, rupees } from "@/lib/study/packs";
import { openStudyShop } from "@/store/use-study-shop-store";
import { useStudyAccess } from "@/lib/study/use-study-access";

export function StudyStrip() {
  const access = useStudyAccess();
  // students who own every pack have nothing to buy here
  if (access.loading || PACKS.every((p) => access.packs.includes(p.id))) return null;
  const core = BUNDLES.find((b) => b.id === "core")!, maths = BUNDLES.find((b) => b.id === "maths")!, all = BUNDLES.find((b) => b.id === "everything")!;
  const apt = PACKS.find((p) => p.id === "apt")!;
  return (
    <PremiumCard skin="peri" compact eyebrow="Study materials" title="Textbook-depth books, bought on their own" cta="Unlock books" onClick={() => openStudyShop("Study packs and bundles")}
      body={`Not part of Plus or Pro. Every book opens with ${FREE_TOPICS} free topics. Core CS ${rupees(core.pricePaise)} (separately ${rupees(bundleSum(core))}), Maths ${rupees(maths.pricePaise)}, Aptitude ${rupees(apt.pricePaise)}, or Everything for ${rupees(all.pricePaise)}.`} />
  );
}
