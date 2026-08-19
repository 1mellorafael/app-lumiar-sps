-- Schema base do App de Lumiar / São Pedro da Serra
-- RLS ligado em toda tabela desde a criação (CLAUDE.md item 4 da checklist
-- de segurança). Evolui por migrations em database/migrations/, nunca
-- reescrevendo isso do zero.
--
-- Convenções de performance/segurança (supabase-postgres-best-practices):
-- - auth.uid() sempre envolto em (select ...) — cacheia por statement em
--   vez de rodar por linha
-- - toda policy usa `to authenticated`/`to anon` explícito, nunca depende
--   de auth.role()
-- - toda FK ganha índice (JOINs e cascades rápidos, além de acelerar as
--   subqueries de RLS que filtram por ela)
-- - quando authenticated precisaria de 2 policies de SELECT (pública +
--   própria), consolida numa só policy com OR — evita multiple permissive
--   policies (Supabase avisa isso no advisor de performance)

-- ============================================================
-- profiles: dados extras de quem se cadastrou (auth/senha ficam no
-- auth.users nativo do Supabase Auth — nunca reimplementar hash de senha)
-- ============================================================
-- Campos batem com o cadastro leve decidido em 15/08 (CLAUDE.md seção 7):
-- nome, email (fica em auth.users), telefone e senha no Passo 1. Sem
-- sobrenome. foto_url (migration 0023) é opcional, não quebra o
-- cadastro leve.
--
-- username (migration 0025) substitui email como identificador de
-- login — email continua pedido e passa a ser verificado pelo Auth
-- nativo, só não é mais usado pra logar.
--
-- endereco/endereco_lat/endereco_lng (migration 0025) confirmam que a
-- conta é da região (Lumiar/São Pedro da Serra e entorno) — validado
-- contra uma área no Zod no cadastro, com aviso claro quando fica fora
-- (nunca falha silenciosa, decisão de 18/08).
--
-- data_nascimento (migration 0028) — reverte a exclusão original.
--
-- username/endereco/data_nascimento são nullable porque contas já
-- existentes (dados de teste, pré-lançamento) não têm — toda conta
-- NOVA é obrigada (Zod).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome varchar(255) not null,
  telefone varchar(20) not null unique,
  foto_url varchar(500),
  username varchar(30) unique,
  endereco varchar(500),
  endereco_lat double precision,
  endereco_lng double precision,
  data_nascimento date,
  is_admin boolean not null default false, -- nunca setável pelo cliente
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- dono vê e edita só o próprio perfil
create policy "profiles_select_own"
  on profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Checagem de admin via function SECURITY DEFINER, não via
-- "exists(select ... from profiles where is_admin)" inline — essa
-- segunda forma causa recursão infinita numa policy de profiles, porque
-- a subquery reavalia RLS de profiles de novo (que inclui essa mesma
-- policy). A function roda como o dono dela, ignora RLS internamente.
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

-- admin vê qualquer profile — precisa saber quem criou um cadastro
-- pendente pra ter accountability na aprovação
create policy "profiles_select_admin"
  on profiles for select
  to authenticated
  using (public.is_admin());

-- criação do profile acontece via trigger no signup (auth.users),
-- não por insert direto do cliente — ver seção de trigger abaixo

-- ============================================================
-- negocios: cada negócio cadastrado (1 profile pode ter vários)
-- ============================================================
-- Nome "negócio" (não "prestador") por decisão de 17/08 — mesma
-- terminologia do Nextdoor ("Business"), sem distinção de porte. Deles
-- verificação com documento é opcional (badge), não bloqueia o cadastro
-- básico — mesma filosofia do cadastro leve já usada aqui.
create table negocios (
  id uuid primary key default gen_random_uuid(),
  -- null = cadastrado pelo admin, sem dono ainda (aguardando alguém
  -- reivindicar) — migration 0018
  profile_id uuid references profiles(id) on delete cascade,
  nome_negocio varchar(255) not null,
  -- array — um negócio pode ser mais de uma coisa (motoboy/mototáxi,
  -- hospedagem pet/adestramento), evita cadastro duplicado só pra isso
  categorias text[] not null,
  descricao text,
  foto_principal_url varchar(500) not null,
  foto_capa_url varchar(500),
  -- object-position (%) escolhido pelo dono pra cada foto — recorte
  -- circular (principal) ou banner (capa) nem sempre pega a parte certa
  -- da imagem original com o centro padrão
  foto_principal_pos_x smallint not null default 50,
  foto_principal_pos_y smallint not null default 50,
  foto_capa_pos_x smallint not null default 50,
  foto_capa_pos_y smallint not null default 50,
  instagram varchar(255),
  -- telefone do NEGÓCIO, separado do telefone da conta (profiles.telefone)
  -- — quem cadastra e quem atende podem ser pessoas diferentes (ver docs/06,
  -- "Cadastro por terceiro")
  telefone_contato varchar(20) not null,
  -- coluna existe mas não é coletada pela UI por enquanto (removido do
  -- cadastro em 17/08) — não dropada, custo zero manter, evita mais uma
  -- migration se voltar
  horario_funcionamento varchar(255),
  -- pode atender só Lumiar, só São Pedro da Serra, ou os dois
  localizacoes text[] not null,
  -- endereço opcional — texto vem do autocomplete do Google; lat/lng só
  -- preenchidos quando a pessoa escolhe um lugar real da lista (não
  -- geocodificamos texto livre), usados pra desenhar o mapa embed
  endereco varchar(500),
  endereco_lat double precision,
  endereco_lng double precision,
  status varchar(20) not null default 'pendente', -- pendente | ativo | rejeitado
  -- publico (qualquer um vê) ou logado (só quem tem conta) — escolhido
  -- pelo dono no cadastro (migration 0027)
  visibilidade varchar(10) not null default 'publico',
  created_at timestamptz not null default now()
);

create index negocios_profile_id_idx on negocios (profile_id);
create index negocios_status_idx on negocios (status);

alter table negocios enable row level security;

-- público (deslogado) só vê negócios ativo E público (regra de
-- sensibilidade: pendente é 100% privado, nenhum campo vaza; e agora
-- visibilidade "logado" também fica de fora do anon)
create policy "negocios_select_anon"
  on negocios for select
  to anon
  using (status = 'ativo' and visibilidade = 'publico');

-- authenticated vê ativos (público) OU os próprios, independente do
-- status — policy única pra evitar multiple permissive policies
create policy "negocios_select_authenticated"
  on negocios for select
  to authenticated
  using (
    status = 'ativo'
    or profile_id = (select auth.uid())
    or public.is_admin()
  );

-- dono cria só pra si mesmo
create policy "negocios_insert_own"
  on negocios for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

-- admin cria negócio sem dono (profile_id null) — migration 0018
create policy "negocios_insert_admin"
  on negocios for insert
  to authenticated
  with check (public.is_admin());

-- dono edita só os próprios; "status" não entra no whitelist de campos
-- editáveis pelo cliente — isso é reforçado na API route (Zod schema),
-- não só aqui
create policy "negocios_update_own"
  on negocios for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

-- admin muda só o status (aprovar/rejeitar) — editar os outros campos
-- continua sendo papel do dono, não do admin
create policy "negocios_update_status_admin"
  on negocios for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- negocio_edicoes: histórico de edições pós-aprovação
-- ============================================================
-- Editar um negócio já ativo não manda ele de volta pra pendente
-- (decisão: continua ativo direto), mas fica registrado o que mudou e
-- com que nível de alerta, pro admin revisar quando quiser.
create table negocio_edicoes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  campos_alterados text[] not null,
  nivel_alerta varchar(10) not null, -- baixo | medio | alto
  editado_em timestamptz not null default now()
);

create index negocio_edicoes_negocio_id_idx on negocio_edicoes (negocio_id);

alter table negocio_edicoes enable row level security;

-- Só o admin lê o histórico — é auditoria interna, não informação do dono
create policy "negocio_edicoes_select_admin"
  on negocio_edicoes for select
  to authenticated
  using (public.is_admin());

-- Sem policy de insert pra authenticated de propósito — a gravação
-- acontece só pela API route via admin client, depois de validar a
-- edição no servidor (mesmo padrão de fotoSignedUrl)

-- ============================================================
-- galeria_fotos: até 5 por negócio, adicionadas pós-cadastro
-- ============================================================
create table galeria_fotos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  foto_url varchar(500) not null,
  ordem int not null default 0
);

create index galeria_fotos_negocio_id_idx on galeria_fotos (negocio_id);

alter table galeria_fotos enable row level security;

-- galeria segue a visibilidade do negócio dono (ativo = público)
create policy "galeria_select_anon"
  on galeria_fotos for select
  to anon
  using (
    exists (
      select 1 from negocios
      where negocios.id = galeria_fotos.negocio_id
        and negocios.status = 'ativo'
    )
  );

create policy "galeria_select_authenticated"
  on galeria_fotos for select
  to authenticated
  using (
    exists (
      select 1 from negocios
      where negocios.id = galeria_fotos.negocio_id
        and (
          negocios.status = 'ativo'
          or negocios.profile_id = (select auth.uid())
        )
    )
  );

create policy "galeria_insert_own"
  on galeria_fotos for insert
  to authenticated
  with check (
    exists (
      select 1 from negocios
      where negocios.id = galeria_fotos.negocio_id
        and negocios.profile_id = (select auth.uid())
    )
  );

create policy "galeria_delete_own"
  on galeria_fotos for delete
  to authenticated
  using (
    exists (
      select 1 from negocios
      where negocios.id = galeria_fotos.negocio_id
        and negocios.profile_id = (select auth.uid())
    )
  );

-- ============================================================
-- posts: eventos, cursos, anúncios e pets perdidos — feed que fica
-- fixo no app, diferente do grupo de WhatsApp (migration 0019)
-- ============================================================
create table posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  -- preenchido quando o post é publicado em nome de um negócio próprio
  -- em vez do perfil pessoal (migration 0020)
  negocio_id uuid references negocios(id) on delete set null,
  tipo varchar(20) not null, -- evento | curso | anuncio | pet_perdido
  -- detectada sozinha pelo bairro/vila do endereço quando dá (evento/
  -- curso), ou escolhida na mão — lumiar | sao-pedro-da-serra | bocaina |
  -- benfica | boa-esperanca | santiago | serra-mar | etc (lista aberta,
  -- ver LOCALIZACOES em src/lib/mock-data.ts)
  localizacao varchar(20) not null,
  titulo varchar(255) not null,
  descricao text,
  -- obrigatória em pet_perdido, opcional nos outros — validado no Zod
  foto_url varchar(500),
  -- sempre obrigatório (todo tipo, inclusive pet_perdido)
  telefone_contato varchar(20) not null,
  -- opcional; evento/curso/anuncio (não pet_perdido) — migration 0024
  email_contato varchar(255),
  -- opcional; só evento/curso — migration 0024
  rede_social varchar(255),
  data_evento timestamptz, -- obrigatório em evento/curso
  -- obrigatório em evento/curso (endereço real); opcional em pet_perdido
  -- ("visto por último"); anuncio não usa
  local_texto varchar(255),
  -- só preenchidos quando a pessoa escolhe um lugar real no autocomplete
  -- (migration 0022) — habilita o mapa clicável na tela de detalhe
  endereco_lat double precision,
  endereco_lng double precision,
  preco numeric(10, 2), -- só anuncio; null = "a combinar"
  status varchar(20) not null default 'ativo', -- ativo | encerrado
  -- nome de quem postou, capturado no momento (migration 0021) — profiles
  -- só tem policy de select pro próprio dono, então o feed não consegue
  -- ler o nome de outra pessoa via join; retrato do momento, não link ao vivo
  autor_nome varchar(255) not null default '',
  -- publico (qualquer um vê) ou logado (só quem tem conta) — escolhido
  -- por quem posta (migration 0027)
  visibilidade varchar(10) not null default 'publico',
  created_at timestamptz not null default now()
);

create index posts_profile_id_idx on posts (profile_id);
create index posts_negocio_id_idx on posts (negocio_id);
create index posts_tipo_idx on posts (tipo);
create index posts_status_idx on posts (status);
create index posts_data_evento_idx on posts (data_evento);

alter table posts enable row level security;

-- sem aprovação prévia (diferente de negocios) — post fica no ar assim
-- que criado, admin remove depois se precisar. anon só vê público;
-- authenticated vê público + logado (policy mais abaixo)
create policy "posts_select_anon"
  on posts for select
  to anon
  using (status = 'ativo' and visibilidade = 'publico');

create policy "posts_select_authenticated"
  on posts for select
  to authenticated
  using (
    status = 'ativo'
    or profile_id = (select auth.uid())
    or public.is_admin()
  );

-- negocio_id preenchido = postando em nome de um negócio próprio; checa
-- que o negócio é do autor e está ativo (senão dá pra postar em nome do
-- negócio de outra pessoa)
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

create policy "posts_delete_own"
  on posts for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "posts_update_admin"
  on posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "posts_delete_admin"
  on posts for delete
  to authenticated
  using (public.is_admin());

-- ============================================================
-- categorias: catálogo público, só admin edita
-- ============================================================
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome varchar(100) unique not null,
  icon varchar(255)
);

alter table categorias enable row level security;

create policy "categorias_select_publico"
  on categorias for select
  to anon, authenticated
  using (true);

-- sem policy de insert/update/delete pro público — só via admin client
-- (service_role, bypassa RLS) ou policy futura restrita a is_admin

insert into categorias (nome) values
  ('Motoboy'), ('Faxina'), ('Mototáxi'), ('Uber'), ('Estética'),
  ('Adestramento'), ('Hospedagem Pet'), ('Lojas'), ('Babá'),
  ('Educação'), ('Psicólogo'), ('Artes');

-- ============================================================
-- sugestoes: formulário de sugestão (geral, lugar, ou problema)
-- ============================================================
create table sugestoes (
  id uuid primary key default gen_random_uuid(),
  categoria varchar(50) not null, -- geral | lugar | problema
  mensagem text not null,
  email varchar(255), -- só se deslogado e quiser resposta
  profile_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index sugestoes_profile_id_idx on sugestoes (profile_id);

alter table sugestoes enable row level security;

-- qualquer um pode enviar sugestão (deslogado ou logado)
create policy "sugestoes_insert_publico"
  on sugestoes for insert
  to anon, authenticated
  with check (true);

-- só o próprio autor vê a sugestão que mandou (se logado); sem select
-- público — sugestões não são um mural
create policy "sugestoes_select_own"
  on sugestoes for select
  to authenticated
  using ((select auth.uid()) = profile_id);

-- ============================================================
-- trigger: cria profiles automaticamente no signup do auth.users
-- (mantém profile_id sempre em sync com auth.users, sem insert manual
-- vindo do cliente)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, nome, telefone, username, endereco, endereco_lat, endereco_lng, data_nascimento
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'telefone', ''),
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'endereco', ''),
    (new.raw_user_meta_data->>'endereco_lat')::double precision,
    (new.raw_user_meta_data->>'endereco_lng')::double precision,
    (new.raw_user_meta_data->>'data_nascimento')::date
  );
  return new;
end;
$$;

-- SECURITY DEFINER só deve rodar via trigger, nunca como RPC pública
-- chamável por /rest/v1/rpc/handle_new_user
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Data API grants — RLS sozinho não expõe a tabela pra REST API do
-- Supabase, precisa do GRANT de base também. Concede só o que cada
-- policy de RLS acima já permite, nunca mais que isso.
-- ============================================================
grant select, update on public.profiles to authenticated;
-- admin client (service_role) usa isso na checagem de duplicidade de
-- telefone em /api/negocios — service_role não tem privilégio
-- implícito, só o que for concedido explicitamente
grant select on public.profiles to service_role;

grant select on public.negocios to anon;
grant select, insert, update on public.negocios to authenticated;

grant select on public.galeria_fotos to anon;
grant select, insert, delete on public.galeria_fotos to authenticated;

grant select on public.categorias to anon, authenticated;

-- ============================================================
-- Storage: bucket de fotos de negócio
-- ============================================================
-- Privado — nenhuma foto é acessível por URL direta. Fotos de status
-- ativo são servidas via URL assinada, gerada pelo backend (service_role,
-- bypassa RLS) depois de checar status/dono — pendente fica genuinamente
-- inacessível, não só "difícil de adivinhar" (CLAUDE.md seção 3).
--
-- Nome do bucket ("prestador-fotos") ficou como estava mesmo após o
-- rename pra "negócio" — é um identificador interno, nunca aparece pro
-- usuário, e renomear exigiria recriar o bucket e mover/re-subir cada
-- arquivo existente. Sem ganho real, só risco.
insert into storage.buckets (id, name, public)
values ('prestador-fotos', 'prestador-fotos', false)
on conflict (id) do nothing;

-- cada negócio só sobe foto na própria pasta: prestador-fotos/{auth.uid()}/...
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

grant insert on public.sugestoes to anon, authenticated;
grant select on public.sugestoes to authenticated;

-- ============================================================
-- storage: posts-fotos (migration 0020)
-- ============================================================
-- Público — post fica visível assim que criado, sem estado "pendente"
-- pra esconder (diferente de negocios), então não precisa de URL
-- assinada: foto_url guarda a URL pública direto.
insert into storage.buckets (id, name, public)
values ('posts-fotos', 'posts-fotos', true)
on conflict (id) do nothing;

create policy "posts_fotos_select_publico"
  on storage.objects for select
  to public
  using (bucket_id = 'posts-fotos');

-- cada autor só sobe foto na própria pasta: posts-fotos/{auth.uid()}/...
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

-- ============================================================
-- storage: perfil-fotos (migration 0023)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('perfil-fotos', 'perfil-fotos', true)
on conflict (id) do nothing;

create policy "perfil_fotos_select_publico"
  on storage.objects for select
  to public
  using (bucket_id = 'perfil-fotos');

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
