import "@/lib/time/install-ist";
import type {Metadata} from 'next';
import { Manrope, Sora, Fraunces, JetBrains_Mono, Playball, Cinzel, Bruno_Ace_SC, Jersey_15, Plus_Jakarta_Sans, Urbanist, DM_Sans, Inter, Bowlby_One, Lilita_One, Rubik, Work_Sans, Orbitron, Rajdhani, Audiowide, Exo_2, Share_Tech_Mono, Space_Mono, Playfair_Display, Lora, Silkscreen, DotGothic16, VT323, Chakra_Petch, Space_Grotesk, Archivo_Black, Outfit } from 'next/font/google';
import './globals.css'; // Global styles
import './looks.css';
import './looks-pro2.css'; // Design Studio Looks, batch 2
import './looks-details.css'; // fonts, motion, full Pixel treatment
import { ScrollbarActivity } from '@/components/system/scrollbar-activity';
import { CardHover } from '@/components/system/card-hover';
import { AuthListener } from '@/components/system/auth-listener';
import { LookApplier } from '@/components/looks/look-applier';
import { CardSpotlight } from '@/components/system/card-spotlight';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE_URL } from "@/lib/site";
import { SAME_AS } from "@/lib/social";
import { TooltipLayer } from "@/components/ui/tooltip-layer";
import { VersionWatch } from "@/components/system/version-watch";
import { PresencePing } from "@/components/friends/presence-ping";

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
const accentSerif = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['SOFT', 'opsz'], variable: '--font-serif', display: 'swap', preload: false });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', preload: false });
const script = Playball({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap', preload: false });
const luxe = Cinzel({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-luxe', display: 'swap', preload: false });
// Look and override fonts (Design Studio): loaded only when a page uses them (preload off). The two -opt- ones are copies of Manrope and Sora under their own
// names, so a font override can point at them even while --font-sans and --font-display are being replaced.
const fPixel = Jersey_15({ subsets: ['latin'], weight: '400', variable: '--font-pixel', display: 'swap', preload: false });
const fGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap', preload: false });
const fArchivo = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--font-archivo', display: 'swap', preload: false });
const fOutfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap', preload: false });
const fManropeOpt = Manrope({ subsets: ['latin'], variable: '--font-opt-manrope', display: 'swap', preload: false });
const fSoraOpt = Sora({ subsets: ['latin'], variable: '--font-opt-sora', display: 'swap', preload: false });
const fx0 = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', preload: false });
const fx1 = Urbanist({ subsets: ['latin'], variable: '--font-urbanist', display: 'swap', preload: false });
const fx2 = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans', display: 'swap', preload: false });
const fx3 = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: false });
const fx4 = Bowlby_One({ subsets: ['latin'], weight: '400', variable: '--font-bowlby', display: 'swap', preload: false });
const fx5 = Lilita_One({ subsets: ['latin'], weight: '400', variable: '--font-lilita', display: 'swap', preload: false });
const fx6 = Rubik({ subsets: ['latin'], variable: '--font-rubik', display: 'swap', preload: false });
const fx7 = Work_Sans({ subsets: ['latin'], variable: '--font-worksans', display: 'swap', preload: false });
const fx8 = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap', preload: false });
const fx9 = Rajdhani({ subsets: ['latin'], weight: '500', variable: '--font-rajdhani', display: 'swap', preload: false });
const fx10 = Audiowide({ subsets: ['latin'], weight: '400', variable: '--font-audiowide', display: 'swap', preload: false });
const fx11 = Exo_2({ subsets: ['latin'], variable: '--font-exo2', display: 'swap', preload: false });
const fx12 = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-sharetech', display: 'swap', preload: false });
const fx13 = Space_Mono({ subsets: ['latin'], weight: '400', variable: '--font-spacemono', display: 'swap', preload: false });
const fx14 = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', preload: false });
const fx15 = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap', preload: false });
const fx16 = Silkscreen({ subsets: ['latin'], weight: '400', variable: '--font-silkscreen', display: 'swap', preload: false });
const fx17 = DotGothic16({ subsets: ['latin'], weight: '400', variable: '--font-dotgothic', display: 'swap', preload: false });
const fx18 = VT323({ subsets: ['latin'], weight: '400', variable: '--font-vt323', display: 'swap', preload: false });
const fx19 = Chakra_Petch({ subsets: ['latin'], weight: '500', variable: '--font-chakra', display: 'swap', preload: false });
const brand = Bruno_Ace_SC({ subsets: ['latin'], weight: '400', variable: '--font-brand', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'RENYXERA · GATE 2027 PYQs, AI Mentor & Mocks for CS, ECE, EE, ME, Civil, DA',
  description: 'Practise every official GATE previous-year paper in an exam-like screen, find your weak topics, and get an AI mentor that explains your exact mistake. CS, ECE, EE, ME, Civil and DA.',
  applicationName: 'RENYXERA',
  keywords: ['GATE 2027', 'GATE previous year questions', 'GATE PYQ with solutions', 'GATE CS', 'GATE ECE', 'GATE mock test', 'GATE AI mentor'],
  openGraph: { type: 'website', siteName: 'RENYXERA', images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'RENYXERA, GATE 2027 preparation' }], title: 'RENYXERA · GATE 2027 PYQs, AI Mentor & Mocks', description: 'Every official GATE paper, an exam-like simulator and an AI mentor that knows your weak spots.' },
  twitter: { card: 'summary_large_image', images: ['/og/default.png'] },
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

const ORG_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'RENYXERA', url: SITE_URL, logo: `${SITE_URL}/brand/apple-touch-icon.png`, sameAs: SAME_AS },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: SITE_URL, name: 'RENYXERA', publisher: { '@id': `${SITE_URL}/#org` } },
  ],
});

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
// Puts the chosen Design Studio Look on <html> before the first paint (the store in store/use-look-store.ts keeps the same key).
const LOOK_BOOTSTRAP = `(function(){try{var s=JSON.parse(localStorage.getItem("renyxera_look_v1")||"null");if(!s)return;var id=(s.trial&&s.trial.endsAt>Date.now())?s.trial.id:s.look;if(id&&id!=="classic"&&id!=="lunar")document.documentElement.setAttribute("data-look",id);var f=s.fonts;if(f){if(f.display)document.documentElement.style.setProperty("--font-display","var("+f.display+")");if(f.body)document.documentElement.style.setProperty("--font-sans","var("+f.body+")");if(f.numbers)document.documentElement.style.setProperty("--font-num","var("+f.numbers+")")}}catch(e){}})();`;
const STALE_GUARD = `(function(){function r(){try{var k="renyxera_stale_reload_at",l=+(sessionStorage.getItem(k)||0);if(Date.now()-l<30000)return;sessionStorage.setItem(k,String(Date.now()))}catch(e){}location.reload()}window.addEventListener("error",function(e){var t=e.target;if(!t||t===window)return;var u=(t.src||t.href||"");if((t.tagName==="SCRIPT"||t.tagName==="LINK")&&u.indexOf("/_next/static/")!==-1)r()},true);window.addEventListener("unhandledrejection",function(e){var m=String((e.reason&&(e.reason.name+" "+e.reason.message))||e.reason||"");if(/ChunkLoadError|Loading (CSS )?chunk|dynamically imported module|Importing a module script failed/i.test(m))r()})})();`;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bodySans.variable} ${displaySans.variable} ${accentSerif.variable} ${mono.variable} ${script.variable} ${luxe.variable} ${brand.variable} ${fPixel.variable} ${fGrotesk.variable} ${fArchivo.variable} ${fOutfit.variable} ${fManropeOpt.variable} ${fSoraOpt.variable} ${fx0.variable} ${fx1.variable} ${fx2.variable} ${fx3.variable} ${fx4.variable} ${fx5.variable} ${fx6.variable} ${fx7.variable} ${fx8.variable} ${fx9.variable} ${fx10.variable} ${fx11.variable} ${fx12.variable} ${fx13.variable} ${fx14.variable} ${fx15.variable} ${fx16.variable} ${fx17.variable} ${fx18.variable} ${fx19.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: LOOK_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: STALE_GUARD }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSON_LD }} />
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
          <CardHover />
          <AuthListener />
          <LookApplier />
          <TooltipLayer />
          <VersionWatch />
          <PresencePing />
          <CardSpotlight />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
