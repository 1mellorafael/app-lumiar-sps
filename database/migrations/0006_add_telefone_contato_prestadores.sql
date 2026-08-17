-- prestadores não tinha telefone próprio — o botão de WhatsApp usaria o
-- telefone de quem fez login (profiles.telefone), o que quebra se um dia
-- alguém cadastrar o serviço de outra pessoa (ver docs/06, seção "Cadastro
-- por terceiro"). Telefone do serviço agora é campo próprio, independente
-- de quem é dono da conta.
alter table prestadores add column telefone_contato varchar(20) not null default '';
alter table prestadores alter column telefone_contato drop default;
