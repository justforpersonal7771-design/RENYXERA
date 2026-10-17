-- GATE-level practice sets (AI-generated): Plus gets a daily cap, Pro none, Free none (enforced in /api/ai/generate).
create table if not exists public.practice_set_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  day date not null,
  used int not null default 0
);
alter table public.practice_set_usage enable row level security;

create or replace function public.consume_practice_set(p_user uuid, p_limit int)
returns table (allowed boolean, used int, day_limit int)
language plpgsql security definer set search_path = public as $$
declare v_today date := (now() at time zone 'Asia/Kolkata')::date; v_used int;
begin
  insert into practice_set_usage(user_id, day, used) values (p_user, v_today, 0)
    on conflict (user_id) do nothing;
  select case when u.day < v_today then 0 else u.used end into v_used
    from practice_set_usage u where u.user_id = p_user for update;
  if v_used >= p_limit then
    return query select false, v_used, p_limit; return;
  end if;
  update practice_set_usage set day = v_today, used = v_used + 1 where user_id = p_user;
  return query select true, v_used + 1, p_limit;
end; $$;
revoke all on function public.consume_practice_set(uuid, int) from public, anon, authenticated;
