# 🎯 SKILLS & REFERÊNCIAS — APP DE LUMIAR

Mapeamento de skills disponíveis (sistema), skills/padrões úteis da internet, e
recomendações concretas pra este projeto.

---

## 1. SKILLS DO SISTEMA (disponíveis já)

### ✅ Frontend
- **web-artifacts-builder** — React + Tailwind + shadcn/ui (para prototipagem
  rápida durante dev). Não é essencial pro MVP mas útil pra testar ideias.
  
### ✅ Backend / DevOps
- **mcp-builder** — Para integração com APIs/serviços via MCP (nice-to-have,
  não MVP).

### ✅ Design & UX — **IMPORTANTES**
- **canvas-design** — Visual art em PNG/PDF (se quiser mockups bonitos).
- **brand-guidelines** — Aplicar estilo de marca (vocês provavelmente vão criar
  próprio; isso é pra aplicar padrão depois).
- **`design:ux-copy`** ⭐ — Microcopy, CTAs, mensagens de erro, onboarding.
  **Usar em:** Wireframes → Sprint final de UX
- **`design:design-system`** ⭐ — Estruturar design system (tokens, cores,
  spacing, tipografia). **Usar em:** Wireframes (definir paleta final)
- **`design:accessibility-review`** ⭐ — WCAG audit formal de designs.
  **Usar em:** Após wireframes, antes de code
- **`design:design-handoff`** ⭐ — Specs pra dev (layout, tokens, states).
  **Usar em:** Antes de Claude Code começar

### ✅ Engineering Architecture — **CRÍTICOS**
- **`engineering:system-design`** ⭐ — Design de APIs, endpoints, data models.
  **Usar em:** Sprint 1 (design de API)
- **`engineering:architecture`** ⭐ — ADR, formalizar decisões de arquitetura.
  **Usar em:** Sprint 1 (antes de code)
- **`engineering:testing-strategy`** — Planning de testes (unit, component, E2E).
  **Usar em:** Sprint 2 (definir estratégia)
- **`engineering:code-review`** — Review de PRs e merge requests.
  **Usar em:** Ao longo do projeto
- **`engineering:documentation`** — Write technical docs (README, API docs).
  **Usar em:** Sprint 1-3 (documentar conforme vai)

### ✅ Marketing & Discovery — **IMPORTANTE DEPOIS**
- **`marketing:seo-audit`** ⭐ — SEO audit (local keywords, meta tags, structured
  data). **Usar em:** Sprint 3 (importante pra app local ser descoberto)

### ✅ Documentação
- **doc-coauthoring** — Guia estruturado pra escrever docs (RFC, specs,
  decision docs).
- **theme-factory** — Aplicar temas a artifacts (slides, docs, landing pages).

### ✅ Geral
- **learn** — Ensinar conceitos de código/tech (quando não entender algo).
- **skill-creator** — Criar novas skills pra Claude (meta, não pro MVP).

---

## 2. SKILLS E PADRÕES DA INTERNET (2024-2026)

### Frontend: Next.js + React

#### **Next.js Best Practices (2025)**
| Tópico | Padrão |
|---|---|
| **App Router** | Use por padrão (Next.js 13+); Server Components pra dados, Client Components pra interatividade |
| **Rendering** | SSG (blogs/landing) → SSR (dynamic) → ISR (ecommerce) → CSR (live updates) |
| **Caching** | Composable caching: `revalidate` em `fetch()`, tags de revalidação, `unstable_cache` pra queries |
| **Performance** | Lazy load com `next/image`, code splitting automático, web vitals monitoring (Vercel Analytics) |
| **Segurança** | CORS/CSRF config no `next.config.js`, auth via middleware, rate limiting via Edge Middleware |

**Referências:**
- Supabase Next.js Guide (2025) — Supabase + Next.js + caching + monitoring
- Next.js Best Practices 2025 (DEV Community) — deep dive em rendering, caching
- Fungies.io Technical Report (2025) — React + Next.js + Express + Supabase patterns

---

### React: Custom Hooks & Patterns

#### **Custom Hooks Best Practices (2025)**
```
1. Um hook faz UMA coisa bem
2. Prefix com "use" (useForm, useAuth, useFetch)
3. Retorna só o que é necessário (não expose tudo)
4. Hooks só no top level (sem loops, conditions, nested functions)
5. Testa com React Testing Library
```

**Padrões úteis pra este projeto:**

| Hook | Use case |
|---|---|
| `useAuth()` | Login, logout, user context (Supabase Auth) |
| `useFetch()` | API calls, loading, error handling |
| `useForm()` | Form state, validation (Zod), submit |
| `usePrestadores()` | Fetch + filter prestadores, cache com React Query |
| `useLocalStorage()` | Salvar preferências do user (theme, language) |
| `useGeoLocation()` | Geo-restrição Lumiar/São Pedro |
| `useDebounce()` | Search input, rate limit |

**Referências:**
- React Hooks Deep Dive (2025) — padrões avançados, memoization, Suspense
- Custom Hooks Best Practices (Medium) — composição, testing, memoization
- Mastering Custom React Hooks (DEV Community) — naming, estrutura, organizção

---

### TypeScript + Validation

#### **Zod Pattern (recomendado pra este projeto)**

Ao invés de só TypeScript types, usar Zod pra schema + validação:

```typescript
// ❌ Só TypeScript (não valida em runtime)
type User = {
  email: string;
  name: string;
};

// ✅ Zod (valida em runtime + TypeScript type seguro)
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  data_nascimento: z.coerce.date(),
});

type User = z.infer<typeof UserSchema>;

// Usa em validação de API
const user = UserSchema.parse(data); // throws se inválido
```

**Por quê:** 
- Validação automática em API routes
- Type inference automático → nunca fica desincronizado
- Reutilizável em ChatGPT structured outputs, server actions, etc.

**Referências:**
- Next.js + Supabase (2024) — padrão Zod recomendado
- Technical Report (2025) — Zod + TypeScript best practices

---

### Acessibilidade (a11y)

#### **WCAG 2.1 AA — padrão obrigatório pro MVP**

Já decidido no projeto (ver `03_ARQUITETURA_TECNICA.md`). Padrões concretos:

| Prática | Implementação |
|---|---|
| **Semantic HTML** | `<button>`, `<nav>`, `<main>`, labels em inputs (padrão shadcn/ui) |
| **ARIA** | `aria-label`, `aria-live`, `role` só quando necessário (não abuse) |
| **Keyboard** | Tab navigation, Esc fecha modais, Enter submete forms |
| **Color contrast** | 4.5:1 pra texto normal, 3:1 pra grande (WCAG AA) |
| **Alt text** | Toda imagem tem `alt`, ícones sozinhos têm `aria-label` |
| **Focus visible** | Outline visível em links/buttons (Tailwind: `focus:outline-2`) |
| **Testing** | Axe DevTools (browser), jest-axe (unit tests), screen reader (manual) |

**Ferramentas:**
- `eslint-plugin-jsx-a11y` — lint em dev (obrigatório)
- Axe DevTools (browser extension) — scan de violations
- Storybook + addon-a11y — test components during dev

**Referências:**
- Ultimate Guide to a11y in React (2025, Medium) — patterns práticos
- React a11y Best Practices (AllAccessible) — WCAG 2.2 AA compliance guide
- A11y Pros Design System — open source accessible component library

---

### Backend: Supabase + TypeScript

#### **Supabase Patterns (2024-2025)**

| Prática | Padrão |
|---|---|
| **Auth** | Use `@supabase/ssr` (melhor que `@supabase/auth-js` alone) |
| **Database** | RLS **ligado em toda tabela**, use `z.infer<Zod>` pra types |
| **Real-time** | `supabase.from('table').on('*', callback)` pra mudanças ao vivo |
| **Storage** | Bucket com policy própria, restringe tipo/tamanho arquivo |
| **Migrations** | Versioná via SQL (Supabase Migrations), nunca "refaz do zero" |
| **Branching** | Use Supabase Branching (GA em abril 2024) pra test schema changes |
| **Logging** | Supabase Log Drains → external monitoring (Sentry depois) |
| **Caching** | @supabase/cache-helpers com `next/fetch` pra query optimization |

**Referências:**
- Supabase Next.js Complete Guide (2025) — RLS, caching, monitoring
- LogRocket: Build Full-Stack with Next.js + Supabase (2024) — patterns práticos

---

### Performance & Monitoring

#### **Métricas a rastrear (MVP)**

```
Vercel Analytics (free tier):
├─ Page load time (< 3s ideal)
├─ LCP (Largest Contentful Paint < 2.5s)
├─ CLS (Cumulative Layout Shift < 0.1)
├─ Visitantes por página
├─ Taxa de bounce
└─ Device + browser breakdown

v1.1: Sentry (free tier)
├─ Erros em production
├─ Performance bottlenecks
├─ User sessions
└─ Release tracking
```

**Referências:**
- Next.js Performance (2025) — Core Web Vitals, caching strategies
- Supabase Branching + Log Drains (2024) — schema management + monitoring

---

## 3. RECOMENDAÇÕES CONCRETAS PRAS PRIMEIRAS SPRINTS

### **PRE-SPRINT: Wireframes + Design System** (paralelo, 1-2 semanas)

**Skills a usar:**
- ✅ `design:ux-copy` — draft microcopy, CTAs, error messages
- ✅ `design:design-system` — estruturar tokens, colors, spacing (vai decidir paleta aqui)
- ✅ `design:design-critique` — feedback em wireframes enquanto desenha
- ✅ `design:accessibility-review` — audit WCAG em wireframes antes de code

**Outputs:**
- Wireframes das 5-6 telas principais (home, search, prestador detail, cadastro, admin)
- Design tokens definidos (cores, tipografia, espacamento)
- Microcopy final (labels, placeholders, error messages)
- A11y checklist confirmado

---

### Sprint 0: API Design + Architecture

**Skills a usar:**
- ✅ `engineering:system-design` — design dos endpoints REST (auth, prestadores, admin)
- ✅ `engineering:architecture` — formalizar ADR (por quê Supabase, por quê Next.js, etc.)
- ✅ `design:design-handoff` — specs de interações pro dev implementar

**Ler/seguir:**
- ✅ `03_ARQUITETURA_TECNICA.md` (checklist de segurança 20 itens)
- ✅ Supabase Next.js Complete Guide (2025)
- ✅ `engineering:system-design` guide

**Outputs:**
- API endpoints documentados (GET /prestadores, POST /auth/signup, etc.)
- Database schema refinado (com explicação de cada campo)
- 3-5 ADRs formalizados (decisões arquiteturais)

---

### Sprint 1: Setup + Auth

**Skills a usar:**
- ✅ `engineering:code-review` — review código conforme write
- ✅ `engineering:documentation` — README + setup guide

**Ler/seguir:**
- ✅ `03_ARQUITETURA_TECNICA.md` (checklist de segurança 20 itens)
- ✅ Supabase Next.js Complete Guide (2025)
- ✅ `@supabase/ssr` docs (novo padrão, mais seguro)
- ✅ Zod + TypeScript pattern (acima)

**Implementar desde o dia 1:**
- ESLint + `eslint-plugin-jsx-a11y`
- Zod schemas pra todos os inputs/database types
- Supabase RLS em toda tabela
- `.env.local` + Vercel env vars (nunca hardcode)
- README.md + setup local guide

---

### Sprint 2: Componentes + Busca + A11y

**Skills a usar:**
- ✅ React Custom Hooks Best Practices (2025)
- ✅ Acessibilidade (a11y) guide (seção 4 deste doc)
- ✅ `design:accessibility-review` — audit dos componentes prontos
- ✅ `engineering:code-review` — PRs de componentes

**Ler/seguir:**
- ✅ `design:design-handoff` specs (do pre-sprint)

**Implementar:**
- `useAuth()` custom hook
- `usePrestadores()` + React Query (caching)
- `useForm()` com Zod validation
- Todos componentes passam em Axe DevTools + `eslint-plugin-jsx-a11y`
- Keyboard navigation 100% funcional
- ARIA labels/roles onde necessário

---

### Sprint 3: Performance + SEO + Security

**Skills a usar:**
- ✅ `marketing:seo-audit` — audit de SEO local (keywords, meta tags, structured data)
- ✅ `engineering:code-review` — PRs finais antes de staging

**Ler/seguir:**
- ✅ Next.js Performance (2025)
- ✅ Supabase Caching patterns
- ✅ 20-item security checklist (`03_ARQUITETURA_TECNICA.md`)

**Implementar:**
- `next/image` pra todas as imagens
- ISR ou cache headers apropriados
- Rate limiting em `/api/auth/login`
- Vercel Analytics live
- Security headers (CSP, X-Frame-Options, etc.)
- SEO tags dinâmicas (open graph, structured data)
- Sitemap.xml + robots.txt

---

## 4. SKILLS NÃO NECESSÁRIOS PRO MVP (pra depois)

- ❌ `engineering:testing-strategy` — Jest/E2E — melhor com usuários reais (Sprint 2-3 review apenas)
- ❌ Storybook — nice-to-have pra Sprint 2, não crítico
- ❌ tRPC / GraphQL — REST simples é suficiente
- ❌ Kubernetes / Docker advanced — Vercel + Supabase managed é suficiente
- ❌ Analytics avançadas (Mixpanel) — Vercel Analytics suficiente pro MVP
- ❌ Performance profiling (React DevTools) — depois, quando houver problemas
- ❌ Monitoramento avançado (Datadog) — Sentry free tier é suficiente

---

## 5. LINKS ÚTEIS (referência rápida)

### Documentação Oficial
- [Next.js App Router](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Zod Validation](https://zod.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Best Practices 2025
- [Supabase Next.js Guide](https://www.digitalapplied.com/blog/mastering-supabase-nextjs-complete-guide) (April 2025)
- [Next.js Deep Dives 2025](https://dev.to/faizancheema893/technical-deep-dives-best-practices-in-nextjs-2025-3n74) (June 2025)
- [React Custom Hooks 2025](https://medium.com/@pallavilodhi08/react-custom-hooks-tutorial-best-practices-patterns-real-world-examples-979a4f1bfa58) (December 2025)
- [React Accessibility Ultimate Guide](https://lokesh-prajapati.medium.com/day-30-ultimate-guide-to-web-accessibility-a11y-in-react-next-js-37ec46011c0d) (May 2025)

### Tools
- [ESLint Plugin a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [React Testing Library](https://testing-library.com/react)

---

## 6. O QUE FALTOU NA PRIMEIRA BUSCA (e por quê)

**Heurística inicial errada:**
- ❌ Busquei genérico ("frontend", "backend", "UI") ao invés de específico
- ❌ Não mapeei skills por **sprint/fase** do projeto
- ❌ Não considerei contexto hyperlocal (SEO local é crítico; não mencionei)
- ❌ Não busquei por "architecture", "system-design", "testing-strategy", "seo"
- ❌ Não pensei em "design system" como skill separada

**O que foi adicionado agora:**
- ✅ 4 skills de design (ux-copy, design-system, accessibility-review, design-handoff)
- ✅ 5 skills de engineering (system-design, architecture, testing-strategy, code-review, documentation)
- ✅ 1 skill de marketing (seo-audit — crítica pra app local)
- ✅ Mapeamento por sprint (pre-sprint, sprint 0, 1, 2, 3)

---

## 7. STATUS: READY FOR CLAUDE CODE

Todas as skills e padrões acima vão pra dentro do `CLAUDE.md` final
(juntamente com os 8 docs já criados).

**Claude Code vai ter:**
- ✅ 20-item security checklist (sempre aplicar)
- ✅ Zod schema pattern (ao invés de só TypeScript)
- ✅ Custom hooks structure
- ✅ a11y implementation checklist
- ✅ Next.js + Supabase best practices 2025
- ✅ RLS security by default
- ✅ ESLint + jest-axe setup no dia 1

**Próximo passo:** fechar pendências (design system color) e gerar `CLAUDE.md`.
