-- Bucket privado — nenhuma foto de prestador é acessível por URL direta.
-- Fotos de status ativo são servidas via URL assinada (curta duração),
-- gerada pelo backend depois de checar status/dono. Pendente fica
-- genuinamente inacessível, não só "difícil de adivinhar" (CLAUDE.md
-- seção 3: "nenhuma URL pública acessível" pra cadastro pendente).
insert into storage.buckets (id, name, public)
values ('prestador-fotos', 'prestador-fotos', false)
on conflict (id) do nothing;

-- Cada prestador só sobe foto na própria pasta: prestador-fotos/{auth.uid()}/...
-- Sem policy de select pública — geração de URL assinada usa o admin
-- client (service_role, bypassa RLS) depois do backend checar
-- status/dono, então não precisa de policy de leitura aqui.
create policy "prestador_fotos_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'prestador-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "prestador_fotos_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'prestador-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
