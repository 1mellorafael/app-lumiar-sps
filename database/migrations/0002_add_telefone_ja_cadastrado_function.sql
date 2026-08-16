-- Função mínima pra checar duplicidade de telefone no cadastro sem
-- precisar do service_role key (que deve ficar reservado só pras rotas
-- de admin da Fase 5, CLAUDE.md item 3 da checklist de segurança).
-- SECURITY DEFINER só pra ler o profiles (que tem RLS restrito ao dono),
-- mas só devolve um boolean — nenhum dado é exposto.
create or replace function public.telefone_ja_cadastrado(p_telefone text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where telefone = p_telefone);
$$;

revoke execute on function public.telefone_ja_cadastrado(text) from public;
grant execute on function public.telefone_ja_cadastrado(text) to anon, authenticated;
