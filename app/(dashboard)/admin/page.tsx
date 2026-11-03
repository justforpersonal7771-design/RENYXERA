"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";

type Overview = {
  visitors: number; tested: number; users_total: number; users_new: number; paid_orders: number; revenue_paise: number;
  daily: { day: string; visitors: number; tests: number }[]; by_branch: { branch: string; visitors: number }[];
};
type FunnelRow = { source: string; visitors: number; tested: number; signed_in: number; upgrade_viewed: number; checkout_started: number; paid: number };
type Payload = { days: number; overview: Overview | null; funnel: FunnelRow[]; errors: string[] };

const TABS = ["Overview", "Funnel", "Links"] as const;
const SITE = "https://gate.renyxera.workers.dev";
const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : "-");

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-semibold text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{hint}</p>}
    </div>
  );
}

function LinkBuilder() {
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("bio");
  const [campaign, setCampaign] = useState("week1");
  const [copied, setCopied] = useState(false);
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 40);
  const link = useMemo(() => {
    const q = new URLSearchParams();
    if (clean(source)) q.set("utm_source", clean(source));
    if (clean(medium)) q.set("utm_medium", clean(medium));
    if (clean(campaign)) q.set("utm_campaign", clean(campaign));
    return `${SITE}/?${q.toString()}`;
  }, [source, medium, campaign]);
  const field = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]";
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">Every link you post should carry a source, so the Funnel tab can show which channel brings tests and payments.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-semibold text-[var(--text-muted)]">Source (where)<input className={field} value={source} onChange={(e) => setSource(e.target.value)} placeholder="instagram, telegram, reddit" /></label>
        <label className="text-xs font-semibold text-[var(--text-muted)]">Medium (what)<input className={field} value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="bio, reel, post, reply" /></label>
        <label className="text-xs font-semibold text-[var(--text-muted)]">Campaign (which)<input className={field} value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="week1" /></label>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <code className="min-w-0 flex-1 break-all text-xs text-[var(--text-primary)]">{link}</code>
        <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--primary,#2563eb)] px-3 py-1.5 text-xs font-bold text-white">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Payload | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    let alive = true;
    fetch(`/api/admin/overview?days=${days}`, { cache: "no-store" })
      .then(async (r) => { if (!alive) return; if (!r.ok) { setState("denied"); return; } setData(await r.json()); setState("ok"); })
      .catch(() => alive && setState("denied"));
    return () => { alive = false; };
  }, [days]);

  if (state === "denied") return <div className="p-8 text-sm text-[var(--text-secondary)]">Page not found.</div>;
  const o = data?.overview;
  const maxV = Math.max(1, ...(o?.daily ?? []).map((d) => d.visitors));

  return (
    <div className="w-full space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Admin</h1>
        <div className="flex gap-1.5">
          {[7, 30, 90].map((d) => (
            <button key={d} type="button" onClick={() => { if (d !== days) { setState("loading"); setDays(d); } }} className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold ${days === d ? "bg-[var(--text-primary)] text-[var(--background)]" : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"}`}>{d} days</button>
          ))}
        </div>
      </div>
      <div className="flex gap-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold ${tab === t ? "bg-[var(--text-primary)] text-[var(--background)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface)]"}`}>{t}</button>
        ))}
      </div>

      {state === "loading" && <Loader2 className="h-5 w-5 animate-spin text-[var(--text-muted)]" />}
      {state === "ok" && data && data.errors.length > 0 && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-[var(--text-secondary)]">Some data could not load: {data.errors.join("; ")}. Has migration 0052 been applied?</p>
      )}

      {state === "ok" && o && tab === "Overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            <Stat label="Visitors" value={o.visitors} />
            <Stat label="Took a test" value={o.tested} hint={`${pct(o.tested, o.visitors)} of visitors`} />
            <Stat label="Accounts" value={o.users_total} hint={`${o.users_new} new`} />
            <Stat label="Paid orders" value={o.paid_orders} hint="live mode only" />
            <Stat label="Revenue" value={`₹${Math.round(o.revenue_paise / 100).toLocaleString("en-IN")}`} hint="live mode only" />
            <Stat label="Visit to paid" value={pct(o.paid_orders, o.visitors)} />
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="mb-3 text-sm font-bold text-[var(--text-primary)]">Visitors per day</p>
            <div className="flex h-32 items-end gap-1">
              {o.daily.map((d) => (
                <div key={d.day} className="group relative flex-1" title={`${d.day}: ${d.visitors} visitors, ${d.tests} tests`}>
                  <div className="w-full rounded-t bg-blue-500/70" style={{ height: `${Math.max(3, (100 * d.visitors) / maxV)}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="mb-2 text-sm font-bold text-[var(--text-primary)]">By branch</p>
            <div className="flex flex-wrap gap-2">
              {o.by_branch.map((b) => <span key={b.branch} className="rounded-full bg-[var(--surface-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">{b.branch}: {b.visitors}</span>)}
            </div>
          </div>
        </div>
      )}

      {state === "ok" && data && tab === "Funnel" && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-[var(--text-muted)]"><tr>{["Source", "Visitors", "Tested", "Signed in", "Saw plans", "Clicked pay", "Paid"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {data.funnel.map((r) => (
                <tr key={r.source} className="border-t border-[var(--border)] text-[var(--text-primary)]">
                  <td className="px-3 py-2 font-semibold">{r.source}</td><td className="px-3 py-2">{r.visitors}</td>
                  <td className="px-3 py-2">{r.tested} <span className="text-xs text-[var(--text-muted)]">{pct(r.tested, r.visitors)}</span></td>
                  <td className="px-3 py-2">{r.signed_in}</td><td className="px-3 py-2">{r.upgrade_viewed}</td><td className="px-3 py-2">{r.checkout_started}</td><td className="px-3 py-2">{r.paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[var(--border)] p-3 text-xs text-[var(--text-muted)]">Paid here counts any paid order, including test-mode. The Overview revenue counts live orders only.</p>
        </div>
      )}

      {tab === "Links" && <LinkBuilder />}
    </div>
  );
}
