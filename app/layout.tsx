import type {Metadata} from 'next';
import { Manrope, Sora, Fraunces, JetBrains_Mono, Playball, Cinzel, Bruno_Ace_SC } from 'next/font/google';
import './globals.css'; // Global styles
import { ScrollbarActivity } from '@/components/system/scrollbar-activity';
import { AuthListener } from '@/components/system/auth-listener';
import { CardSpotlight } from '@/components/system/card-spotlight';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE_URL } from "@/lib/site";

// One family per job, all SIL OFL (served via next/font, self-hosted at build):
//  - Manrope   — body & UI text: calm, open, very legible at small sizes
//  - Sora      — every h1–h4 (globals.css) and big stat numbers (.font-num)
//  - Fraunces  — italic accent words only ("font-serif italic")
//  - JetBrains Mono — code only; numbers use Sora's tabular figures instead
//  - Playball  — script accent for the dashboard headline (.font-script)
//  - Cinzel    — classical luxe serif for "GATE 2027" (.font-luxe)
//  - Bruno Ace SC — the RENYXERA wordmark only (.font-brand), so the product name stands apart
const bodySans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const displaySans = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const accentSerif = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['SOFT', 'opsz'], variable: '--font-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const script = Playball({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
const luxe = Cinzel({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-luxe', display: 'swap' });
const brand = Bruno_Ace_SC({ subsets: ['latin'], weight: '400', variable: '--font-brand', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
const THEME_BOOTSTRAP = `(function(){try{if(typeof window.__name!=="function"){window.__name=function(f){return f}}var t=localStorage.getItem("theme");var v=t==="dark"?"dark":"light";var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(v);d.style.colorScheme=v}catch(e){}try{if(sessionStorage.getItem("renyxera_intro_seen")){document.documentElement.setAttribute("data-intro-seen","")}else{sessionStorage.setItem("renyxera_intro_seen","1")}}catch(e){}})();`;

// Stale-deploy guard: a tab opened before a deploy asks for the previous version's
// /_next/static files, which no longer exist — the page then renders unstyled or throws
// "Loading chunk … failed". Any such script/style/chunk failure reloads onto the new
// version once (at most every 30 s, so a real outage can't loop). See lib/stale-deploy.ts.
const STALE_GUARD = `(function(){function r(){try{var k="renyxera_stale_reload_at",l=+(sessionStorage.getItem(k)||0);if(Date.now()-l<30000)return;sessionStorage.setItem(k,String(Date.now()))}catch(e){}location.reload()}window.addEventListener("error",function(e){var t=e.target;if(!t||t===window)return;var u=(t.src||t.href||"");if((t.tagName==="SCRIPT"||t.tagName==="LINK")&&u.indexOf("/_next/static/")!==-1)r()},true);window.addEventListener("unhandledrejection",function(e){var m=String((e.reason&&(e.reason.name+" "+e.reason.message))||e.reason||"");if(/ChunkLoadError|Loading (CSS )?chunk|dynamically imported module|Importing a module script failed/i.test(m))r()})})();`;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bodySans.variable} ${displaySans.variable} ${accentSerif.variable} ${mono.variable} ${script.variable} ${luxe.variable} ${brand.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: STALE_GUARD }} />
        {/* MathJax (formulas) comes from this CDN; warming the connection early shaves
            the DNS/TLS round-trips off the first question with maths. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/* Step 9: Cloudflare Web Analytics — cookieless, free; only when a token is set. */}
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN })} />
        )}
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
          <CardSpotlight />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
