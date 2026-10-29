import type {NextConfig} from 'next';

// One id per build, baked into both the pages and /api/version, so an open tab can tell
// when it's running an older copy of the app (see components/system/version-watch.tsx).
const BUILD_ID = process.env.GITHUB_SHA?.slice(0, 12) || String(Date.now());

const nextConfig: NextConfig = {
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
