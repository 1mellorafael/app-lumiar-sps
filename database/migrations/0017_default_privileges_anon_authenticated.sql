-- Mesmo problema já corrigido pro service_role (migration 0014), mas pra
-- anon/authenticated: RLS restringe certo, mas sem o GRANT padrão do
-- Postgres a policy nunca chega a ser avaliada. Sem isso, toda tabela
-- NOVA reproduz o mesmo bug de "permission denied" (já aconteceu duas
-- vezes nesta sessão) até alguém notar e migrar na mão de novo. RLS
-- continua sendo a fronteira de segurança real (obrigatório em toda
-- tabela desde a criação, CLAUDE.md item 4) — o grant sozinho não abre
-- nada que a policy não permita.
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public grant select on sequences to anon, authenticated;
