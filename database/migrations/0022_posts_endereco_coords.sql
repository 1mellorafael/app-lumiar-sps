-- Coordenadas do local do post (evento/workshop/pet_perdido), só
-- preenchidas quando a pessoa escolhe um lugar real no autocomplete —
-- mesmo padrão do endereco_lat/lng de negocios. local_texto continua
-- sendo o texto livre (endereço ou "perto de tal lugar"); essas colunas
-- só habilitam o mapa quando dá pra geocodificar de verdade.
alter table posts add column endereco_lat double precision;
alter table posts add column endereco_lng double precision;
