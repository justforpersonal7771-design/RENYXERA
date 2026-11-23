-- "Notify me" for features a branch does not have yet (Forge questions, study books). One row per account, branch and feature.
-- Written by /api/feature-waitlist with the service role; nobody reads it from the browser.
create table if not exists public.feature_waitlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  branch_code text not null,
  feature text not null check (feature in ('forge', 'study')),
  created_at timestamptz not null default now(),
  primary key (user_id, branch_code, feature)
);
alter table public.feature_waitlist enable row level security;
-- no policies on purpose: only the service role (API route) reads or writes it
