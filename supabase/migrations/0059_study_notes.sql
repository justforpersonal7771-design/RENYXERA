-- Study lesson highlights and typed notes, synced across a student's devices.
create table if not exists public.study_notes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson text not null,
  quote text not null,
  note text not null default '',
  color text not null default 'yellow' check (color in ('yellow','green','pink','blue')),
  created_at timestamptz not null default now()
);
create index if not exists study_notes_user_lesson on public.study_notes (user_id, lesson, created_at);
alter table public.study_notes enable row level security;
drop policy if exists "own study notes" on public.study_notes;
create policy "own study notes" on public.study_notes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
