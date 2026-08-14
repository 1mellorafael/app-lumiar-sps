# 🎨 WIREFRAMES — SKETCH DE BAIXA FIDELIDADE (V0)

Telas principais mapeadas em ASCII. **Revisão 4** — ajustes de 14/08 (rodada 3).

---

## 1️⃣ HOME / DISCOVER

```
┌─────────────────────────────────────────────┐
│        Logo "Lumiar/São Pedro da Serra"     │
│                                    ☀️ 22°C  │ ← Logo centralizada, clima
├─────────────────────────────────────────────┤     no canto direito
│  CATEGORIAS                                 │
│  ─────────────────────────────────────────  │
│  🏍️ Motoboy    🧹 Faxina    🏠 Hospedagem │
│  🚕 Uber       💅 Estética  🐕 Adestramento│
│  👶 Babá       📚 Educação  🧠 Psicólogo  │
│  🎨 Artes      🛍️ Lojas     [Ver todas →] │
│                                             │
├─────────────────────────────────────────────┤
│  Presta algum serviço em Lumiar ou São      │
│  Pedro? [Cadastre-se →]                     │
├─────────────────────────────────────────────┤
│  Conhece alguém que presta serviço? Ou só   │
│  curte o app? Divulgue o Lumiar! 📲         │
│  [Compartilhar app →]                       │
├─────────────────────────────────────────────┤
│  📱 Adicione o app à tela inicial do seu    │
│     celular   [Adicionar]                   │
│                                             │
├─────────────────────────────────────────────┤
│  📺 Ver um anúncio pra ajudar a manter o    │
│     app no ar   [Ver Anúncio]               │
│                                             │
├─────────────────────────────────────────────┤
│  Bottom Nav:                                │
│  🏠 Home    🔍 Buscar   🔧 Úteis   ☰ Menu  │
└─────────────────────────────────────────────┘
```

### Mudanças desta revisão:
- ❌ **Removida a busca do topo da Home** — já existe na barra de baixo
  (🔍 Buscar).
- ❌ **Removido o ícone de idioma do topo** — idioma agora só existe dentro
  do Menu, com bandeiras (ver seção 7)
- ❌ **Removido o ícone ☰ do canto superior direito** — já existe acesso ao
  Menu pela barra de baixo, não precisa duplicar.
- ✅ **Logo centralizada, clima no canto direito** — layout ajustado
  conforme pedido
- ✅ **Nome do app padronizado:** "Lumiar/São Pedro da Serra" (com barra)
- ✅ **Clima compacto no topo** — só ícone (☀️/🌙/🌧️) + graus. Se tiver
  alerta importante, aparece um ícone extra do lado (ex: ☀️ 22°C ⚠️).
  Versão completa com previsão e alerta detalhado fica na aba **Úteis**
  (ver seção 2️⃣.5).
- ✅ **Nova aba "Úteis" (🔧) na barra de baixo** — Ônibus e a versão
  completa do Clima moraram pra lá (ver seção 2️⃣.5)
- ✅ **Botão "Adicionar à Tela Inicial" também na Home** — antes só
  existia no onboarding (primeira visita) e no Menu; agora fica sempre
  visível aqui também, sem depender de lembrar de procurar no Menu
- ✅ **Botão "Ver Anúncio" continua na Home** (além de também estar em
  Úteis)
- ✅ **Banner trocado:** era "sugerir um lugar/prestador", virou
  **"Divulgar o app"** — convite geral pra compartilhar o Lumiar. Sugerir
  um lugar continua existindo, mas só dentro do formulário de Enviar
  Sugestão (seção 7C)

---

## 🃏 CARDS vs. LISTA — princípio de exibição (Home, Categorias, Úteis)

Demonstrado nos protótipos interativos acima (segunda versão, mais
compacta). Regra vale pras áreas do app que mostram várias opções pra
escolher: **alternância entre visualização em Cards e em Lista**, com
toggle simples no topo.

```
✅ Ambos os formatos são clicáveis (card inteiro e linha inteira)
✅ Cards são COMPACTOS — grid de 3 colunas, não cards gigantes
✅ Foto é composta em duas camadas:
   → Capa (opcional): imagem de fundo, cor neutra se não tiver
   → Principal (obrigatória): foto/logo circular, sempre no centro
✅ Nome/título NUNCA fica sobreposto em cima da foto — sempre abaixo
   dela, como texto separado, nunca como legenda por cima da imagem
✅ Cards: melhor pra reconhecimento visual rápido
✅ Lista: melhor pra escanear muitas opções rápido, mais compacta
```

Esse padrão se aplica em:
- **Home** → lista de categorias (seção 1️⃣)
- **Categorias** → grid de categorias (seção 2️⃣)
- **Busca/Listagem** → lista de serviços (seção 3️⃣)
- **Úteis** → toggle também disponível aqui (telefones, futuros pontos
  turísticos etc.)

---

## 2️⃣ CATEGORIAS (tela própria, com toggle Cards/Lista)

```
┌─────────────────────────────────────────────┐
│ ← [Voltar]  Todas as Categorias  [▦][☰]    │ ← toggle Cards/Lista
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────┐  ┌───────────────┐      │
│  │      🏍️       │  │      🧹       │      │
│  │    Motoboy    │  │    Faxina     │      │
│  └───────────────┘  └───────────────┘      │
│                                             │
│  (... resto igual à revisão anterior)      │
│                                             │
├─────────────────────────────────────────────┤
│  🏠 Home    🔍 Buscar   🔧 Úteis   ☰ Menu  │
└─────────────────────────────────────────────┘
```

Clicar no card (ou na linha, se estiver em modo Lista) continua abrindo
direto a lista filtrada daquela categoria. Ver princípio de Cards vs.
Lista logo acima.

---

## 2️⃣.5 ÚTEIS (nova aba na barra de baixo)

```
┌─────────────────────────────────────────────┐
│         Úteis              [▦][☰]           │ ← toggle Cards/Lista
├─────────────────────────────────────────────┤     (pros telefones, por ex.)
│                                             │
│  🌦️  CLIMA — versão completa                 │
│  ─────────────────────────────────────────  │
│  22°C, parcialmente nublado                 │
│  Previsão: manhã ☀️ · tarde ⛅ · noite 🌧️   │
│  ⚠️ Alerta: chuva forte prevista hoje à noite│
│                                             │
├─────────────────────────────────────────────┤
│  🚌 ÔNIBUS (próximos horários)              │
│  ─────────────────────────────────────────  │
│  Lumiar → São Pedro: 06:30, 09:00, 14:30   │
│  [Ver todos]                                │
│                                             │
├─────────────────────────────────────────────┤
│  ☎️  TELEFONES ÚTEIS                         │
│  ─────────────────────────────────────────  │
│  Bombeiros: 193                             │
│  SAMU: 192                                  │
│  Polícia: 190                               │
│  Defesa Civil: (22) xxxx-xxxx               │
│  Posto de Saúde Lumiar: (22) xxxx-xxxx      │
│  [Ver todos]                                │
│                                             │
├─────────────────────────────────────────────┤
│  📺 Ver um anúncio pra ajudar a manter o    │
│     app no ar   [Ver Anúncio]               │
│                                             │
├─────────────────────────────────────────────┤
│  🏠 Home    🔍 Buscar   🔧 Úteis   ☰ Menu  │
└─────────────────────────────────────────────┘
```

### Notas:
- Nova aba criada pra tirar peso da Home (ver seção 1️⃣, "Mudanças desta
  revisão")
- **Clima aqui é a versão completa** (previsão do dia, detalhe do
  alerta) — a Home mostra só a versão compacta (ícone + graus)
- ✅ **Telefones úteis adicionados** — números de emergência (bombeiros,
  SAMU, polícia) + contatos locais (defesa civil, posto de saúde). Faz
  bastante sentido numa região serrana com histórico de temporais/
  deslizamentos — conecta com o alerta de clima logo acima
- Ônibus e o botão de anúncio também aparecem aqui — o anúncio existe
  tanto na Home quanto aqui por enquanto (decisão de manter nos dois
  lugares na fase inicial)
- Espaço pra crescer no futuro: pontos turísticos (Fase 3), eventos
  locais, se o feed de notícias voltar

---

## 3️⃣ BUSCA / LISTAGEM DE SERVIÇOS

Mesma base das revisões anteriores (10-12 resultados por página, sem
status, sem rating, "Buscar Serviços") — agora com **toggle Cards/Lista**
no topo da tela, mesmo princípio da seção 2️⃣ (ver "Cards vs. Lista" acima).
Card mostra foto, nome (abaixo, nunca sobre a foto), categoria e
descrição curta; lista mostra a mesma informação em linha compacta.
Ambos os formatos são clicáveis.

---

## 4️⃣ DETALHE DO SERVIÇO

```
┌─────────────────────────────────────────────┐
│ ← [Voltar]                                  │
├─────────────────────────────────────────────┤
│                                             │
│     ┌───────────────────────────────┐      │
│     │ (foto de capa, se tiver)      │      │
│     │        ┌─────────┐            │      │
│     │        │ [Foto   │            │      │
│     │        │Principal]│           │      │
│     │        └─────────┘            │      │
│     └───────────────────────────────┘      │
│               João                          │  ← nome fica abaixo,
│                                             │     fora da moldura da foto
├─────────────────────────────────────────────┤
│  INFORMAÇÕES                                │
│  ─────────────────────────────────────────  │
│  📍 Lumiar, São Pedro da Serra              │
│  📞 (21) 98765-4321                         │
│  🏷️ Motoboy                                 │
│                                             │
├─────────────────────────────────────────────┤
│  SOBRE                                      │
│  ─────────────────────────────────────────  │
│  Entrego qualquer coisa. Rápido e seguro.  │
│                                             │
├─────────────────────────────────────────────┤
│  [📷] @joao_moto  ← clicável, abre Instagram│  ← Ícone + link clicável
├─────────────────────────────────────────────┤
│              [💬 Chamar no WhatsApp]        │
│  [ 🔗 Copiar link ] [ 📤 Compartilhar ]    │
├─────────────────────────────────────────────┤
│  🏠 Home    🔍 Buscar   🔧 Úteis   ☰ Menu  │
└─────────────────────────────────────────────┘
```

### Correções desta revisão:
- ✅ **Foto virou composição de duas camadas:** capa (opcional, fundo) +
  foto principal (obrigatória, centro) — mesmo padrão mostrado na demo
  interativa de cards
- ✅ **Nome movido pra fora da moldura da foto** — antes estava dentro do
  mesmo quadro que a foto (ambíguo, parecia sobreposto); agora fica
  claramente abaixo, como texto separado
- ✅ **Ícone 🏷️ voltou** ao lado da categoria. Eu tinha removido isso na
  revisão anterior por conta própria — não foi pedido seu, foi presunção
  minha achando que "limpava" a tela. Como você esclareceu que os ícones
  no sketch são só placeholder (a versão final vai ter um icon set
  próprio, não emoji), faz mais sentido manter o ícone aqui — ele
  representa "aqui existe um ícone", não a decisão final de estilo.
- ✅ **Instagram corrigido:** antes estava só como texto estático (bug do
  wireframe, não fazia nada clicável). Agora é um **link clicável** — com
  **ícone do Instagram antes do texto**, e clicar abre o perfil do
  Instagram da pessoa numa nova aba/app.

---

## 5️⃣ CADASTRO DE SERVIÇO

### 5A - Passo 1: Sua Conta

```
┌─────────────────────────────────────────────┐
│ ← [Cancelar]     Cadastrar seu Serviço      │
├─────────────────────────────────────────────┤
│                                             │
│  Passo 1 de 2: Sua Conta                   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Foto de Perfil (obrigatória)               │
│  ┌──────────────────────────────────────┐  │
│  │        [Clique pra enviar foto]      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  Nome                                       │
│  ┌─────────────────────────────────────┐  │
│  │ João                                 │  │  ← auto-capitaliza
│  └─────────────────────────────────────┘  │
│                                             │
│  Sobrenome                                  │
│  ┌─────────────────────────────────────┐  │
│  │ da Silva                            │  │  ← auto-capitaliza
│  └─────────────────────────────────────┘  │     (preposição minúscula)
│                                             │
│  Email                                      │
│  ┌─────────────────────────────────────┐  │
│  │ joao@email.com                      │ ✓│  ← valida formato de email
│  └─────────────────────────────────────┘  │
│                                             │
│  Telefone (WhatsApp)                        │
│  ┌─────────────────────────────────────┐  │
│  │ (21) 98765-4321                     │ ✓│  ← máscara automática
│  └─────────────────────────────────────┘  │     (xx) xxxxx-xxxx
│                                             │
│  Data de Nascimento                         │
│  ┌─────────────────────────────────┬───┐  │
│  │ 15/03/2010                      │ 📅│  │  ← formato xx/xx/xxxx +
│  └─────────────────────────────────┴───┘  │     ícone abre calendário
│                                             │
│  Senha                                      │
│  ┌─────────────────────────────────────┐  │
│  │ ••••••••                            │  │
│  └─────────────────────────────────────┘  │
│  ▓▓▓▓░░░░░░  Média                         │  ← medidor de força
│                                             │
│  Confirmar Senha                            │
│  ┌─────────────────────────────────────┐  │
│  │ ••••••••                            │ ✓│  ← precisa bater com Senha,
│  └─────────────────────────────────────┘  │     senão erro inline antes
│                                             │     de avançar
│                                             │
│  Endereço                                   │
│  ┌─────────────────────────────────────┐  │
│  │ Rua das Flores                      │  │
│  └─────────────────────────────────────┘  │
│  ↓ (autocomplete Google, ao selecionar)    │
│  ┌─────────────────────────────────────┐  │
│  │ Rua Das Flores, 123, Centro,        │  │
│  │ Lumiar, Nova Friburgo - RJ,         │  │
│  │ 28611-000                           │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [ ] Concordo com os Termos                │
│                                             │
│           [Próximo: Seu Serviço →]         │
│                                             │
│  Já tem conta? [Login aqui]                │
│                                             │
└─────────────────────────────────────────────┘
```

### Mudanças desta revisão:
- ✅ **Nome e Sobrenome separados** em dois campos (antes era "Nome
  Completo" junto) — ambos com auto-capitalização
- ✅ **Data de Nascimento** no formato `xx/xx/xxxx`, com ícone de
  calendário 📅 no canto do campo pra escolher a data visualmente (em vez
  de só digitar)
- ✅ **Medidor de força de senha** — barra visual (fraca/média/forte)
  aparece embaixo do campo Senha conforme a pessoa digita
- ✅ **Confirmar Senha precisa bater com Senha** — erro inline se
  diferente, não deixa avançar pro Passo 2
- 🔒 **Senha e Confirmar Senha são os campos mais sensíveis do
  formulário** — já cobertos pela checklist de segurança do projeto
  (`03_ARQUITETURA_TECNICA.md`): nunca trafegam nem ficam salvos em texto
  plano, hash bcrypt/Argon2 no backend, nunca aparecem em log nenhum,
  sempre por HTTPS. Não precisa de tratamento extra além do que já está
  documentado ali.
- ✅ **Telefone com máscara automática:** `(xx) xxxxx-xxxx`
- ✅ **Email com validação de formato**

---

### 5B - Passo 2: Seu Serviço

```
┌─────────────────────────────────────────────┐
│ ← [Voltar]       Cadastrar seu Serviço      │
├─────────────────────────────────────────────┤
│                                             │
│  Passo 2 de 2: Seu Serviço                 │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Foto Principal (obrigatória)               │
│  ┌──────────────────────────────────────┐  │
│  │        [Clique pra enviar foto]      │  │
│  │   Pode ser você, um logo, ou outra   │  │
│  │           foto (JPG, PNG · Max 5MB)  │  │
│  └──────────────────────────────────────┘  │
│  Fica no centro do card/perfil               │
│                                             │
│  Foto de Capa (opcional)                     │
│  ┌──────────────────────────────────────┐  │
│  │        [Clique pra enviar foto]      │  │
│  └──────────────────────────────────────┘  │
│  Aparece como fundo, atrás da Foto Principal │
│                                             │
│  Categoria (obrigatória)                    │
│  ┌─────────────────────────────────────┐  │
│  │ [Selecione uma categoria ▼]         │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Nome do Serviço (opcional)                 │
│  ┌─────────────────────────────────────┐  │
│  │ Motoboy João - Entrega Rápida      │  │  ← primeira letra maiúscula
│  └─────────────────────────────────────┘  │
│                                             │
│  Descrição (opcional)                       │
│  ┌─────────────────────────────────────┐  │
│  │ Entrego rapidinho por Lumiar e      │  │  ← primeira letra maiúscula
│  │ São Pedro...                        │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Instagram (opcional)                       │
│  ┌─────────────────────────────────────┐  │
│  │ @joao_moto                          │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [ ] Concordo com Termos de Prestador      │
│                                             │
│           [✓ Enviar Cadastro]              │
│                                             │
└─────────────────────────────────────────────┘
```

### Mudanças desta revisão:
- ✅ **Foto virou duas fotos:** "Foto Principal" (obrigatória, fica no
  centro do card/perfil) + "Foto de Capa" (opcional, fica como fundo
  atrás da principal) — visto no protótipo de cards da demo interativa.
  Se não tiver capa, fica só uma cor de fundo neutra atrás da foto
  principal.
- ✅ **Nome do Serviço** e **Descrição:** primeira letra sempre maiúscula
  automaticamente (ex: "motoboy joão" → "Motoboy João"; a frase da
  descrição também começa maiúscula, mesmo que a pessoa digite tudo
  minúsculo)
- ❌ **Galeria de fotos removida deste formulário.** Depois de enviar o
  cadastro, a pessoa cai direto na **tela do próprio serviço** (a mesma
  estrutura da tela 4️⃣, mas em "modo dono") — e é **lá** que existe a
  opção de adicionar fotos à galeria, não durante o cadastro inicial. Isso
  deixa o formulário de cadastro mais curto, e a galeria vira parte da
  gestão contínua do perfil (pode adicionar fotos quando quiser depois,
  não só no dia do cadastro).

---

## 6️⃣ PÓS-CADASTRO: TELA DO PRÓPRIO SERVIÇO (modo dono)

Nova tela — pra onde a pessoa vai logo após enviar o cadastro (ou sempre
que acessar "Meus Serviços" no Perfil).

```
┌─────────────────────────────────────────────┐
│ ← [Voltar]                                  │
├─────────────────────────────────────────────┤
│                                             │
│     ┌───────────────────────────────┐      │
│     │ (foto de capa, se tiver)      │      │
│     │        ┌─────────┐            │      │
│     │        │ [Foto   │            │      │
│     │        │Principal]│           │      │
│     │        └─────────┘            │      │
│     └───────────────────────────────┘      │
│  [📷 Trocar capa]    [📷 Trocar principal]  │  ← botões separados,
│               João                          │     perto da foto,
│                                             │     não sobrepostos
│  ⏳ Status: Pendente de aprovação           │
│  (some quando o admin aprovar)              │
│                                             │
├─────────────────────────────────────────────┤
│  INFORMAÇÕES                    [✏️ Editar] │
│  ─────────────────────────────────────────  │
│  📍 Lumiar, São Pedro da Serra              │
│  📞 (21) 98765-4321                         │
│  🏷️ Motoboy                                 │
│  [📷] @joao_moto                            │
│                                             │
├─────────────────────────────────────────────┤
│  GALERIA DE FOTOS (até 5)       [+ Adicionar]│
│  ─────────────────────────────────────────  │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ [Foto] │ │ [Foto] │ │   +    │          │
│  │  1/5   │ │  2/5   │ │Adicionar│          │
│  └────────┘ └────────┘ └────────┘          │
│                                             │
├─────────────────────────────────────────────┤
│  Prévia de como aparece pro público:        │
│  [Ver perfil público →]                     │
│                                             │
├─────────────────────────────────────────────┤
│  🏠 Home    🔍 Buscar   🔧 Úteis   ☰ Perfil│
└─────────────────────────────────────────────┘
```

### Notas:
- Essa é a tela que a pessoa vê **depois** de completar o cadastro (Passo
  2), e sempre que quiser editar seu serviço depois
- **Galeria vive aqui**, não no formulário de cadastro
- Mostra status "Pendente" até o admin aprovar
- Acesso recorrente: pelo **Perfil** (ver seção 7)
- ✅ **Correção:** Instagram estava faltando nesta tela (bug meu, não é
  que "não coubesse") — adicionado junto das outras informações
- ✅ **Correção:** barra de navegação estava faltando nesta tela (bug
  meu) — sem ela não tinha como chegar no Menu/Perfil (onde fica
  "Sobre o App", Termos, etc.) a partir daqui. Adicionada.
- ✅ **Simplificado de 3 "Editar" pra 1:** antes tinha um Editar genérico
  no topo, um pra Informações, e um pro Instagram — redundante. Agora:
  **trocar foto** virou dois botões (capa e principal, já que são duas
  fotos separadas), ambos logo abaixo da composição de foto (perto, mas
  **não sobrepostos**), e **editar as informações** (telefone, categoria,
  Instagram etc.) é um botão só, na seção Informações.

---

## 7️⃣ MENU (deslogado) vs. PERFIL (logado com serviço)

### 7A - MENU (pessoa sem login, ou logada mas sem serviço cadastrado)

```
┌─────────────────────────────────┐
│  MENU                    [x]    │
├─────────────────────────────────┤
│                                 │
│  👤 Fazer Login                 │
│  ➕ Cadastrar Serviço            │
│                                 │
│  ⚙️  Configurações               │
│     └─ 🌙 Tema: [Claro|Escuro] │
│     └─ 🌍 Idioma: [🇧🇷|🇺🇸]      │
│                                 │
│  📱 Adicionar à Tela Inicial    │
│                                 │
│  💡 Enviar Sugestão             │
│  ℹ️  Sobre o App                 │
│                                 │
└─────────────────────────────────┘
```

### 7B - PERFIL (pessoa logada e com pelo menos 1 serviço cadastrado)

O mesmo espaço (mesmo botão na barra de baixo) muda de nome e conteúdo:

```
┌─────────────────────────────────┐
│  PERFIL                  [x]    │
├─────────────────────────────────┤
│                                 │
│  [Foto]  João da Silva          │
│          [Editar meus dados]    │  ← nome, telefone, email,
│                                 │     endereço, senha
│  MEUS SERVIÇOS                  │
│  ┌─────────────────────────┐   │
│  │ 🏍️ Motoboy João          │   │
│  │ ⏳ Pendente              │   │
│  └─────────────────────────┘   │
│                                 │
│  [+ Adicionar outro serviço]   │
│                                 │
│  ⚙️  Configurações               │
│     └─ 🌙 Tema: [Claro|Escuro] │
│     └─ 🌍 Idioma: [🇧🇷|🇺🇸]      │
│                                 │
│  📱 Adicionar à Tela Inicial    │
│                                 │
│  💡 Enviar Sugestão             │
│  ℹ️  Sobre o App                 │
│  🚪 Sair                        │
│                                 │
└─────────────────────────────────┘
```

### 7C - ENVIAR SUGESTÃO (novo)

```
┌─────────────────────────────────────────────┐
│ ← [Voltar]           Enviar Sugestão         │
├─────────────────────────────────────────────┤
│                                             │
│  Sobre o que é?                             │
│  ┌─────────────────────────────────────┐  │
│  │ [Sugestão geral ▼]                  │  │
│  │  • Sugestão geral                   │  │
│  │  • Lugar                            │  │
│  │  • Reportar um problema             │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Conta aqui embaixo:                        │
│  ┌─────────────────────────────────────┐  │
│  │  Ex: "Seria legal ter um filtro     │  │  ← placeholder de exemplo
│  │  por bairro na busca..."            │  │
│  │                                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [SE DESLOGADO — mostra este campo:]       │
│  Email (opcional, se quiser resposta)      │
│  ┌─────────────────────────────────────┐  │
│  │                                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [SE LOGADO — não mostra campo de email,   │
│   usa o email da conta automaticamente]    │
│                                             │
│              [Enviar Sugestão]              │
│                                             │
└─────────────────────────────────────────────┘
```

### Notas:
- Vai direto pro seu email/painel (implementação simples — insert numa
  tabela `sugestoes` no Supabase, sem precisar de sistema de suporte
  completo)
- **Se a pessoa já está logada, não precisa perguntar o email de novo** —
  o sistema já sabe qual é (usa o da conta automaticamente, sem mostrar o
  campo). Só pergunta email pra quem está navegando sem conta.
- ✅ **Dropdown de categoria adicionado** — inclui "Lugar", categoria
  simples pra indicar um lugar/prestador que a pessoa conhece
- Placeholder do campo de texto dá um exemplo do tipo de coisa que pode
  mandar (ajuda a pessoa a entender o que escrever)
- Acessível tanto pelo Menu (deslogado) quanto pelo Perfil (logado)

### Notas desta revisão:
- ✅ **Mesmo espaço, muda de nome e conteúdo** dependendo se a pessoa tem
  login/serviço: "Menu" (visitante) vira "Perfil" (dono de serviço)
- ✅ Tudo que existe no Menu **também existe no Perfil** (Configurações,
  tema, idioma, adicionar à tela inicial, sobre) — o Perfil só adiciona
  por cima: foto+nome, lista "Meus Serviços", e botão de adicionar mais
  um serviço (uma pessoa pode ter mais de um, ex: motoboy E dono de loja)
- ✅ **"Adicionar à Tela Inicial" também mora aqui** — junto com o resto
  das configurações, não só no onboarding
- ✅ **"Sobre o App" contém Termos de Uso e Política de Privacidade** —
  esse item do menu abre uma tela com esses dois links (ver seção 1️⃣2️⃣
  pra entender por quê fica aqui e não num "rodapé" tradicional)
- ❌ **Email removido da tela de Perfil** — email é dado privado (já
  estava definido assim em `02_ESCOPO_MVP_ATUAL.md`, item 11 — nunca
  público), não precisa nem aparecer pro próprio dono aqui, já que ele já
  sabe qual é o email dele
- ✅ **"Editar meus dados" adicionado** — a pessoa pode editar seus dados
  de conta (nome, sobrenome, telefone, email, endereço, senha) direto do
  Perfil. Isso é diferente de editar um serviço específico (que fica na
  tela do próprio serviço, seção 6️⃣) — dados de conta são uma coisa,
  dados de cada serviço são outra

---

## 8️⃣ ADMIN DASHBOARD

```
┌─────────────────────────────────────────────┐
│  ⚙️  ADMIN           [Logout]               │
├─────────────────────────────────────────────┤
│                                             │
│  PENDÊNCIAS (7)                             │
│  ─────────────────────────────────────────  │
│  [Filtrar: Categoria ▼]                    │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ João da Silva                        │  │
│  │ Categoria: Motoboy                   │  │
│  │ Nascimento: 15/03/2010 (16 anos)     │  │
│  │ ⚠️ MENOR DE IDADE — revisar          │  │
│  │ Endereço: Rua X, Lumiar              │  │
│  │ ✓ Endereço dentro da área            │  │
│  │                                      │  │
│  │ [ Ver Foto ] [ Mensagem ] [ 📍 Mapa]│  │
│  │ [ ✓ Aprovar ]  [ ✗ Rejeitar ]       │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  [Carregar mais...]                        │
│                                             │
├─────────────────────────────────────────────┤
│  APROVADOS (42)                             │
│  Busca: [ joao ]   [Filtro: Categoria ▼]   │
│                                             │
├─────────────────────────────────────────────┤
│  [+ Criar novo perfil]                     │
│                                             │
├─────────────────────────────────────────────┤
│  STATUS: 42 ativos · 3 novas em 24h        │
└─────────────────────────────────────────────┘
```

### Mudança desta revisão:
- ❌ **Removido o texto explicativo** que estava dentro do wireframe
  ("Você pode criar QUALQUER tipo de perfil direto..."). Aquilo era nota
  de documentação minha, não texto pra aparecer no app — o botão em si
  ("+ Criar novo perfil") já é autoexplicativo pra você como admin. A
  explicação completa do que esse botão faz fica só aqui no documento,
  não na interface.

---

## 9️⃣ ONBOARDING (Primeira Visita / Modal — PWA)

```
┌─────────────────────────────────────────────┐
│                                             │
│    Bem-vindo ao app Lumiar e São Pedro     │
│              da Serra! 🎉                   │
│                                             │
│         Seu app local de serviços           │
│                                             │
│     ┌─────────────────────────────┐       │
│     │  🔍 Buscar serviços          │       │
│     └─────────────────────────────┘       │
│     ┌─────────────────────────────┐       │
│     │  ➕ Oferecer seu serviço     │       │
│     └─────────────────────────────┘       │
│                                             │
│  ───────────────────────────────────────  │
│  💡 Dica: adicione à tela inicial do seu   │
│  celular pra acessar rapidinho!            │
│     [📱 Como adicionar à tela inicial]     │
│                                             │
│            [Entendi, começar]              │
│                                             │
└─────────────────────────────────────────────┘
```

### Mudanças desta revisão:
- ✅ **"Adicionar à Tela Inicial" continua no onboarding** — e também
  passou a existir na Home (seção 1️⃣) e no Menu/Perfil (seção 7), pra
  ficar sempre fácil de achar, não só na primeira visita
- ❌ **Removida a menção ao anúncio** — não precisa aparecer logo na
  primeira visita; ele já está disponível na Home e na aba Úteis pra
  quem quiser usar depois

---

## 🔟 "ADICIONAR À TELA INICIAL" — lógica completa de detecção

Você fez 3 perguntas boas sobre isso — respondendo cada uma:

### 1. Dá pra saber o sistema/navegador?

Sim — mas a forma certa de fazer isso é **checar se aquele navegador
específico tem a função de instalação disponível** (feature detection),
em vez de simplesmente perguntar "o nome dele é Chrome?". Essa diferença
resolve exatamente os dois problemas que você levantou:

### 2. E se eu fizer o botão só pra Chrome e a pessoa estiver no Edge?

Não dá ruim — porque o Edge é construído em cima do mesmo motor do Chrome
(Chromium), e por isso **também** oferece essa função de instalação com 1
clique. Se a checagem for "esse navegador tem a função de instalar?" (em
vez de "o nome dele é literalmente Chrome?"), o Edge passa no teste
automaticamente, sem precisar prever cada navegador manualmente.

### 3. E se a pessoa estiver no iPhone usando Chrome ou Edge (não Safari)?

Você identificou certo: a dica "toque em Compartilhar → Adicionar à Tela
de Início" **é específica do Safari** e não existe da mesma forma no
Chrome/Edge quando rodando em iPhone (regra da Apple: todo navegador no
iOS usa o motor do Safari por baixo, mas só o app Safari em si expõe essa
opção no menu). Nesse caso, a lógica certa é:

```
SE sistema = iOS E navegador ≠ Safari:
   Mostra: "Pra adicionar à tela inicial, abra este link
            no Safari" (com botão de copiar o link)

SE sistema = iOS E navegador = Safari:
   Mostra o passo a passo normal (Compartilhar → Adicionar)

SE navegador suporta instalação nativa (Android/Chrome/Edge/etc):
   Mostra o botão de 1 clique
```

### 4. Dá pra saber se a pessoa já adicionou, pra parar de oferecer?

Sim, na prática funciona bem: quando alguém abre o app **a partir do
ícone que ela adicionou na tela inicial**, o navegador informa que está
rodando em "modo instalado" (diferente de estar aberto numa aba normal).
O app usa essa informação pra **esconder automaticameante** a sugestão de
instalação nesses casos. Não é 100% infalível pra todo cenário possível,
mas cobre o caso principal: uma vez instalado, a pessoa não vê mais a
sugestão quando abre pelo ícone.

### Resumo da lógica final

```
App detecta, nesta ordem:
1. Já está rodando em modo instalado? → não mostra nada
2. Navegador suporta instalação nativa? → botão de 1 clique
3. É iPhone + não é Safari? → "abra no Safari pra instalar"
4. É iPhone + é Safari? → passo a passo Compartilhar → Adicionar
5. Nenhum dos casos acima? → não mostra a sugestão (navegador
   desktop antigo, por exemplo, onde isso não faz sentido)
```

---

## COMPONENTES REUTILIZÁVEIS (atualizado)

```
BOTÃO WHATSAPP (primário)
┌──────────────────────────────┐
│  💬 Chamar no WhatsApp       │
└──────────────────────────────┘

CARD DE SERVIÇO
┌──────────────────────────────────┐
│ [Foto]    Nome                   │
│           Categoria              │
│           "Desc curta"           │
│           [WhatsApp →]           │
└──────────────────────────────────┘

CARD DE CATEGORIA
┌───────────────┐
│    [ícone]    │  ← placeholder no sketch;
│    Motoboy    │     versão final usa icon set
└───────────────┘     próprio, não emoji

INPUT COM MÁSCARA (telefone)
┌─────────────────────────────┐
│ Telefone                     │
│ ┌───────────────────────┐   │
│ │ (21) 98765-4321       │ ✓ │  ← formata sozinho
│ └───────────────────────┘   │
└─────────────────────────────┘

INPUT COM AUTOCOMPLETE (endereço)
┌─────────────────────────────┐
│ Endereço                     │
│ ┌───────────────────────┐   │
│ │ Rua das Flores        │   │
│ └───────────────────────┘   │
│  ▾ Rua das Flores, Lumiar   │
└─────────────────────────────┘
Ao selecionar: preenche formatado automaticamente.
```

---

## SESSÃO / LOGIN PERSISTENTE

Login fica salvo automaticamente entre visitas (cookie seguro + refresh
token via Supabase Auth) — sem precisar logar de novo toda vez. Só some
com logout manual, limpeza de dados do navegador, ou muitos meses de
inatividade.

---

## RESPONSIVIDADE

Breakpoints CSS por largura de tela (não por modelo de celular):
Mobile (até 640px) → 1 coluna · Tablet (640-1024px) → 2 colunas ·
Desktop (1024px+) → 3-4 colunas. Já coberto pela stack (Next.js +
Tailwind), mobile-first por padrão.

---

## DESIGN SYSTEM — ✅ Aprovado

```
PRIMARY:    Verde-azulado profundo   #0F6E5C
SECONDARY:  Terracota suave          #C97B4A
NEUTRAL:    Cinza-pedra #4A4A48 (texto) / Bege-claro #F5F3EF (fundo)
SUCCESS:    Verde WhatsApp #25D366 (reservado só pro botão)
ERROR:      Vermelho-terracota #B4442E
TIPOGRAFIA: Inter (headings + body)
ESPAÇAMENTO: múltiplos de 8px
```

---

## 1️⃣1️⃣ ANÚNCIOS (ADS) — abordagem inicial

Você quer ir testando, sem exagerar. Proposta de abordagem gradual:

```
FASE 1 (lançamento):
✅ Botão "Ver Anúncio" voluntário — vive na aba Úteis (não mais na Home,
   ver seção 1️⃣ e 2️⃣.5)
   Mensagem: "ajudar a manter o app no ar"
   Recompensa opcional: nenhuma por enquanto (é doação de atenção,
   não troca por benefício — mais simples de implementar e testar)

FASE 2 (depois de validar Fase 1):
🔲 Banner discreto em ALGUMAS páginas de serviço (não todas)
   Testar: taxa de cliques, reclamações, se atrapalha a leitura
🔲 Rotação: nem todo serviço mostra anúncio, ex: 1 a cada 3-4 visualizações
```

**Minha sugestão:** começar só com o botão voluntário (Fase 1), medir se
as pessoas usam, e só depois decidir se vale a pena adicionar banners
passivos.

### Sobre "podia ser Instagram Ads ou Facebook Ads também?"

Vale separar dois conceitos diferentes, que resolvem problemas opostos:

```
REDE DE ANÚNCIOS DENTRO DO APP (ex: Google AdSense)
→ Anúncios de terceiros aparecem NO Lumiar
→ Você GANHA dinheiro com isso
→ É monetização

INSTAGRAM ADS / FACEBOOK ADS
→ Você PAGA pra divulgar o Lumiar DENTRO do Instagram/Facebook
→ Não gera receita — é custo de marketing
→ É aquisição de usuários novos, não monetização
```

Os dois podem coexistir (um pra ganhar dinheiro dentro do app, outro pra
atrair gente nova de fora), mas não são a mesma ferramenta. O Instagram
não oferece uma "rede de anúncios pra embutir dentro de outro app" do
jeito que o AdSense faz — então pra monetizar dentro do Lumiar, a opção
realista continua sendo AdSense (ou similar). Pra divulgar o Lumiar,
campanha no Instagram/Facebook é uma ótima ideia de lançamento local.

> 📌 Pendência: escolher qual rede de anúncios usar pra monetização
> dentro do app (Google AdSense é o mais comum, mas Lumiar é pequeno —
> pode não qualificar tráfego suficiente no início). Ver
> `08_PENDENCIAS_ABERTAS.md`.

---

## 1️⃣2️⃣ TERMOS DE USO E POLÍTICA DE PRIVACIDADE — onde ficam

Correção importante: eu tinha chamado isso de "Rodapé" antes, mas isso
estava conceitualmente errado pro formato do app. **"Rodapé" é um padrão
de site tradicional** (scroll até o fim da página) — este é um app
mobile-first com barra de navegação fixa embaixo, então não existe um
"fim da página" pra colocar rodapé em cada tela.

**Onde ficam de verdade:** dentro do **Menu/Perfil** (seção 7) — é o
equivalente mobile de rodapé. Se um dia existir uma versão desktop mais
larga, aí sim cabe um rodapé de verdade no fim da página.

```
MENU / PERFIL (mobile — já existe, ver seção 7):
  ℹ️  Sobre o App
      └─ Termos de Uso
      └─ Política de Privacidade

DESKTOP (só se/quando existir uma versão web mais larga):
┌─────────────────────────────────────────────┐
│  ─────────────────────────────────────────  │
│  App Lumiar e São Pedro da Serra            │
│  Termos de Uso · Política de Privacidade    │
│  © 2026                                     │
└─────────────────────────────────────────────┘
```

### O que precisa existir (não é decisão de design, é requisito):

- ✅ **Política de Privacidade** — documento próprio, explicando o que
  coleta, pra quê usa, como armazena, e os direitos da pessoa (acessar,
  corrigir, apagar seus dados) — ainda não escrito, precisa ser criado
- ✅ **Termos de Uso** — o texto que o checkbox do cadastro referencia,
  também ainda não escrito
- ⚠️ **Atenção especial — dados de menores:** como agora menores podem
  enviar cadastro (mesmo que fiquem pendentes), a LGPD tem regras
  específicas pra tratamento de dados de crianças/adolescentes (Art. 14),
  que geralmente exigem consentimento de um responsável. **Isso não é
  algo que eu, como IA, deveria decidir por você** — recomendo uma
  consulta jurídica rápida antes do lançamento, especificamente sobre
  esse ponto. Não é aconselhamento jurídico o que estou dando aqui, só
  sinalizando o risco.

> 📌 Pendência: escrever Política de Privacidade e Termos de Uso. Ver
> `08_PENDENCIAS_ABERTAS.md`.

---

## PRÓXIMOS PASSOS

1. Validar com prestadores reais se quiser
2. Design handoff + `CLAUDE.md`
