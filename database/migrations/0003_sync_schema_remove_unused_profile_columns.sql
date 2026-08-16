-- Sincroniza o banco remoto com database/schema.sql (revisão de 16/08,
-- docs/07_STATUS_ATUAL.md): o cadastro real (cadastro/page.tsx) nunca
-- coletou sobrenome, foto de perfil, data de nascimento ou endereço — só
-- nome/email/telefone/senha (cadastro leve, CLAUDE.md seção 7). Essas
-- colunas not null quebravam o signup assim que a Fase 2 (Auth) tentasse
-- gravar de verdade. A correção só tinha sido feita no arquivo schema.sql,
-- nunca aplicada como migration nesta base.

alter table public.profiles
  drop column sobrenome,
  drop column foto_perfil_url,
  drop column data_nascimento,
  drop column endereco_completo,
  drop column endereco_dentro_area;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, nome, telefone
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'telefone', '')
  );
  return new;
end;
$$;
