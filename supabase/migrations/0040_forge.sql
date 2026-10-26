-- 0040: Forge — original GATE-level questions (R11-A1, docs/roadmap/R11-FORGE.md).
-- Public half in forge_items (readable by signed-in users once released, never mock-only items);
-- private half in forge_answers (no policies: only the service role reads it, through /api routes).
-- Access by plan is enforced in the API (Plus/Pro questions; Free gets Forge Mocks only).

create table if not exists public.forge_items (
  id text primary key check (id ~ '^FORGE_[A-Z]{2,4}_[0-9]{6}$'),
  branch text not null references public.branches(code),
  subject text not null,
  topic text not null,
  syllabus_code text,
  kind text not null,
  difficulty text not null check (difficulty in ('E', 'M', 'H', 'X')),
  question_type text not null check (question_type in ('MCQ', 'MSQ', 'NAT')),
  marks int not null check (marks in (1, 2)),
  question_text text not null,
  options jsonb not null default '[]'::jsonb,       -- [{option_id, text}] — no correctness here
  images jsonb not null default '[]'::jsonb,
  release_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'approved', 'retired')),
  mock_only boolean not null default false,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists forge_items_branch_idx on public.forge_items (branch, status, release_at);
create index if not exists forge_items_topic_idx on public.forge_items (branch, topic);

create table if not exists public.forge_answers (
  item_id text primary key references public.forge_items(id) on delete cascade,
  correct_option_ids text[] not null default '{}',
  nat_min numeric,
  nat_max numeric,
  nat_ranges jsonb,
  solution jsonb not null default '{}'::jsonb,       -- {given, find, steps[], shortcut, trap}
  verify jsonb,                                       -- the code that recomputes the answer (audit)
  updated_at timestamptz not null default now()
);

create table if not exists public.forge_item_stats (
  item_id text primary key references public.forge_items(id) on delete cascade,
  attempts int not null default 0,
  correct int not null default 0,
  p_value numeric,
  discrimination numeric,
  avg_time_ms int,
  reports int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.forge_reports (
  id bigint generated always as identity primary key,
  item_id text not null references public.forge_items(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reason text not null check (char_length(reason) between 3 and 500),
  created_at timestamptz not null default now()
);

alter table public.forge_items enable row level security;
alter table public.forge_answers enable row level security;
alter table public.forge_item_stats enable row level security;
alter table public.forge_reports enable row level security;
revoke all on public.forge_answers, public.forge_item_stats, public.forge_reports from anon, authenticated;
revoke all on public.forge_items from anon;

-- Signed-in users may read released, approved, non-mock items (the API additionally checks the plan).
drop policy if exists forge_items_read on public.forge_items;
create policy forge_items_read on public.forge_items for select to authenticated
  using (status = 'approved' and not mock_only and release_at <= now());
