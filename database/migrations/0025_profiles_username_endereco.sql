-- username substitui email como identificador de login (decisão de
-- 18/08) — email continua sendo pedido e passa a ser verificado pelo
-- Auth nativo do Supabase, só não é mais o campo de login. Nullable
-- porque contas já existentes (dados de teste, pré-lançamento) ainda
-- não têm um; toda conta NOVA é obrigada a preencher (Zod).
alter table profiles add column username varchar(30) unique;

-- endereço da conta pessoal — usado só pra confirmar que a pessoa é da
-- região (Lumiar/São Pedro da Serra e entorno), validado contra uma
-- área no Zod na hora do cadastro. Nunca falha silenciosamente: mostra
-- o motivo real quando fica de fora (decisão de 18/08 — endereço mal
-- mapeado no OSM já provou derrubar gente real nessa região, ver
-- localizacao de posts). Nullable pelo mesmo motivo do username acima.
alter table profiles add column endereco varchar(500);
alter table profiles add column endereco_lat double precision;
alter table profiles add column endereco_lng double precision;
