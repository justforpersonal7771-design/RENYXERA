/**
 * "Hard reset this device" (moved from the navbar to Profile → Data & storage): clears
 * every local database, storage, cache and the service worker, then reloads. Account
 * data on the server is untouched — signing back in restores it.
 */
export async function hardResetDevice(): Promise<void> {
  try {
    if (typeof indexedDB.databases === "function") {
      const dbs = await indexedDB.databases();
      await Promise.all(dbs.map((d) => d.name && new Promise((res) => {
        const r = indexedDB.deleteDatabase(d.name!);
        r.onsuccess = r.onerror = r.onblocked = () => res(null);
      })));
    } else {
      (indexedDB as IDBFactory).deleteDatabase("GatePrepOS_DB");
    }
  } catch {}
  try { localStorage.clear(); } catch {}
  try { sessionStorage.clear(); } catch {}
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }
  if ("serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  }
  window.location.replace("/");
}
