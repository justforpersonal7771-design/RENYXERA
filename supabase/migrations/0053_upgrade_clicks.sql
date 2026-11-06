-- Which locked surface makes people click Upgrade (R13-A1). Event carries source = 'lock:<surface>'.
alter table public.events drop constraint if exists events_event_check;
alter table public.events add constraint events_event_check check (event in (
  'visit','test_started','test_submitted','review_opened','ai_used','invite_shared','share_clicked','telegram_join',
  'signed_in','upgrade_viewed','upgrade_clicked','checkout_started'));

create or replace function public.upgrade_clicks_by_surface(p_days int default 30)
returns table (surface text, clicks bigint, people bigint)
language sql security definer set search_path = public as $$
  select substr(source, 6) as surface, count(*) as clicks, count(distinct anon_id) as people
  from public.events
  where event = 'upgrade_clicked' and source like 'lock:%' and created_at >= now() - make_interval(days => p_days)
  group by 1 order by 2 desc;
$$;
revoke all on function public.upgrade_clicks_by_surface(int) from public, anon, authenticated;
