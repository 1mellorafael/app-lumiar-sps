-- Renomeia "prestador" pra "negócio" em todo o app (decisão de 17/08,
-- inspirada no Nextdoor: eles chamam de "Business", não separam por
-- porte — verificação com documento é opcional, não bloqueia o cadastro
-- básico, mesma filosofia do cadastro leve já usada aqui).
alter table prestadores rename to negocios;
alter table negocios rename column nome_servico to nome_negocio;

-- Renomeia policies (cosmético, mas mantém consistência com o resto)
alter policy "prestadores_select_anon" on negocios rename to "negocios_select_anon";
alter policy "prestadores_select_authenticated" on negocios rename to "negocios_select_authenticated";
alter policy "prestadores_insert_own" on negocios rename to "negocios_insert_own";
alter policy "prestadores_update_own" on negocios rename to "negocios_update_own";
alter policy "prestadores_update_status_admin" on negocios rename to "negocios_update_status_admin";

alter index prestadores_pkey rename to negocios_pkey;
alter index prestadores_profile_id_idx rename to negocios_profile_id_idx;
alter index prestadores_status_idx rename to negocios_status_idx;

-- galeria_fotos referencia prestador_id — renomeia pra negocio_id
alter table galeria_fotos rename column prestador_id to negocio_id;
alter index galeria_fotos_prestador_id_idx rename to galeria_fotos_negocio_id_idx;

-- Campo opcional pra quem quiser informar horário de funcionamento —
-- texto livre por enquanto (ex: "Seg-Sex, 8h-18h"), não estruturado por
-- dia/horário ainda.
alter table negocios add column horario_funcionamento varchar(255);
