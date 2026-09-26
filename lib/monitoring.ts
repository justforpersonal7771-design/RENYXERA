/**
 * Step 9: client error monitoring (Sentry, free tier). Entirely off unless
 * NEXT_PUBLIC_SENTRY_DSN is set; the SDK is loaded lazily so it costs nothing otherwise.
 * Privacy: no user email/name is sent — only an anonymous user id, and query strings are
 * stripped from URLs (they can carry pack/test ids).
 */
const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
let started: Promise<typeof import("@sentry/browser") | null> | null = null;

export function initMonitoring() {
  if (!DSN || typeof window === "undefined") return Promise.resolve(null);
  if (!started) {
    started = import("@sentry/browser")
      .then((Sentry) => {
        Sentry.init({
          dsn: DSN,
          environment: location.hostname === "localhost" ? "development" : "production",
          sampleRate: 1,
          tracesSampleRate: 0, // errors only — stays well inside the free quota
          sendDefaultPii: false,
          ignoreErrors: [
            /ResizeObserver loop/,
            /Loading chunk [\w-]+ failed/, // handled by the stale-deploy reload
            /ChunkLoadError/,
            /AbortError/,
            /NetworkError|Failed to fetch|Load failed/,
          ],
          beforeSend(event) {
            if (event.request?.url) event.request.url = event.request.url.split("?")[0];
            if (event.user) event.user = { id: event.user.id };
            return event;
          },
        });
        return Sentry;
      })
      .catch(() => null);
  }
  return started;
}

export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (!DSN) return;
  void initMonitoring().then((Sentry) => Sentry?.captureException(error, context ? { extra: context } : undefined));
}

export function setMonitoringUser(id: string | null) {
  if (!DSN) return;
  void initMonitoring().then((Sentry) => Sentry?.setUser(id ? { id } : null));
}
