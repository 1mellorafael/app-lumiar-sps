-- Histórico de leituras do nível do rio (INEA) — guardamos cada leitura
-- pra calcular variação ao longo do tempo (subida rápida = risco), já
-- que a API do INEA não expõe série histórica, só o valor mais recente.
create table leituras_nivel_rio (
  id uuid primary key default gen_random_uuid(),
  estacao_id varchar(20) not null,
  nivel_m numeric,
  chuva_mm numeric,
  medido_em timestamptz not null,
  criado_em timestamptz not null default now(),
  unique (estacao_id, medido_em)
);

create index leituras_nivel_rio_estacao_medido_idx
  on leituras_nivel_rio (estacao_id, medido_em desc);

alter table leituras_nivel_rio enable row level security;
-- Sem policy nenhuma: só o backend (service_role, que ignora RLS) grava
-- e lê. Não é dado de usuário, não precisa de acesso público.
