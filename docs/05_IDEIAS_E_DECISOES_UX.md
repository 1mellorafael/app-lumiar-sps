> Nota: as perguntas de UX que geraram as "Decisões de UX (Consolidadas)"
> abaixo estavam antes num documento separado de análise lado-a-lado
> (prós/contras de cada opção). Esse documento de análise foi arquivado —
> as decisões finais já estão todas aqui, é o que vale.

# 💡 IDEIAS & BRAINSTORM - APP DE LUMIAR

**O que é:** Ideias criativas, não compromissadas. Brainstorm puro. Pode ser maluca, pode ser boa, pode ser descartada depois.  
**Quando usar:** Antes de wireframes, durante desenvolvimento, quando tiver inspiration  
**Como funciona:** Você adiciona ideia → Eu lembro quando relevante → Alertamos conflitos  

---

## 📱 NAVEGAÇÃO

### Ideia 1: Bottom Tab Navigation
```
[Casa] [Buscar] [Notícias] [Perfil]
```
- **Descrição:** Simples, móvel-friendly, clássico
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Testar com wireframes

### Ideia 2: Breadcrumb + Back Button
```
Lumiar > Serviços > Motoboy > João Silva (voltar)
```
- **Descrição:** Usuário sabe sempre onde tá
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Bom pra desktop, opcional mobile

### Ideia 3: Floating Action Button (FAB)
```
Botão flutuante na direita
[+] → Abre menu (novo post, novo serviço, etc)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Material Design classic, bom pra ações rápidas

---

## 🎨 UI/DESIGN

### Ideia 1: Cores Quentes (Laranja/Vermelho)
```
Primary: #FF6B35 (laranja queimado)
Secondary: #F7931E (laranja)
Neutral: #333333, #F5F5F5
```
- **Descrição:** Quente, energético, bom contraste
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Teste durante design system

### Ideia 2: Cores Frias (Azul/Verde)
```
Primary: #00B4D8 (azul água)
Secondary: #00A676 (verde fresco)
```
- **Descrição:** Confiança, natureza, calma
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Alternativa se quiser vibe diferente

### Ideia 3: Status Online com Animação
```
Ponto verde piscante no avatar do prestador
Significa: "online agora"
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Mais óbvio que ícone estático

### Ideia 4: Card do Prestador com Hover
```
Hover: Sombra aumenta + botão "Ligar" fica visível
Click: Expande pra detalhe
Swipe: Próximo prestador (mobile)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Interatividade sem ser intrusiva

### Ideia 5: Badge de Verificação Especial
```
✓ Verificado (simples)
🏆 Top Prestador (5 stars + 10+ reviews)
⚡ Responde Rápido (60s average response)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Gamification leve

---

## ⚙️ FUNCIONAMENTO

### Ideia 1: Filtro Inteligente na Busca
```
[Categoria] [Ordenar: Rating/Online/Preço] [Filtros+]
├─ Filtro avançado: horário, distância (depois geoloc)
└─ Salvar buscas favoritas
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** MVP: só ordenar. v1.2: filtros avançados

### Ideia 2: One-Click Call (WhatsApp Web)
```
Clica em "Ligar" → Abre WhatsApp web com mensagem pré-pronta
"Oi, achei você no app Lumiar. Você tá disponível?"
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Já mapeado no plano. Implementar early

### Ideia 3: Chat Bubble Animado
```
Quando usuário chega na homepage:
"Olá! Procurando um serviço? 👋"
Fecha se clica ou inicia busca
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Tutorial interativo, legal pra onboarding

### Ideia 4: Histórico de Buscas
```
Mostra últimas 5 buscas
"Você procurou: Motoboy, Encanador, Adestrador"
Clica pra repetir busca
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** UX melhora muito. LocalStorage + Supabase

### Ideia 5: Recomendação Contextual
```
Se tá no feed de notícias sobre encanador:
"Procurando encanador? [Sim] [Não]"
Redireciona pra busca de encanador
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** v1.2+, need tracking

### Ideia 6: Dark Mode Toggle
```
Sol/Lua no header
Salva preferência no localStorage
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Nice-to-have. MVP: não. v1.1: sim

---

## 💰 MONETIZAÇÃO (Criatividade, não compromisso)

### Ideia 1: Botão "Ver Ad pra Ajudar" ⭐ (NOVA)
```
[Ajude a manter o app] [Ver anúncio 30s]
Usuario clica → vê ad → ganha nada mas app lucra
Opcional, não obrigado
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** UX-friendly, usuário não se sente explorado
- **Impacto:** +R$ 10-20/mês se 20% clica
- **Conflita com?** Nenhuma ideia ainda

### Ideia 2: Ad Obrigatório 1x por Dia ⚠️ (NOVA)
```
Usuário abre app:
[Aviso] "Veja um anúncio de 1 minuto pra continuar"
[Iniciar ad] → Assiste → [Pronto, continue]

Ou: Random, aparece após 3 buscas
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Mais agressivo, pode irritar
- **Impacto:** +R$ 50-100/mês
- **Conflita com?** Ideia 1 (são estratégias diferentes)

### Ideia 3: Promoted Listing (Prestador paga) ⭐
```
Prestador paga R$19/mês
Aparece em destaque na busca
Ou: Destaque só entre "Online Agora"
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Já mapeado no plano. Low friction, high value
- **Impacto:** +R$ 200-500/mês (5-10 prestadores @ R$50)

### Ideia 4: Badge Premium (Futuro)
```
Cliente paga R$29/mês
├─ Sem ads
├─ Salva favoritos
├─ Histórico de contatos
└─ Acesso a relatórios (what he spent on services)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** v2.0+, só se app crescer muito
- **Impacto:** Desconhecido ainda

### Ideia 5: Affiliate Links (Produtos)
```
Feed de notícias: "Ração X em promoção"
Link Hotmart/Shopify → app ganha 10-30%
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Requer marketplace ou parceria
- **Impacto:** +R$ 50-200/mês se 2-5 pessoas clica

---

## 🎮 GAMIFICATION (Ideias Criativas)

### Ideia 1: Rating em Tempo Real
```
Após chamar prestador, app notifica:
"Avalie o atendimento de João"
⭐⭐⭐⭐⭐
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Já planejado. Push notification é key

### Ideia 2: Streak (Consistência)
```
Prestador ativa "disponível" 5 dias seguidos:
🔥 5-day streak (badge no perfil)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Gamification leve, encoraja uso

### Ideia 3: Badges Temáticas
```
🌟 First Review (primeira avaliação)
🚀 Speed Demon (responde em <30s)
💯 Perfect Record (5 stars, 20+ reviews)
🌱 Rising Star (novo mas bom rating)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Motivação visual

### Ideia 4: Leaderboard (Talvez)
```
Top 10 Prestadores da Semana
├─ Por rating
├─ Por número de atendimentos
└─ Por velocidade de resposta
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** ⚠️ Pode gerar competição prejudicial
- **Conflita com?** Comunidade local, precisa cuidado

### Ideia 5: Achievement Unlock (Usuário Cliente)
```
Você procurou 5 prestadores diferentes: 🏆 Explorer
Você avaliou 3 serviços: 🌟 Trusted Reviewer
Você voltou 10x: 🔄 Loyal
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Gamification pura, sem impacto real

---

## 📢 NOTIFICAÇÕES & COMUNICAÇÃO

### Ideia 1: Push Notification Inteligente
```
Prestador online? Notify (opcional)
Novo post no feed? Notify (opcional)
Seu prestador favorito voltou? Notify
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** v1.2+. Preferências no settings

### Ideia 2: Email Semanal
```
Todo domingo às 18h:
"Esta semana em Lumiar:"
├─ Novos serviços
├─ Promoções
└─ Eventos próximos
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Opt-in. Ótimo pra re-engagement

### Ideia 3: In-App Toast Notifications
```
"João X marcou como favorito"
"Novo prestador em sua área"
"Alerta: Loja fecha em 30min"
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Sonner.js fácil implementar

---

## 🔐 SEGURANÇA & CONFIANÇA

### Ideia 1: Selo de Verificação Visual
```
✓ Verificado (email + tel confirmados)
🆔 ID Confirmada (admin verificou documento)
🏪 Negócio Registrado (CNPJ válido)
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Crucial pra confiança

### Ideia 2: Relatório de Fraude
```
[Reportar] botão no perfil do prestador
Razão: Não veio, abusivo, falso número, etc
Admin revisa
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Sistema de moderation

### Ideia 3: Historico de Contatos (Cliente)
```
Cliente vê: "Você chamou João 3x"
Data, hora, avaliou? Sim/Não
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Privado só pra cliente. Premium depois?

---

## 📊 ANALYTICS & INSIGHTS (Futuro)

### Ideia 1: Meu Relatório (Prestador)
```
Dashboard:
├─ Chamadas: 23 este mês
├─ Rating médio: 4.8 ⭐
├─ Horário mais ativo: 14-18h
└─ Gráfico de tendência
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** v1.2+. Motivação visual

### Ideia 2: Market Insights (Cliente)
```
"Motoboys em Lumiar costumam cobrar R$ 15-25/km"
"Encanadores respondem em ~30 minutos"
```
- **Status:** 💭 Brainstorm
- **Adicionada:** 2026-08-13
- **Notas:** Anônimo, agregado

---

## 📝 IDEIAS DESCARTADAS (POR QUÊ)

*Vazio por enquanto. Quando descartamos algo, documenta aqui.*

---

## ⚠️ IDEIAS CONFLITANTES (RESOLVIDAS)

### ✅ Decisão 1: Ad Obrigatório vs Experiência Limpa

**Escolhido:** Ideia A - Botão "Ver Ad pra Ajudar" (opcional)  
**Por quê:** UX limpa, não força usuário, comunidade pequena valoriza confiança  
**Status:** ✅ DECIDIDO  

---

### 🎯 DECISÕES DE UX (Consolidadas - 2026-08-13)

**Onboarding:**
- ✅ SEM tutorial (simples, direto)
- ✅ SEM dropdown prestador/cliente no cadastro
- ✅ Todos começam como clientes
- ✅ Dentro do app: "Virar prestador?" → novo formulário

**Loading:**
- ✅ Skeleton screens (moderno, rápido perceptualmente)
- ✅ App super responsivo (velocidade é prioritária)

**Feedback Visual:**
- ✅ Instantâneo (otimistic update)
- ✅ Toast + icon change instantaneamente

**Busca:**
- ✅ Dropdowns simples MVP (Categoria + Ordenar)
- ✅ Escalável pra filtros depois

**Social Proof:**
- ✅ ⭐ Só Rating (não dá rastrear tempo - comunicação é via WhatsApp fora do app)

**Empty State:**
- ✅ Orientador (não deixa perdido)
- ✅ "Ative notificações" + "Procure outra categoria"

**Feed:**
- ✅ Load More Button (não infinite scroll)
- ✅ Respeita usuário

**Undo/Redo:**
- ✅ 5 segundos em toast

**Favoritos:**
- ✅ ⭐ Estrela (familiar, intuitivo)
- ⚠️ Nota: Favoritar foi tirado do escopo do V0 (ver `02_ESCOPO_MVP_ATUAL.md`).
  Essa decisão de ícone fica guardada pra quando a feature voltar.

**Rating:**
- ✅ Push notification (não intrusive)
- ✅ 2-3 horas depois do atendimento
- ⚠️ Nota: se avaliação entra no V0 ainda está pendente de confirmação
  (ver `08_PENDENCIAS_ABERTAS.md`). Essa decisão de UX vale quando a
  feature for implementada, seja no V0 ou depois.

---

## 📅 PRÓXIMAS BRAINSTORMS

*Adiciona aqui quando tiver nova sessão*

- **Data planejada:** Depois dos wireframes
- **Foco:** Refinamento de ideias já existentes
- **Convite:** Feedback de beta testers

---

## 🎮 IDEIA NOVA (14/08) — Aba de Jogos com Desafios Diários

Brainstorm de hoje, ainda **não é decisão de escopo**, é ideia pra
amadurecer:

**O que é:** aba de jogos estilo NYT Games / Term.ooo (Wordle em
português) / palavras cruzadas — desafios diários, temas relacionados a
Lumiar e São Pedro da Serra (nomes de lugares, história local, natureza da
região).

**Possíveis ganchos de produto:**
- Pode ter níveis de dificuldade
- Geração de conteúdo via IA/agente (novo desafio todo dia,
  automatizado — reduz trabalho manual de manter isso)
- **Mais espaço pra anúncios** — jogos costumam ter boa tolerância a
  anúncio (ex: "veja um anúncio pra jogar de novo", comum em apps de
  puzzle)

**Decisão (14/08, rodada 4) sobre login/ads no jogo:**
- ✅ **Jogo sempre grátis, sem exigir login pra jogar** — maximiza quem
  experimenta, especialmente público mais velho que talvez nunca tenha
  jogado algo assim
- ✅ **Login serve pra salvar sequência de dias jogados (streak) e
  sincronizar entre aparelhos** — conecta com a pendência de incentivo de
  cadastro/login voluntário (ver `08_PENDENCIAS_ABERTAS.md`)
- 🔲 **Em aberto:** se o anúncio deve ou não sumir pra quem está logado
  (como um "prêmio" por criar conta). Ainda não decidido — avaliar depois
  de ter uso real pra ver se faz diferença no incentivo.

**Escala do esforço:** isso é uma feature própria, não um ajuste pequeno —
teria conteúdo (banco de palavras/desafios locais), lógica de jogo, e
manutenção contínua (mesmo automatizada). Não é V0. Sugestão: mapear como
possível Fase 2 ou 3 no `06_VISAO_LONGO_PRAZO.md`, depois que o
diretório básico estiver rodando e validado com usuários reais.

---

## 🏃 IDEIA NOVA (14/08, rodada 5) — Leaderboard de Corrida (KMs acumulados)

Brainstorm: ranking onde as pessoas acumulam quilômetros corridos, tipo
um "placar" comunitário. **É viável, com dois caminhos de complexidade
bem diferentes:**

```
CAMINHO A — Manual (mais simples):
├─ Pessoa registra ela mesma quantos KMs correu
├─ App soma o total e ranqueia
├─ Fácil de construir
└─ Depende de a pessoa lembrar de registrar (menos confiável)

CAMINHO B — Integração automática (mais complexo):
├─ Conecta com Strava, Apple Health, ou Google Fit
├─ Dados de corrida vêm automaticamente, sem a pessoa digitar nada
├─ Mais confiável e menos fricção pro usuário
└─ Exige autenticação OAuth com serviço externo + manutenção contínua
   dessa integração
```

**Escala do esforço:** parecida com a ideia dos Jogos — feature própria,
não é ajuste pequeno. O Caminho A é bem mais rápido de construir que o B.
Mesma lógica de "Fase 2/3, depois do diretório validado" se aplica aqui.
Pode inclusive conectar com incentivo de login (ranking só faz sentido
com conta).

---

## 🏘️ IDEIA NOVA (16/08) — Módulo Comunidade (Alerta, Pede Aí, Pet Perdido, Jornal, Selo)

Sessão longa de brainstorm com pesquisa na internet (Nextdoor, Vizinhos
App, Front Porch Forum, Colab, Patch.com, CEMADEN, INPE Queimadas).
Resultado: um módulo inteiro novo, priorizado ANTES de Turismo (ver
`06_VISAO_LONGO_PRAZO.md` pro roadmap atualizado). Resumo das peças:

**Alerta** — Defesa Civil (chuva/deslizamento, fonte: CEMADEN GeoRisk,
previsão até 72h) + risco de incêndio (fonte: INPE Queimadas, dados
abertos, atualização a cada 10min-3h desde 1998) + override manual do
admin sempre disponível. Motivação: Nova Friburgo tem alerta real de
risco moderado de deslizamento registrado em dez/2025, e histórico
trágico de encosta na região — nenhum concorrente genérico oferece
isso hiperlocal.

**Pede Aí** — mural de pedido reverso ("preciso de alguém pra X"),
formato LISTA (pesquisa de UX confirma: lista é melhor pra
busca/ação, card é melhor pra navegação/descoberta — Pede Aí é ação).
Reaproveita o `ViewToggle` que já existe no app, sem inventar estética
nova de "classificados" (risco de ficar datado/tosco).

**Pet Perdido** — dividido em duas partes: (1) card normal dentro do
feed, mesmo visual do resto do app; (2) botão "Gerar Cartaz" que
exporta uma imagem estilo panfleto de poste (alto contraste, foto
grande, "DESAPARECIDO"), inspirado na parceria real Nextdoor+PawBoost —
resolve o desejo de estética "colado no poste" sem forçar isso na UI
principal do app.

**Jornal/Colunas** — conteúdo 100% local, curadoria delegável (não só
o admin escreve). Regra dura, baseada no caso Patch.com: nunca agregar
notícia genérica do mundo solta — se um colunista comentar algo do
mundo, é sempre pela lente local. Diferença Alerta vs. Notícia: o
critério é URGÊNCIA (alerta = ação imediata, curta duração, sempre no
topo; notícia = informativo, pode ser resumo/digest, vida mais longa).

**Selo "Verificado pela comunidade"** — botão no perfil do prestador
("eu conheço, confirmo"), contador, badge automático ao bater um
mínimo. Inspirado em "Compra Verificada" da Amazon — binário, não é
nota de 1 a 5.

**Curadoria distribuída** — colunista (Jornal), curador de ônibus
(horários), curador de alertas — papéis de permissão mais leves que
admin completo, reaproveitando o mesmo fluxo PENDENTE→APROVADO já
usado pra prestador.

**Arquitetura aberto/fechado** — Serviços fica aberto (como já é hoje).
Comunidade fica atrás de um "confirmo que moro aqui" leve/autodeclarado
(não é comprovante de residência como Nextdoor/Vizinhos fazem — a
comunidade pequena já se modera via WhatsApp, dá pra confiar mais cedo).
Turismo (futuro) fica aberto também, mas separado da Comunidade.

**Monetização** — não cobrar do morador nem do prestador individual
(mantém a alma do projeto). Ads voluntários (já previstos no V0)
continuam. A peça nova: negócio maior (restaurante, pousada, loja)
paga por destaque no futuro diretório de turismo — isso é adiado até
Turismo virar prioridade de novo.

⚠️ **Conflitos com ideias antigas deste documento, resolvidos em
16/08:**
- *"Ideia 5: Badge de Verificação Especial"* (seção UI/DESIGN) tinha
  "🏆 Top Prestador (5 stars + 10+ reviews)" — **descartado**, contradiz
  a decisão de não ter rating. Só o "✓ Verificado" simples sobrevive,
  na forma do Selo comunitário acima.
- *"Ideia 1: Rating em Tempo Real"* (seção GAMIFICATION) — **fora de
  escopo**, mesma razão. Ver seção 12 do CLAUDE.md.
- *"Ideia 4: Badge Premium"* (seção MONETIZAÇÃO, cliente paga R$29/mês)
  — **não é o caminho escolhido**; monetização decidida é negócio
  pagando por destaque, não cliente/morador pagando assinatura.

---

## 🔄 COMO USAR ESTE DOCUMENTO

1. **Você tem ideia:** Adiciona aqui na categoria correta
2. **Eu consulto:** Toda vez antes de sugerir algo
3. **Se conflitar:** Alerto você → Vocês decidem
4. **Se esquecer:** Eu lembro no contexto relevante

**Exemplo:**
```
Você: "E se botão de..." 
Eu: "Ótimo! Já temos ideia parecida aqui: [X]
     Quer revisar ou quer algo diferente?"
```

---

## 📌 CHECKLIST

Quando for criar wireframes:
- [ ] Revisar todas ideias de navegação
- [ ] Revisar todas ideias de UI/design
- [ ] Revisar ideias de funcionamento
- [ ] Decidir: qual cor (quente vs fria)?
- [ ] Decidir: qual estratégia de monetização MVP?

Quando for para Claude Code:
- [ ] Passar este documento inteiro
- [ ] Ele conhece todas as ideias
- [ ] Ele alerta se sugerir algo conflitante

