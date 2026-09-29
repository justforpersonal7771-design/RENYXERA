-- RENYXERA — Release 7: show members' tier (silver Plus / gold Pro crown) on leaderboards.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Leaderboard rows expose only each member's public display label, so this maps labels to
-- their active paid tier. Only 'plus'/'pro' are returned (free is the default), labels that
-- match more than one account are skipped, and at most 100 labels are looked up per call.
create or replace function public.tiers_for_labels(p_labels text[])
returns table (label text, tier text)
language sql stable security definer set search_path = '' as $$
  with l as (select distinct x from unnest(p_labels[1:100]) as x),
  m as (
    select public.display_label(p) as label, public.account_tier(p.id) as tier
      from public.profiles p
     where public.display_label(p) in (select x from l)
  )
  select label, min(tier) from m
   where tier in ('plus', 'pro')
   group by label having count(*) = 1;
$$;
revoke all on function public.tiers_for_labels(text[]) from public;
grant execute on function public.tiers_for_labels(text[]) to anon, authenticated;
