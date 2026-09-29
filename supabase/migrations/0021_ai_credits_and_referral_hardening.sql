-- RENYXERA — Release 7E hardening. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- 1. Bonus AI credits: a small ledger spent only after the daily allowance runs out.
-- 2. Referrals no longer grant Pro. The inviter gets 1 day of Plus + 15 AI credits, the friend
--    10 AI credits — and only after REAL use: tests on 2 different IST days, each with 10+
--    answered questions and no integrity flags; never when the two accounts share a device;
--    at most 3 rewards a month and 10 in total per inviter.
-- 4. Free accounts no longer get a daily AI allowance: they get a one-time teaser of 5 AI
--    requests (ensure_welcome_ai), then earn more via sponsor breaks / referrals, or upgrade.
-- 3. Sponsor breaks: watching a short sponsor break earns a few AI credits, fewer each time
--    (+5, +3, +2, +1; max 4 a day), expiring at the end of the IST day. Claims are one-time.

-- ── 1. Bonus AI credits ─────────────────────────────────────────────────────────────────
create table if not exists public.ai_bonus_credits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  remaining int not null check (remaining >= 0),
  granted int not null check (granted > 0),
  reason text not null check (reason in ('referral', 'sponsor', 'admin', 'welcome')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_bonus_credits_user_idx on public.ai_bonus_credits (user_id, expires_at);
alter table public.ai_bonus_credits enable row level security;
revoke all on public.ai_bonus_credits from anon, authenticated;

create or replace function public.grant_ai_credits(p_user uuid, p_credits int, p_reason text, p_expires timestamptz)
returns void language sql security definer set search_path = '' as $$
  insert into public.ai_bonus_credits (user_id, remaining, granted, reason, expires_at)
  values (p_user, p_credits, p_credits, p_reason, p_expires);
$$;
revoke all on function public.grant_ai_credits(uuid, int, text, timestamptz) from public, anon, authenticated;
grant execute on function public.grant_ai_credits(uuid, int, text, timestamptz) to service_role;

-- Spends one credit (soonest-expiring first). Returns true if one was available.
create or replace function public.consume_ai_bonus(p_user uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r_id bigint;
begin
  select id into r_id from public.ai_bonus_credits
   where user_id = p_user and remaining > 0 and expires_at > now()
   order by expires_at limit 1 for update skip locked;
  if r_id is null then return false; end if;
  update public.ai_bonus_credits set remaining = remaining - 1 where id = r_id;
  return true;
end;
$$;
revoke all on function public.consume_ai_bonus(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_bonus(uuid) to service_role;

-- The caller's live bonus balance (for the UI).
create or replace function public.my_ai_bonus()
returns int language sql stable security definer set search_path = '' as $$
  select coalesce(sum(remaining), 0)::int from public.ai_bonus_credits
   where user_id = auth.uid() and remaining > 0 and expires_at > now();
$$;
revoke all on function public.my_ai_bonus() from public, anon;
grant execute on function public.my_ai_bonus() to authenticated;

-- ── 2. Referral hardening ───────────────────────────────────────────────────────────────
create or replace function public.credit_referral(p_referred uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r public.referrals; confirmed timestamptz; active_days int; month_count int; total_count int;
begin
  select * into r from public.referrals where referred_id = p_referred and credited_at is null for update;
  if not found then return false; end if;

  select email_confirmed_at into confirmed from auth.users where id = p_referred;
  if confirmed is null then return false; end if;

  -- Real use: submitted, unflagged tests with 10+ answered questions, on 2 different IST days.
  select count(distinct (a.submitted_at at time zone 'Asia/Kolkata')::date) into active_days
    from public.exam_attempts a
   where a.user_id = p_referred and a.submitted_at is not null
     and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
     and (select count(*) from public.exam_responses x
           where x.attempt_id = a.id and (x.nat_value is not null or coalesce(array_length(x.selected_option_ids, 1), 0) > 0)) >= 10;
  if active_days < 2 then return false; end if;

  -- Same device ever used by both accounts → never rewarded (and closed for good).
  if exists (select 1 from public.device_sessions d1 join public.device_sessions d2 on d1.device_id = d2.device_id
              where d1.user_id = p_referred and d2.user_id = r.referrer_id) then
    update public.referrals set credited_at = now() where referred_id = p_referred;
    return false;
  end if;

  select count(*) filter (where credited_at >= date_trunc('month', now())), count(*) filter (where credited_at is not null)
    into month_count, total_count
    from public.referrals where referrer_id = r.referrer_id;

  update public.referrals set credited_at = now() where referred_id = p_referred;
  perform public.grant_ai_credits(p_referred, 10, 'referral', now() + interval '30 days');
  if month_count < 3 and total_count < 10 then
    perform public.grant_pro_days_tier(r.referrer_id, 1, 'plus', 'referral');
    perform public.grant_ai_credits(r.referrer_id, 15, 'referral', now() + interval '30 days');
  end if;
  return true;
end;
$$;
revoke all on function public.credit_referral(uuid) from public, anon, authenticated;
grant execute on function public.credit_referral(uuid) to service_role;

-- Tier-aware grant: never downgrades an active higher tier; extends the same tier.
create or replace function public.grant_pro_days_tier(p_user uuid, p_days int, p_tier text, p_source text)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.entitlements;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at)
    values (p_user, p_tier, now() + make_interval(days => p_days), p_source, now());
  elsif e.plan = 'pro' and e.valid_until > now() and p_tier = 'plus' then
    return; -- already on a higher tier
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

-- ── 3. Sponsor breaks ───────────────────────────────────────────────────────────────────
create table if not exists public.sponsor_claims (
  nonce text primary key check (char_length(nonce) between 16 and 64),
  user_id uuid not null references auth.users(id) on delete cascade,
  credits int not null,
  claimed_at timestamptz not null default now()
);
create index if not exists sponsor_claims_user_day_idx on public.sponsor_claims (user_id, claimed_at);
alter table public.sponsor_claims enable row level security;
revoke all on public.sponsor_claims from anon, authenticated;

-- Claims one break (nonce is single-use). Returns credits granted (0 = daily cap reached).
create or replace function public.claim_sponsor_break(p_user uuid, p_nonce text)
returns int language plpgsql security definer set search_path = '' as $$
declare n int; credits int; day_end timestamptz;
begin
  select count(*) into n from public.sponsor_claims
   where user_id = p_user and (claimed_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date;
  credits := case n when 0 then 5 when 1 then 3 when 2 then 2 when 3 then 1 else 0 end;
  if credits = 0 then return 0; end if;
  insert into public.sponsor_claims (nonce, user_id, credits) values (p_nonce, p_user, credits); -- unique → replay fails
  day_end := (((now() at time zone 'Asia/Kolkata')::date + 1)::timestamp at time zone 'Asia/Kolkata');
  perform public.grant_ai_credits(p_user, credits, 'sponsor', day_end);
  return credits;
end;
$$;
revoke all on function public.claim_sponsor_break(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_sponsor_break(uuid, text) to service_role;

-- Today's breaks for the caller (UI: how many left and what the next one pays).
create or replace function public.my_sponsor_breaks_today()
returns int language sql stable security definer set search_path = '' as $$
  select count(*)::int from public.sponsor_claims
   where user_id = auth.uid() and (claimed_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date;
$$;
revoke all on function public.my_sponsor_breaks_today() from public, anon;
grant execute on function public.my_sponsor_breaks_today() to authenticated;

-- ── 4. One-time free AI teaser ─────────────────────────────────────────────────────────
-- Grants 5 welcome AI requests exactly once per account (called by the AI route).
create or replace function public.ensure_welcome_ai(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.ai_bonus_credits where user_id = p_user and reason = 'welcome') then return; end if;
  perform pg_advisory_xact_lock(hashtext('welcome_ai:' || p_user::text));
  if exists (select 1 from public.ai_bonus_credits where user_id = p_user and reason = 'welcome') then return; end if;
  insert into public.ai_bonus_credits (user_id, remaining, granted, reason, expires_at)
  values (p_user, 5, 5, 'welcome', now() + interval '10 years');
end;
$$;
revoke all on function public.ensure_welcome_ai(uuid) from public, anon, authenticated;
grant execute on function public.ensure_welcome_ai(uuid) to service_role;
