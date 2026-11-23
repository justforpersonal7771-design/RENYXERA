-- 0065: invites reward AI credits only (owner decision 23 Nov 2026: Plus and Pro are paid products, never given away).
-- The inviter used to get 1 day of Plus + 15 AI credits; now 25 AI credits (valid 30 days). The invited friend still gets 10 AI credits.
-- Same conditions as 0021: real use on 2 different days, no shared device, at most 3 rewards a month and 10 in total. Safe to re-run.

create or replace function public.credit_referral(p_referred uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r public.referrals; confirmed timestamptz; active_days int; month_count int; total_count int;
begin
  select * into r from public.referrals where referred_id = p_referred and credited_at is null for update;
  if not found then return false; end if;

  select email_confirmed_at into confirmed from auth.users where id = p_referred;
  if confirmed is null then return false; end if;

  -- Real use: submitted, unflagged tests with 10+ answered questions, on 2 different IST days.
  select count(distinct (a.submitted_at at time zone 'Asia/Kolkata')::date) into active_days
    from public.exam_attempts a
   where a.user_id = p_referred and a.submitted_at is not null
     and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
     and (select count(*) from public.exam_responses x
           where x.attempt_id = a.id and (x.nat_value is not null or coalesce(array_length(x.selected_option_ids, 1), 0) > 0)) >= 10;
  if active_days < 2 then return false; end if;

  -- Same device ever used by both accounts → never rewarded (and closed for good).
  if exists (select 1 from public.device_sessions d1 join public.device_sessions d2 on d1.device_id = d2.device_id
              where d1.user_id = p_referred and d2.user_id = r.referrer_id) then
    update public.referrals set credited_at = now() where referred_id = p_referred;
    return false;
  end if;

  select count(*) filter (where credited_at >= date_trunc('month', now())), count(*) filter (where credited_at is not null)
    into month_count, total_count
    from public.referrals where referrer_id = r.referrer_id;

  update public.referrals set credited_at = now() where referred_id = p_referred;
  perform public.grant_ai_credits(p_referred, 10, 'referral', now() + interval '30 days');
  if month_count < 3 and total_count < 10 then
    perform public.grant_ai_credits(r.referrer_id, 25, 'referral', now() + interval '30 days');
  end if;
  return true;
end;
$$;
revoke all on function public.credit_referral(uuid) from public, anon, authenticated;
grant execute on function public.credit_referral(uuid) to service_role;
