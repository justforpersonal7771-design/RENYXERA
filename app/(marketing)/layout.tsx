import { ClientLayout } from "@/components/layout/client-layout";
import { Footer } from "@/components/layout/footer";
import { ToolsFrame } from "@/components/seo/tool-shell";

// Public, crawlable pages (about, PYQs, syllabus, tools, articles, branches) live inside the
// same app shell and navbar as the dashboard. They are still server components, so their
// full content (and every tool link in the bottom tools dock) is in the initial HTML for
// search engines and Google's OAuth brand reviewer.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      {/* Fill the viewport (minus navbar and page padding) so the footer sits at the bottom on short pages. */}
      <div className="flex flex-col min-h-[calc(100dvh-6rem)] sm:min-h-[calc(100dvh-7rem)] md:min-h-[calc(100dvh-8rem)]">
        <div className="flex-1">
          <ToolsFrame>{children}</ToolsFrame>
        </div>
        <Footer />
      </div>
    </ClientLayout>
  );
}
