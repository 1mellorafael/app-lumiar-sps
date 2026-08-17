# 📊 STATUS ATUAL — APP DE LUMIAR

**Última atualização:** 17/08/2026 (Fase 5 — Admin + rename pra "Negócio")
**Fase:** Implementação — Fase 2 (Auth), Fase 3 (cadastro de negócio real) e Fase 5 mínima (Admin) completas. Próximo passo: Fase 3 item 10 (editar negócio, galeria) e Fase 4 (Perfil/Menu completo)

## ⚠️ Rename de terminologia (17/08): "prestador" → "negócio"

Decisão do dia: app usa "negócio" em vez de "prestador/serviço" — mesma
terminologia do Nextdoor ("Business"). Tabela `prestadores` virou
`negocios` (migration `0010`), rotas `/cadastro-negocio` e
`/negocio/[id]`. **Documentos escritos antes de 17/08 neste repo ainda
citam "prestador"/"serviço" em partes históricas — são o mesmo conceito
com nome antigo, não reescrevi retroativamente todo o histórico.** Único
nome interno que ficou como estava de propósito: o bucket de Storage
(`prestador-fotos`) — renomear exigiria mover cada arquivo já salvo, sem
ganho real (usuário nunca vê esse nome).

---

## O que já está construído (código)

| Rota/Tela | Arquivo | Estado |
|---|---|---|
| Home | `src/app/page.tsx` | ✅ Grade de módulos. Clima removido da Home (fica só em Úteis) |
| Busca/Categorias | `src/app/busca/page.tsx` + `[slug]` | ✅ Grid + toggle Cards/Lista, busca normalizada (sem acento/maiúscula), dispensa teclado ao rolar/Enter/botão limpar. Cards sem descrição (só no detalhe). Ainda lê de `mock-data.ts`, não do banco real |
| Detalhe do Negócio | `src/app/negocio/[id]/page.tsx` | ✅ Server Component — se o id é UUID, busca `negocios` real (RLS: pendente só dono/admin vê) com foto via URL assinada; senão cai no mock (compat com Busca/Categorias, que ainda não migraram) |
| Cadastro de conta | `src/app/cadastro/page.tsx` | ✅ Só cria a conta via Supabase Auth (`/api/auth/cadastro`) — **não** força cadastro de negócio em seguida, tela de sucesso oferece "Cadastrar meu negócio" ou "Ir pro Menu" |
| Cadastro de negócio | `src/app/cadastro-negocio/page.tsx` | ✅ Tela própria, exige login (manda pro `/login` senão). Upload de foto principal (obrigatória) + capa (opcional), telefone de contato próprio, horário de funcionamento (opcional, texto livre), categoria validada. Cai na tela do próprio negócio, `status: pendente` |
| Admin | `src/app/admin/page.tsx` | ✅ Lista pendentes, aprova/rejeita. Card mostra só o essencial pra escanear rápido (foto, nome, categoria, quem cadastrou) — telefone/descrição só no clique. Link só aparece no Menu pra quem é `is_admin` |
| Login | `src/app/login/page.tsx` | ✅ Login real via `/api/auth/login` |
| Menu | `src/app/menu/page.tsx` | ✅ 3 estados reais: deslogado (Fazer login + Criar conta), logado sem negócio (Cadastrar negócio), logado com negócio (Meus negócios, contador) |
| Úteis | `src/app/uteis/page.tsx` | ✅ Clima com toggle Lumiar/SPS (dados ainda ilustrativos), ônibus, telefones |
| Termos / Privacidade | `src/app/termos/page.tsx`, `privacidade/page.tsx` | ✅ Texto placeholder publicado (a própria página já avisa "versão preliminar, revisão jurídica antes do lançamento") |
| PWA | manifest + ícones | ✅ Instalação funcional (Android 1-clique, iOS passo a passo) |
| Motion/toque | `globals.css` + componentes | ✅ Todo card segue o mesmo sistema de sombra/toque (regra formal no CLAUDE.md §9 desde 17/08) |

## O que NÃO está construído ainda

- **Galeria de fotos, editar negócio** — Fase 3 item 10 ("tela pós-cadastro modo dono"), ainda não construído. Hoje dá pra criar o negócio, não pra editar depois
- **Busca/Categorias ainda em mock** — só o cadastro e a página de detalhe leem do banco real; listagem/filtro por categoria continua em `mock-data.ts`
- **i18n** — só português, toggle de idioma ainda não funcional
- **Comunidade** (Colunas, Carona, Corrida, Alerta, Pede Aí, Selo) — Fase 8, não iniciada. Ordem revisada em 17/08 (ver `11_PLANO_IMPLEMENTACAO.md`) pra priorizar Alerta (retenção) logo após o Admin
- **SMTP customizado (Resend)** — Auth ainda usa o provedor de email padrão do Supabase, com rate limit agressivo (poucos emails/hora). Precisa configurar antes do lançamento (pendência já registrada no `08_PENDENCIAS_ABERTAS.md`)
- **Admin "criar perfil manualmente"** — item do plano original da Fase 5, não construído ainda (não bloqueia, é conveniência)

## Correção feita em 16/08 — Fase 2, Auth

`database/schema.sql` já tinha sido corrigido numa revisão anterior (removendo `sobrenome`, `foto_perfil_url`, `data_nascimento` e endereço, que o cadastro real nunca coletou), mas essa correção nunca tinha virado migration de verdade — **o banco remoto ainda tinha essas colunas `not null`**, o que quebrou o primeiro teste de signup real assim que a Fase 2 começou a rodar. Aplicadas como `database/migrations/0001` a `0003`: unique constraint em `telefone`, function `telefone_ja_cadastrado` (checagem de duplicidade sem precisar de `service_role`) e a sincronização das colunas removidas + trigger `handle_new_user` atualizado. Banco remoto e `schema.sql` agora batem.

## Revisão de segurança pós-Fase 2 (16-17/08)

`/code-review` em modo `high` (8 ângulos, verificação individual) rodado
**depois** do merge da Fase 2 — deveria ter rodado antes (lição registrada
em memória). Achou 8 problemas reais, todos corrigidos em commit
separado: RPC pública de telefone permitia enumeração (removida, virou
checagem via `service_role` no backend), erro de checagem de telefone era
ignorado (fail-open), email aparecia no Menu (violava CLAUDE.md), refresh
de sessão não existia de fato, confirmação de senha só validada no
cliente, entre outros.

## Incidente em produção (17/08) — resolvido

O refresh de sessão adicionado no `proxy.ts` (parte da correção acima)
rodava em toda rota sem guarda contra env var ausente/erro — derrubou o
site inteiro em produção por ~10min (16 erros, 5 usuários, todas as
rotas). Corrigido com guarda de env var + try/catch: qualquer falha no
refresh agora deixa a navegação seguir normal em vez de travar a rota.
Lição: mudança em `proxy.ts`/middleware é de altíssimo risco porque roda
em toda requisição — testar isso especificamente antes de ampliar o
matcher no futuro.

## Decisão: confirmação de email desativada

CLAUDE.md seção 7 especifica Passo 1 → Passo 2 "direto na sequência",
sem gate no meio — mas o Supabase por padrão exige confirmar email antes
de ter sessão ativa, o que quebraria esse fluxo. Desativado "Confirm
email" no Supabase Dashboard (Authentication → Sign In / Providers →
Email) em 17/08. Justificativa: o gate de segurança real desse app é a
aprovação do admin antes do serviço virar público (Fase 5), não a posse
de um email verificado — e a comunidade pequena/conectada já reduz risco
de spam (mesma lógica de confiança comunitária). Se abuso virar
problema real depois do lançamento, reavaliar.

## ⚠️ Documentos desatualizados (não confiar sem checar CLAUDE.md antes)

`02_ESCOPO_MVP_ATUAL.md` se autodeclara "o documento que manda", mas o **CLAUDE.md tem precedência agora** (ele mesmo diz isso na abertura). As seções 3, 4 e 5 de `02` (campos de cadastro, menores de idade via data de nascimento, geo-restrição via geocoding) descrevem um fluxo mais pesado que **não é o que foi implementado** — o cadastro real é o leve da seção 7 do CLAUDE.md. Marcado com aviso dentro do próprio `02` nesta revisão; não reescrevi o documento inteiro porque parte do conteúdo (moderação de linguagem, regra de sensibilidade pendente/aprovado, lógica de admin) ainda é válida e não foi implementada — só os campos de cadastro específicos ficaram obsoletos.

## Próximas etapas (em ordem)

1. **Fase 3, item 10 — Tela pós-cadastro (modo dono)**: editar negócio, galeria de fotos (hoje só dá pra criar, não editar)
2. **Fase 4 — Perfil/Menu**: "Meus Negócios" de verdade (hoje é placeholder desabilitado quando já tem ≥1)
3. **Fase 8, item B — Morador account**: pré-requisito do Alerta (item C), pra quem só quer reportar sem ser dono de negócio
4. Validação com negócios reais continua pendente (falar com 5-10 donos) — não é bloqueio técnico, é validação de produto

## Teste ponta a ponta (Fase 2 + 3 + 5) — feito em 17/08

Happy-path completo testado de verdade: cadastro de conta (sem gate de
confirmação de email, decisão acima) → login → cadastro de negócio com
upload de foto real → `status: pendente` → RLS bloqueia visitante
não-dono/não-admin → dono vê a própria página com banner de "em
análise" → admin aprova pelo dashboard → status vira `ativo`. Dados de
teste removidos do banco depois de cada rodada.

## Pendências que ainda precisam de decisão sua

Ver `08_PENDENCIAS_ABERTAS.md`.
