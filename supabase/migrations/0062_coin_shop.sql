-- Coin shop: spend coins on Mentor tokens and avatar frames. Spending is one atomic function so a balance can never go below zero.
alter table public.coins_ledger drop constraint if exists coins_ledger_amount_check;
alter table public.coins_ledger add constraint coins_ledger_amount_check check (amount <> 0);
alter table public.coins_ledger drop constraint if exists coins_ledger_kind_check;
alter table public.coins_ledger add constraint coins_ledger_kind_check check (kind in ('daily','streak_bonus','battle_win','battle_draw','battle_play','spend'));

-- Mentor tokens bought with coins live beside paid recharge packs (no billing order).
alter table public.ai_credit_packs alter column order_id drop not null;
alter table public.ai_credit_packs drop constraint if exists ai_credit_packs_pack_id_check;
alter table public.ai_credit_packs add constraint ai_credit_packs_pack_id_check check (pack_id in ('topup_small','topup_medium','topup_large','coins_mentor'));

create table if not exists public.user_unlocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null check (item_id ~ '^[a-z0-9_]{2,40}$'),
  equipped boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
alter table public.user_unlocks enable row level security;
revoke all on public.user_unlocks from anon;
revoke insert, update, delete on public.user_unlocks from authenticated;
drop policy if exists unlocks_read on public.user_unlocks;
create policy unlocks_read on public.user_unlocks for select to authenticated using ((select auth.uid()) = user_id);

-- Spend p_cost coins for p_item once (p_ref makes each purchase unique). Returns the new balance, or -1 if there are not enough coins.
create or replace function public.spend_coins(p_user uuid, p_item text, p_cost int, p_ref text)
returns int language plpgsql security definer set search_path = public as $$
declare bal int;
begin
  perform pg_advisory_xact_lock(hashtext('coins:' || p_user::text));
  select coalesce(sum(amount), 0) into bal from coins_ledger where user_id = p_user;
  if p_cost <= 0 or bal < p_cost then return -1; end if;
  insert into coins_ledger (user_id, kind, amount, ref) values (p_user, 'spend', -p_cost, p_item || ':' || p_ref);
  return bal - p_cost;
end $$;
revoke all on function public.spend_coins(uuid, text, int, text) from public, anon, authenticated;
