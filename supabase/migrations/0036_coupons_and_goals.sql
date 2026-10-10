-- Coupons (server-validated promo codes) and the diagnostic goals saved on the profile.

-- 1. Goals from the "Start here" card, saved with the account instead of only on one device.
alter table public.profiles add column if not exists weekly_study_days int check (weekly_study_days between 1 and 7);
alter table public.profiles add column if not exists target_air int check (target_air between 1 and 100000);
grant update (weekly_study_days, target_air) on public.profiles to authenticated;

-- 2. Coupons. Create them in the SQL editor, for example:
--    insert into coupons (code, percent_off, max_uses, expires_at, note) values ('FRIEND20', 20, 100, '2027-03-31', 'club offer');
create table if not exists public.coupons (
  code text primary key check (code = upper(code) and char_length(code) between 3 and 32),
  percent_off int check (percent_off between 1 and 60),
  amount_off_paise int check (amount_off_paise between 100 and 500000),
  max_uses int check (max_uses > 0),
  expires_at timestamptz,
  plans text[],                       -- null = any plan; otherwise exact plan ids, for example {plus_monthly,plus_yearly}
  active boolean not null default true,
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  check ((percent_off is not null) <> (amount_off_paise is not null))
);
create table if not exists public.coupon_redemptions (
  id bigint generated always as identity primary key,
  code text not null references public.coupons(code) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists coupon_redemptions_code_idx on public.coupon_redemptions (code);
create index if not exists coupon_redemptions_user_idx on public.coupon_redemptions (user_id, code);
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
revoke all on public.coupons, public.coupon_redemptions from anon, authenticated;

-- 3. Orders remember which coupon was used and how much it took off (shown on the receipt).
alter table public.billing_orders add column if not exists coupon_code text;
alter table public.billing_orders add column if not exists discount_paise integer not null default 0 check (discount_paise >= 0);
