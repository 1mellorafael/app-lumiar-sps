# 🚀 PLANO DE IMPLEMENTAÇÃO — ORDEM DE FEATURES PRO CLAUDE CODE

Este documento existe pra dar ao Claude Code uma sequência clara: **uma
feature de cada vez, testada, commitada, só então a próxima.** Nunca
"implementa tudo e depois ajusta".

---

## REGRA DE OURO (ler antes de começar)

```
1. Uma feature completa por vez — não pula pra próxima sem terminar a atual
2. Segurança SEMPRE em primeiro lugar — nunca sacrificada por velocidade
3. Commit ao FINAL de cada feature funcionando — não a cada pequena
   alteração dentro dela (isso gera log poluído e gasta tokens à toa)
4. Cada commit tem descrição clara do que foi feito e por quê
5. Se uma feature depender de outra, respeita a ordem abaixo
```

**O que conta como "uma feature" pra fins de commit** (nem gigante, nem
minúsculo):
- ✅ "Tela de Categorias completa, com toggle Cards/Lista funcionando" → 1 commit
- ✅ "Sistema de cadastro completo (Passo 1 + Passo 2 + validações)" → 1 commit
- ❌ Longe demais: "app inteiro" → 1 commit (perde rastreabilidade)
- ❌ Perto demais: "adiciona um input", "muda uma cor", "corrige typo" → cada
  um vira commit separado (isso é o que queremos evitar)

Se uma feature for grande (ex: cadastro completo), pode quebrar em 2-3
commits lógicos internos (ex: "estrutura + validação" e "integração com
Supabase"), mas sempre por **unidade de trabalho que funciona sozinha**,
nunca por "salvei o arquivo agora".

---

## ORDEM DE IMPLEMENTAÇÃO

### Fase 0 — Fundação (segurança e infraestrutura primeiro, sem tela nenhuma)

```
1. Setup do projeto
   Next.js + TypeScript + Tailwind + shadcn/ui + ESLint + Prettier
   → commit: "chore: setup inicial do projeto"

2. Segurança base (ANTES de qualquer feature visível)
   - Supabase configurado com RLS ligado em toda tabela desde o início
   - Variáveis de ambiente (.env.local, nunca no código)
   - Security headers (next.config.js)
   - Rate limiting middleware (Vercel Edge + Upstash)
   → commit: "chore(security): configura RLS, env vars e headers de segurança"

3. Design system base
   Cores, tipografia (Inter), espaçamento, componentes base
   (Botão, Input, Card) conforme `10_WIREFRAMES_SKETCH_BAIXO.md`
   → commit: "feat(ui): design system base — cores, tipografia, componentes"
```

**Por quê segurança vem antes de tela:** não faz sentido construir uma
tela que salva dados num banco sem RLS — teria que refazer depois. Base
seguríssima primeiro, features em cima dela.

---

### Fase 1 — Navegação e telas estáticas (sem dados reais ainda)

```
4. Home (estática, com dados fake/mock)
   → commit: "feat(home): tela inicial com categorias, clima compacto,
     banners"

5. Categorias — grid + toggle Cards/Lista
   → commit: "feat(categorias): tela de categorias com toggle cards/lista"

6. Busca/Listagem de Serviços (com dados fake ainda)
   → commit: "feat(busca): listagem de serviços com filtros e paginação"

7. Detalhe do Serviço (com dados fake ainda)
   → commit: "feat(detalhe-servico): página de detalhe com foto composta
     (capa+principal), Instagram clicável, botão WhatsApp"
```

---

### Fase 2 — Autenticação (crítico, revisar com atenção redobrada)

```
8. Sistema de login/cadastro (Supabase Auth)
   - Passo 1: dados da conta (nome, sobrenome, email, telefone, senha,
     endereço com autocomplete)
   - Validações: capitalização, máscara telefone, força de senha,
     confirmar senha, duplicidade email/telefone
   → commit: "feat(auth): sistema de cadastro e login com Supabase Auth"

   ⚠️ Esta é a feature mais sensível em segurança do projeto — antes de
   dar como pronta, confirmar contra a checklist de 20 itens em
   `03_ARQUITETURA_TECNICA.md` item por item.
```

---

### Fase 3 — Cadastro de serviço (depende da Fase 2)

```
9. Cadastro de Serviço (Passo 2) + fluxo de aprovação
   - Foto Principal + Foto de Capa
   - Categoria, nome, descrição, Instagram
   - Status pendente (regra de sensibilidade: tudo privado até aprovar)
   → commit: "feat(cadastro-servico): passo 2 do cadastro com status
     pendente"

10. Tela pós-cadastro (modo dono)
    - Galeria de fotos, editar informações, editar dados de conta
    → commit: "feat(perfil-servico): tela de gestão do próprio serviço"
```

---

### Fase 4 — Perfil / Menu

```
11. Menu (deslogado) + Perfil (logado)
    - Configurações (tema claro/escuro, idioma com bandeiras)
    - Adicionar à Tela Inicial (com detecção de navegador/SO)
    - Editar meus dados
    → commit: "feat(perfil): menu/perfil com configurações e PWA install"
```

---

### Fase 5 — Admin

```
12. Admin Dashboard
    - Pendências (com sinalização de menor de idade e endereço fora
      da área, sem mostrar isso publicamente)
    - Aprovados, busca, criar perfil manualmente
    → commit: "feat(admin): dashboard de aprovação e gestão"
```

---

### Fase 6 — Conteúdo complementar

```
13. Aba Úteis
    - Clima (completo), Ônibus, Telefones úteis, toggle cards/lista
    → commit: "feat(uteis): aba com clima, ônibus e telefones úteis"

14. Enviar Sugestão
    → commit: "feat(sugestoes): formulário de sugestão com categorias"

15. Anúncios (Fase 1 do plano de ads — botão voluntário)
    → commit: "feat(ads): botão de anúncio voluntário"
```

---

### Fase 7 — Internacionalização e polish final

```
16. i18n (next-intl) — PT-BR default + EN
    → commit: "feat(i18n): suporte a português e inglês"

17. Acessibilidade — auditoria final (WCAG AA)
    → commit: "fix(a11y): ajustes de acessibilidade pós-auditoria"

18. Performance — next/image, lazy loading, Vercel Analytics
    → commit: "perf: otimizações de imagem e carregamento"
```

---

## O QUE FICA PRA DEPOIS DO V0 (não bloqueia lançamento)

Estes itens têm pendência aberta em `08_PENDENCIAS_ABERTAS.md` e não
travam o início da implementação — podem ser resolvidos em paralelo:

- Escolha da rede de anúncios (Fase 2 do plano de ads)
- Texto de Política de Privacidade e Termos de Uso (pode ter placeholder
  no início, mas **precisa estar pronto antes do lançamento público**)
- Consulta jurídica sobre dados de menores (LGPD Art. 14) — também precisa
  estar resolvido antes do lançamento, não antes de começar a codar

---

## COMO PASSAR ISSO PRO CLAUDE CODE

Recomendo passar, nesta ordem, pro Claude Code no início da sessão:
1. Este documento (`11_PLANO_IMPLEMENTACAO.md`)
2. `CLAUDE.md` (quando gerado — vai consolidar tudo)
3. Pedir explicitamente: "siga a ordem da Fase 0 até a Fase 7, uma feature
   por vez, sempre me mostrando o resultado antes de eu confirmar que
   pode commitar e seguir pra próxima"

Isso dá a você o controle de revisar cada passo antes dele virar commit
definitivo — importante principalmente nas Fases 0 e 2 (segurança e auth).
