-- Um negócio pode ser mais de uma coisa (motoboy/mototáxi, hospedagem
-- pet/adestramento) — evita cadastro duplicado só pra cobrir isso.
-- Migra dado existente pra array de 1 item antes de trocar o tipo.
alter table negocios add column categorias text[];
update negocios set categorias = array[categoria];
alter table negocios alter column categorias set not null;
alter table negocios drop column categoria;

-- nome_negocio agora é obrigatório (decisão de 17/08) — sem dado
-- existente com valor null pra migrar (nenhum negócio real cadastrado
-- ainda além de dados de teste já removidos)
alter table negocios alter column nome_negocio set not null;
