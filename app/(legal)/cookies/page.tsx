import Link from "next/link";

export const metadata = {
  title: "Cookie Policy — RENYXERA",
  description: "The cookies and browser storage RENYXERA uses, and why.",
};

const A = "text-[var(--accent)] font-semibold";
const H = "text-lg font-bold text-[var(--text-primary)] mb-2";

const ROWS: [string, string, string][] = [
  ["Sign-in cookies (sb-…-auth-token)", "Keep you signed in securely. Set by Supabase, our sign-in provider.", "Essential"],
  ["Security checks (Cloudflare Turnstile, __cf_bm)", "Stop bots on sign-in and sign-up, and protect the site from abuse.", "Essential"],
  ["IndexedDB (study data)", "Your test history, bookmarks, mistakes and planner, stored on your device so the app works offline.", "Essential"],
  ["IndexedDB (downloads vault)", "Encrypted offline packs you choose to download. Removed when you sign out.", "Essential, only if used"],
  ["Local storage", "Theme, motion and reminder preferences, and a random device id for Active Devices.", "Functional"],
  ["Session storage", "Short-lived flags such as whether you've seen the intro animation.", "Functional"],
  ["Offline cache (service worker)", "Copies of the app's pages and files so it opens quickly and works offline.", "Functional"],
];

export default function CookiePolicyPage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-1">Cookie Policy</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 26 September 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className={H}>1. The short version</h2>
          <p>
            RENYXERA uses a small number of cookies and browser storage to sign you in, keep the site secure, remember your
            preferences and let the app work offline. We <strong className="text-[var(--text-primary)]">don&apos;t use advertising or cross-site tracking
            cookies</strong>, and we don&apos;t sell your data.
          </p>
        </section>

        <section>
          <h2 className={H}>2. What we use</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-secondary)] text-left text-[var(--text-primary)]">
                <tr><th className="p-3 font-semibold">Item</th><th className="p-3 font-semibold">Why</th><th className="p-3 font-semibold">Type</th></tr>
              </thead>
              <tbody>
                {ROWS.map(([item, why, type]) => (
                  <tr key={item} className="border-t border-[var(--border-subtle)] align-top">
                    <td className="p-3 font-medium text-[var(--text-primary)]">{item}</td>
                    <td className="p-3">{why}</td>
                    <td className="p-3 whitespace-nowrap">{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className={H}>3. Analytics, error reports and ads</h2>
          <p>
            We use <strong className="text-[var(--text-primary)]">Cloudflare Web Analytics</strong> to count page visits. It sets no cookies and
            doesn&apos;t track you across sites. When something breaks, an error report (what failed, your browser and an
            anonymous account id — never your name or email) is sent to <strong className="text-[var(--text-primary)]">Sentry</strong> so we can fix it.
            If we add advertising in future, we&apos;ll list it here first and ask for your consent where the law requires it.
          </p>
        </section>

        <section>
          <h2 className={H}>4. Your choices</h2>
          <p>
            You can clear or block cookies and site data in your browser settings. Essential items are needed to sign in and
            use the app — blocking them will sign you out, and clearing site data removes anything stored only on this device
            (export it first from <Link href="/profile#security" className={A}>Profile → Export my data</Link>).
          </p>
        </section>

        <section>
          <h2 className={H}>5. Related</h2>
          <p>
            <Link href="/privacy" className={A}>Privacy policy</Link> · <Link href="/terms" className={A}>Terms</Link> ·{" "}
            <Link href="/contact" className={A}>Contact</Link>
          </p>
        </section>
      </div>
    </article>
  );
}
