-- Module 4G · per-user daily AI quota (enforced in Postgres) + server-side response cache.
-- Run once in the Supabase SQL editor.

-- 1. Atomic quota check-and-increment. One statement under a row lock, so concurrent
--    Worker instances can't both slip past the limit. The day rolls over at midnight IST.
create or replace function public.consume_ai_call(p_user uuid, p_limit int)
returns table (allowed boolean, used int, day_limit int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_used int;
  v_reset date;
begin
  select daily_ai_calls, (daily_ai_reset_at at time zone 'Asia/Kolkata')::date
    into v_used, v_reset
    from profiles where id = p_user
    for update;

  if not found then
    return query select false, 0, p_limit;
    return;
  end if;

  if v_reset is null or v_reset < v_today then
    v_used := 0;
  end if;

  if v_used >= p_limit then
    update profiles set daily_ai_calls = v_used, daily_ai_reset_at = now() where id = p_user;
    return query select false, v_used, p_limit;
    return;
  end if;

  update profiles set daily_ai_calls = v_used + 1, daily_ai_reset_at = now() where id = p_user;
  return query select true, v_used + 1, p_limit;
end;
$$;

-- Server (service role) only — a signed-in user must not be able to call it directly.
revoke all on function public.consume_ai_call(uuid, int) from public, anon, authenticated;

-- 2. Response cache keyed by a hash of the exact instruction + prompt. Identical questions
--    are answered from here and cost no quota. No RLS policies: service role only.
create table if not exists public.ai_response_cache (
  prompt_hash text primary key,
  response text not null,
  hits int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.ai_response_cache enable row level security;
