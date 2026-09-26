/**
 * Step 7 (4F): this browser's identity for Active Devices. A random id kept in
 * localStorage (not a fingerprint) plus a readable label like "Chrome on Windows".
 */
const KEY = "renyxera_device_id";

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id || !/^[A-Za-z0-9-]{8,64}$/.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "ephemeral-" + Math.random().toString(36).slice(2, 12);
  }
}

export function deviceLabel(ua = typeof navigator !== "undefined" ? navigator.userAgent : ""): string {
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /SamsungBrowser/.test(ua) ? "Samsung Internet" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Safari\//.test(ua) ? "Safari" : "Browser";
  const os =
    /Windows/.test(ua) ? "Windows" :
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad|iPod/.test(ua) ? "iOS" :
    /Mac OS X|Macintosh/.test(ua) ? "macOS" :
    /CrOS/.test(ua) ? "ChromeOS" :
    /Linux/.test(ua) ? "Linux" : "Unknown OS";
  return `${browser} on ${os}`;
}

export function isMobileLabel(label: string) {
  return /Android|iOS/.test(label);
}

/** Tells the server this device is active. Returns true if the device was signed out
 *  remotely (the caller then signs out locally). Never throws. */
export async function deviceHeartbeat(): Promise<{ revoked: boolean } | null> {
  try {
    const res = await fetch("/api/devices", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "heartbeat", device_id: getDeviceId(), label: deviceLabel() }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { revoked: boolean };
  } catch {
    return null;
  }
}
