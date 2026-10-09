-- Adds the telegram_join event (Join-our-Telegram clicks) to the allowed growth events.
alter table public.events drop constraint if exists events_event_check;
alter table public.events add constraint events_event_check check (event in ('visit','test_started','test_submitted','review_opened','ai_used','invite_shared','share_clicked','telegram_join'));
