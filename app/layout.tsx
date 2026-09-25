import type {Metadata} from 'next';
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css'; // Global styles
import { ScrollbarActivity } from '@/components/system/scrollbar-activity';
import { AuthListener } from '@/components/system/auth-listener';
import { ThemeProvider } from '@/components/theme-provider';

// Four deliberately different families, each with one job:
//  - Plus Jakarta Sans  — body & UI text, with its "Lancip" (sharp) alternates, ss01
//  - Bricolage Grotesque — every h1–h4 (applied globally in globals.css)
//  - Instrument Serif   — italic accent words only (.font-serif / "font-serif italic")
//  - JetBrains Mono     — numbers, timers, code (font-mono)
// Self-hosted from the designer's official release (tokotype/PlusJakartaSans, SIL OFL
// 1.1 — licence alongside in app/fonts) rather than Google Fonts: Google's web cut is
// subset to 285 glyphs with the stylistic sets stripped, so ss01 "Lancip Alternates"
// simply doesn't exist in it. Enabled globally in globals.css.
const bodySans = localFont({
  src: [
    { path: './fonts/PlusJakartaSans-Variable.woff2', weight: '200 800', style: 'normal' },
    { path: './fonts/PlusJakartaSans-Italic-Variable.woff2', weight: '200 800', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
});
const displaySans = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const accentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'RENYXERA — A New ERA of Intelligent Learning',
  description: 'RENYXERA is a premium, adaptive GATE CSE preparation workspace — analyze weaknesses, drill weak topics, and track mastery with an AI mentor built in.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  // Proves ownership of gate.renyxera.workers.dev to Google Search Console (under
  // renyxera@gmail.com) — needed to clear the "homepage URL is not registered to you"
  // branding-verification issue on the Google OAuth consent screen.
  verification: {
    google: 'c3t_O6hCIMk3dM6oOGOQ9w1RgweDyttKmyhMNj9tjQM',
  },
};

export const viewport = {
  themeColor: '#4f46e5',
};

// Runs in <head>, before anything paints. Kept as a plain string on purpose: the
// Cloudflare build (OpenNext/esbuild with keepNames) rewrites next-themes' own inline
// script — which is generated from a function via toString() — to call an esbuild
// helper, `__name(...)`, that doesn't exist in the browser. That script then threw a
// ReferenceError before applying the theme, so a dark-mode reload showed the light
// theme for ~2s until React hydrated (measured on production via screencast frames;
// the local `next start` build isn't affected, which is why local tests passed).
// This defines the missing helper so next-themes' script works again, and applies the
// saved theme itself as a belt-and-braces guarantee. Light is the default.
const THEME_BOOTSTRAP = `(function(){try{if(typeof window.__name!=="function"){window.__name=function(f){return f}}var t=localStorage.getItem("theme");var v=t==="dark"?"dark":"light";var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(v);d.style.colorScheme=v}catch(e){}})();`;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bodySans.variable} ${displaySans.variable} ${accentSerif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        {/* Root, not nested in (dashboard)/layout.tsx — next-themes' anti-flash
            script has to be part of <body>'s very first content to run before
            ANY route paints, and has to cover (auth) routes too (they call
            useTheme() but previously had no provider at all above them, so
            resolvedTheme was always undefined there). enableSystem is off and
            defaultTheme is "light": a first-time visitor should see light, not
            whatever their OS happens to prefer; a returning visitor's own
            explicit choice (stored in localStorage) is still respected. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ScrollbarActivity />
          <AuthListener />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
