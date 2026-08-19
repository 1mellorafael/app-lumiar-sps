-- Foto de perfil pessoal, opcional (mantém o cadastro leve — CLAUDE.md
-- seção 7 — não vira campo obrigatório). Bucket público: mesma lógica do
-- posts-fotos, não tem estado "pendente" pra esconder.
alter table profiles add column foto_url varchar(500);

insert into storage.buckets (id, name, public)
values ('perfil-fotos', 'perfil-fotos', true)
on conflict (id) do nothing;

create policy "perfil_fotos_select_publico"
  on storage.objects for select
  to public
  using (bucket_id = 'perfil-fotos');

-- cada pessoa só sobe foto na própria pasta: perfil-fotos/{auth.uid()}/...
create policy "perfil_fotos_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'perfil-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "perfil_fotos_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'perfil-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
