-- Admin precisa ver e aprovar/rejeitar pendentes de qualquer dono —
-- as policies existentes só cobrem "ativo" (público) ou "o próprio dono".
-- Consolida em vez de adicionar policy nova, pra evitar multiple
-- permissive policies (aviso de performance do Supabase advisor).
drop policy "prestadores_select_authenticated" on prestadores;
create policy "prestadores_select_authenticated"
  on prestadores for select
  to authenticated
  using (
    status = 'ativo'
    or profile_id = (select auth.uid())
    or exists (
      select 1 from profiles p
      where p.id = (select auth.uid()) and p.is_admin
    )
  );

-- update: dono continua podendo editar os próprios campos; admin ganha
-- policy separada pra mudar status (não editar os outros campos do
-- prestador — isso é papel do dono, não do admin)
create policy "prestadores_update_status_admin"
  on prestadores for update
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = (select auth.uid()) and p.is_admin
    )
  )
  with check (
    exists (
      select 1 from profiles p
      where p.id = (select auth.uid()) and p.is_admin
    )
  );
