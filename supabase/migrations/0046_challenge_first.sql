-- 0046: create a challenge BEFORE playing it (Battles as a game).
-- The owner picks any test in the builder, the challenge exists at once with its questions, friends can join, and the owner's own score
-- is filled in by the API from the server-graded attempt when the owner finishes. Safe to run more than once.
alter table public.battles alter column owner_score drop not null;
alter table public.battles alter column max_score drop not null;
alter table public.battles drop constraint if exists battles_max_score_check;
alter table public.battles add constraint battles_max_score_check check (max_score is null or max_score > 0);
alter table public.battles add column if not exists owner_submitted_at timestamptz;
