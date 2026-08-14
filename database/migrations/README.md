# Migrations

`schema.sql` na pasta acima é a base inicial (rodada uma vez, direto no
SQL Editor do Supabase, ao criar o projeto).

A partir daqui, toda mudança de schema entra como um arquivo novo nesta
pasta, nunca editando `schema.sql` ou migrations antigas:

```
0001_add_avaliacoes_table.sql
0002_add_negocio_cnpj_field.sql
```

Cada migration deve ser idempotente e incluir a policy de RLS da tabela
nova, se aplicável — nenhuma tabela entra sem RLS ligado.
