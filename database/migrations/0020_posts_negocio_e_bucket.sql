-- Posts podem ser publicados como perfil pessoal (negocio_id null) ou em
-- nome de um negócio próprio (decisão de 18/08) — dono de negócio pode
-- postar um evento/anúncio já com a cara do negócio, sem trocar de conta.
alter table posts add column negocio_id uuid references negocios(id) on delete set null;
create index posts_negocio_id_idx on posts (negocio_id);

-- policies de insert/update precisam recriar pra checar que, quando
-- negocio_id vem preenchido, o negócio é do próprio autor e está ativo
-- (senão dá pra postar em nome do negócio de outra pessoa)
drop policy "posts_insert_own" on posts;
create policy "posts_insert_own"
  on posts for insert
  to authenticated
  with check (
    (select auth.uid()) = profile_id
    and (
      negocio_id is null
      or exists (
        select 1 from negocios
        where negocios.id = posts.negocio_id
          and negocios.profile_id = (select auth.uid())
          and negocios.status = 'ativo'
      )
    )
  );

drop policy "posts_update_own" on posts;
create policy "posts_update_own"
  on posts for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check (
    (select auth.uid()) = profile_id
    and (
      negocio_id is null
      or exists (
        select 1 from negocios
        where negocios.id = posts.negocio_id
          and negocios.profile_id = (select auth.uid())
          and negocios.status = 'ativo'
      )
    )
  );

-- Bucket público — post fica visível assim que criado (sem estado
-- "pendente" pra esconder, diferente de negocios), então não precisa de
-- URL assinada: foto_url guarda a URL pública direto.
insert into storage.buckets (id, name, public)
values ('posts-fotos', 'posts-fotos', true)
on conflict (id) do nothing;

create policy "posts_fotos_select_publico"
  on storage.objects for select
  to public
  using (bucket_id = 'posts-fotos');

create policy "posts_fotos_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'posts-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "posts_fotos_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'posts-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "posts_fotos_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'posts-fotos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
