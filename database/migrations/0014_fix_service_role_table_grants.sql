-- service_role só tinha TRIGGER/REFERENCES/TRUNCATE em todas as tabelas
-- (faltava SELECT/INSERT/UPDATE/DELETE) — bypassa RLS mas ainda precisa
-- dos grants padrão do Postgres, que não tinham sido concedidos. Sem
-- isso, todo uso do admin client pra escrever em tabela (não storage)
-- falhava silenciosamente com "permission denied".
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
