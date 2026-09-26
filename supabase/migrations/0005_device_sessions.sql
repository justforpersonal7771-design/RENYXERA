-- RENYXERA — Step 7 (4F): Active Devices + sign out a single device.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- One row per (account, browser/device). Written only by our server (service_role) from
-- the verified JWT, so session_id can't be spoofed. Users may read their own rows.
create table if not exists public.device_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null check (char_length(device_id) between 8 and 64),
  session_id uuid,
  label text not null default 'Unknown device' check (char_length(label) <= 80),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, device_id)
);

create index if not exists device_sessions_user_idx on public.device_sessions(user_id, last_seen_at desc);

alter table public.device_sessions enable row level security;

drop policy if exists "users read own devices" on public.device_sessions;
create policy "users read own devices"
  on public.device_sessions for select
  to authenticated
  using (auth.uid() = user_id);
-- No insert/update/delete policy: only the server writes.

-- Ends one Supabase Auth session (its refresh token stops working; the short-lived access
-- token expires within the hour, and the device signs itself out on its next check-in).
-- Only callable with the service_role key, and only for a session owned by p_user.
create or replace function public.revoke_auth_session(p_user uuid, p_session uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.sessions where id = p_session and user_id = p_user;
$$;

revoke all on function public.revoke_auth_session(uuid, uuid) from public, anon, authenticated;
grant execute on function public.revoke_auth_session(uuid, uuid) to service_role;
