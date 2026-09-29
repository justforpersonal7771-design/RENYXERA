-- RENYXERA — Release 7A: prorated Plus → Pro upgrade. Run once in the Supabase SQL Editor.
-- Safe to re-run.
--
-- An upgrade order carries the paise credited for the unused part of the member's Plus plan
-- (computed on the server from their last paid Plus order). On payment the account becomes
-- Pro for the FULL new period starting now — the unused Plus time is not stacked on top,
-- because it was already refunded as a price credit. Net effect: Plus-then-Pro members pay
-- exactly what a direct Pro buyer pays for the same Pro time.

alter table public.billing_orders add column if not exists upgrade_credit_paise integer not null default 0 check (upgrade_credit_paise >= 0);

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
  if o.upgrade_credit_paise > 0 then
    -- Prorated upgrade: full Pro period from now, replacing the refunded Plus time.
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at)
    values (o.user_id, 'pro', now() + make_interval(days => o.period_days), 'razorpay', now())
    on conflict (user_id) do update set plan = 'pro', valid_until = now() + make_interval(days => o.period_days), source = 'razorpay', updated_at = now();
    return true;
  end if;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (o.user_id, t, now() + make_interval(days => o.period_days), 'razorpay', now())
  on conflict (user_id) do update
    set plan = case when e.plan = 'pro' and e.valid_until > now() and t = 'plus' then 'pro' else t end,
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now();
  return true;
end;
$$;
revoke all on function public.apply_paid_order(text, text) from public, anon, authenticated;
grant execute on function public.apply_paid_order(text, text) to service_role;
