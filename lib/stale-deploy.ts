/**
 * After a deploy, a tab opened on the previous version still asks for that version's
 * script/style chunks, which no longer exist ("Loading chunk 4580 failed", or a page
 * with no styles). The fix is a single hard reload onto the new version. Guarded so a
 * genuinely broken chunk can't cause a reload loop (at most once per 30 s).
 */
const KEY = "renyxera_stale_reload_at";

export function isStaleDeployError(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.name} ${err.message}` : String(err ?? "");
  return /ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(msg);
}

/** Reloads once; returns false if a reload already happened in the last 30 s. */
export function reloadForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // storage blocked: still reload once per page life
  }
  window.location.reload();
  return true;
}
