-- Telefone precisa ser único pra detectar duplicidade no cadastro (CLAUDE.md
-- seção 7: "Email/telefone já existentes: erro inline, sugere login").
-- Email já é único nativamente via auth.users; telefone não tinha essa
-- garantia. Armazenado sempre como dígitos (API normaliza antes de gravar).
alter table public.profiles
  add constraint profiles_telefone_key unique (telefone);
