-- Fix: calendar / maintenance / rent saves fail with RLS
-- (profile missing household_id or household_members row).
-- Run once in Supabase → SQL Editor.

-- Ensure every profile has a household + membership row.
do $$
declare r record; hid uuid;
begin
  for r in select id from public.profiles where household_id is null loop
    insert into public.households (name, created_by) values ('My lease', r.id) returning id into hid;
    insert into public.household_members (household_id, user_id, role)
      values (hid, r.id, 'owner') on conflict do nothing;
    update public.profiles p set household_id = hid where p.id = r.id;
  end loop;
end $$;

-- Backfill any missing membership rows for profiles that already have a household.
insert into public.household_members (household_id, user_id, role)
select p.household_id, p.id, 'owner'
from public.profiles p
where p.household_id is not null
  and not exists (
    select 1 from public.household_members hm
    where hm.household_id = p.household_id and hm.user_id = p.id
  )
on conflict (household_id, user_id) do nothing;

-- Callable from the app before any shared-data write.
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

  update public.profiles p
  set household_id = hid
  where p.id = auth.uid();

  return hid;
end;
$$;

grant execute on function public.ensure_household() to authenticated;
grant execute on function public.join_household(text) to authenticated;
grant execute on function public.leave_household() to authenticated;
grant execute on function public.rename_household(text) to authenticated;
grant execute on function public.regenerate_invite_code() to authenticated;
