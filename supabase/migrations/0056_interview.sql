-- Interview section: private to the emails listed in interview_access. Everything is read and written through
-- server routes that check access first (service role); the browser has no direct table access.
create table if not exists public.interview_access (
  email text primary key check (email = lower(email)),
  note text,
  created_at timestamptz not null default now()
);
create table if not exists public.interview_docs (
  id text primary key,
  book text not null,
  book_title text not null,
  kind text not null check (kind in ('chapter','revision','glossary','traps','snippets','lab')),
  ord int not null default 0,
  title text not null,
  body text not null,
  meta jsonb not null default '{}'::jsonb
);
create index if not exists interview_docs_book_idx on public.interview_docs (book, kind, ord);
create table if not exists public.interview_cards (
  id text primary key,
  book text not null,
  book_title text not null,
  type text not null,
  ch text not null default '',
  star boolean not null default false,
  front text not null,
  back text not null,
  more text not null default ''
);
create table if not exists public.interview_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_id text not null,
  status text not null check (status in ('reading','done')),
  updated_at timestamptz not null default now(),
  primary key (user_id, doc_id)
);
create table if not exists public.interview_attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_kind text not null check (item_kind in ('lab','sql','card','code')),
  item_id text not null,
  ok boolean not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists interview_attempts_user_idx on public.interview_attempts (user_id, created_at desc);
alter table public.interview_access enable row level security;
alter table public.interview_docs enable row level security;
alter table public.interview_cards enable row level security;
alter table public.interview_progress enable row level security;
alter table public.interview_attempts enable row level security;
revoke all on public.interview_access, public.interview_docs, public.interview_cards, public.interview_progress, public.interview_attempts from anon, authenticated;
revoke all on sequence public.interview_attempts_id_seq from anon, authenticated;
