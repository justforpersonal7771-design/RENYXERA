-- Usernames are lowercase-only and unique regardless of case.
--
-- The profile form already lowercases input and checks availability via
-- /api/username/check, but that's the client; these constraints make it true at the
-- database level too (a direct PostgREST call can't write "Adil", and two people can't
-- race to "adil" and "ADIL"). Run once in the Supabase SQL editor.

-- 1. Normalise any existing mixed-case usernames.
update public.profiles set username = lower(username)
where username is not null and username <> lower(username);

-- 2. Lowercase + allowed characters + length, enforced on every write.
alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles add constraint profiles_username_format
  check (username is null or username ~ '^[a-z][a-z0-9_]{2,19}$') not valid;
-- NOT VALID: enforced on every new insert/update, without failing the migration if an
-- older username happens not to fit the new rules (it stays until its owner edits it).

-- 3. Case-insensitive uniqueness (belt and braces alongside the existing unique column).
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));
