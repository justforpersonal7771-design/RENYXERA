"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

/**
 * Minimal shell for /login and /signup — deliberately its own route group, separate
 * from (dashboard)/layout.tsx, so it renders without the app topbar/sidebar chrome
 * (there's nothing to navigate to yet if you're not signed in) and so none of this
 * touches the dashboard layout, which is a carefully-tuned shared component.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    // Own scroll container for the same reason as (legal)/layout.tsx — html/body are
    // overflow:hidden app-wide, so on a short/mobile screen the form was clipped.
    <div className="h-full overflow-y-auto custom-scrollbar">
    <div className="ambient-gradient min-h-full flex flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-8 flex items-center gap-2.5 group">
        <img
          src={mounted && resolvedTheme === "light" ? "/brand/mark-light.png" : "/brand/mark-dark.png"}
          alt="RENYXERA"
          className="h-10 w-auto object-contain transition-transform group-hover:scale-105 group-hover:rotate-3 drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]"
        />
        <img
          src={mounted && resolvedTheme === "light" ? "/brand/wordmark-light.png" : "/brand/wordmark-dark.png"}
          alt="RENYXERA"
          className="h-6 w-auto dark:[filter:invert(1)_hue-rotate(180deg)]"
        />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <div className="w-full max-w-sm">
        <Footer />
      </div>
    </div>
    </div>
  );
}
