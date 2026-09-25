import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page in this app is prerendered at build time (○ in `next build`) and nothing
// uses ISR/revalidation, so the prerendered output can be served straight from Workers
// static assets — no R2 bucket, no KV, $0.
//
// Before this, there was no incremental cache at all, so OpenNext re-rendered each
// "static" page on every request (20–40 ms CPU warm, 240–1,360 ms on a cold isolate —
// measured with `wrangler tail`). On the free plan's CPU budget that surfaced as
// Error 1102 "Worker exceeded resource limits". enableCacheInterception serves the
// cached page before the Next.js server is even loaded, which is what removes the
// cold-start cost for page requests.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
