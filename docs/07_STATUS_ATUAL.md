# 📊 STATUS ATUAL — APP DE LUMIAR

**Última atualização:** 16/08/2026 (revisão de handoff)
**Fase:** Implementação — Fase 1 completa, Fase 2 (Auth) é o próximo passo

---

## O que já está construído (código)

| Rota/Tela | Arquivo | Estado |
|---|---|---|
| Home | `src/app/page.tsx` | ✅ Grade de módulos, clima compacto |
| Busca/Categorias | `src/app/busca/page.tsx` + `[slug]` | ✅ Grid + toggle Cards/Lista, busca normalizada (sem acento/maiúscula), dispensa teclado ao rolar/Enter/botão limpar |
| Detalhe do Serviço | `src/app/servico/[id]/page.tsx` | ✅ Layout completo. Foto ainda é avatar com iniciais (sem upload real — depende da Fase 2/3) |
| Cadastro (UI) | `src/app/cadastro/page.tsx` | ⚠️ Passo 1 + Passo 2 completos **visualmente**, mas **não grava no Supabase ainda** — é só front-end, próximo passo é ligar no Auth |
| Menu | `src/app/menu/page.tsx` | ✅ |
| Úteis | `src/app/uteis/page.tsx` | ✅ Clima (semana completa), ônibus, telefones — dados ilustrativos, não vêm de fonte real ainda |
| Termos / Privacidade | `src/app/termos/page.tsx`, `privacidade/page.tsx` | ✅ Texto placeholder publicado (a própria página já avisa "versão preliminar, revisão jurídica antes do lançamento") |
| PWA | manifest + ícones | ✅ Instalação funcional (Android 1-clique, iOS passo a passo) |
| Motion/toque | `globals.css` + 9 componentes | ✅ Tokens Material Design 3 (`ease-standard`, `ease-decelerate`), feedback de toque consistente em todos os cards/botões/nav |

## O que NÃO está construído ainda

- **Supabase Auth** — cadastro/login não gravam em banco real, é só UI (Fase 2 do `11_PLANO_IMPLEMENTACAO.md`)
- **Upload de foto** — avatar com iniciais é placeholder em todo lugar
- **Admin Dashboard** — aprovação de serviço pendente não existe ainda (Fase 5)
- **i18n** — só português, toggle de idioma ainda não funcional
- **Comunidade** (Colunas, Carona, Corrida, Alerta, Pede Aí, Selo) — Fase 8, não iniciada

## Correção feita nesta revisão (16/08)

`database/schema.sql` tinha `sobrenome`, `foto_perfil_url`, `data_nascimento` como colunas `not null` — mas o cadastro real (`cadastro/page.tsx`) nunca coletou esses campos, só nome/email/telefone/senha (CLAUDE.md seção 7, decisão de 15/08 de cadastro leve). Isso teria quebrado o signup assim que a Fase 2 (Auth) começasse. **Removidas as 3 colunas + o campo de endereço/geocoding** (também não existe no formulário atual — geo-restrição virou só aviso de texto fixo, não geocoding automático). Schema agora bate exatamente com o form.

## ⚠️ Documentos desatualizados (não confiar sem checar CLAUDE.md antes)

`02_ESCOPO_MVP_ATUAL.md` se autodeclara "o documento que manda", mas o **CLAUDE.md tem precedência agora** (ele mesmo diz isso na abertura). As seções 3, 4 e 5 de `02` (campos de cadastro, menores de idade via data de nascimento, geo-restrição via geocoding) descrevem um fluxo mais pesado que **não é o que foi implementado** — o cadastro real é o leve da seção 7 do CLAUDE.md. Marcado com aviso dentro do próprio `02` nesta revisão; não reescrevi o documento inteiro porque parte do conteúdo (moderação de linguagem, regra de sensibilidade pendente/aprovado, lógica de admin) ainda é válida e não foi implementada — só os campos de cadastro específicos ficaram obsoletos.

## Próximas etapas (em ordem)

1. **Fase 2 — Supabase Auth** (`11_PLANO_IMPLEMENTACAO.md`): ligar o cadastro/login real, aplicar o schema corrigido, revisar contra a checklist de 20 itens de segurança do CLAUDE.md item por item antes de considerar pronto
2. **Fase 3 — Cadastro de serviço real**: upload de foto principal/capa, status pendente funcionando de verdade
3. **Fase 5 — Admin Dashboard**: aprovação manual
4. Validação com prestadores reais continua pendente (falar com 5-10 prestadores) — não é bloqueio técnico, é validação de produto

## Pendências que ainda precisam de decisão sua

Ver `08_PENDENCIAS_ABERTAS.md`.
