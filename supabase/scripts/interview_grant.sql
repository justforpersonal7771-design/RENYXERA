-- Give people access to the Interview section. Run in the Supabase SQL editor AFTER migration 0056_interview.sql.
insert into public.interview_access (email, note) values
  ('1adilkhan7771@gmail.com', 'owner'),
  ('justforpersonal7772+razorpay@gmail.com', 'owner (razorpay account)')
on conflict (email) do nothing;

-- Add one more:  insert into public.interview_access (email) values (lower('someone@example.com')) on conflict do nothing;
-- Remove one:    delete from public.interview_access where email = lower('someone@example.com');
-- See the list:  select * from public.interview_access;
