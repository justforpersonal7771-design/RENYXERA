-- 0044: fixes for the Supabase Security and Performance Advisor warnings (31 Oct 2026).
-- Safe to run more than once. Every statement is wrapped so one that does not apply is skipped with a NOTICE instead of
-- stopping the rest; read the "Messages"/notices after running to see anything skipped.

create or replace function pg_temp.try(sql text) returns void language plpgsql as $$
begin
  execute sql;
exception when others then
  raise notice 'skipped: % (%)', left(sql, 90), sqlerrm;
end $$;

-- ---------------------------------------------------------------------------------------------------------------------
-- 1) auth_rls_initplan (Performance Advisor, 15 warnings): write auth.uid() as (select auth.uid()) so Postgres evaluates it
--    once per query instead of once per row. Same rules as before; only the evaluation changes.
-- ---------------------------------------------------------------------------------------------------------------------
select pg_temp.try($q$alter policy "users can read their own profile" on public.profiles using ((select auth.uid()) = id)$q$);
select pg_temp.try($q$alter policy "users can update their own profile" on public.profiles using ((select auth.uid()) = id) with check ((select auth.uid()) = id)$q$);
select pg_temp.try($q$alter policy "users can read their own attempts" on public.exam_attempts using ((select auth.uid()) = user_id)$q$);
select pg_temp.try($q$alter policy "users can read responses on their own attempts" on public.exam_responses using (exists (select 1 from public.exam_attempts a where a.id = exam_responses.attempt_id and a.user_id = (select auth.uid())))$q$);
select pg_temp.try($q$alter policy "users can read their own question state" on public.user_question_state using ((select auth.uid()) = user_id)$q$);
select pg_temp.try($q$alter policy "users can write their own question state" on public.user_question_state with check ((select auth.uid()) = user_id)$q$);
select pg_temp.try($q$alter policy "users can update their own question state" on public.user_question_state using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)$q$);
select pg_temp.try($q$alter policy "users can delete their own question state" on public.user_question_state using ((select auth.uid()) = user_id)$q$);
select pg_temp.try($q$alter policy "users read own devices" on public.device_sessions using ((select auth.uid()) = user_id)$q$);
select pg_temp.try($q$alter policy "own records: read" on public.user_records using (user_id = (select auth.uid()))$q$);
select pg_temp.try($q$alter policy "own records: insert" on public.user_records with check (user_id = (select auth.uid()))$q$);
select pg_temp.try($q$alter policy "own records: update" on public.user_records using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))$q$);
select pg_temp.try($q$alter policy "own records: delete" on public.user_records using (user_id = (select auth.uid()))$q$);
select pg_temp.try($q$alter policy battles_read on public.battles using (owner_id = (select auth.uid()) or exists (select 1 from public.battle_entries e where e.battle_id = battles.id and e.user_id = (select auth.uid())))$q$);
select pg_temp.try($q$alter policy battle_entries_read on public.battle_entries using (user_id = (select auth.uid()) or exists (select 1 from public.battles b where b.id = battle_entries.battle_id and b.owner_id = (select auth.uid())))$q$);

-- ---------------------------------------------------------------------------------------------------------------------
-- 2) function_search_path_mutable (Security Advisor, 2 warnings): pin the search path of the two trigger functions.
-- ---------------------------------------------------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('set_updated_at', 'lock_verified_phone')
  loop
    execute format('alter function %s set search_path = public, pg_temp', r.sig);
  end loop;
end $$;

-- ---------------------------------------------------------------------------------------------------------------------
-- 3) SECURITY DEFINER functions callable through the public API (Security Advisor, anon and authenticated warnings).
--    Earlier migrations ran "revoke ... from public", but Supabase also grants EXECUTE directly to anon and authenticated
--    when a function is created, so those revokes never removed that access. Fix it for every SECURITY DEFINER function:
--      * signed-out visitors (anon) lose EXECUTE, except the six functions behind the public leaderboards;
--      * trigger functions and account_tier() lose EXECUTE for signed-in users too (they run inside triggers/other
--        definer functions, which use the owner's rights, so nothing that exists today needs the grant).
--    Functions that signed-in users call on purpose (my_referral_code, claim_referral, change_my_branch, mock_paper, ...)
--    keep their signed-in access: each one reads or writes only the caller's own rows (auth.uid()); those warnings that
--    remain are accepted by design. The server (service_role) keeps its own grant.
-- ---------------------------------------------------------------------------------------------------------------------
do $$
declare
  r record;
  public_ok text[] := array['board', 'board_branch', 'practice_leaderboard', 'mock_leaderboard', 'mock_leaderboard_moves', 'tiers_for_labels'];
  internal_only text[] := array['account_tier', 'handle_new_user', 'profiles_premium_avatar', 'referral_on_submit', 'set_updated_at', 'lock_verified_phone'];
begin
  for r in
    select p.oid::regprocedure as sig, p.proname, (p.prorettype = 'pg_catalog.trigger'::regtype) as is_trigger
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
  loop
    if not (r.proname = any (public_ok)) then
      execute format('revoke execute on function %s from public, anon', r.sig);
    end if;
    if r.is_trigger or r.proname = any (internal_only) then
      execute format('revoke execute on function %s from authenticated', r.sig);
    end if;
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;
end $$;
