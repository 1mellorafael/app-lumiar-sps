-- Mesmo problema do service_role: RLS restringe a leitura pro admin, mas
-- o GRANT básico de SELECT pra authenticated nem existia nessa tabela
-- nova — sem ele, a policy nunca chega a ser avaliada.
grant select on negocio_edicoes to authenticated;
