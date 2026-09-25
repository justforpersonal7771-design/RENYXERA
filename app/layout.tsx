import type {Metadata} from 'next';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles
import { ScrollbarActivity } from '@/components/system/scrollbar-activity';
import { AuthListener } from '@/components/system/auth-listener';
import { ThemeProvider } from '@/components/theme-provider';

// Geist (Vercel's flagship typeface) for body/UI text — the current standard for a
// clean, modern, premium SaaS look, replacing Inter. Geist Mono replaces JetBrains
// Mono for the same reason, as a matched pair from the same family rather than two
// unrelated typefaces. Space Grotesk stays for display headings (the geometric,
// slightly-distinctive display companion Geist itself doesn't provide).
const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

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
};

export const viewport = {
  themeColor: '#4f46e5',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
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
