-- Admin client (service_role) usado na checagem de duplicidade de telefone
-- (src/app/api/prestadores/route.ts) precisa de SELECT em profiles —
-- service_role não tem privilégio implícito em tabela de usuário, só o
-- que for concedido explicitamente (RLS e GRANT são mecanismos separados).
grant select on public.profiles to service_role;
