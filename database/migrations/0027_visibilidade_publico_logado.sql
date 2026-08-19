-- Quem cria um post ou negócio escolhe se fica visível pra qualquer
-- um (público) ou só pra quem tem conta (logado) — decisão de 18/08,
-- junto com a Home passar a mostrar um feed público (sem login) e um
-- feed completo (logado, público + logado). RLS de authenticated já
-- mostra tudo que é 'ativo' independente de visibilidade (mesma policy
-- de antes); só a policy de anon precisa aprender a filtrar.
alter table posts add column visibilidade varchar(10) not null default 'publico';
alter table negocios add column visibilidade varchar(10) not null default 'publico';

drop policy "posts_select_anon" on posts;
create policy "posts_select_anon"
  on posts for select
  to anon
  using (status = 'ativo' and visibilidade = 'publico');

drop policy "negocios_select_anon" on negocios;
create policy "negocios_select_anon"
  on negocios for select
  to anon
  using (status = 'ativo' and visibilidade = 'publico');
