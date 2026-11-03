-- Funnel tracking: from first visit to payment, by first-touch source.
-- New events: signed_in (first sign-in on a browser), upgrade_viewed (Plans window or page opened),
-- checkout_started (Pay clicked on the confirm window). Payment itself is read from billing_orders.
alter table public.events drop constraint if exists events_event_check;
alter table public.events add constraint events_event_check check (event in (
  'visit','test_started','test_submitted','review_opened','ai_used','invite_shared','share_clicked','telegram_join',
  'signed_in','upgrade_viewed','checkout_started'));

create index if not exists events_event_idx on public.events (event, created_at);

-- One row per first-touch source: how many distinct visitors reached each stage in the last p_days days.
-- 'paid' counts users with a paid order in the window whose events carry that source.
create or replace function public.funnel_by_source(p_days int default 30)
returns table (source text, visitors bigint, tested bigint, signed_in bigint, upgrade_viewed bigint, checkout_started bigint, paid bigint)
language sql stable security definer set search_path = public as $$
  with e as (
    select anon_id, user_id, event, coalesce(source, 'direct') as src
    from events where created_at >= now() - make_interval(days => p_days)
  ),
  paid_users as (
    select distinct user_id from billing_orders where status = 'paid' and paid_at >= now() - make_interval(days => p_days)
  )
  select src,
    count(distinct anon_id),
    count(distinct anon_id) filter (where event = 'test_submitted'),
    count(distinct anon_id) filter (where event = 'signed_in'),
    count(distinct anon_id) filter (where event = 'upgrade_viewed'),
    count(distinct anon_id) filter (where event = 'checkout_started'),
    count(distinct user_id) filter (where user_id in (select user_id from paid_users))
  from e group by src order by 2 desc;
$$;
revoke all on function public.funnel_by_source(int) from public, anon, authenticated;
