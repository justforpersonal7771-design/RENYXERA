"use client";

/** "Study materials" row for the Plus and Pro plans screen: study is bought on its own, so the plans screen says so and opens the study window. */
import { BookOpenText } from "lucide-react";
import { BUNDLES, FREE_TOPICS, PACKS, bundleSum, perPack, rupees } from "@/lib/study/packs";
import { openStudyShop } from "@/store/use-study-shop-store";

export function StudyStrip() {
  const core = BUNDLES.find((b) => b.id === "core")!, maths = BUNDLES.find((b) => b.id === "maths")!, all = BUNDLES.find((b) => b.id === "everything")!;
  const apt = PACKS.find((p) => p.id === "apt")!;
  return (
    <section aria-labelledby="study-strip-h" className="card-pastel flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between" data-tint="butter">
      <div className="min-w-0">
        <h2 id="study-strip-h" className="inline-flex items-center gap-2 font-display text-xl font-extrabold text-[var(--text-primary)]"><BookOpenText className="h-5 w-5" aria-hidden /> Study materials</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">Textbook-depth books with a lab in every topic. Bought on their own, not part of Plus or Pro: every book opens with {FREE_TOPICS} free sample topics. Core CS is {rupees(core.pricePaise)} (separately {rupees(bundleSum(core))}), Maths {rupees(maths.pricePaise)}, Aptitude {rupees(apt.pricePaise)}, or Everything for {rupees(all.pricePaise)}, about {rupees(perPack(all))} a subject.</p>
      </div>
      <button type="button" onClick={() => openStudyShop("Study packs and bundles")} className="btn-main shrink-0">See packs and bundles</button>
    </section>
  );
}
