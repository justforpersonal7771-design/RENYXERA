-- RENYXERA — Step 8 (4H): waitlist hardening.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. Joins now go through /api/waitlist (email validation, rate limit, dedupe) using the
--    service role. The old open INSERT policy let anyone with the public key write any
--    number of rows straight to the table — remove it.
drop policy if exists "anyone can join the waitlist" on public.branch_waitlist;

-- 2. Clear exact duplicates before adding uniqueness (keeps the earliest signup).
delete from public.branch_waitlist a
using public.branch_waitlist b
where a.ctid > b.ctid
  and a.branch_code = b.branch_code
  and (
    (a.email is not null and lower(a.email) = lower(b.email))
    or (a.user_id is not null and a.user_id = b.user_id)
  );

-- 3. One signup per person per branch (emails compared case-insensitively).
create unique index if not exists branch_waitlist_email_uq
  on public.branch_waitlist (branch_code, lower(email)) where email is not null;
create unique index if not exists branch_waitlist_user_uq
  on public.branch_waitlist (branch_code, user_id) where user_id is not null;

-- 4. Sanity limit on stored emails.
alter table public.branch_waitlist drop constraint if exists branch_waitlist_email_len;
alter table public.branch_waitlist add constraint branch_waitlist_email_len
  check (email is null or char_length(email) <= 254);
