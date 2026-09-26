-- RENYXERA — Step 6 (5A/5B): answer-key withholding + server-graded attempts.
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- (exam_attempts / exam_responses already exist from 0001 and are used as-is.)

-- NAT questions whose official key accepts "A OR B" — keep every range.
-- Shape: [[min, max], [min, max]]. nat_min/nat_max stay as the first range.
alter table public.question_answers
  add column if not exists nat_ranges jsonb;
