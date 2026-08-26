-- Populates public.users right after a Supabase Auth signup, reading the
-- `name` passed in supabase.auth.signUp({ options: { data: { name } } })
-- (see src/pages/Auth.tsx). Without this trigger, public.users never gets a
-- row and Index.tsx's `.from("users").select("name")` always misses.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Restored verbatim from the one SQL file the previous project ever
-- committed (supabase/functions/is_two_factor_enabled.sql).
create function public.is_two_factor_enabled()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  is_enabled boolean;
begin
  select two_factor_enabled into is_enabled from public.user_settings where user_id = auth.uid();
  return coalesce(is_enabled, false);
end;
$$;

create function public.set_two_factor_enabled(enabled boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_settings (user_id, two_factor_enabled) values (auth.uid(), enabled)
  on conflict (user_id) do update set two_factor_enabled = enabled, updated_at = now();
  return true;
end;
$$;
