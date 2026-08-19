-- email_contato: opcional, só faz sentido pra evento/curso/anuncio (não
-- pet_perdido, que já tem telefone como contato único e obrigatório).
-- rede_social: opcional, só evento/curso.
-- Nenhum dos dois ganha "not null" — aplicabilidade por tipo é regra de
-- app (Zod), não de schema, mesmo padrão de data_evento/preco aqui.
alter table posts add column email_contato varchar(255);
alter table posts add column rede_social varchar(255);
