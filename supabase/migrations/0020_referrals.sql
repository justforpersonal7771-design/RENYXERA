-- RENYXERA — Release 7E: referral credits (both sides). Run once in the Supabase SQL Editor.
-- Safe to re-run.
--
-- A member shares /r/<code>. A NEW account (≤ 7 days old) claims it once. When that friend
-- submits their first test (server-graded attempt) with a confirmed email, BOTH accounts get
-- REFERRAL_DAYS of Pro. A referrer can earn at most MAX_CREDITED credits. No self-referral.

create table if not exists public.referral_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^[a-z0-9]{6,12}$'),
  created_at timestamptz not null default now()
);
alter table public.referral_codes enable row level security;
revoke all on public.referral_codes from anon, authenticated;

create table if not exists public.referrals (
  referred_id uuid primary key references auth.users(id) on delete cascade,
  referrer_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  credited_at timestamptz,
  check (referred_id <> referrer_id)
);
create index if not exists referrals_referrer_idx on public.referrals (referrer_id);
alter table public.referrals enable row level security;
revoke all on public.referrals from anon, authenticated;

-- The caller's code (created on first use).
create or replace function public.my_referral_code()
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); c text;
begin
  if uid is null then raise exception 'not signed in'; end if;
  select code into c from public.referral_codes where user_id = uid;
  if c is not null then return c; end if;
  loop
    c := substr(md5(gen_random_uuid()::text), 1, 8);
    begin
      insert into public.referral_codes (user_id, code) values (uid, c);
      return c;
    exception when unique_violation then
      select code into c from public.referral_codes where user_id = uid;
      if c is not null then return c; end if;
    end;
  end loop;
end;
$$;
revoke all on function public.my_referral_code() from public, anon;
grant execute on function public.my_referral_code() to authenticated;

-- A new account claims a code once. Returns 'ok' | 'invalid' | 'self' | 'already' | 'too_old'.
create or replace function public.claim_referral(p_code text)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); ref uuid; made timestamptz;
begin
  if uid is null then return 'invalid'; end if;
  select user_id into ref from public.referral_codes where code = lower(trim(p_code));
  if ref is null then return 'invalid'; end if;
  if ref = uid then return 'self'; end if;
  if exists (select 1 from public.referrals where referred_id = uid) then return 'already'; end if;
  select created_at into made from auth.users where id = uid;
  if made is null or made < now() - interval '7 days' then return 'too_old'; end if;
  insert into public.referrals (referred_id, referrer_id) values (uid, ref) on conflict do nothing;
  return 'ok';
end;
$$;
revoke all on function public.claim_referral(text) from public, anon;
grant execute on function public.claim_referral(text) to authenticated;

-- Grants Pro days to one account (extends from now or from the current end date).
create or replace function public.grant_pro_days(p_user uuid, p_days int, p_source text)
returns void language sql security definer set search_path = '' as $$
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (p_user, 'pro', now() + make_interval(days => p_days), p_source, now())
  on conflict (user_id) do update
    set plan = 'pro',
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => p_days),
        source = coalesce(e.source, p_source), updated_at = now();
$$;
revoke all on function public.grant_pro_days(uuid, int, text) from public, anon, authenticated;
grant execute on function public.grant_pro_days(uuid, int, text) to service_role;

-- Credits a pending referral once the referred account has submitted a test.
create or replace function public.credit_referral(p_referred uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r public.referrals; confirmed timestamptz; credited int;
  REFERRAL_DAYS constant int := 7; MAX_CREDITED constant int := 5;
begin
  select * into r from public.referrals where referred_id = p_referred and credited_at is null for update;
  if not found then return false; end if;
  select email_confirmed_at into confirmed from auth.users where id = p_referred;
  if confirmed is null then return false; end if;
  select count(*) into credited from public.referrals where referrer_id = r.referrer_id and credited_at is not null;
  update public.referrals set credited_at = now() where referred_id = p_referred;
  perform public.grant_pro_days(p_referred, REFERRAL_DAYS, 'referral');
  if credited < MAX_CREDITED then perform public.grant_pro_days(r.referrer_id, REFERRAL_DAYS, 'referral'); end if;
  return true;
end;
$$;
revoke all on function public.credit_referral(uuid) from public, anon, authenticated;
grant execute on function public.credit_referral(uuid) to service_role;

-- First submitted test → credit (no app code path can forget it).
create or replace function public.referral_on_submit()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.submitted_at is not null and (tg_op = 'INSERT' or old.submitted_at is null) then
    perform public.credit_referral(new.user_id);
  end if;
  return new;
end;
$$;
drop trigger if exists referral_on_submit on public.exam_attempts;
create trigger referral_on_submit after insert or update of submitted_at on public.exam_attempts
  for each row execute function public.referral_on_submit();

-- The caller's referral stats.
create or replace function public.my_referrals()
returns table (code text, joined int, credited int) language sql stable security definer set search_path = '' as $$
  select (select c.code from public.referral_codes c where c.user_id = auth.uid()),
         (select count(*)::int from public.referrals where referrer_id = auth.uid()),
         (select count(*)::int from public.referrals where referrer_id = auth.uid() and credited_at is not null);
$$;
revoke all on function public.my_referrals() from public, anon;
grant execute on function public.my_referrals() to authenticated;

-- ── 7E: acquisition (UTM) + weekly growth metrics ──────────────────────────────────────
alter table public.profiles add column if not exists acquisition jsonb;

-- Stores the first-touch UTM/referrer once per account (later calls are ignored).
create or replace function public.set_acquisition(p jsonb)
returns void language sql security definer set search_path = '' as $$
  update public.profiles
     set acquisition = jsonb_strip_nulls(jsonb_build_object(
           'source', left(p->>'source', 60), 'medium', left(p->>'medium', 60),
           'campaign', left(p->>'campaign', 80), 'referrer', left(p->>'referrer', 120),
           'landing', left(p->>'landing', 120), 'at', now()))
   where id = auth.uid() and acquisition is null;
$$;
revoke all on function public.set_acquisition(jsonb) from public, anon;
grant execute on function public.set_acquisition(jsonb) to authenticated;

-- Weekly metrics for the owner (service role only): sign-ups by channel, activation
-- (first test within 24 h of sign-up) and D7 / D30 retention (a test 7+/30+ days later).
create or replace function public.weekly_growth_metrics(p_weeks int default 8)
returns table (week date, channel text, signups int, activated_24h int, retained_d7 int, retained_d30 int)
language sql stable security definer set search_path = '' as $$
  with u as (
    select a.id, a.created_at, date_trunc('week', a.created_at)::date as week,
           coalesce(p.acquisition->>'source', case when r.referred_id is not null then 'referral' else 'direct' end) as channel
    from auth.users a
    left join public.profiles p on p.id = a.id
    left join public.referrals r on r.referred_id = a.id
    where a.created_at >= date_trunc('week', now()) - make_interval(weeks => p_weeks)
  )
  select u.week, u.channel, count(*)::int,
         count(*) filter (where exists (select 1 from public.exam_attempts e where e.user_id = u.id and e.submitted_at <= u.created_at + interval '24 hours'))::int,
         count(*) filter (where exists (select 1 from public.exam_attempts e where e.user_id = u.id and e.submitted_at >= u.created_at + interval '7 days'))::int,
         count(*) filter (where exists (select 1 from public.exam_attempts e where e.user_id = u.id and e.submitted_at >= u.created_at + interval '30 days'))::int
  from u group by u.week, u.channel order by u.week desc, 3 desc;
$$;
revoke all on function public.weekly_growth_metrics(int) from public, anon, authenticated;
grant execute on function public.weekly_growth_metrics(int) to service_role;

-- ── Optional mobile number at onboarding (contact about updates, with explicit consent) ──
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists contact_opt_in boolean not null default false;
do $$ begin
  alter table public.profiles add constraint profiles_phone_format check (phone is null or phone ~ '^\+91[6-9][0-9]{9}$');
exception when duplicate_object then null; end $$;

-- ── Three tiers: free · plus (silver) · pro (gold) ─────────────────────────────────────
alter table public.entitlements drop constraint if exists entitlements_plan_check;
alter table public.entitlements add constraint entitlements_plan_check check (plan in ('free', 'plus', 'pro'));

-- The account's active tier right now ('free' when nothing is active).
create or replace function public.account_tier(p_user uuid)
returns text language sql stable security definer set search_path = '' as $$
  select coalesce((select e.plan from public.entitlements e
                    where e.user_id = p_user and e.plan in ('plus', 'pro')
                      and e.valid_until is not null and e.valid_until > now()), 'free');
$$;
revoke all on function public.account_tier(uuid) from public, anon;
grant execute on function public.account_tier(uuid) to authenticated, service_role;

-- Paid orders grant the tier named by the plan id (plus_* → plus, pro_* → pro). Buying the
-- same tier extends it; buying Pro while on Plus upgrades; buying Plus never downgrades Pro.
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders; t text;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;
  t := case when o.plan_id like 'plus%' then 'plus' else 'pro' end;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (o.user_id, t, now() + make_interval(days => o.period_days), 'razorpay', now())
  on conflict (user_id) do update
    set plan = case when e.plan = 'pro' and e.valid_until > now() and t = 'plus' then 'pro' else t end,
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now();
  return true;
end;
$$;

-- ── Premium avatars: only qualifying tiers can SET them (keep in sync with dicebear-styles.ts) ──
create or replace function public.profiles_premium_avatar()
returns trigger language plpgsql security definer set search_path = '' as $$
declare need text; have text;
begin
  if tg_op = 'UPDATE' and new.avatar_style is not distinct from old.avatar_style then return new; end if;
  need := case
    when new.avatar_style in ('avataaars', 'big-smile', 'open-peeps', 'personas', 'pixel-art', 'fun-emoji') then 'plus'
    when new.avatar_style in ('toon-head', 'voxel-art', 'clay', 'dylan', 'cameo', 'miniavs') then 'pro'
    else 'free' end;
  if need = 'free' then return new; end if;
  have := public.account_tier(new.id);
  if (need = 'plus' and have in ('plus', 'pro')) or (need = 'pro' and have = 'pro') then return new; end if;
  raise exception 'premium_avatar_requires_%', need using errcode = 'P0001';
end;
$$;
drop trigger if exists profiles_premium_avatar on public.profiles;
create trigger profiles_premium_avatar before insert or update of avatar_style on public.profiles
  for each row execute function public.profiles_premium_avatar();
