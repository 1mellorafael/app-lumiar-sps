-- Só preenchido quando a pessoa escolhe um endereço real via autocomplete
-- do Google (não geocodificamos texto livre) — usado só pra desenhar o
-- mapa embed, endereço em si continua sendo o texto solto na coluna
-- "endereco".
alter table negocios add column endereco_lat double precision;
alter table negocios add column endereco_lng double precision;
