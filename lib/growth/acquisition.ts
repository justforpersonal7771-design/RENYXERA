// 7E: first-touch acquisition. On the first visit we remember where the student came from
// (utm_* tags or the external referrer); after they sign in it is saved to their profile once
// (set_acquisition RPC) and feeds weekly_growth_metrics(). No third-party tracking.
const KEY = "renyxera:acq";
const SENT = "renyxera:acq-sent";

export function captureAcquisition() {
  try {
    if (localStorage.getItem(KEY)) return;
    const u = new URL(window.location.href);
    const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? new URL(document.referrer).hostname : null;
    const data = {
      source: u.searchParams.get("utm_source") ?? (u.pathname.startsWith("/r/") ? "referral" : ref ?? "direct"),
      medium: u.searchParams.get("utm_medium"),
      campaign: u.searchParams.get("utm_campaign"),
      referrer: ref,
      landing: u.pathname.slice(0, 120),
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch { /* storage blocked */ }
}

export async function sendAcquisition(supabase: { rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ error: unknown }> }) {
  try {
    if (localStorage.getItem(SENT)) return;
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const { error } = await supabase.rpc("set_acquisition", { p: JSON.parse(raw) });
    if (!error) localStorage.setItem(SENT, "1");
  } catch { /* non-fatal */ }
}
