-- Supabase's security advisor flagged all 3 SECURITY DEFINER functions as
-- callable via the public REST RPC endpoint by both anon and authenticated
-- roles (Postgres grants EXECUTE to PUBLIC by default on function creation).
--
-- handle_new_user() is only meant to run via the auth.users trigger — it
-- should never be invocable directly by anyone.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_two_factor_enabled()/set_two_factor_enabled() are called by the app via
-- supabase.rpc(...) but only ever after a successful login (see Auth.tsx,
-- AuthContext.tsx) — restrict to authenticated, drop anon.
revoke execute on function public.is_two_factor_enabled() from public, anon;
grant execute on function public.is_two_factor_enabled() to authenticated;

revoke execute on function public.set_two_factor_enabled(boolean) from public, anon;
grant execute on function public.set_two_factor_enabled(boolean) to authenticated;
