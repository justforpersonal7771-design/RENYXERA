-- 0045: let Mentor chats sync across a student's devices through the existing per-user sync table.
-- One row per chat (kind 'mentor_chat', key = chat id, data = the chat tree). Same rules as every other synced record:
-- row-level security keeps each student to their own rows, deletes are tombstones, and a row is at most 256 KB.
-- Safe to run more than once.
alter table public.user_records drop constraint if exists user_records_kind_check;
alter table public.user_records add constraint user_records_kind_check check (kind in ('bookmark', 'mistake', 'session', 'mentor_chat'));
