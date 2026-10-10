-- GATE season pass (docs/GROWTH_TASKS.md): one payment valid until 31 March of the chosen exam year,
-- up to 4 years ahead, so an order's period can be longer than the old 800-day cap.
alter table public.billing_orders drop constraint if exists billing_orders_period_days_check;
alter table public.billing_orders add constraint billing_orders_period_days_check check (period_days between 1 and 2200);
