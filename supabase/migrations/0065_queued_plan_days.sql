-- 0065: referral days wait in line instead of being lost (owner decision 23 Nov 2026). Safe to re-run.
-- An inviter who is on Pro already has more than the "1 day of Plus" the invite gives. That day is now banked in bonus_plan_days and starts
-- the first time the member is seen with NO plan running (their Pro ended), so it is never wasted, and it keeps waiting if they buy more Pro
-- before using it. A member on Plus gets the day added to their Plus as before; a Free member gets it at once as before.
--   * several invites while on Pro  -> several rows, applied together when the Pro ends
--   * buying Pro / Plus before the queue starts -> the plan is extended as usual; the queue only starts when no plan is running
--   * the days start at the first visit after the plan ends (not backdated), so a member who was away does not lose them

create table if not exists public.bonus_plan_days (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tier text not null default 'plus' check (tier = 'plus'),
  days int not null check (days > 0),
  source text not null default 'referral',
  created_at timestamptz not null default now(),
  applied_at timestamptz
);
create index if not exists bonus_plan_days_waiting_idx on public.bonus_plan_days (user_id) where applied_at is null;
alter table public.bonus_plan_days enable row level security;
revoke all on public.bonus_plan_days from anon;
revoke insert, update, delete on public.bonus_plan_days from authenticated;
drop policy if exists bonus_plan_days_read_own on public.bonus_plan_days;
create policy bonus_plan_days_read_own on public.bonus_plan_days for select to authenticated using (user_id = (select auth.uid()));

-- Referral grant: same as 0021, except an active Pro member's day is banked instead of dropped.
create or replace function public.grant_pro_days_tier(p_user uuid, p_days int, p_tier text, p_source text)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.entitlements;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at)
    values (p_user, p_tier, now() + make_interval(days => p_days), p_source, now());
  elsif e.plan = 'pro' and e.valid_until > now() and p_tier = 'plus' then
    insert into public.bonus_plan_days (user_id, tier, days, source) values (p_user, 'plus', p_days, p_source);
  else
    update public.entitlements
       set plan = p_tier,
           valid_until = greatest(coalesce(case when e.plan = p_tier then e.valid_until end, now()), now()) + make_interval(days => p_days),
           source = coalesce(e.source, p_source), updated_at = now()
     where user_id = p_user;
  end if;
end;
$$;
revoke all on function public.grant_pro_days_tier(uuid, int, text, text) from public, anon, authenticated;
grant execute on function public.grant_pro_days_tier(uuid, int, text, text) to service_role;

-- Starts the waiting days when no Plus or Pro plan is running. Returns the days started (0 when nothing waits or a plan is still running).
create or replace function public.apply_queued_plan_days(p_user uuid)
returns int language plpgsql security definer set search_path = '' as $$
declare e public.entitlements; d int; has_row boolean;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user::text, 0)); -- two requests at once must not start the same days twice
  select coalesce(sum(days), 0)::int into d from public.bonus_plan_days where user_id = p_user and applied_at is null;
  if d = 0 then return 0; end if;
  select * into e from public.entitlements where user_id = p_user for update;
  has_row := found;
  if has_row and e.plan in ('plus', 'pro') and e.valid_until > now() then return 0; end if; -- a plan is still running: the days wait their turn
  if has_row then
    update public.entitlements set plan = 'plus', valid_until = now() + make_interval(days => d), source = coalesce(e.source, 'referral'), updated_at = now() where user_id = p_user;
  else
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at) values (p_user, 'plus', now() + make_interval(days => d), 'referral', now());
  end if;
  update public.bonus_plan_days set applied_at = now() where user_id = p_user and applied_at is null;
  return d;
end;
$$;
revoke all on function public.apply_queued_plan_days(uuid) from public, anon, authenticated;
grant execute on function public.apply_queued_plan_days(uuid) to service_role;

-- How many days are waiting for the signed-in member (shown on the invite card).
create or replace function public.my_queued_days()
returns int language sql stable security definer set search_path = '' as $$
  select coalesce(sum(days), 0)::int from public.bonus_plan_days where user_id = (select auth.uid()) and applied_at is null;
$$;
revoke all on function public.my_queued_days() from public, anon;
grant execute on function public.my_queued_days() to authenticated;
