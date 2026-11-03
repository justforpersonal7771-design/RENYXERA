-- Admin console (docs/roadmap/R30-ADMIN-CONSOLE.md). Who may open /admin is decided by this table,
-- checked on the server with the service role; the browser can neither read nor write it.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

-- One call for the Overview tab. Revenue counts LIVE paid orders only (test-mode orders are ignored).
create or replace function public.admin_overview(p_days int default 30)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'visitors', (select count(distinct anon_id) from events where created_at >= now() - make_interval(days => p_days)),
    'tested', (select count(distinct anon_id) from events where event = 'test_submitted' and created_at >= now() - make_interval(days => p_days)),
    'users_total', (select count(*) from auth.users),
    'users_new', (select count(*) from auth.users where created_at >= now() - make_interval(days => p_days)),
    'paid_orders', (select count(*) from billing_orders where status = 'paid' and mode = 'live' and paid_at >= now() - make_interval(days => p_days)),
    'revenue_paise', (select coalesce(sum(amount_paise), 0) from billing_orders where status = 'paid' and mode = 'live' and paid_at >= now() - make_interval(days => p_days)),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object('day', d, 'visitors', v, 'tests', t) order by d), '[]'::jsonb) from (
        select date_trunc('day', created_at)::date as d, count(distinct anon_id) as v,
               count(*) filter (where event = 'test_submitted') as t
        from events where created_at >= now() - make_interval(days => p_days) group by 1) x),
    'by_branch', (select coalesce(jsonb_agg(jsonb_build_object('branch', b, 'visitors', v)), '[]'::jsonb) from (
        select coalesce(branch, 'unknown') as b, count(distinct anon_id) as v
        from events where created_at >= now() - make_interval(days => p_days) group by 1 order by 2 desc) y)
  );
$$;
revoke all on function public.admin_overview(int) from public, anon, authenticated;
