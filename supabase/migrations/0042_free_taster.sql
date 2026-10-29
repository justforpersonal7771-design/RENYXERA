-- 0042: lifetime taster counters for Free accounts ("tease, don't block", 29 Oct 2026).
-- A fixed number of uses per feature, never reset (unlike the daily practice_set_usage). Server-only: no policies, called with the service role.
create table if not exists public.taster_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (char_length(feature) between 1 and 40),
  used int not null default 0,
  primary key (user_id, feature)
);
alter table public.taster_usage enable row level security;
revoke all on public.taster_usage from anon, authenticated;

create or replace function public.consume_taster(p_user uuid, p_feature text, p_limit int)
returns table (allowed boolean, used int, taster_limit int)
language plpgsql security definer set search_path = public as $$
declare v_used int;
begin
  insert into taster_usage(user_id, feature, used) values (p_user, p_feature, 0) on conflict (user_id, feature) do nothing;
  select t.used into v_used from taster_usage t where t.user_id = p_user and t.feature = p_feature for update;
  if v_used >= p_limit then
    return query select false, v_used, p_limit; return;
  end if;
  update taster_usage t set used = v_used + 1 where t.user_id = p_user and t.feature = p_feature;
  return query select true, v_used + 1, p_limit;
end; $$;
revoke all on function public.consume_taster(uuid, text, int) from public, anon, authenticated;
