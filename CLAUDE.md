# CLAUDE.md — App de Lumiar / São Pedro da Serra

Este arquivo é a referência oficial do projeto. Leia por completo antes de
escrever qualquer código. Em caso de conflito entre este arquivo e
qualquer outro documento do repositório, **este arquivo vale**.

Documentos de apoio (na pasta `docs/` do repo): visão geral, escopo
detalhado, arquitetura técnica, práticas de GitHub, wireframes completos,
plano de implementação, roadmap de longo prazo. Consulte-os quando
precisar de mais detalhe do que está aqui.

---

## 1. O que é o projeto

App web (PWA) que conecta negócios locais a clientes em Lumiar e
São Pedro da Serra (distritos de Nova Friburgo, RJ), substituindo grupos
de WhatsApp caóticos. Gratuito pro negócio, sem comissão. Navegável sem
login; login só é exigido pra cadastrar um negócio.

**Nomenclatura (decisão de 17/08):** o app chama de "negócio", não
"prestador" — mesma terminologia do Nextdoor ("Business"), sem distinguir
por porte. Tabela no banco: `negocios`. Rotas: `/cadastro-negocio`,
`/negocio/[id]`. Documentos mais antigos neste repo podem citar
"prestador"/"serviço" — trate como sinônimo histórico do mesmo conceito.

---

## 2. Regra de ouro: uma feature de cada vez

**Não implemente tudo de uma vez.** Siga a ordem de `docs/11_PLANO_IMPLEMENTACAO.md`
— Fase 0 até Fase 7, uma feature por vez. Ao terminar cada feature:

1. Mostre o resultado pro usuário
2. Espere confirmação antes de commitar
3. Só então siga pra próxima feature

**Granularidade de commit:** 1 commit = 1 feature completa e testada,
nunca 1 commit por pequena alteração isolada (input novo, cor mudada,
typo corrigido) — isso polui o log e gasta tokens à toa. Mas também nunca
"o app inteiro num commit só" — perde rastreabilidade. Ver
`docs/04_GITHUB_PRATICAS.md` pra convenção de mensagem de commit
(Conventional Commits).

---

## 3. Segurança sempre em primeiro lugar

Segurança nunca é sacrificada por velocidade. Checklist obrigatória,
aplicada a **todo** código, sem exceção:

| #   | Item                     | Como aplicar                                                                                     |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| 1   | Hide API keys            | Só em `.env.local` / Vercel env vars, nunca hardcoded                                            |
| 2   | Purge git secrets        | `.env*` no `.gitignore` desde o 1º commit; `gitleaks` no CI                                      |
| 3   | Use public DB key        | Frontend usa só a `anon key` do Supabase; `service_role key` nunca sai do backend                |
| 4   | Enable RLS               | Row-Level Security ligado em **toda** tabela desde a criação                                     |
| 5   | Encrypt sensitive data   | Dados sensíveis nunca em texto plano em logs                                                     |
| 6   | Enforce server-side auth | Toda mutação validada no servidor, nunca só no frontend                                          |
| 7   | Lock record access       | RLS restringe cada registro ao dono (`profile_id`/`user_id`)                                     |
| 8   | Block field tampering    | Whitelist de campos aceitos por endpoint — nunca aceitar `status`, `role` etc. vindos do cliente |
| 9   | Secure session cookies   | `httpOnly`, `secure`, `SameSite` (Supabase Auth já cobre)                                        |
| 10  | Hash passwords           | bcrypt/Argon2 via Supabase Auth nativo — nunca reimplementar                                     |
| 11  | Rate limit login         | Vercel Edge Middleware + Upstash Redis                                                           |
| 12  | Add bot protection       | Captcha (hCaptcha/Turnstile) em cadastro e login                                                 |
| 13  | Parameterize queries     | Sempre via client Supabase, nunca SQL concatenado                                                |
| 14  | Validate all input       | Zod no backend, mesmo se já validado no frontend                                                 |
| 15  | Escape user content      | Nunca `dangerouslySetInnerHTML` sem sanitizar                                                    |
| 16  | Restrict file uploads    | Só imagem, tamanho máximo, bucket com policy própria                                             |
| 17  | Trim API responses       | Nunca devolver senha, email etc. em resposta pública                                             |
| 18  | Add security headers     | CSP, `X-Frame-Options`, `Strict-Transport-Security` no `next.config.js`                          |
| 19  | Force HTTPS              | Automático no Vercel                                                                             |
| 20  | Scan dependencies        | `npm audit` + Dependabot no CI                                                                   |

Antes de considerar a Fase 2 (auth) e qualquer feature que mexe com dados
de usuário como "pronta", revise contra esta tabela item por item.

### Regra de sensibilidade de dados (crítica)

```
STATUS PENDENTE (pessoa ou serviço):
   → TODAS as informações são privadas, sem exceção — inclusive campos
     que seriam públicos depois de aprovado (foto, nome, categoria)
   → Nada aparece em busca, nenhuma URL pública acessível
   → Só o admin vê, no dashboard

STATUS APROVADO:
   → Só os campos marcados como públicos ficam visíveis:
     foto principal, foto de capa, nome, categoria, descrição,
     Instagram, telefone (via botão de WhatsApp)
   → Sempre privados, mesmo aprovado: email, senha
```

---

## 4. Convenção de idioma

- **Código** (variáveis, funções, arquivos, commits): sempre em **inglês**
- **Comentários no código**: sempre em **português**
- **UI/navegação do app**: **português** como padrão, com opção de
  **inglês** (`next-intl`)

---

## 5. Stack técnica

| Camada             | Escolha                                              |
| ------------------ | ---------------------------------------------------- |
| Frontend           | Next.js (App Router) + React + TypeScript + Tailwind |
| Componentes UI     | shadcn/ui                                            |
| Backend            | Next.js API Routes                                   |
| Database           | Supabase (PostgreSQL + Auth + RLS)                   |
| Hosting            | Vercel                                               |
| Email transacional | Resend                                               |
| Erros              | Sentry                                               |
| Rate limiting      | Vercel Edge Middleware + Upstash Redis               |
| i18n               | next-intl                                            |
| Validação          | Zod (sempre no backend)                              |

Custo mensal do MVP: R$ 0 (free tiers).

---

## 6. Escopo do V0 — o que construir

### Dentro do V0

- Navegação livre, sem login
- Cadastro de Negócio (login só exigido aqui)
- Categorias: Motoboy, Faxina, Mototáxi, Uber, Estética, Adestramento,
  Hospedagem Pet, Lojas, Babá, Educação, Psicólogo, Artes
- Botão de WhatsApp em cada perfil
- Aprovação manual pelo admin (todo serviço nasce PENDENTE)
- Aba Úteis: horários de ônibus, clima, telefones úteis
- Toggle Cards/Lista em Categorias e Úteis
- PWA: adicionar à tela inicial (com detecção de navegador/SO)
- Enviar Sugestão (geral, lugar, ou problema)
- Anúncio voluntário (botão "Ver Anúncio", Fase 1 do plano de ads)

### Fora do V0 (adiado, não cancelado — ver `docs/06_VISAO_LONGO_PRAZO.md`)

- Verificação por CNPJ, badge automático (negócio verificado)
- Avaliações/rating
- Feed de notícias/eventos (substituído pelo widget de Clima)
- Status "disponível agora" / online-offline
- Chat interno, pagamento, app nativo

---

## 7. Fluxo de cadastro

**Decisão de 17/08 (revisa a versão original deste documento):** conta
pessoal (`/cadastro`) e cadastro de serviço (`/cadastro-servico`) são
duas telas **separadas**, não um wizard de "Passo 1 de 2" / "Passo 2 de
2". Motivo: conta serve pra qualquer morador (Alerta, sugestão, futuro
Comunidade), não só pra quem presta serviço — forçar quem só quer criar
conta a passar pela tela de serviço é fricção sem propósito. Depois de
criar a conta, a pessoa escolhe explicitamente "Cadastrar meu serviço"
ou "Ir pro Menu", em vez de cair automaticamente no formulário de
serviço.

### `/cadastro` — Criar Conta

```
Nome                    ← auto-capitaliza
Email                   ← valida formato
Telefone                ← máscara (xx) xxxxx-xxxx
Senha + Confirmar Senha ← medidor de força, precisam bater

⚠️ Aviso permanente antes do botão:
   "Plataforma apenas para Lumiar e São Pedro da Serra.
    Cadastros fora da região podem ser removidos sem aviso prévio."

→ Email/telefone já existentes: erro inline, sugere login
→ Sucesso: tela de confirmação com dois botões — "Cadastrar meu
  serviço" (vai pra /cadastro-servico) ou "Ir pro Menu"
```

### `/cadastro-negocio` — Cadastrar Negócio (exige login; quem não tem
conta é mandado pro login, que linka pra `/cadastro`)

```
Foto Principal (obrigatória — centro do card)
Foto de Capa (opcional — fundo atrás da principal)
Categoria (dropdown)
Nome do Negócio (opcional)   ← auto-capitaliza
Telefone de contato do negócio ← campo próprio, pode ser diferente do
  telefone da conta (pré-preenchido com ele, mas editável — ver seção
  "Cadastro por terceiro" em docs/06)
Horário de funcionamento (opcional) ← texto livre
Descrição (opcional)         ← auto-capitaliza
Instagram (opcional)
☑️ Termos de Uso pra Negócios

→ Status PENDENTE
→ Cai na tela do próprio negócio (não no formulário) — galeria de fotos
  (até 5) é adicionada lá, não durante o cadastro
```

---

## 8. Estrutura de dados (schema base)

Ver `docs/03_ARQUITETURA_TECNICA.md` pro schema SQL completo. Resumo:

- `profiles` — dados extras do usuário (auth/senha ficam no `auth.users`
  nativo do Supabase, nunca reimplementar hash de senha)
- `negocios` — cada negócio (1 profile pode ter vários), com
  `foto_principal_url` (obrigatória) + `foto_capa_url` (opcional)
- `galeria_fotos` — até 5 por negócio, adicionadas pós-cadastro
- `categorias` — seed com a lista da seção 6
- `sugestoes` — formulário de sugestão

Sem tabela de avaliação/rating (fora do V0). Sem verificação por CNPJ/
documento (fora do V0 — ver seção 14, badge de negócio verificado é fase
futura opcional, não bloqueia o cadastro básico). Extensões futuras
entram via migration nova, nunca reescrevendo o que já existe.

---

## 9. Design system

```
PRIMARY:    Verde-azulado profundo   #0F6E5C
SECONDARY:  Terracota suave          #C97B4A
NEUTRAL:    Cinza-pedra #4A4A48 (texto) / Bege-claro #F5F3EF (fundo)
SUCCESS:    Verde WhatsApp #25D366 (reservado só pro botão de WhatsApp)
ERROR:      Vermelho-terracota #B4442E
TIPOGRAFIA: Inter (headings + body)
ESPAÇAMENTO: múltiplos de 8px
```

### Princípios de UI obrigatórios

- **Cards compactos**, não gigantes (grid de 3 colunas em mobile)
- **Toggle Cards/Lista** disponível em Categorias e Úteis; ambos os
  formatos sempre clicáveis
- **Foto em duas camadas:** capa (opcional, fundo) + principal
  (obrigatória, círculo central) — sem capa, mostra cor neutra de fundo
- **Nome/título nunca sobreposto na foto** — sempre como texto separado,
  abaixo dela
- Botões de trocar foto ficam **perto** da foto, nunca sobrepostos nela
- **Todo card usa o mesmo sistema de sombra e feedback de toque**, sem
  exceção — inclusive telas internas/admin, não só as públicas:
  `shadow-[var(--shadow-card)]` em repouso, `hover:shadow-[var(--shadow-card-hover)]`,
  `transition-all duration-200 ease-decelerate`, e `active:scale-[0.97–0.99]`
  quando o card inteiro (não só uma parte) é a área clicável. Regra
  descoberta em 17/08 quando o card de aprovação do admin saiu
  inconsistente do resto do app — antes de criar um card novo, conferir
  contra um card existente (`service-card.tsx`, `category-list.tsx`),
  nunca inventar um estilo de sombra/toque do zero
- Mobile-first, breakpoints por largura de tela (não por modelo de
  celular)
- WCAG 2.1 AA desde o início (shadcn/ui já cobre boa parte)

Wireframes completos de cada tela (ASCII, com todas as correções
aplicadas): `docs/10_WIREFRAMES_SKETCH_BAIXO.md`.

---

## 10. Navegação (bottom nav)

```
Deslogado / sem serviço:  🏠 Home   🔲 Categorias   🔧 Úteis   ☰ Menu
Logado com serviço:       🏠 Home   🔲 Categorias   🔧 Úteis   ☰ Perfil
```

Menu/Perfil contém: Login (se deslogado) ou dados da conta + "Meus
Serviços" (se logado), Configurações (tema claro/escuro, idioma com
bandeiras 🇧🇷/🇺🇸), Adicionar à Tela Inicial, Enviar Sugestão, Sobre o App
(Termos de Uso + Política de Privacidade).

Dados privados (email) nunca aparecem nem pro próprio dono na tela de
Perfil — ele já sabe qual é o email dele.

---

## 11. PWA — adicionar à tela inicial

```
1. Já rodando em modo instalado? → não mostra nada
2. Navegador suporta instalação nativa (Chrome/Edge/etc)? → botão de
   1 clique (API beforeinstallprompt)
3. iPhone + navegador que não é Safari? → "abra este link no Safari
   pra instalar"
4. iPhone + Safari? → passo a passo (Compartilhar → Adicionar à Tela
   de Início)
```

Botão fica disponível em três lugares: Home, onboarding (primeira
visita), e Menu/Perfil.

---

## 12. O que NÃO fazer

- Não implementar rating/avaliação (fora do V0)
- Não implementar feed de notícias completo (só o widget de Clima)
- Não implementar status online/offline
- Não implementar verificação por CNPJ/badge automático
- Não expor nenhum campo de um cadastro/negócio PENDENTE publicamente,
  mesmo os que seriam públicos depois de aprovado
- Não reimplementar hash de senha manualmente — usar Supabase Auth nativo
- Não usar `service_role key` no frontend
- Não pular a checklist de segurança pra "ir mais rápido"

---

## 13. Pendências conhecidas (não bloqueiam o desenvolvimento)

- Rede de anúncios (AdSense provável, avaliar perto do lançamento)
- Texto de Política de Privacidade e Termos de Uso (placeholder ok por
  enquanto, mas precisa existir antes do lançamento público)

Ver `docs/08_PENDENCIAS_ABERTAS.md` pra lista completa e atualizada.

---

## 14. Ideias de fases futuras (não implementar agora)

Registradas em `docs/05_IDEIAS_E_DECISOES_UX.md` e
`docs/06_VISAO_LONGO_PRAZO.md`. Ordem de prioridade pós-V0 (decidida em
16/08): **Comunidade vem antes de Turismo** — foco em construir
reputação/confiança na comunidade primeiro, mesmo que isso signifique
adiar monetização via ads.

- **Fase Comunidade** (prioridade alta): Alerta (Defesa Civil/CEMADEN +
  risco de incêndio/INPE Queimadas, sempre com override manual do
  admin), Pede Aí (mural de pedido reverso, formato lista), Pet Perdido
  (card no feed + gerador de cartaz exportável pra WhatsApp/impressão),
  Jornal/Colunas (conteúdo 100% local, nunca agrega notícia genérica do
  mundo solta), selo "Verificado pela comunidade" (contador de
  confirmação — não é rating/nota). Curadoria distribuída: partes
  específicas (jornal, horário de ônibus, alertas) podem ficar com
  pessoas de confiança além do admin.
- **Fase Negócio/Marketplace leve**: catálogo de produtos, sem
  pagamento processado na plataforma
- **Fase Turismo**: cachoeiras, trilhas, restaurantes/pousadas maiores
  — pausada de propósito até a Comunidade validar; monetização aqui é
  negócio pagando por destaque, nunca cobrando do morador
- **Fase App Nativo**: só quando uso recorrente justificar
- Aba de Jogos com desafios diários, leaderboard de corrida (KMs
  acumulados) — sistemas próprios, podem se cruzar com o selo no
  futuro (ex: missão de confirmar vizinhos) sem nascerem acoplados

Nenhuma dessas entra no V0 atual — só mencionar se o usuário perguntar
sobre o roadmap.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
