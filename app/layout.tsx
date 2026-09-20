import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">{children}</body>
    </html>
  );
}
