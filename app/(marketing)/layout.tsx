import { Footer } from "@/components/layout/footer";
import { PublicHeader } from "@/components/seo/public-header";

// Server-rendered shell for public, no-login pages (about, PYQs, syllabus, tools). No
// client JS is needed to read any of it — the point is that a first-time visitor,
// a search engine, or Google's OAuth brand reviewer sees the full content with or
// without JavaScript, and without the dashboard's sign-in prompts around it.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Footer />
      </div>
    </div>
  );
}
