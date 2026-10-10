-- Telegram integration: link an account to a Telegram chat, keep reminders / timers / alarms, remember what the
-- bot already sent. Server-only (service role): the browser never reads these tables directly.

create table if not exists public.telegram_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  chat_id bigint not null unique,
  tg_username text check (char_length(tg_username) <= 64),
  tg_first_name text check (char_length(tg_first_name) <= 128),
  linked_at timestamptz not null default now(),
  in_channel boolean,            -- member of the daily-question channel (null = couldn't verify)
  in_group boolean,              -- member of the discussion group
  checked_at timestamptz,
  prefs jsonb not null default '{"blocks":true,"digest":true,"alarms":true,"mocks":true,"billing":true,"weekly":true,"roll":true}'::jsonb,
  digest_time text not null default '07:00' check (digest_time ~ '^[0-2][0-9]:[0-5][0-9]$'),   -- IST
  blocked boolean not null default false,   -- the user blocked the bot; stop sending
  last_digest date, last_roll_prompt date, last_weekly date
);

create table if not exists public.telegram_link_codes (
  code text primary key check (char_length(code) between 16 and 64),
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null
);
create index if not exists telegram_link_codes_user_idx on public.telegram_link_codes (user_id);

create table if not exists public.telegram_reminders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('block','timer','alarm','custom')),
  remind_at timestamptz not null,
  title text not null check (char_length(title) <= 160),
  body text check (char_length(body) <= 500),
  event_id text check (char_length(event_id) <= 80),     -- the Study Planner event this belongs to
  event_date date,                                        -- the day of that event (for digests / roll-forward)
  repeat text check (repeat in ('daily')),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  done_at timestamptz
);
create index if not exists telegram_reminders_due_idx on public.telegram_reminders (remind_at) where sent_at is null;
create index if not exists telegram_reminders_user_idx on public.telegram_reminders (user_id, event_date);
create index if not exists telegram_reminders_event_idx on public.telegram_reminders (user_id, event_id);

-- Things done in Telegram that the app applies the next time it opens (mark a block done, move it a day).
create table if not exists public.telegram_actions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('done','roll')),
  event_id text not null check (char_length(event_id) <= 80),
  created_at timestamptz not null default now(),
  applied_at timestamptz
);
create index if not exists telegram_actions_user_idx on public.telegram_actions (user_id) where applied_at is null;

-- One-per-key log so a broadcast (mock starting, plan ending) is never sent twice.
create table if not exists public.telegram_sent (
  key text primary key check (char_length(key) <= 160),
  sent_at timestamptz not null default now()
);

alter table public.telegram_accounts enable row level security;
alter table public.telegram_link_codes enable row level security;
alter table public.telegram_reminders enable row level security;
alter table public.telegram_actions enable row level security;
alter table public.telegram_sent enable row level security;
revoke all on public.telegram_accounts, public.telegram_link_codes, public.telegram_reminders, public.telegram_actions, public.telegram_sent from anon, authenticated;

-- Housekeeping: keep a month of sent reminders and applied actions.
create or replace function public.prune_telegram() returns void language sql security definer set search_path = public as $$
  delete from telegram_reminders where sent_at is not null and sent_at < now() - interval '30 days';
  delete from telegram_actions where applied_at is not null and applied_at < now() - interval '30 days';
  delete from telegram_link_codes where expires_at < now();
  delete from telegram_sent where sent_at < now() - interval '90 days';
$$;
revoke all on function public.prune_telegram() from public, anon, authenticated;
