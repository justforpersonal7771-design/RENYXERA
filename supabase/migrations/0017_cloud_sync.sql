-- RENYXERA — 4I Cloud Sync: bookmarks, mistakes and finished tests follow the account
-- across devices. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- One row per (account, kind, key). The browser keeps working offline from IndexedDB and
-- syncs through this table: local changes are queued and upserted; other devices pull rows
-- changed since their last pull and merge them (lib/sync/sync-engine.ts). Deletions are
-- kept as tombstones (deleted = true) so they reach every device.

create table if not exists public.user_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('bookmark', 'mistake', 'session')),
  key text not null check (char_length(key) <= 120),
  data jsonb,
  deleted boolean not null default false,
  client_updated_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, key),
  check (data is null or pg_column_size(data) <= 262144)
);
create index if not exists user_records_pull_idx on public.user_records (user_id, updated_at);

-- Server clock orders pulls (clients' clocks can be wrong).
create or replace function public.user_records_touch()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;
drop trigger if exists user_records_touch on public.user_records;
create trigger user_records_touch before insert or update on public.user_records
  for each row execute function public.user_records_touch();

alter table public.user_records enable row level security;
drop policy if exists "own records: read" on public.user_records;
create policy "own records: read" on public.user_records for select to authenticated using (user_id = auth.uid());
drop policy if exists "own records: insert" on public.user_records;
create policy "own records: insert" on public.user_records for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "own records: update" on public.user_records;
create policy "own records: update" on public.user_records for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own records: delete" on public.user_records;
create policy "own records: delete" on public.user_records for delete to authenticated using (user_id = auth.uid());
