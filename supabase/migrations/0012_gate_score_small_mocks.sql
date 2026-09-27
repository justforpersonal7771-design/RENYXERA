-- RENYXERA — Step 11c fix: GATE score for small mocks.
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- With few candidates, Mt (mean of top 0.1% / top 10) can be <= the qualifying mark, so the
-- score formula is undefined; fall back to the topper's marks. Otherwise identical to 0011.

drop function if exists public.mock_my_result(uuid);
create function public.mock_my_result(p_mock uuid)
returns table (
  status text,              -- 'ranked' | 'flagged' | 'late' | 'not_attempted' | 'pending'
  marks numeric,
  max_marks numeric,
  air bigint,               -- All-India Rank (ties share a rank)
  candidates bigint,        -- ranked candidates
  percentile numeric,
  category text,
  pwd boolean,
  category_rank bigint,     -- among ranked candidates of the same category (PwD: among PwD)
  qualifying_general numeric,
  qualifying_obc_ews numeric,
  qualifying_sc_st_pwd numeric,
  my_qualifying numeric,
  qualified boolean,
  gate_score int,
  mean_marks numeric,
  sd_marks numeric,
  topper_mean numeric
)
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_mock public.mock_events%rowtype;
  v_att public.exam_attempts%rowtype;
  v_n bigint; v_mean numeric; v_sd numeric; v_q numeric; v_top_n int; v_mt numeric;
  v_cat text; v_pwd boolean; v_myq numeric;
  v_uids uuid[]; v_marks numeric[]; v_cats text[]; v_pwds boolean[];
  v_mine numeric; v_in boolean;
begin
  if v_uid is null then return; end if;
  select * into v_mock from public.mock_events where id = p_mock;
  if not found then return; end if;
  select * into v_att from public.exam_attempts where mock_id = p_mock and user_id = v_uid;
  if now() < v_mock.results_at then
    return query select 'pending'::text, null::numeric, null::numeric, null::bigint, null::bigint, null::numeric, null::text, null::boolean, null::bigint, null::numeric, null::numeric, null::numeric, null::numeric, null::boolean, null::int, null::numeric, null::numeric, null::numeric;
    return;
  end if;

  -- Ranked population (same rules as mock_leaderboard), held in arrays (read-only function).
  select coalesce(array_agg(a.user_id), '{}'), coalesce(array_agg(a.server_score), '{}'),
         coalesce(array_agg(coalesce(p.category, 'GEN')), '{}'), coalesce(array_agg(coalesce(p.pwd, false)), '{}')
    into v_uids, v_marks, v_cats, v_pwds
    from public.exam_attempts a join public.profiles p on p.id = a.user_id
    where a.mock_id = p_mock and a.status = 'submitted' and a.server_score is not null
      and a.submitted_at <= v_mock.ends_at + interval '2 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0;

  select count(*), avg(m), coalesce(stddev_pop(m), 0) into v_n, v_mean, v_sd from unnest(v_marks) m;
  v_q := round(greatest(25, coalesce(v_mean, 0) + coalesce(v_sd, 0)), 2);
  v_top_n := greatest(10, ceil(v_n * 0.001)::int);
  select avg(t.m) into v_mt from (select m from unnest(v_marks) m order by m desc limit v_top_n) t;
  -- Small mocks: with few candidates the top-10 mean can fall at/below the qualifying mark,
  -- which makes the formula undefined. Fall back to the topper's marks (a real GATE paper,
  -- with lakhs of candidates, never hits this).
  if v_mt is not null and v_mt <= v_q then select max(m) into v_mt from unnest(v_marks) m; end if;
  v_in := v_uid = any(v_uids);
  if v_in then v_mine := v_marks[array_position(v_uids, v_uid)]; end if;

  select coalesce(p.category, 'GEN'), coalesce(p.pwd, false) into v_cat, v_pwd from public.profiles p where p.id = v_uid;
  v_myq := case when v_pwd or v_cat in ('SC', 'ST') then round(v_q * 2 / 3, 2)
                when v_cat in ('OBC_NCL', 'EWS') then round(v_q * 0.9, 2)
                else v_q end;

  if v_att.id is null then
    return query select 'not_attempted'::text, null::numeric, null::numeric, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;
  if not v_in then
    return query select (case when coalesce(jsonb_array_length(v_att.integrity_flags), 0) > 0 then 'flagged' else 'late' end)::text,
      v_att.server_score, v_att.server_max, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;

  return query
  with g as (select * from unnest(v_marks, v_cats, v_pwds) as t(marks, cat, pwd))
  select 'ranked'::text,
    v_mine,
    v_att.server_max,
    (select count(*) from g where g.marks > v_mine) + 1,
    v_n,
    round(100.0 * (select count(*) from g where g.marks < v_mine) / greatest(v_n - 1, 1), 2),
    v_cat, v_pwd,
    (select count(*) from g where g.marks > v_mine
       and (case when v_pwd then g.pwd else g.cat = v_cat end)) + 1,
    v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq,
    v_mine >= v_myq,
    case when v_mine >= v_myq and v_mt is not null and v_mt > v_q
      then least(1000, greatest(0, round(350 + (900 - 350) * (v_mine - v_q) / (v_mt - v_q))))::int
      else null end,
    round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
end;
$$;

revoke all on function public.mock_my_result(uuid) from public;
grant execute on function public.mock_my_result(uuid) to authenticated;
