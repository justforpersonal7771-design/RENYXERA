-- RENYXERA — hotfix. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Migration 0020 added profiles.phone and profiles.contact_opt_in, but students may only
-- update columns explicitly granted to them (see the column-level grants on profiles), so
-- saving a mobile number failed with "permission denied". Allow these two.
grant update (phone, contact_opt_in) on public.profiles to authenticated;
