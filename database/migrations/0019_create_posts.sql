-- Posts: eventos, workshops, anúncios e pets perdidos — feed que fica
-- fixo no app (diferente do grupo de WhatsApp, que rola e some). Uma
-- tabela só com campo `tipo`, não uma por categoria — mantém o feed
-- simples de consultar (1 query, sem UNION) e segue o mesmo espírito
-- flexível da tabela `negocios`.
create table posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  tipo varchar(20) not null, -- evento | workshop | anuncio | pet_perdido
  localizacao varchar(20) not null, -- lumiar | sao_pedro_da_serra
  titulo varchar(255) not null,
  descricao text,
  -- obrigatória em pet_perdido (principal jeito de reconhecer o bicho),
  -- opcional nos outros tipos — validado no Zod, não aqui
  foto_url varchar(500),
  -- pré-preenchido com o telefone da conta, editável — mesmo padrão do
  -- telefone_contato de negocios
  telefone_contato varchar(20) not null,
  -- só usado em evento/workshop
  data_evento timestamptz,
  -- local livre: onde vai rolar (evento/workshop) ou onde foi visto por
  -- último (pet_perdido); anuncio não usa
  local_texto varchar(255),
  -- só usado em anuncio; null = "a combinar"
  preco numeric(10, 2),
  status varchar(20) not null default 'ativo', -- ativo | encerrado
  created_at timestamptz not null default now()
);

create index posts_profile_id_idx on posts (profile_id);
create index posts_tipo_idx on posts (tipo);
create index posts_status_idx on posts (status);
create index posts_data_evento_idx on posts (data_evento);

alter table posts enable row level security;

-- Sem aprovação prévia (diferente de negocios): post fica no ar assim
-- que criado, admin remove depois se precisar. Moderação prévia deixaria
-- o app mais lento que o grupo de WhatsApp pra essa função, que é o
-- oposto do diferencial buscado (decisão de 18/08).
create policy "posts_select_anon"
  on posts for select
  to anon
  using (status = 'ativo');

create policy "posts_select_authenticated"
  on posts for select
  to authenticated
  using (
    status = 'ativo'
    or profile_id = (select auth.uid())
    or public.is_admin()
  );

-- qualquer conta logada posta — não precisa ser dono de negócio
create policy "posts_insert_own"
  on posts for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

-- autor edita/encerra só o próprio; "status" fica fora do whitelist de
-- campos editáveis pela API (reforçado no Zod, não só aqui)
create policy "posts_update_own"
  on posts for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "posts_delete_own"
  on posts for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

-- admin modera (oculta/edita status) ou remove qualquer post depois de
-- publicado
create policy "posts_update_admin"
  on posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "posts_delete_admin"
  on posts for delete
  to authenticated
  using (public.is_admin());
