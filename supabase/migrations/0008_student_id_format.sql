-- RENYXERA — Student ID format: RNX-GATE-<BRANCH>-<6 digits>, e.g. RNX-GATE-CSIT-100001.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- New accounts (all CS & IT today; other branches get their own code when they launch).
alter table public.profiles
  alter column student_id set default ('RNX-GATE-CSIT-' || nextval('public.student_id_seq')::text);

-- Existing IDs keep their number: RNX100001 -> RNX-GATE-CSIT-100001.
update public.profiles
  set student_id = 'RNX-GATE-CSIT-' || substring(student_id from 4)
  where student_id ~ '^RNX[0-9]+$';

-- Guard the format from now on.
alter table public.profiles drop constraint if exists profiles_student_id_format;
alter table public.profiles add constraint profiles_student_id_format
  check (student_id ~ '^RNX-GATE-[A-Z]{2,5}-[0-9]{6,}$');
