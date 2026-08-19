-- Estende o trigger de criação automática de profile pra também gravar
-- username/endereço vindos de raw_user_meta_data (mesmo mecanismo de
-- nome/telefone) — sem isso o cadastro novo salvava só nome/telefone e
-- perdia os campos novos.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, nome, telefone, username, endereco, endereco_lat, endereco_lng
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'telefone', ''),
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'endereco', ''),
    (new.raw_user_meta_data->>'endereco_lat')::double precision,
    (new.raw_user_meta_data->>'endereco_lng')::double precision
  );
  return new;
end;
$$;
