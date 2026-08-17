-- Permite escolher qual parte da foto fica visível (object-position),
-- já que o recorte é circular (principal) ou banner (capa) e o padrão
-- centralizado nem sempre pega a parte certa da imagem.
alter table negocios add column foto_principal_pos_x smallint not null default 50;
alter table negocios add column foto_principal_pos_y smallint not null default 50;
alter table negocios add column foto_capa_pos_x smallint not null default 50;
alter table negocios add column foto_capa_pos_y smallint not null default 50;
