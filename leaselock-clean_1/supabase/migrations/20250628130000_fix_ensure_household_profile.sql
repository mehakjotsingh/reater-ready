-- Fix ensure_household: create profile row if missing (calendar/maintenance/rent saves).

create or replace function public.ensure_household()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare hid uuid;
begin
  select p.household_id into hid
  from public.profiles p
  where p.id = auth.uid();

  if hid is not null then
    insert into public.household_members (household_id, user_id, role)
      values (hid, auth.uid(), 'owner')
      on conflict (household_id, user_id) do nothing;
    return hid;
  end if;

  insert into public.households (name, created_by)
    values ('My lease', auth.uid())
    returning id into hid;

  insert into public.household_members (household_id, user_id, role)
    values (hid, auth.uid(), 'owner');

  insert into public.profiles (id, household_id)
  values (auth.uid(), hid)
  on conflict (id) do update
    set household_id = excluded.household_id,
        updated_at = now();

  return hid;
end;
$$;

grant execute on function public.ensure_household() to authenticated;
