-- Achado de code review (revisão da Fase 2): telefone_ja_cadastrado
-- (migration 0002) tinha EXECUTE liberado pro papel anon — qualquer um
-- podia chamar /rest/v1/rpc/telefone_ja_cadastrado direto (fora da rota
-- Next.js e do rate limit dela) e enumerar quais telefones de
-- Lumiar/SPS já têm conta. Revertendo pra checagem via service_role
-- dentro da API route (backend, nunca exposto ao client — CLAUDE.md
-- item 3), que não é alcançável por ninguém de fora.
drop function if exists public.telefone_ja_cadastrado(text);
