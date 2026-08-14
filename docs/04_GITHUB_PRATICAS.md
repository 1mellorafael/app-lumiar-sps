# PRÁTICAS CORRETAS DE GITHUB - APP DE LUMIAR

## ⚠️ Leia primeiro: granularidade de commit

Este documento tem o workflow completo (branches, PR, CI/CD). Mas o ponto
mais importante, que vale sempre: **1 commit = 1 feature completa e
testada**, nunca 1 commit por pequena alteração dentro dela. Ver
`11_PLANO_IMPLEMENTACAO.md` pra ordem exata de features e onde cada
commit deve acontecer.

Não é preciso abrir PR formal pra cada feature pequena se isso virar
fricção — mas cada commit na branch principal precisa ter mensagem clara
o suficiente pra entender o que mudou e por quê, só de ler o log.

## 1. ESTRUTURA DE BRANCHES

```
main (produção, sempre estável)
├── staging (testes antes de liberar)
└── dev (desenvolvimento diário)
    ├── feature/feature-name (nova funcionalidade)
    ├── feature/outra-feature
    ├── fix/bug-name (correção de bug)
    ├── docs/nome-doc (documentação)
    ├── chore/dependencias (atualizações)
    └── test/nome-teste (testes)
```

### Regras de Branches:
1. **main**: Apenas código testado e pronto pra produção
2. **staging**: Mescla da dev, testada antes de main
3. **dev**: Integração de todas as features
4. **feature/**: Sempre sai de dev, volta pra dev via PR
5. **fix/**: Saem de dev, volta pra dev via PR
6. **docs/**: Saem de dev, volta pra dev via PR

### Naming Convention:
```
feature/lista-prestadores         ✅
feature/status-online             ✅
fix/horario-onibus-errado         ✅
fix/avatar-nao-carrega            ✅
docs/setup-local                  ✅
chore/atualizar-dependencias      ✅
test/auth-integration             ✅

ERRADO:
Feature/ListaPrestadores          ❌
feature_lista_prestadores         ❌
lista-prestadores                 ❌
```

---

## 2. COMMIT MESSAGE CONVENTION (Conventional Commits)

### Formato:
```
<tipo>(<escopo>): <assunto>

<corpo (opcional)>

<footer (opcional)>
```

### Tipos:
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Apenas documentação
- **style**: Formatação, sem mudança lógica (eslint, prettier)
- **refactor**: Reescreve código sem alterar funcionalidade
- **perf**: Melhora de performance
- **test**: Adiciona/altera testes
- **chore**: Build, CI/CD, dependências
- **revert**: Volta um commit anterior

### Escopo (opcional mas recomendado):
- **auth**: Sistema de autenticação
- **prestadores**: Feature de prestadores
- **feed**: Feed de notícias
- **onibus**: Horários de ônibus
- **ui**: Componentes e estilo
- **db**: Database/migrations
- **api**: API routes
- **deploy**: Deploy e infraestrutura

### Exemplos:

```
feat(auth): implementa sistema de cadastro com email

- Email validation com regex
- Password hashing com bcrypt
- Envio de email de confirmação
- Testes unitários de validação

feat(prestadores): adiciona status "disponível agora"

fix(db): corrige índice duplicado em usuarios

docs(readme): adiciona instruções de setup local

style(ui): formata componentes com prettier

refactor(auth): extrai lógica de validação em utils

test(prestadores): adiciona testes E2E de listagem

chore(deps): atualiza dependências de segurança

Fixes #123
```

### Boas Práticas:
1. **Imperative form**: "add", "fix", "change" (não "added", "fixed")
2. **Lowercase**: tudo minúsculo (exceto nomes próprios)
3. **Sem ponto final**: "adiciona" e não "adiciona."
4. **Conciso**: primeira linha < 50 caracteres
5. **Detalhado**: corpo > 72 caracteres por linha
6. **Referencia Issue**: "Fixes #123" ou "Relates #456"

---

## 3. PULL REQUEST (PR) WORKFLOW

### Criar uma PR:
```bash
1. Sai de dev
   git checkout dev
   git pull origin dev

2. Cria branch
   git checkout -b feature/nova-funcionalidade

3. Trabalha, commits, mais commits

4. Push pra origin
   git push origin feature/nova-funcionalidade

5. Abre PR no GitHub
   - Title: segue conventional commits
   - Description: explica o que, por que, como testar
   - Assignee: você mesmo
   - Reviewers: você mesmo (solo)
   - Labels: feature, bug, docs, etc
```

### Template de PR Description:

```markdown
## Descrição
Breve explicação do que essa PR faz.

## Tipo de mudança
- [ ] Nova funcionalidade
- [x] Correção de bug
- [ ] Refactoring
- [ ] Documentação
- [ ] Outra

## Como testar
Passo a passo para testar:
1. Abra o app
2. Vá para tal lugar
3. Clique em tal botão
4. Deve aparecer X

## Screenshots (se visual)
[Imagem aqui]

## Checklist
- [x] Código segue style guide
- [x] Testes foram adicionados
- [x] Testes passam localmente
- [x] Documentação atualizada
- [x] Sem warnings no console

## Relacionado
Fixes #123
Relates #456
```

### Regras de Merge:
1. **Squash and merge** se a feature tem muitos commits
2. **Create a merge commit** se quer histórico de cada commit
3. **Rebase and merge** se quer linear (avançado)

**Recomendação:** Use **squash** pra features pequenas, **merge commit** pra maiores.

---

## 4. VERSIONAMENTO (Semantic Versioning)

### Formato: MAJOR.MINOR.PATCH
```
1.0.0 = primeira release
1.0.1 = bug fix
1.1.0 = nova feature
2.0.0 = breaking change
```

### Releases:
```
v1.0.0-alpha.1   (early preview)
v1.0.0-beta.1    (near release)
v1.0.0-rc.1      (release candidate)
v1.0.0           (stable release)
```

### Timeline do projeto:
```
Semana 1-2: v0.1.0-alpha (setup básico)
Semana 3-4: v0.2.0-alpha (features core)
Semana 5:   v0.3.0-alpha (avaliações + polish)
Semana 6:   v0.3.0-beta (staging test)
Semana 7:   v1.0.0-rc (release candidate)
Semana 8:   v1.0.0 (lançamento)
```

### Tag no Git:
```bash
git tag -a v1.0.0 -m "Release v1.0.0: MVP estável"
git push origin v1.0.0
```

---

## 5. ARQUIVO .gitignore

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Build
/.next/
/out/
/dist/
/build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# Testing
coverage/
.nyc_output/

# Misc
.cache/
.turbo/
*.tmp
```

---

## 6. ARQUIVO .gitattributes (Opcional mas bom)

```
* text=auto
*.js text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.md text eol=lf
*.json text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
```

---

## 7. WORKFLOW COM GITHUB ACTIONS (CI/CD)

### Arquivo: `.github/workflows/tests.yml`

```yaml
name: Tests

on:
  push:
    branches: [ dev, staging, main ]
  pull_request:
    branches: [ dev, staging, main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
```

### Arquivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        production: true
```

---

## 8. GITHUB SETTINGS RECOMENDADO

### Branch Protection Rules (main):
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require code reviews from 1 person (você mesmo)
- ✅ Dismiss stale pull request approvals
- ✅ Include administrators

### Branch Protection Rules (staging):
- ✅ Require pull request reviews
- ⚠️ Menos restritivo que main

### Branch Protection Rules (dev):
- ❌ Sem proteção (trabalho diário)

---

## 9. LOCAL SETUP PARA TRABALHAR COM GIT

### Configuração Inicial:
```bash
# Clone o repo
git clone https://github.com/seu-usuario/app-lumiar.git
cd app-lumiar

# Setup local
npm install
cp .env.example .env.local

# Verificar config git
git config user.name "Seu Nome"
git config user.email "seu-email@example.com"

# Verificar branches
git branch -a

# Switch pra dev
git checkout dev
```

### Workflow Diário:
```bash
# 1. Pega updates
git checkout dev
git pull origin dev

# 2. Cria branch
git checkout -b feature/meu-recurso

# 3. Trabalha... commits...
git add .
git commit -m "feat(ui): adiciona componente botão"

# 4. Mais código, mais commits
git add .
git commit -m "feat(ui): botão com variantes de tamanho"

# 5. Push
git push origin feature/meu-recurso

# 6. Abre PR no GitHub

# 7. Aprova sua própria PR (você é solo)

# 8. Merge (squash)

# 9. Delete branch local
git branch -d feature/meu-recurso
git push origin --delete feature/meu-recurso

# 10. Volta pra dev
git checkout dev
git pull origin dev
```

---

## 10. ARQUIVO README.md INICIAL

```markdown
# App de Lumiar

Hub centralizado de serviços, transportes e comunidade de Lumiar.

## Setup Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
git clone https://github.com/seu-usuario/app-lumiar.git
cd app-lumiar
npm install
cp .env.example .env.local
```

### Variáveis de Ambiente

Copie `.env.example` pra `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Desenvolvimento

```bash
npm run dev
# Abre em http://localhost:3000
```

### Build

```bash
npm run build
npm start
```

### Tests

```bash
npm test
npm run test:e2e
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Git Workflow

Ver [GITHUB_PRATICAS.md](./GITHUB_PRATICAS.md)

## Branches Principais

- `main` - Produção
- `staging` - Testes
- `dev` - Desenvolvimento

Crie features em `feature/nome-descritivo` saindo de `dev`.

## Deployment

- **Staging**: automático em `staging` → Vercel preview
- **Produção**: automático em `main` → Vercel production

## Roadmap

Ver [1_VISAO_ESCOPO.md](./1_VISAO_ESCOPO.md) e [APP_LUMIAR_PLANEJAMENTO.md](./APP_LUMIAR_PLANEJAMENTO.md)

## Licença

MIT
```

---

## 11. MELHORES PRÁTICAS GERAIS

### Code Quality:
- ✅ ESLint + Prettier obrigatórios
- ✅ TypeScript strict mode
- ✅ No console.log em produção
- ✅ Testes pra features críticas

### Commits:
- ✅ Commits pequenos e atômicos
- ✅ 1 feature = 1 commit (squash no merge)
- ✅ Mensagens descritivas
- ✅ Sem "fix commit" ou "oops"

### PRs:
- ✅ 1 feature = 1 PR
- ✅ PR não muito grande (< 400 linhas idealmente)
- ✅ Sempre com testes
- ✅ Sempre com descrição

### Releases:
- ✅ Tag no git
- ✅ Release notes no GitHub
- ✅ Changelog atualizado

---

## 12. ISSUE TEMPLATE (Opcional)

### Arquivo: `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Reporte um bug encontrado

---

## Descrição do Bug
Descrição clara do que aconteceu.

## Steps to Reproduce
1. Vá para...
2. Clique em...
3. Veja erro...

## Comportamento Esperado
O que deveria acontecer.

## Comportamento Atual
O que realmente aconteceu.

## Screenshots
Se aplicável, screenshots.

## Informações do Ambiente
- OS: [e.g., macOS]
- Browser: [e.g., Chrome]
- Versão: [e.g., 1.0.0]

## Logs
Se tem erro, cole o stack trace.
```

---

## 13. CHECKLIST PRÉ-COMMIT

Antes de fazer commit, verificar:

- [ ] Código roda localmente sem erro
- [ ] Testes passam
- [ ] ESLint passa
- [ ] Prettier passou
- [ ] Mensagem de commit segue convention
- [ ] Não tem console.log
- [ ] Não tem arquivo de teste extra (.tmp, etc)
- [ ] .env.local não foi commited

---

## 14. QUANDO COMEÇAR A USAR ISSO

**Assim que criar o repositório no GitHub**, use essas práticas desde o primeiro commit.

**Quando for pra Claude Code:**
- Passe este documento pra ele
- Ele vai seguir essas práticas em todos os commits/PRs
- Você aprova e faz merge

---

## 15. RESUMO VISUAL

```
main (produção)
 ↑
 | PR (merge squash)
 |
staging (QA)
 ↑
 | PR (merge squash)
 |
dev (integração)
 ↑
 | feature/nova-funcionalidade (seu trabalho)
 |
 | git checkout -b feature/xyz
 | ... commits com mensagens boas ...
 | git push origin feature/xyz
 | Abre PR
 | Aprova PR
 | Faz merge
 | Delete branch
 | Volta pra dev
 |
[Repete pro próximo feature]
```

---

## PRÓXIMO PASSO

Quando for criar o repositório no GitHub:
1. Use este documento como guia
2. Copie os arquivos (.gitignore, .gitattributes, workflows)
3. Crie o README.md
4. Primeiro commit: "chore: setup inicial do projeto"
5. Passe este documento + `11_PLANO_IMPLEMENTACAO.md` pro Claude Code

