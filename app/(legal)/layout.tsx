import { ClientLayout } from "@/components/layout/client-layout";
import { Footer } from "@/components/layout/footer";
import { LegalNav, LegalToc } from "@/components/seo/legal-nav";

/**
 * Terms, privacy, cookies, refunds, disclaimer and contact, inside the app shell: the
 * document across the full width, an "On this page" index on the right, and the legal
 * pages dock at the bottom of the screen.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-8 pb-24">
        <main id="legal-article" className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 lg:p-12">{children}</main>
        <aside className="hidden xl:block"><LegalToc /></aside>
      </div>
      <LegalNav />
      <Footer />
    </ClientLayout>
  );
}
