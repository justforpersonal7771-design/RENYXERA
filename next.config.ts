import type {NextConfig} from 'next';

// One id per build, baked into both the pages and /api/version, so an open tab can tell
// when it's running an older copy of the app (see components/system/version-watch.tsx).
const BUILD_ID = process.env.GITHUB_SHA?.slice(0, 12) || String(Date.now());

// Security headers (R16-A2, 30 Oct 2026). The Content-Security-Policy is REPORT-ONLY first: the browser reports what it would block
// to /api/csp-report (logged) and blocks nothing, so it can be tightened from real traffic before it is enforced.
const supabaseOrigin = (() => { try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin; } catch { return "https://*.supabase.co"; } })();
const supabaseWs = supabaseOrigin.replace(/^https:/, "wss:");
const CSP = [
  "default-src 'self'",
  // Next.js inlines its bootstrap scripts, so 'unsafe-inline' stays until nonces are added. Third parties we really load: MathJax (jsDelivr), Turnstile, Razorpay, Cloudflare analytics, EthicalAds.
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://challenges.cloudflare.com https://checkout.razorpay.com https://cdn.razorpay.com https://static.cloudflareinsights.com https://media.ethicalads.io",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  `connect-src 'self' ${supabaseOrigin} ${supabaseWs} https://api.razorpay.com https://lumberjack.razorpay.com https://lumberjack-metrics.razorpay.com https://cdn.jsdelivr.net https://cloudflareinsights.com https://challenges.cloudflare.com https://*.ingest.sentry.io`,
  "frame-src https://challenges.cloudflare.com https://api.razorpay.com https://checkout.razorpay.com https://www.youtube-nocookie.com https://www.youtube.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.razorpay.com",
  "frame-ancestors 'none'",
  "report-uri /api/csp-report",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), camera=(self), microphone=(self), interest-cohort=()' },
        // allow-popups keeps the Google sign-in and Razorpay popups working.
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        { key: 'Content-Security-Policy-Report-Only', value: CSP },
      ],
    }];
  },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  experimental: { optimizePackageImports: ['lucide-react', 'recharts', 'motion', 'date-fns'] },
  compiler: { removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false },
  // Test Centre (R22): the old Exam Setup and Mocks URLs keep working (links, bookmarks, Telegram messages); query strings are kept.
  async redirects() {
    return [
      { source: '/setup', destination: '/test-centre/build', permanent: false },
      { source: '/mocks', destination: '/test-centre/mocks', permanent: false },
      { source: '/mocks/results', destination: '/test-centre/mocks/results', permanent: false },
    ];
  },
};

export default nextConfig;
