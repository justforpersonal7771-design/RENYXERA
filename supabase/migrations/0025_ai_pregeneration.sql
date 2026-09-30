-- RENYXERA — AI pre-generation of question-level answers (hints, shortcuts, standard
-- explanations) for every official PYQ, run in the background while traffic is low.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Order is fixed (questions by year desc, session, question number; then HINT, SHORTCUT,
-- EXPLAIN), and `cursor` is the position in that list. The runner only advances the cursor
-- after an item is saved (or recorded as failed), so when the AI quota runs out it pauses
-- and resumes from the exact same item — nothing is skipped. Failed items are kept with
-- their error and retried in a later pass. Service role only; the admin console (Release 10)
-- will read these tables.

create table if not exists public.ai_pregen_control (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default true,
  cursor int not null default 0 check (cursor >= 0),
  pass int not null default 1,
  paused_until timestamptz,
  last_run_at timestamptz,
  last_message text,
  updated_at timestamptz not null default now()
);
insert into public.ai_pregen_control (id) values (1) on conflict (id) do nothing;

create table if not exists public.ai_pregen_items (
  question_id text not null references public.questions(id) on delete cascade,
  kind text not null check (kind in ('HINT', 'SHORTCUT', 'EXPLAIN')),
  status text not null check (status in ('done', 'failed')),
  model text,
  cache_key text,
  error text check (error is null or char_length(error) <= 500),
  attempts int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (question_id, kind)
);
create index if not exists ai_pregen_items_status_idx on public.ai_pregen_items (status, updated_at);

alter table public.ai_pregen_control enable row level security;
alter table public.ai_pregen_items enable row level security;
revoke all on public.ai_pregen_control, public.ai_pregen_items from anon, authenticated;
