import { ClientLayout } from "@/components/layout/client-layout";

// ThemeProvider now lives in the root layout (app/layout.tsx) so its
// anti-flash script covers every route, not just this group — see the
// comment there.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
