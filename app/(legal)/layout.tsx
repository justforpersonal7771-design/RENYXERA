import { Footer } from "@/components/layout/footer";
import { PublicHeader } from "@/components/seo/public-header";
import { LegalNav, LegalToc } from "@/components/seo/legal-nav";

/**
 * Terms, privacy, cookies, refunds, disclaimer and contact. Full page width: the adaptive
 * legal menu under the header, the document, and an "On this page" index on the right. html/body are overflow:hidden app-wide
 * (globals.css), so this shell scrolls itself.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[var(--background)]">
      <PublicHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalNav />
        <div className="pt-4 pb-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_240px] gap-10">
          <main id="legal-article" className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 lg:p-12">{children}</main>
          <aside className="hidden xl:block"><LegalToc /></aside>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"><Footer /></div>
    </div>
  );
}
