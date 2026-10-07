-- A verified mobile number is permanently linked to its account: once phone_verified is
-- true, the number can't be changed or removed (and verification can't be undone) by
-- anyone but the service role. Users can't set phone_verified themselves (no column grant);
-- the future Telegram/WhatsApp verification flow sets it server-side.
create or replace function public.lock_verified_phone()
returns trigger language plpgsql as $$
begin
  if old.phone_verified and coalesce(auth.role(), '') <> 'service_role'
     and (new.phone is distinct from old.phone or not new.phone_verified) then
    raise exception 'phone_locked: a verified mobile number cannot be changed';
  end if;
  return new;
end $$;

drop trigger if exists profiles_lock_verified_phone on public.profiles;
create trigger profiles_lock_verified_phone
  before update of phone, phone_verified on public.profiles
  for each row execute function public.lock_verified_phone();
