# 📊 STATUS ATUAL — APP DE LUMIAR

**Última atualização:** 17/08/2026 (Fase 3 — Cadastro de Serviço)
**Fase:** Implementação — Fase 2 (Auth) e Fase 3 (cadastro de serviço real) completas. Fase 5 (Admin) é o próximo passo antes do lançamento (precisa existir pra aprovar os pendentes)

---

## O que já está construído (código)

| Rota/Tela | Arquivo | Estado |
|---|---|---|
| Home | `src/app/page.tsx` | ✅ Grade de módulos, clima compacto |
| Busca/Categorias | `src/app/busca/page.tsx` + `[slug]` | ✅ Grid + toggle Cards/Lista, busca normalizada (sem acento/maiúscula), dispensa teclado ao rolar/Enter/botão limpar. Ainda lê de `mock-data.ts`, não do banco real |
| Detalhe do Serviço | `src/app/servico/[id]/page.tsx` | ✅ Server Component — se o id é UUID, busca `prestadores` real (RLS: pendente só o dono vê) com foto via URL assinada; senão cai no mock (compat com Busca/Categorias, que ainda não migraram) |
| Cadastro (UI + Auth + Serviço) | `src/app/cadastro/page.tsx` | ✅ Passo 1 grava conta real via Supabase Auth (`/api/auth/cadastro`). Passo 2 grava serviço real via `/api/prestadores` (`multipart/form-data`): upload de foto principal (obrigatória) + capa (opcional) pro Storage privado, telefone de contato próprio (separado do telefone da conta), categoria validada contra a lista canônica. Cai na tela do próprio serviço, `status: pendente` |
| Login | `src/app/login/page.tsx` | ✅ Login real via `/api/auth/login` |
| Menu | `src/app/menu/page.tsx` | ✅ Reflete sessão real (Server Component), botão Sair funcional, "Meus serviços" ainda placeholder (Fase 4) |
| Úteis | `src/app/uteis/page.tsx` | ✅ Clima (semana completa), ônibus, telefones — dados ilustrativos, não vêm de fonte real ainda |
| Termos / Privacidade | `src/app/termos/page.tsx`, `privacidade/page.tsx` | ✅ Texto placeholder publicado (a própria página já avisa "versão preliminar, revisão jurídica antes do lançamento") |
| PWA | manifest + ícones | ✅ Instalação funcional (Android 1-clique, iOS passo a passo) |
| Motion/toque | `globals.css` + 9 componentes | ✅ Tokens Material Design 3 (`ease-standard`, `ease-decelerate`), feedback de toque consistente em todos os cards/botões/nav |

## O que NÃO está construído ainda

- **Admin Dashboard** — aprovação de serviço pendente não existe ainda (Fase 5). **Bloqueia o lançamento**: sem isso, todo cadastro fica pendente pra sempre, ninguém aparece na Busca
- **Galeria de fotos, editar serviço** — Fase 3 item 10 ("tela pós-cadastro modo dono"), ainda não construído. Hoje dá pra criar o serviço, não pra editar depois
- **Busca/Categorias ainda em mock** — só o cadastro e a página de detalhe leem do banco real; listagem/filtro por categoria continua em `mock-data.ts`
- **i18n** — só português, toggle de idioma ainda não funcional
- **Comunidade** (Colunas, Carona, Corrida, Alerta, Pede Aí, Selo) — Fase 8, não iniciada
- **SMTP customizado (Resend)** — Auth ainda usa o provedor de email padrão do Supabase, com rate limit agressivo (poucos emails/hora). Precisa configurar antes do lançamento (pendência já registrada no `08_PENDENCIAS_ABERTAS.md`)

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

1. **Fase 5 — Admin Dashboard**: aprovação manual — bloqueia o lançamento, sem isso nenhum cadastro sai de pendente
2. **Fase 3, item 10 — Tela pós-cadastro (modo dono)**: editar serviço, galeria de fotos (hoje só dá pra criar, não editar)
3. **Fase 4 — Perfil/Menu**: "Meus Serviços" de verdade (hoje é placeholder desabilitado)
4. Validação com prestadores reais continua pendente (falar com 5-10 prestadores) — não é bloqueio técnico, é validação de produto

## Teste ponta a ponta (Fase 2 + Fase 3) — feito em 17/08

Happy-path completo testado de verdade: cadastro de conta (sem gate de
confirmação de email, decisão acima) → login → Passo 2 com upload de
foto real → prestador criado com `status: pendente` → RLS bloqueia
visitante não-dono (confirmado: "Serviço não encontrado" pra quem não é
dono) → dono vê a própria página com banner de "em análise" → foto
carrega via URL assinada. Dados de teste removidos do banco depois.

## Pendências que ainda precisam de decisão sua

Ver `08_PENDENCIAS_ABERTAS.md`.
