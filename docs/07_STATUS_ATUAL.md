# 📊 STATUS ATUAL — APP DE LUMIAR

**Última atualização:** 16/08/2026 (Fase 2 — Auth)
**Fase:** Implementação — Fase 2 (Auth) completa, Fase 3 (cadastro de serviço real) é o próximo passo

---

## O que já está construído (código)

| Rota/Tela | Arquivo | Estado |
|---|---|---|
| Home | `src/app/page.tsx` | ✅ Grade de módulos, clima compacto |
| Busca/Categorias | `src/app/busca/page.tsx` + `[slug]` | ✅ Grid + toggle Cards/Lista, busca normalizada (sem acento/maiúscula), dispensa teclado ao rolar/Enter/botão limpar |
| Detalhe do Serviço | `src/app/servico/[id]/page.tsx` | ✅ Layout completo. Foto ainda é avatar com iniciais (sem upload real — depende da Fase 2/3) |
| Cadastro (UI + Auth) | `src/app/cadastro/page.tsx` | ✅ Passo 1 grava conta real via Supabase Auth (`/api/auth/cadastro`), com auto-capitalização, máscara, medidor de força, duplicidade de email/telefone inline. Passo 2 (dados do serviço) ainda é só front-end — depende da Fase 3 |
| Login | `src/app/login/page.tsx` | ✅ Login real via `/api/auth/login` |
| Menu | `src/app/menu/page.tsx` | ✅ Reflete sessão real (Server Component), botão Sair funcional |
| Úteis | `src/app/uteis/page.tsx` | ✅ Clima (semana completa), ônibus, telefones — dados ilustrativos, não vêm de fonte real ainda |
| Termos / Privacidade | `src/app/termos/page.tsx`, `privacidade/page.tsx` | ✅ Texto placeholder publicado (a própria página já avisa "versão preliminar, revisão jurídica antes do lançamento") |
| PWA | manifest + ícones | ✅ Instalação funcional (Android 1-clique, iOS passo a passo) |
| Motion/toque | `globals.css` + 9 componentes | ✅ Tokens Material Design 3 (`ease-standard`, `ease-decelerate`), feedback de toque consistente em todos os cards/botões/nav |

## O que NÃO está construído ainda

- **Upload de foto** — avatar com iniciais é placeholder em todo lugar
- **Admin Dashboard** — aprovação de serviço pendente não existe ainda (Fase 5)
- **i18n** — só português, toggle de idioma ainda não funcional
- **Comunidade** (Colunas, Carona, Corrida, Alerta, Pede Aí, Selo) — Fase 8, não iniciada
- **SMTP customizado (Resend)** — Auth ainda usa o provedor de email padrão do Supabase, com rate limit agressivo (poucos emails/hora). Precisa configurar antes do lançamento (pendência já registrada no `08_PENDENCIAS_ABERTAS.md`)

## Correção feita nesta revisão (16/08) — Fase 2, Auth

`database/schema.sql` já tinha sido corrigido numa revisão anterior (removendo `sobrenome`, `foto_perfil_url`, `data_nascimento` e endereço, que o cadastro real nunca coletou), mas essa correção nunca tinha virado migration de verdade — **o banco remoto ainda tinha essas colunas `not null`**, o que quebrou o primeiro teste de signup real assim que a Fase 2 começou a rodar. Aplicadas como `database/migrations/0001` a `0003`: unique constraint em `telefone`, function `telefone_ja_cadastrado` (checagem de duplicidade sem precisar de `service_role`) e a sincronização das colunas removidas + trigger `handle_new_user` atualizado. Banco remoto e `schema.sql` agora batem.

## ⚠️ Documentos desatualizados (não confiar sem checar CLAUDE.md antes)

`02_ESCOPO_MVP_ATUAL.md` se autodeclara "o documento que manda", mas o **CLAUDE.md tem precedência agora** (ele mesmo diz isso na abertura). As seções 3, 4 e 5 de `02` (campos de cadastro, menores de idade via data de nascimento, geo-restrição via geocoding) descrevem um fluxo mais pesado que **não é o que foi implementado** — o cadastro real é o leve da seção 7 do CLAUDE.md. Marcado com aviso dentro do próprio `02` nesta revisão; não reescrevi o documento inteiro porque parte do conteúdo (moderação de linguagem, regra de sensibilidade pendente/aprovado, lógica de admin) ainda é válida e não foi implementada — só os campos de cadastro específicos ficaram obsoletos.

## Próximas etapas (em ordem)

1. **Fase 3 — Cadastro de serviço real** (`11_PLANO_IMPLEMENTACAO.md`): upload de foto principal/capa, status pendente funcionando de verdade
2. **Fase 5 — Admin Dashboard**: aprovação manual
3. Validação com prestadores reais continua pendente (falar com 5-10 prestadores) — não é bloqueio técnico, é validação de produto

## Pendência de teste (Fase 2)

O happy-path completo de cadastro (usuário criado + email de confirmação
recebido) não foi verificado ponta a ponta nesta sessão — bati no rate
limit de email do provedor padrão do Supabase durante os testes. Toda a
mecânica foi comprovada (RPC de duplicidade, chamada ao `signUp`,
mapeamento de erros 400/409/429), só a confirmação de email em si não foi
vista rodando. Vale um teste manual depois que o rate limit resetar (~1h)
ou depois que o SMTP customizado (Resend) for configurado.

## Pendências que ainda precisam de decisão sua

Ver `08_PENDENCIAS_ABERTAS.md`.
