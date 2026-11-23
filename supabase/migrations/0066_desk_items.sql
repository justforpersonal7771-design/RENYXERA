-- 0066: AI Desk items (23 Nov 2026).
-- One small document table for the things that follow a student between screens: central Notes, Revision schedule state,
-- saved Tutor queues. Each row is one JSON document in a named collection ('notes', 'revision', 'queues'), owned by one user.
-- The app works without this table (it keeps everything on the device and the API answers 503); once it exists the same data is
-- mirrored to the account so it follows the student across devices. Safe to run more than once.

create table if not exists public.desk_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  coll text not null check (coll in ('notes', 'revision', 'queues')),
  id text not null check (char_length(id) between 1 and 120),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, coll, id)
);

create index if not exists desk_items_user_coll_idx on public.desk_items (user_id, coll, updated_at desc);

alter table public.desk_items enable row level security;

drop policy if exists "desk_items own rows" on public.desk_items;
create policy "desk_items own rows" on public.desk_items
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- A student cannot store an unbounded amount: 3,000 documents per collection is far above real use.
create or replace function public.desk_items_cap() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.desk_items where user_id = new.user_id and coll = new.coll) >= 3000
     and not exists (select 1 from public.desk_items where user_id = new.user_id and coll = new.coll and id = new.id) then
    raise exception 'desk_items limit reached for this collection';
  end if;
  return new;
end $$;

drop trigger if exists desk_items_cap_trg on public.desk_items;
create trigger desk_items_cap_trg before insert on public.desk_items for each row execute function public.desk_items_cap();
