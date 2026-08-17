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
   - Passo 1: dados da conta — nome, email, telefone, senha (cadastro
     leve por decisão de 15/08: sem CPF, sem endereço, sem data de
     nascimento). Aviso fixo: plataforma exclusiva pra Lumiar/São
     Pedro da Serra, cadastro fora da região pode ser removido sem
     aviso prévio
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

### Fase 8 — Comunidade (pós-V0, prioridade alta — ver `06_VISAO_LONGO_PRAZO.md`)

```
Não implementar ainda — registrado aqui só pra manter a ordem visível
quando o V0 estiver completo. Decisão de 16/08: essa fase vem ANTES de
Turismo/Marketplace no roadmap de longo prazo, mesmo entrando depois
do V0 neste plano de implementação (que cobre só a Fase 0 do roadmap
maior em `06_VISAO_LONGO_PRAZO.md`).

### ⚠️ ORDEM REVISADA em 17/08 — foco em retenção, substitui a ordem original abaixo

```
Motivação: diretório de serviço é uso de BAIXA frequência (alguém
procura um motoboy uma vez a cada duas semanas) — sem outro motivo de
abrir o app, "cadastrou e nunca mais voltou" é o risco real do
lançamento. A ordem original (Morador → Colunas → Push → Carona → ... →
Alerta como item 24, quase no fim) coloca o único recurso que NÃO
depende de massa crítica (Alerta) por último — invertido.

Alerta também foi redesenhado nesta sessão: o comportamento real já
observado na comunidade (grupos de voluntários — inclusive INEA — se
mobilizam por foco de incêndio reportado por morador, não por dado de
satélite) significa que fonte oficial automática (CEMADEN/INPE) chega
sempre atrasada pro caso que mais importa (fogo). Reporte comunitário
(tipo Waze: reporta, outros confirmam, admin encerra se for falso
alarme) é o mecanismo PRINCIPAL, não um extra — fonte oficial vira
camada de confirmação por cima, incremento posterior, não bloqueia o
lançamento do Alerta. Isso também simplifica o caminho crítico: a
integração com CEMADEN/INPE é a parte incerta (sem API pública bem
documentada, confirmado em pesquisa de 17/08) — tirar ela da frente faz
o Alerta sair MAIS rápido, não mais devagar.

Sem push, um alerta comunitário de incêndio é só uma versão mais lenta
do grupo de WhatsApp — perde a razão de existir. Por isso push deixa de
ser "depois" e nasce junto com o Alerta, não numa fase separada.

NOVA ORDEM:

A. Admin mínimo (Fase 5 já existente no plano principal, não a Fase 8)
   — só listar pendentes + aprovar/rejeitar. Bloqueia o lançamento de
   qualquer jeito, sai antes de tudo abaixo.

B. Morador account (era item 19) — pré-requisito do Alerta: hoje só
   quem cadastra serviço tem login; um morador que só quer reportar um
   foco de incêndio precisa de conta própria, mais leve que virar
   prestador.
   → commit: "feat(morador): conta de morador separada de prestador"

C. Alerta comunitário + Push (fundidos numa fase só — era item 24 e 21
   respectivamente, agora juntos e logo no início):
   - Reporte de morador (incêndio, chuva/deslizamento): publica na hora,
     sem fila de moderação prévia (mesma lógica de confiança comunitária
     já usada no resto do app) — contador de confirmação de outros
     moradores (tipo "ainda ativo?" do Waze), admin encerra se for falso
   - Push dispara pra quem segue Alerta assim que alguém reporta
   - Fonte oficial (CEMADEN chuva, INPE queimadas) fica como incremento
     POSTERIOR, não bloqueia esta fase — quando entrar, só confirma/
     reforça o que a comunidade já reporta
   → commit: "feat(alerta): reporte comunitário com push, override do admin"

D. Colunas/Dicas (era item 20) — primeiro gancho de conteúdo, já nasce
   com push existente pra avisar de post novo (não depende de alguém
   abrir o app por acaso)
   → commit: "feat(colunas): dicas e conselhos de prestadores"

E. Carona (era item 22) — só faz sentido depois que B-D já geraram
   engajamento; mural vazio antes disso é pior que não ter mural
   → commit: "feat(carona): caronas compartilhadas entre moradores"

Itens 23 (Corrida/Leaderboard), 25-30 (estrutura genérica de post,
Pede Aí genérico, Pet Perdido, Jornal expande, Selo, Home modular)
continuam na ordem original, depois do item E — não foram reavaliados
nesta sessão.
```

---

### Ordem original (definida em 16/08) — mantida como referência histórica

```
19. Morador account (account table + login + opcional "moro aqui" checkbox)
    → commit: "feat(morador): conta de morador separada de prestador"

20. Colunas/Dicas — prestadores podem postar dicas e conselhos
    (reusa prestador account, não precisa de morador account)
    → commit: "feat(colunas): dicas e conselhos de prestadores"

21. Push notifications infrastructure — triggers pra Carona, Coluna,
    Alerta (PWA infrastructure já existe, só faltam os triggers)
    → commit: "feat(push): notificações push para novas atividades"

22. Carona — primeiro e único tipo de "Pede Aí" no lançamento desta
    fase (destino, data/hora, need/offer, contato WhatsApp)
    → commit: "feat(carona): caronas compartilhadas entre moradores"

23. Corrida/Leaderboard — km acumulados, ranking diário/semanal
    (gamification driver para retenção-hábito)
    → commit: "feat(corrida): leaderboard de km acumulados"

24. Alerta — Defesa Civil/CEMADEN (chuva/deslizamento) + INPE Queimadas
    (incêndio) + override manual do admin + denúncia de morador (com moderação)
    → commit: "feat(alerta): widget de alerta com fonte automática, override e denúncia"

25. Estrutura genérica de "post comunitário" (tipo: pede_ai |
    pet_perdido | alerta) — base pra expandir Pede Aí além de Carona
    → commit: "feat(comunidade): estrutura base de post comunitário genérico"

26. Pede Aí genérico — expande além de Carona quando comunidade tem
    momentum (produtos usados, objetos perdidos, favores, etc.)
    → commit: "feat(pede-ai-generico): mural de pedidos genéricos da comunidade"

27. Pet Perdido — card no feed + gerador de cartaz exportável
    (reutiliza estrutura de post comunitário do item 25)
    → commit: "feat(pet-perdido): cartão de pet perdido com gerador de cartaz"

28. Jornal/Colunas expande — conteúdo 100% local, papel de colunista com
    permissão própria (curadoria delegável, não só admin). Diferente de
    "Dicas de Prestador" (item 20) — aqui é content curator escrevendo artigos.
    → commit: "feat(jornal): módulo de colunas com papel de colunista"

29. Selo "Verificado pela comunidade" — contador de confirmação no
    perfil do prestador, badge automático (não é rating)
    → commit: "feat(selo): selo de verificação comunitária"

30. Home modular — usuário logado escolhe widgets (ônibus, clima,
    contato útil, jornal, etc.) — widgets editáveis ao clicar/pressionar
    → commit: "feat(home): home modular configurável pelo usuário"

Detalhe completo de cada item, racional e pesquisa que embasou as
decisões em `06_VISAO_LONGO_PRAZO.md` e `05_IDEIAS_E_DECISOES_UX.md`.

ESTRATÉGIA DE LANÇAMENTO (Comunidade Phase — decisão de 16/08):
```
├─ Fase 1 (Fechadíssima ~10-20 pessoas):
│  └─ Contas criadas na mão pelo admin (sem sistema de código ainda)
│  └─ Testam cadastro/login/perfil de ponta a ponta
│  └─ Prestadores cadastram serviço real (povoa Busca)
│
├─ Fase 2 (Um pouco mais aberto):
│  └─ Inclui primeiros prestadores que vão postar Coluna
│  └─ Testa Carona com gente que já sabe que vai pro Rio/Friburgo
│  └─ Testam Push notifications end-to-end
│
└─ Fase 3 (Anúncio público nos grupos):
   └─ Anuncia nos grupos WhatsApp/Facebook APENAS quando:
   │  └─ Busca já tem gente de verdade (provou que não tá "morto")
   │  └─ Já tem pelo menos 1 Coluna postada
   │  └─ Alerta já está configurado e rodando
   │  └─ Convites por código de invite, liberados em waves
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
