-- RENYXERA — Release 8: multi-branch (docs/MULTI_BRANCH_DESIGN.md v2). Run once in the
-- Supabase SQL Editor. Safe to re-run.
--
-- Rules enforced here:
--   * A signed-in account belongs to ONE branch (profiles.target_branch).
--   * It is chosen once (set_initial_branch) and may be changed exactly ONCE more
--     (change_my_branch). After that it is locked. Clients can no longer write
--     target_branch directly; only these two functions (and the audited admin one) can.
--   * Plus/Pro (entitlements) belong to the account's branch: paid features only apply
--     while entitlements.branch_code = profiles.target_branch, and the one change moves it.
--   * Every pick/change is audited in branch_switches; nothing is ever deleted.

-- ── 1. Profile branch state ─────────────────────────────────────────────────────────────
alter table public.profiles add column if not exists branch_confirmed_at timestamptz;
alter table public.profiles add column if not exists branch_changes_used smallint not null default 0;
alter table public.profiles add column if not exists branch_changed_at timestamptz;
alter table public.profiles add column if not exists branch_previous text references public.branches(code);
-- Owner/tester access to a branch before it is live (never granted to clients).
alter table public.profiles add column if not exists beta_branches text[] not null default '{}';
alter table public.profiles drop constraint if exists profiles_branch_changes_used_check;
alter table public.profiles add constraint profiles_branch_changes_used_check check (branch_changes_used in (0, 1));

-- Everyone who finished onboarding before this release chose CSE (the only branch): their
-- branch counts as confirmed, and they still have their one change.
update public.profiles set branch_confirmed_at = coalesce(onboarded_at, created_at, now())
 where branch_confirmed_at is null and onboarded_at is not null;

-- Clients may no longer write target_branch directly.
revoke update (target_branch) on public.profiles from authenticated, anon;

-- ── 2. Audit ────────────────────────────────────────────────────────────────────────────
create table if not exists public.branch_switches (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  from_branch text references public.branches(code),
  to_branch text not null references public.branches(code),
  via text not null check (via in ('onboarding', 'final_change', 'admin')),
  note text check (note is null or char_length(note) <= 300),
  at timestamptz not null default now()
);
create index if not exists branch_switches_user_idx on public.branch_switches (user_id, at desc);
alter table public.branch_switches enable row level security;
drop policy if exists branch_switches_select_own on public.branch_switches;
create policy branch_switches_select_own on public.branch_switches for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.branch_switches from anon, authenticated;

-- A branch the caller may pick: live, or in their beta list.
create or replace function public.branch_open_to(p_user uuid, p_code text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.branches b where b.code = p_code and b.status = 'live')
      or exists (select 1 from public.profiles p where p.id = p_user and p_code = any(p.beta_branches));
$$;
revoke all on function public.branch_open_to(uuid, text) from public, anon, authenticated;

-- ── 3. First pick (onboarding) ──────────────────────────────────────────────────────────
create or replace function public.set_initial_branch(p_code text)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); p public.profiles;
begin
  if uid is null then raise exception 'not signed in'; end if;
  select * into p from public.profiles where id = uid for update;
  if not found then raise exception 'no profile'; end if;
  if p.branch_confirmed_at is not null then return 'already_confirmed'; end if;
  if not public.branch_open_to(uid, p_code) then return 'branch_not_open'; end if;
  update public.profiles set target_branch = p_code, branch_confirmed_at = now() where id = uid;
  update public.entitlements set branch_code = p_code where user_id = uid;
  insert into public.branch_switches (user_id, from_branch, to_branch, via) values (uid, p.target_branch, p_code, 'onboarding');
  return 'ok';
end;
$$;
revoke all on function public.set_initial_branch(text) from public, anon;
grant execute on function public.set_initial_branch(text) to authenticated;

-- ── 4. The one final change ─────────────────────────────────────────────────────────────
create or replace function public.change_my_branch(p_to text)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); p public.profiles;
begin
  if uid is null then raise exception 'not signed in'; end if;
  select * into p from public.profiles where id = uid for update;
  if not found then raise exception 'no profile'; end if;
  if p.branch_changes_used >= 1 then return 'locked'; end if;
  if p_to = p.target_branch then return 'same_branch'; end if;
  if not public.branch_open_to(uid, p_to) then return 'branch_not_open'; end if;
  -- Never mid-way through a live All-India mock.
  if exists (select 1 from public.exam_attempts a where a.user_id = uid and a.status = 'in_progress' and a.mock_id is not null
             and a.server_started_at + make_interval(secs => a.duration_seconds) > now()) then
    return 'mock_in_progress';
  end if;
  update public.profiles
     set branch_previous = p.target_branch, target_branch = p_to,
         branch_changes_used = 1, branch_changed_at = now(),
         branch_confirmed_at = coalesce(p.branch_confirmed_at, now())
   where id = uid;
  -- Plus/Pro moves with the account (same plan, same expiry). The only time it can move.
  update public.entitlements set branch_code = p_to, updated_at = now() where user_id = uid;
  insert into public.branch_switches (user_id, from_branch, to_branch, via) values (uid, p.target_branch, p_to, 'final_change');
  return 'ok';
end;
$$;
revoke all on function public.change_my_branch(text) from public, anon;
grant execute on function public.change_my_branch(text) to authenticated;

-- Exceptional, audited, service role only (e.g. a branch pulled back after launch, design E5).
-- Does NOT consume the user's change.
create or replace function public.admin_set_branch(p_user uuid, p_to text, p_note text)
returns void language plpgsql security definer set search_path = '' as $$
declare old text;
begin
  select target_branch into old from public.profiles where id = p_user for update;
  update public.profiles set target_branch = p_to where id = p_user;
  update public.entitlements set branch_code = p_to, updated_at = now() where user_id = p_user;
  insert into public.branch_switches (user_id, from_branch, to_branch, via, note) values (p_user, old, p_to, 'admin', p_note);
end;
$$;
revoke all on function public.admin_set_branch(uuid, text, text) from public, anon, authenticated;
grant execute on function public.admin_set_branch(uuid, text, text) to service_role;

-- ── 5. Plus / Pro tied to the branch ────────────────────────────────────────────────────
alter table public.entitlements add column if not exists branch_code text references public.branches(code);
update public.entitlements e set branch_code = coalesce(e.branch_code, p.target_branch, 'CSE')
  from public.profiles p where p.id = e.user_id and e.branch_code is null;
update public.entitlements set branch_code = 'CSE' where branch_code is null;
alter table public.entitlements alter column branch_code set not null;
alter table public.entitlements alter column branch_code set default 'CSE';

alter table public.billing_orders add column if not exists branch_code text references public.branches(code);
alter table public.billing_orders add column if not exists lock_confirmation_id bigint;

-- The checkout "this subscription is for <branch>" signal: append-only, never editable.
create table if not exists public.branch_lock_confirmations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  branch_code text not null references public.branches(code),
  plan_id text not null check (char_length(plan_id) <= 40),
  typed_code text not null check (char_length(typed_code) <= 8),
  ip_hash text, ua_hash text,
  confirmed_at timestamptz not null default now()
);
alter table public.branch_lock_confirmations enable row level security;
drop policy if exists blc_select_own on public.branch_lock_confirmations;
create policy blc_select_own on public.branch_lock_confirmations for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.branch_lock_confirmations from anon, authenticated;

-- Paid only while the plan belongs to the account's CURRENT branch.
create or replace function public.is_pro(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.entitlements e join public.profiles p on p.id = e.user_id
    where e.user_id = p_user and e.plan = 'pro' and e.valid_until is not null and e.valid_until > now()
      and e.branch_code = p.target_branch
  );
$$;
revoke all on function public.is_pro(uuid) from public, anon, authenticated;
grant execute on function public.is_pro(uuid) to service_role;

-- Grants follow the ORDER's branch (recorded at checkout), never the client.
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders; t text; br text;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;
  select coalesce(o.branch_code, p.target_branch, 'CSE') into br from public.profiles p where p.id = o.user_id;
  br := coalesce(br, 'CSE');
  t := case when o.plan_id like 'plus%' then 'plus' else 'pro' end;
  if o.upgrade_credit_paise > 0 then
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at, branch_code)
    values (o.user_id, 'pro', now() + make_interval(days => o.period_days), 'razorpay', now(), br)
    on conflict (user_id) do update set plan = 'pro', valid_until = now() + make_interval(days => o.period_days), source = 'razorpay', updated_at = now(), branch_code = br;
    return true;
  end if;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at, branch_code)
  values (o.user_id, t, now() + make_interval(days => o.period_days), 'razorpay', now(), br)
  on conflict (user_id) do update
    set plan = case when e.plan = 'pro' and e.valid_until > now() and t = 'plus' then 'pro' else t end,
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now(), branch_code = br;
  return true;
end;
$$;
revoke all on function public.apply_paid_order(text, text) from public, anon, authenticated;
grant execute on function public.apply_paid_order(text, text) to service_role;

-- ── 6. Cloud sync partition ─────────────────────────────────────────────────────────────
alter table public.user_records add column if not exists branch_code text not null default 'CSE' references public.branches(code);
update public.user_records set branch_code = 'ECE' where key like 'GATE_EC_%' and branch_code <> 'ECE';
create index if not exists user_records_user_branch_idx on public.user_records (user_id, branch_code);

-- ── 7. ECE question rows may exist before launch (seeded for the owner's beta) ─────────
-- Nothing to do: public.branches already has ECE as 'coming_soon'. Flip to 'live' at launch:
--   update public.branches set status = 'live' where code = 'ECE';
-- Owner beta before launch:
--   update public.profiles set beta_branches = array['ECE'] where id = '<your user id>';
