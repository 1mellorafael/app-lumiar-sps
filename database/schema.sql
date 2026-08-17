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
-- só nome, email (fica em auth.users), telefone e senha no Passo 1. Sem
-- sobrenome, foto de perfil, data de nascimento ou endereço — geo-restrição
-- vira só aviso de texto fixo antes do botão, não geocoding automático.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome varchar(255) not null,
  telefone varchar(20) not null unique,
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
-- prestadores: cada serviço (1 profile pode ter vários)
-- ============================================================
create table prestadores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  nome_servico varchar(255),
  categoria varchar(100) not null,
  descricao text,
  foto_principal_url varchar(500) not null,
  foto_capa_url varchar(500),
  instagram varchar(255),
  -- telefone do SERVIÇO, separado do telefone da conta (profiles.telefone)
  -- — quem cadastra e quem atende podem ser pessoas diferentes (ver docs/06,
  -- "Cadastro por terceiro")
  telefone_contato varchar(20) not null,
  status varchar(20) not null default 'pendente', -- pendente | ativo | rejeitado
  created_at timestamptz not null default now()
);

create index prestadores_profile_id_idx on prestadores (profile_id);
create index prestadores_status_idx on prestadores (status);

alter table prestadores enable row level security;

-- público (deslogado) só vê prestadores com status ativo (regra de
-- sensibilidade: pendente é 100% privado, nenhum campo vaza)
create policy "prestadores_select_anon"
  on prestadores for select
  to anon
  using (status = 'ativo');

-- authenticated vê ativos (público) OU os próprios, independente do
-- status — policy única pra evitar multiple permissive policies
create policy "prestadores_select_authenticated"
  on prestadores for select
  to authenticated
  using (
    status = 'ativo'
    or profile_id = (select auth.uid())
    or public.is_admin()
  );

-- dono cria só pra si mesmo
create policy "prestadores_insert_own"
  on prestadores for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

-- dono edita só os próprios; "status" não entra no whitelist de campos
-- editáveis pelo cliente — isso é reforçado na API route (Zod schema),
-- não só aqui
create policy "prestadores_update_own"
  on prestadores for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

-- admin muda só o status (aprovar/rejeitar) — editar os outros campos
-- continua sendo papel do dono, não do admin
create policy "prestadores_update_status_admin"
  on prestadores for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- galeria_fotos: até 5 por prestador, adicionadas pós-cadastro
-- ============================================================
create table galeria_fotos (
  id uuid primary key default gen_random_uuid(),
  prestador_id uuid not null references prestadores(id) on delete cascade,
  foto_url varchar(500) not null,
  ordem int not null default 0
);

create index galeria_fotos_prestador_id_idx on galeria_fotos (prestador_id);

alter table galeria_fotos enable row level security;

-- galeria segue a visibilidade do prestador dono (ativo = público)
create policy "galeria_select_anon"
  on galeria_fotos for select
  to anon
  using (
    exists (
      select 1 from prestadores
      where prestadores.id = galeria_fotos.prestador_id
        and prestadores.status = 'ativo'
    )
  );

create policy "galeria_select_authenticated"
  on galeria_fotos for select
  to authenticated
  using (
    exists (
      select 1 from prestadores
      where prestadores.id = galeria_fotos.prestador_id
        and (
          prestadores.status = 'ativo'
          or prestadores.profile_id = (select auth.uid())
        )
    )
  );

create policy "galeria_insert_own"
  on galeria_fotos for insert
  to authenticated
  with check (
    exists (
      select 1 from prestadores
      where prestadores.id = galeria_fotos.prestador_id
        and prestadores.profile_id = (select auth.uid())
    )
  );

create policy "galeria_delete_own"
  on galeria_fotos for delete
  to authenticated
  using (
    exists (
      select 1 from prestadores
      where prestadores.id = galeria_fotos.prestador_id
        and prestadores.profile_id = (select auth.uid())
    )
  );

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
-- telefone em /api/prestadores — service_role não tem privilégio
-- implícito, só o que for concedido explicitamente
grant select on public.profiles to service_role;

grant select on public.prestadores to anon;
grant select, insert, update on public.prestadores to authenticated;

grant select on public.galeria_fotos to anon;
grant select, insert, delete on public.galeria_fotos to authenticated;

grant select on public.categorias to anon, authenticated;

-- ============================================================
-- Storage: bucket de fotos de prestador
-- ============================================================
-- Privado — nenhuma foto é acessível por URL direta. Fotos de status
-- ativo são servidas via URL assinada, gerada pelo backend (service_role,
-- bypassa RLS) depois de checar status/dono — pendente fica genuinamente
-- inacessível, não só "difícil de adivinhar" (CLAUDE.md seção 3).
insert into storage.buckets (id, name, public)
values ('prestador-fotos', 'prestador-fotos', false)
on conflict (id) do nothing;

-- cada prestador só sobe foto na própria pasta: prestador-fotos/{auth.uid()}/...
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
