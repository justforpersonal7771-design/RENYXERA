// Offline copies of pages, lessons and question data are switched off (owner, 18 Nov): study material must come from
// the server every time, so it cannot be lifted from a device's cache and passed around. Only the content-hashed build
// files (/_next/static/*, code and styles, no study data) are kept, so a tab opened on the previous deploy still loads.
// Activating this version deletes every cache an earlier version made (pages, /data/questions.json, warmed routes).
const STATIC_CACHE = "renyxera-static-v1";
const STATIC_MAX_ENTRIES = 800;

self.addEventListener("install", () => { self.skipWaiting(); });

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key !== STATIC_CACHE ? caches.delete(key) : undefined))))
      .then(trimStatic)
  );
  self.clients.claim();
});

// Old pages may still ask for the offline warm-up; it does nothing now.
self.addEventListener("message", () => {});

async function trimStatic() {
  const cache = await caches.open(STATIC_CACHE);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - STATIC_MAX_ENTRIES)).map((k) => cache.delete(k)));
}

async function staticAsset(req) {
  const cache = await caches.open(STATIC_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return new Response("", { status: 504 });
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Only build files go through the worker; pages, data and API calls always go straight to the network.
  if (url.pathname.startsWith("/_next/static/")) event.respondWith(staticAsset(req));
});
