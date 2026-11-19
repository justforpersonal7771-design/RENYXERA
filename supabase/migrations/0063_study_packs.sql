-- 0063: Study packs (docs/study-materials/13-PRICING-BUNDLES-AND-OFFERS.md §6). Safe to re-run.
-- Study materials are a separate product from Plus and Pro. A paid order lists the subject packs it grants in billing_orders.study_packs
-- (a single pack, a curated bundle, build-your-own, or Complete CS added at plan checkout). apply_paid_order expands that list into
-- one study_access row per pack, exactly once per order; a later purchase of the same pack extends it instead of double-granting.
-- Access lasts until the end of the buyer's GATE season: the server computes it at order time (billing_orders.study_valid_until).

alter table public.billing_orders add column if not exists study_packs text[];
alter table public.billing_orders add column if not exists study_valid_until timestamptz;

create table if not exists public.study_access (
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id text not null check (pack_id in ('os','toc','cn','coa','algo','dm','dbms','dl','pds','cd','maths','apt')),
  order_id bigint not null references public.billing_orders(id) on delete restrict,
  valid_until timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, pack_id)
);
create index if not exists study_access_order_idx on public.study_access (order_id);
alter table public.study_access enable row level security;
revoke all on public.study_access from anon;
revoke insert, update, delete on public.study_access from authenticated;
drop policy if exists study_access_read_own on public.study_access;
create policy study_access_read_own on public.study_access for select to authenticated using (user_id = (select auth.uid()));

-- Marks an order paid; grants its study packs (if any); then a study-only order stops, a topup creates its pack, a plan extends as before.
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders; t text; br text; tk int; pk text; until timestamptz;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;

  if o.study_packs is not null and array_length(o.study_packs, 1) > 0 then
    until := coalesce(o.study_valid_until, now() + interval '365 days');
    foreach pk in array o.study_packs loop
      insert into public.study_access as s (user_id, pack_id, order_id, valid_until)
      values (o.user_id, pk, o.id, until)
      on conflict (user_id, pack_id) do update
        set valid_until = greatest(s.valid_until, excluded.valid_until), order_id = excluded.order_id, updated_at = now();
    end loop;
  end if;
  if o.plan_id like 'study\_%' then return true; end if;

  if o.plan_id like 'topup\_%' then
    tk := case o.plan_id when 'topup_small' then 150000 when 'topup_medium' then 450000 when 'topup_large' then 1200000 else 0 end;
    if tk = 0 then return true; end if;
    insert into public.ai_credit_packs (user_id, order_id, pack_id, tokens_total, tokens_left, expires_at)
    values (o.user_id, o.id, o.plan_id, tk, tk, now() + make_interval(days => o.period_days))
    on conflict (order_id) do nothing;
    return true;
  end if;

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
