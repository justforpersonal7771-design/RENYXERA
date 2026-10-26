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
};

export default nextConfig;
