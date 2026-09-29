-- RENYXERA — Release 7A/7B/7C: entitlements, billing orders, webhook idempotency and the
-- "Upgrade to Pro" fake-door interest log. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Entitlements live only on the server and are re-checked on every gated action. Rows are
-- written only by the service role (Razorpay webhook / admin); members can read their own.

-- ── Entitlements: one row per account ─────────────────────────────────────────────────
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  valid_until timestamptz,
  source text check (source is null or source in ('razorpay', 'admin', 'referral', 'promo')),
  updated_at timestamptz not null default now()
);
alter table public.entitlements enable row level security;
drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own on public.entitlements for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.entitlements from anon, authenticated;

-- True while the account has an active paid plan.
create or replace function public.is_pro(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.entitlements e
    where e.user_id = p_user and e.plan = 'pro' and e.valid_until is not null and e.valid_until > now()
  );
$$;
revoke all on function public.is_pro(uuid) from public, anon, authenticated;
grant execute on function public.is_pro(uuid) to service_role;

-- ── Billing orders (Razorpay) ─────────────────────────────────────────────────────────
create table if not exists public.billing_orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (char_length(plan_id) <= 40),
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  period_days integer not null check (period_days between 1 and 800),
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  mode text not null check (mode in ('test', 'live')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists billing_orders_user_idx on public.billing_orders (user_id, created_at desc);
alter table public.billing_orders enable row level security;
drop policy if exists billing_orders_select_own on public.billing_orders;
create policy billing_orders_select_own on public.billing_orders for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.billing_orders from anon, authenticated;

-- Webhook idempotency: a Razorpay event is applied at most once.
create table if not exists public.billing_events (
  event_id text primary key check (char_length(event_id) <= 80),
  event text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
alter table public.billing_events enable row level security;
revoke all on public.billing_events from anon, authenticated;

-- Marks an order paid and extends Pro exactly once (called by the webhook, service role).
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (o.user_id, 'pro', now() + make_interval(days => o.period_days), 'razorpay', now())
  on conflict (user_id) do update
    set plan = 'pro',
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now();
  return true;
end;
$$;
revoke all on function public.apply_paid_order(text, text) from public, anon, authenticated;
grant execute on function public.apply_paid_order(text, text) to service_role;

-- ── Fake-door: who clicked "Upgrade" before payments are switched on ───────────────────
create table if not exists public.pro_interest (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  plan_id text not null check (char_length(plan_id) <= 40),
  source text not null default 'pro_page' check (char_length(source) <= 40),
  created_at timestamptz not null default now()
);
create unique index if not exists pro_interest_user_plan on public.pro_interest (user_id, plan_id) where user_id is not null;
alter table public.pro_interest enable row level security;
revoke all on public.pro_interest from anon, authenticated;
