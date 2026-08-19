-- Nome de quem postou, capturado no momento da publicação. Não dá pra
-- resolver isso via join na hora de exibir o feed: profiles só tem
-- policy de select pro próprio dono (profiles_select_own), então o
-- feed não conseguiria ler o nome de quem postou o feed de outra
-- pessoa. Guardar aqui evita abrir mais superfície de RLS em profiles
-- só pra isso — e como bônus, se a pessoa mudar o nome depois, os
-- posts antigos continuam com o nome de quando foram feitos (correto
-- pro contexto: é um retrato do momento, não um link ao vivo).
alter table posts add column autor_nome varchar(255) not null default '';
