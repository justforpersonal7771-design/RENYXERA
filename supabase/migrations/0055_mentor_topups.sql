-- 0055: AI Mentor recharge packs (R27 section 3, owner decision 1 Nov 2026). Safe to re-run.
-- A pack is a one-off purchase of Mentor tokens that expire after 90 days and are spent only after the daily allowance runs out.
-- A pack never touches the plan or entitlements. Rows are written only by the service role (the paid-order function below).
-- Packs: topup_small 150,000 tokens, topup_medium 450,000, topup_large 1,200,000.

create table if not exists public.ai_credit_packs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id bigint not null unique references public.billing_orders(id) on delete restrict,
  pack_id text not null check (pack_id in ('topup_small', 'topup_medium', 'topup_large')),
  tokens_total int not null check (tokens_total > 0),
  tokens_left int not null check (tokens_left >= 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_credit_packs_user_idx on public.ai_credit_packs (user_id, expires_at);
alter table public.ai_credit_packs enable row level security;
revoke all on public.ai_credit_packs from anon;
revoke insert, update, delete on public.ai_credit_packs from authenticated;
drop policy if exists ai_credit_packs_read_own on public.ai_credit_packs;
create policy ai_credit_packs_read_own on public.ai_credit_packs for select to authenticated using (user_id = (select auth.uid()));

-- Marks an order paid, then either extends the plan (as before) or, for a topup_* order, creates the pack. Exactly once per order.
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders; t text; br text; tk int;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;

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

-- Tokens left across a student's unexpired packs.
create or replace function public.ai_pack_balance(p_user uuid)
returns int language sql stable security definer set search_path = '' as $$
  select coalesce(sum(tokens_left), 0)::int from public.ai_credit_packs where user_id = p_user and expires_at > now() and tokens_left > 0;
$$;
revoke all on function public.ai_pack_balance(uuid) from public, anon, authenticated;
grant execute on function public.ai_pack_balance(uuid) to service_role;

-- Spends p_tokens from the packs that expire first, all in one transaction (two requests at once cannot overspend).
-- Returns the tokens left afterwards, or -1 if the packs do not hold enough (nothing is spent then).
create or replace function public.spend_ai_pack(p_user uuid, p_tokens int)
returns int language plpgsql security definer set search_path = '' as $$
declare r record; need int := greatest(p_tokens, 0); have int; take int;
begin
  select coalesce(sum(tokens_left), 0) into have from public.ai_credit_packs where user_id = p_user and expires_at > now() and tokens_left > 0;
  if have < need then return -1; end if;
  for r in select id, tokens_left from public.ai_credit_packs where user_id = p_user and expires_at > now() and tokens_left > 0 order by expires_at, id for update loop
    exit when need = 0;
    take := least(r.tokens_left, need);
    update public.ai_credit_packs set tokens_left = tokens_left - take where id = r.id;
    need := need - take;
  end loop;
  return have - greatest(p_tokens, 0);
end;
$$;
revoke all on function public.spend_ai_pack(uuid, int) from public, anon, authenticated;
grant execute on function public.spend_ai_pack(uuid, int) to service_role;
