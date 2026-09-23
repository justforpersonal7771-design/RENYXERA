import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Deliberately the plain default config (no R2-backed incremental cache override) for
// now — that override needs an actual R2 bucket bound in wrangler.jsonc, which doesn't
// exist yet (R2 is provisioned as part of Module 4A/8A once there's a real Cloudflare
// account to provision it in). Revisit once that bucket exists; ISR/ on-demand revalidation
// will fall back to Workers' default cache behavior until then.
export default defineCloudflareConfig({});
