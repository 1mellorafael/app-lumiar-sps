-- Data de nascimento, pedida no cadastro (decisão de 18/08 — reverte a
-- exclusão original do cadastro leve). Nullable pelas mesmas razões de
-- username/endereco (migration 0025): contas já existentes não têm.
alter table profiles add column data_nascimento date;
