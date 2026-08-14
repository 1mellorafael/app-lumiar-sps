# 🏗️ ARQUITETURA TÉCNICA — APP DE LUMIAR

## Stack

| Camada | Escolha |
|---|---|
| Frontend | Next.js + React + TypeScript + Tailwind |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL + Auth + Realtime + Row-Level Security) |
| Hosting | Vercel |
| Componentes UI | Shadcn/ui (Tailwind, acessível, rápido de montar) |
| Email transacional | Resend (100/dia grátis) |
| Erros/observabilidade | Sentry (free tier) |
| Rate limiting | Vercel Edge Middleware + Upstash Redis (free tier) |
| i18n | next-intl — PT-BR (padrão) + Inglês |

**Custo mensal no MVP: R$ 0.** Tudo dentro de free tiers generosos. Isso só
muda se o app crescer bastante (ver seção de custo no final).

Importante: essa mesma stack já roda como **site normal** no navegador
(desktop e mobile), não é "só app". PWA (adicionar à tela do celular) cobre
90% da experiência de app nativo sem custo de manter loja Android/iOS — ver
`06_VISAO_LONGO_PRAZO.md`.

---

## Convenção de idioma

- **Código** (variáveis, funções, nomes de arquivo, commits): sempre em
  **inglês**.
- **Comentários no código**: sempre em **português**.
- **Navegação/UI do app**: **português** como padrão, com **opção de
  inglês** (usa `next-intl` — rotas tipo `/pt-br` e `/en`).

## Estrutura de pastas (referência)

```
app-lumiar/
├── app/ (Next.js App Router)
│   ├── (auth)/login, cadastro
│   ├── (main)/buscar, perfil, feed, onibus
├── components/ (Cards, Forms, Layout)
├── hooks/ (useAuth, usePrestadores)
├── lib/ (supabase client, api-calls, utils)
├── api/ (auth, prestadores, feed, onibus)
├── database/ (schema.sql, migrations/)
```

---

## Database — schema base (evolui por migrations, nunca "refaz do zero")

```sql
-- profiles: dados extras de quem se cadastrou (auth/email/senha ficam no
-- auth.users nativo do Supabase Auth — nunca reimplementamos hash de senha)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  sobrenome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  foto_perfil_url VARCHAR(500) NOT NULL,
  data_nascimento DATE NOT NULL,  -- nunca exposta publicamente
  endereco_completo VARCHAR(500),  -- formato normalizado (Google Places)
  endereco_dentro_area BOOLEAN DEFAULT NULL,  -- resultado do geocoding,
                                                -- não bloqueia, só sinaliza
  created_at TIMESTAMP DEFAULT NOW()
);

-- prestadores: dados de cada serviço (1 profile pode ter vários)
CREATE TABLE prestadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  nome_servico VARCHAR(255),
  categoria VARCHAR(100) NOT NULL,
  descricao TEXT,
  foto_principal_url VARCHAR(500) NOT NULL,  -- obrigatória, fica no centro
  foto_capa_url VARCHAR(500),                -- opcional, fica de fundo
  instagram VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pendente', -- pendente | ativo | rejeitado
  created_at TIMESTAMP DEFAULT NOW()
);
-- Sem rating_medio/total_avaliacoes — avaliação está fora do V0.
-- Se entrar numa fase futura, adiciona via migration, sem tocar no resto.

-- galeria_fotos: até 5 por prestador, adicionadas depois do cadastro
CREATE TABLE galeria_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES prestadores(id) ON DELETE CASCADE,
  foto_url VARCHAR(500) NOT NULL,
  ordem INT DEFAULT 0
);

-- categorias
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(255)
);
-- Seed inicial: Motoboy, Faxina, Mototáxi, Uber, Estética, Adestramento,
-- Hospedagem Pet, Lojas, Babá, Educação, Psicólogo, Artes

-- sugestoes: formulário de sugestão (geral, lugar, ou problema)
CREATE TABLE sugestoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria VARCHAR(50) NOT NULL, -- geral | lugar | problema
  mensagem TEXT NOT NULL,
  email VARCHAR(255),  -- só se deslogado e quiser resposta
  profile_id UUID REFERENCES profiles(id),  -- se logado
  created_at TIMESTAMP DEFAULT NOW()
);

-- horarios_onibus, telefones_uteis: ver schema completo quando for
-- implementar a aba Úteis
```

`negocios` e tabelas relacionadas (CNPJ, galeria de negócio) **não
existem ainda** — quando a Fase 1 do roadmap chegar, só se adiciona
tabela nova, sem mexer no que já existe. Mesma lógica pra `avaliacoes`,
se e quando entrar.

---

## API — endpoints principais (MVP)

```
POST   /api/auth/cadastro          (cria auth.users via Supabase Auth
                                     + registro em profiles)
POST   /api/auth/login
GET    /api/auth/me

GET    /api/prestadores            (lista, filtros: categoria; só status
                                     ativo aparece publicamente)
GET    /api/prestadores/[id]
POST   /api/prestadores            (cria, status pendente)
PATCH  /api/prestadores/[id]
POST   /api/prestadores/[id]/galeria   (adicionar foto, até 5)

GET    /api/onibus
GET    /api/telefones-uteis
GET    /api/clima                  (proxy pra API externa de clima)

POST   /api/sugestoes

-- admin
GET    /api/admin/pendentes        (retorna TODOS os campos, mesmo os
                                     que seriam públicos depois de aprovado
                                     — regra de sensibilidade, ver 02)
PATCH  /api/admin/prestadores/[id]/aprovar
PATCH  /api/admin/prestadores/[id]/rejeitar
POST   /api/admin/prestadores      (admin cria perfil em nome de outra
                                     pessoa)
PATCH  /api/admin/prestadores/[id]/transferir-posse
```

---

## Segurança

**Checklist obrigatória do projeto** — aplicada em todo código a partir de
agora (traduzida pra ações concretas na nossa stack Next.js + Supabase +
Vercel):

| # | Item | Como aplicamos |
|---|---|---|
| 1 | Hide API keys | Chaves só em `.env.local` / Vercel env vars, nunca hardcoded no código |
| 2 | Purge git secrets | `.env*` no `.gitignore` desde o 1º commit; rodar `gitleaks`/`git-secrets` no CI antes de cada merge |
| 3 | Use public DB key | Frontend usa só a `anon key` do Supabase; a `service_role key` nunca sai do backend/servidor |
| 4 | Enable Row-Level Security | RLS **ligado em toda tabela** do Supabase desde a criação, sem exceção |
| 5 | Encrypt sensitive data | Campos sensíveis (data de nascimento, telefone) nunca em texto plano em logs; criptografados em repouso |
| 6 | Enforce server-side auth | Toda ação que muda dado é validada no servidor — nunca confia em checagem feita só no frontend |
| 7 | Lock record access | Políticas de RLS restringem cada registro ao `user_id` dono (usuário só edita o que é seu) |
| 8 | Block field tampering | Endpoints usam **whitelist** de campos aceitos — usuário não pode mandar `status`, `role`, `user_id` etc. por fora do que é permitido |
| 9 | Secure session cookies | Cookies de sessão `httpOnly`, `secure`, `SameSite` (Supabase Auth já cobre isso) |
| 10 | Hash passwords | bcrypt/Argon2 (padrão do Supabase Auth), nunca senha em texto plano |
| 11 | Rate limit login | Vercel Edge Middleware + Upstash Redis limitando tentativas de login por IP |
| 12 | Add bot protection | Captcha (hCaptcha/Cloudflare Turnstile) no cadastro e login |
| 13 | Parameterize queries | Sempre via client do Supabase (já parametriza) — nunca concatenar SQL cru |
| 14 | Validate all input | Todo input validado no backend com Zod, mesmo o que já foi validado no frontend |
| 15 | Escape user content | Next.js escapa JSX por padrão; nunca usar `dangerouslySetInnerHTML` com conteúdo de usuário sem sanitizar |
| 16 | Restrict file uploads | Limita tipo de arquivo (só imagem), tamanho máximo, e bucket com policy própria no Supabase Storage |
| 17 | Trim API responses | Endpoints retornam só os campos necessários — nunca devolver hash de senha, data de nascimento etc. em resposta pública |
| 18 | Add security headers | CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security` configurados no `next.config.js`/`vercel.json` |
| 19 | Force HTTPS | Automático no Vercel; redirect forçado de HTTP → HTTPS |
| 20 | Scan dependencies | `npm audit` + Dependabot/GitHub security alerts rodando no CI |

Essa tabela é a referência oficial de segurança do projeto — qualquer
feature nova passa por ela antes de ir pra produção.

## Performance — metas realistas

| Métrica | Meta |
|---|---|
| Page load (first paint) | < 3s (< 1.5s ideal) |
| API response (busca) | < 300ms |
| Lighthouse mobile | 85+ |

Técnicas: code splitting automático (Next.js), `next/image`, índices no
banco, CDN da Vercel, cache leve (React Query).

## Acessibilidade (a11y)

WCAG 2.1 AA desde o início. Shadcn/ui já cobre boa parte (contraste,
navegação por teclado, componentes com foco/label). Falta: alt text em
imagens e testar com Lighthouse.

## Legal / Compliance

- Política de Privacidade + Termos de Uso (essencial, pode usar Iubenda
  gratuito como base pro MVP)
- LGPD: direito de exportar/apagar dados
- Isenção de responsabilidade: o app **conecta** pessoas, não é parte da
  negociação/pagamento entre prestador e cliente (protege legalmente)

## Testes

Jest + React Testing Library pra unit tests no MVP (~60% coverage já é
suficiente). E2E (Playwright) e integration tests ficam pra depois que
houver mais tráfego real.

## SEO

Meta tags dinâmicas por página, sitemap.xml, robots.txt, structured data
(schema.org LocalBusiness) no perfil do prestador. Importante porque o app
é navegável sem login — isso só funciona de verdade se o Google conseguir
indexar os perfis.

## Custo por estágio de crescimento

| Estágio | Custo estimado/mês |
|---|---|
| MVP (< 10k requisições) | R$ 0 |
| Crescimento (100k requisições) | R$ 0-50 |
| Popular (1M+ requisições) | ~R$ 400 (Vercel Pro + Supabase Pro) |

Só vale gastar quando o app já tiver receita (ads/destaque pago).
