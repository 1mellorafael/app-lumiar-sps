-- Admin pode cadastrar um negócio direto, sem dono ainda (ex: base de
-- prospecção já verificada manualmente) — já estava previsto desde a
-- Fase 5 mínima do admin ("sem 'criar perfil manualmente' ainda"),
-- decisão de 17/08 destrava isso. profile_id fica null até alguém criar
-- conta e o admin transferir a posse (telefone bate com profiles.telefone).
alter table negocios alter column profile_id drop not null;

create policy "negocios_insert_admin"
  on negocios for insert
  to authenticated
  with check (public.is_admin());
