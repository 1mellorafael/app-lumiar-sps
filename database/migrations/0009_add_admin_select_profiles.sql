-- Admin precisa ver quem criou um cadastro pendente (nome do dono da
-- conta) pra ter accountability na aprovação — hoje só o próprio dono
-- vê o próprio profile.
--
-- Checagem de admin via function SECURITY DEFINER, não via
-- "exists(select ... from profiles where is_admin)" inline na policy —
-- essa segunda forma causa recursão infinita, porque a subquery
-- reavalia RLS de profiles de novo (que inclui essa mesma policy).
-- A function roda como o dono dela, ignora RLS internamente, sem
-- recursão. Reaproveitada também nas policies de prestadores que já
-- checavam admin (0008), pelo mesmo motivo.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "profiles_select_admin"
  on profiles for select
  to authenticated
  using (public.is_admin());

drop policy "prestadores_select_authenticated" on prestadores;
create policy "prestadores_select_authenticated"
  on prestadores for select
  to authenticated
  using (
    status = 'ativo'
    or profile_id = (select auth.uid())
    or public.is_admin()
  );

drop policy "prestadores_update_status_admin" on prestadores;
create policy "prestadores_update_status_admin"
  on prestadores for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
