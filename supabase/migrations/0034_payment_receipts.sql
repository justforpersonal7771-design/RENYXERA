-- Receipts (Profile → Plan & payments): remember how an order was paid, for the receipt.
-- Only the method and a masked detail (e.g. "Card ····1234 (visa)") — never full card numbers or UPI ids.
alter table public.billing_orders add column if not exists payment_method text check (char_length(payment_method) <= 40);
alter table public.billing_orders add column if not exists payment_detail text check (char_length(payment_detail) <= 80);
