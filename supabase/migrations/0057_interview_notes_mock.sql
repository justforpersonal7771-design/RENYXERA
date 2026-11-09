-- Interview section, part 2: highlights and notes in the reader, and the mock interviewer's scored answers.
create table if not exists public.interview_notes (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_id text not null,
  quote text not null,
  note text not null default '',
  color text not null default 'yellow' check (color in ('yellow','green','pink','blue')),
  created_at timestamptz not null default now()
);
create index if not exists interview_notes_user_doc_idx on public.interview_notes (user_id, doc_id);
alter table public.interview_notes enable row level security;
revoke all on public.interview_notes from anon, authenticated;
revoke all on sequence public.interview_notes_id_seq from anon, authenticated;

-- the mock interviewer records its scored answers as attempts of kind 'mock'
alter table public.interview_attempts drop constraint if exists interview_attempts_item_kind_check;
alter table public.interview_attempts add constraint interview_attempts_item_kind_check check (item_kind in ('lab','sql','card','code','mock'));
