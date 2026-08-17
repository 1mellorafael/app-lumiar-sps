-- Localização — negócio pode atender Lumiar, São Pedro da Serra, ou os
-- dois; obrigatório escolher pelo menos um. Backfill com os dois pra não
-- quebrar registros já existentes (não sabemos a localização real deles).
alter table negocios add column localizacoes text[];
update negocios set localizacoes = array['lumiar', 'sao-pedro-da-serra'];
alter table negocios alter column localizacoes set not null;

-- Endereço opcional — texto livre por enquanto, autocomplete/mapa do
-- Google entra depois via API key
alter table negocios add column endereco varchar(500);

-- Histórico de edições pós-aprovação — negócio continua ativo ao ser
-- editado (decisão: não volta pra pendente), mas fica registrado o que
-- mudou e com que nível de alerta, pro admin revisar quando quiser
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
