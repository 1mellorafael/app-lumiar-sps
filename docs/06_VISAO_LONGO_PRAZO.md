# 🗺️ VISÃO DE LONGO PRAZO — PLATAFORMA LUMIAR EM ETAPAS

**Contexto:** Rafa expandiu a visão — não é só um app, pode virar
uma plataforma completa de Lumiar/São Pedro da Serra (site + mobile,
prestadores com página própria, vendedores, turismo).

---

## 💡 A BOA NOTÍCIA TÉCNICA

```
A stack que já escolhemos (Next.js + React) NÃO é só "app mobile".
Ela já roda como SITE de verdade no navegador (desktop e mobile).

Ou seja: quando você constrói o MVP, você JÁ ESTÁ construindo
o site. Não são dois projetos separados.

O que diferencia "site" de "app":
├─ Site: acessa pelo navegador (funciona em qualquer aparelho)
├─ App nativo (loja Android/iOS): precisa empacotar separado
└─ PWA (meio termo): site que se comporta como app, pode ser
   "instalado" na tela do celular, funciona quase como nativo
   (SEM precisar publicar em loja)

Recomendação: o MVP já nasce como site responsivo + PWA.
App nativo de loja fica pra MUITO mais pra frente (só faz
sentido quando o volume de uso justificar).
```

**Isso significa: você não precisa escolher entre site OU app.
A mesma base de código serve os dois, em fases diferentes.**

---

## 🪜 AS ETAPAS (visão realista, do menor pro maior)

### FASE 0 — MVP (o que já está desenhado)
```
O que é:
├─ Hub de prestadores + negócios de Lumiar/SPS
├─ Busca, categorias, perfis
├─ Contato via WhatsApp
└─ Site responsivo (funciona em cel e computador)

Objetivo: validar se as pessoas usam, se prestadores
querem se cadastrar, se o modelo "puxa tração pelo dia a dia"
como você pensou.

Isso é o que já vínhamos planejando. Não muda nada do
que já foi decidido — é só a base de tudo o resto.
```

### FASE 1 — Prestador com mais liberdade na página
```
O que muda:
├─ Prestador ganha uma "página" mais completa (ainda dentro
│  do app/site, não é link externo)
├─ Pode personalizar mais: cores? destaque de serviços?
│  fotos organizadas?
└─ Ainda tudo dentro da mesma plataforma (não é site à parte
   pra cada prestador — isso complicaria demais)

Por que fase 1 e não já no MVP:
└─ Precisa primeiro validar se as pessoas usam o básico.
   "Liberdade de customização" só importa se já tiver
   gente usando a base.
```

### FASE 2 — Comunidade (prioridade alta — decisão de 16/08, refinada em sessão posterior)

```
ARQUITETURA DE RETENÇÃO:
Esta fase tem 3 pilares de retenção-hábito (usuários retornam todo dia):
├─ Colunas/Dicas — prestadores compartilham expertise (reusa conta existente)
├─ Carona — compartilha caronas (demanda já existe em WhatsApp, só move pra app)
└─ Corrida/Leaderboard — gamification (km acumulados, ranking)

+ Alerta (retenção-utilidade — volta quando precisa) — Defesa Civil +
  INPE + override manual + denúncia de morador
+ Selo (retenção passiva — validação social comunitária, não é rating)

O que são:

1. MORADOR ACCOUNT (pré-requisito pra Comunidade)
   ├─ Conta separada de prestador (1 pessoa pode ter ambas)
   ├─ Login mesmo, pode ser omitido se a pessoa só tá navegando
   ├─ Checkbox opcional "Moro aqui" no cadastro
   ├─ Acesso às features comunitárias (Carona, Pede Aí, Alerta, Selo)
   └─ Sem verificação de comprovante (comunidade pequena se modera sozinha)

2. COLUNAS/DICAS (retenção-hábito #1 — expertise do prestador)
   ├─ Prestadores postam conselhos/dicas sobre seu serviço
   ├─ Não requer morador account (reusa prestador account)
   ├─ Widget de "Dica do Dia" na Home (rota com conteúdo novo)
   └─ Reaproveitado depois por Jornal expandido (item maior em item 28)

3. CARONA (retenção-hábito #2 — primeiro e único "Pede Aí" no lançamento)
   ├─ Mural de caronas compartilhadas (destino, data/hora, precisa/oferece)
   ├─ Contato via WhatsApp direto
   ├─ Demanda já existe (grupos de WhatsApp já organizam isso)
   ├─ Soluciona "cold-start" do Pede Aí — tem demanda real de dia 1
   └─ Pede Aí genérico (produtos, favores, etc.) é fase posterior (item 26)

4. CORRIDA/LEADERBOARD (retenção-hábito #3 — gamification)
   ├─ Usuário loga km manualmente ou por integração de GPS
   ├─ Ranking diário, semanal, mensal
   ├─ Pode cruzar com Selo futuramente (missão: "confirme 5 vizinhos")
   └─ Motiva abertura do app todo dia

5. ALERTA (retenção-utilidade — "volta quando precisa")
   ├─ Defesa Civil/CEMADEN: chuva, deslizamento (automático)
   ├─ INPE Queimadas: risco de incêndio (automático)
   ├─ Override manual do admin (nunca 100% dependente de API)
   ├─ Denúncia de morador: "pessoa estranha na região", "buzinada",
   │  etc. (com moderação — Nextdoor teve problema com racial profiling)
   ├─ Push notification em tempo real
   └─ Diferente de Pede Aí/Carona: não é "usuário gera", é "app avisa"

6. SELO "Verificado pela comunidade" (retenção passiva)
   ├─ Botão "Eu conheço este prestador" no perfil
   ├─ Contador automático de confirmações
   ├─ Badge automática ao bater mínimo (ex: 10 confirmações)
   ├─ NÃO é rating/nota (continua fora de escopo)
   └─ Validação social passiva — prestador não pede nem gerencia

Por que Comunidade vem ANTES de Turismo (mudança de ordem em relação à
versão anterior deste documento):
└─ Decisão explícita do Rafa: o objetivo principal do app é construir
   reputação/confiança dentro da comunidade primeiro — mesmo que isso
   signifique adiar a parte que geraria receita mais rápido (turismo +
   ads). Ver `05_IDEIAS_E_DECISOES_UX.md` pro racional completo da
   pesquisa que embasou essa fase (Nextdoor, Vizinhos App, Front Porch
   Forum, Patch.com, CEMADEN, INPE Queimadas).

Curadoria distribuída (não fica tudo com o admin):
├─ Dica de Coluna — qualquer prestador escreve
├─ Colunista (Jornal expandido) — responsável só pelo Jornal/Colunas de conteúdo
├─ Curador de ônibus — mantém horários atualizados
└─ Curador de alertas — pode confirmar/ajustar alerta manualmente
   Cada papel é um nível de permissão mais leve que admin completo,
   reaproveitando o mesmo modelo de aprovação que já existe pra
   prestador (PENDENTE → APROVADO).

Base de dados sugerida: modelar como uma estrutura genérica de "post
comunitário" (tipo: carona | pede_ai | pet_perdido | alerta) em vez de
N sistemas separados — Carona, Pede Aí e Pet Perdido reaproveitam quase
tudo (título, descrição, tipo, data, status, contato).
```

### FASE 3 — Vendedores / Marketplace leve
```
O que muda:
├─ Catálogo de produtos (já anotado como v1.1+ antes)
├─ Cliente monta "carrinho" mentalmente e manda pedido
│  pronto pelo WhatsApp
└─ SEM processar pagamento ainda (continua tudo combinado
   fora da plataforma — mais simples, sem responsabilidade
   de e-commerce/PCI compliance)

Isso já é o "vendedores poderiam vender ali" que você
mencionou — só que de forma leve, sem virar um Mercado Livre.
```

### FASE 4 — Módulo de Turismo (pausado de propósito — decisão de 16/08)
```
O que muda:
├─ Cachoeiras, trilhas, pontos turísticos, restaurantes/pousadas
│  maiores como novo "tipo de conteúdo" (parecido com negócio, mas
│  sem prestador de serviço — é só informação + localização)
├─ Esse conteúdo funciona MUITO bem sem precisar de login
│  (turista chega, vê, usa)
└─ Pode ter dica de acesso, nível de dificuldade, fotos

Esse módulo é o que passa a trazer tráfego de FORA de
Lumiar — pessoas pesquisando "cachoeiras perto de Nova
Friburgo" no Google podem cair no seu site.

Por que pausado: decisão explícita do Rafa — focar em Comunidade
primeiro, mesmo sacrificando velocidade de monetização. Turismo só
volta a ser prioridade depois que a Comunidade estiver validada com
uso real. Quando voltar, começar reaproveitando o catálogo de
prestadores já existente (restaurante/pousada como categoria nova)
antes de investir num site de turismo separado com ads — testa
demanda barato antes de construir caro.

Monetização, quando essa fase entrar: negócio paga por
destaque/posição (listagem em destaque), nunca cobra do morador nem
do prestador individual — ver `05_IDEIAS_E_DECISOES_UX.md` pro
racional completo. Ads voluntários (já previsto no V0) continuam
rodando em paralelo como complemento, não como fonte principal.

Aqui entra a questão que você levantou: diferenciar
morador de visitante. Não precisa decidir agora — mas
a arquitetura de login único (Opção A que recomendei)
já aguenta isso numa flag futura tipo "é_morador: true/false"
sem precisar redesenhar nada.
```

### FASE 5 — App Nativo (opcional, só se fizer sentido)
```
Só decide isso quando:
├─ Já tem uso recorrente forte (site/PWA validado)
└─ Notificações push realmente importam (ex: "seu pedido
   foi confirmado", "novo prestador na sua área")

Até lá, PWA já resolve 90% da experiência "tipo app"
sem o custo de manter loja Android/iOS.
```

### IDEIA CANDIDATA — Aba de Jogos (não alocada em fase ainda)

Brainstorm de 14/08, detalhado em `05_IDEIAS_E_DECISOES_UX.md`: desafios
diários estilo NYT Games/Term.ooo, temas locais, possível geração via
IA/agente, e potencial gatilho de login ("faça login pra jogar" — conecta
com a pendência de incentivo de cadastro voluntário). Boa candidata a
Fase 2 ou 3, depois que o diretório básico estiver validado com uso real.

---

## 🏘️ MORADOR vs VISITANTE — não precisa decidir agora

```
Você mencionou: talvez diferir login de quem mora e quem não.

Minha sugestão: NÃO precisa resolver isso agora. Só anota
como decisão futura, porque:

1. O MVP nem tem esse conceito ainda (só tem "cliente" genérico)
2. Quando o módulo de Turismo (Fase 3) entrar, aí sim faz
   sentido pensar: "visitante vê cachoeiras, mora vê tudo"
3. Tecnicamente é fácil de adicionar depois (é só uma flag
   a mais no cadastro), não trava nada do que já foi decidido

Ideias pra quando for pensar nisso (só pra não esquecer):
├─ Métrica interessante: quantos visitantes viram vs
│  moradores — ajuda a medir se o turismo tá funcionando
├─ Pode ter conteúdo exclusivo pra morador (grupos, avisos
│  locais) vs conteúdo aberto pra visitante (cachoeiras,
│  hospedagem, restaurante)
└─ Verificação de "morador de verdade" seria complexa (não
   tem como confirmar fácil) — melhor pensar nisso como
   auto-declaração, não verificação rígida
```

---

## 🔓🔒 ABERTO vs FECHADO — decisão de 16/08

```
Estrutura em 3 camadas, não 2:

1. Serviços (aberto, sem login) — já é assim, continua assim.
   Serve morador E turista ao mesmo tempo, é a base que já existe.

2. Comunidade (fechada — Carona, Pede Aí, Pet Perdido, Alerta, Jornal, Selo) —
   só pra quem confirma "moro aqui". Verificação leve no início
   (autodeclarada, tipo checkbox), não precisa ser tão rígida quanto
   Nextdoor/Vizinhos (que pedem comprovante de residência) — a
   comunidade pequena de Lumiar/SPS já se modera sozinha via grupos de
   WhatsApp, então dá pra confiar mais cedo e endurecer só se virar
   problema.

3. Turismo (aberto, futuro) — cachoeiras, trilhas, restaurantes
   maiores. Fica de fora da Comunidade de propósito: turista não tem
   motivo pra ver "cachorro perdido no bairro" nem alerta de risco de
   uma região onde não mora, e misturar os dois dilui a confiança que
   faz a Comunidade funcionar.

Por que NÃO fechar o app inteiro (opção descartada): contradiz o
pilar já fixado desde o início do projeto — "gratuito pro prestador,
sem comissão, navegável sem login" (seção 1 do CLAUDE.md). Fechar tudo
reduziria o alcance do prestador, que é o oposto do que o app deveria
fazer por ele.
```

---

## 📞 GRUPOS FECHADOS — ideia futura, não V0

```
Observação do Rafa (sessão posterior a 16/08): percebeu que comunidade
small de Lumiar já usa grupos no Facebook pra conversar por afinidade
(feministas, hobby, interesse local, etc.), e que essa demanda é real.

Realidade técnica: grupos de conversa/chat é o que o Facebook faz
melhor — 15+ anos de infraestrutura, muito investimento. Construir
isso agora para brigar com FB no seu ponto forte seria gastar esforço
sem diferenciação.

Decisão: isso fica como **ideia futura de fase bem distante** (pós-Fase 4,
talvez). Documentado aqui pra não esquecer, mas não trava o lançamento
da Comunidade agora.

Alternativamente: quando/se virar prioridade, considerar integração com
grupo FB existente em vez de reimplementar (link no app → abre grupo).

Não confundir com:
├─ Pede Aí — não é chat, é mural de pedidos (texto+contato WhatsApp)
├─ Colunas — não é conversa, é conteúdo de expertise
└─ Carona — não é group chat, é "eu ofereço X, tire para Y" (WhatsApp direto)
```

---

## 🎯 ESTRATÉGIA DE LANÇAMENTO GRADUAL — decisão de sessão posterior

```
Problema que resolve: app aparecer "morto" no primeiro dia desanima
usuários. Solução: lançar em 3 waves, começando fechado.

WAVE 1 — FECHADÍSSIMO (~10-20 pessoas, 1-2 semanas)
├─ Contas criadas manualmente pelo admin (sem sistema de código ainda)
├─ Objetivo: testar cadastro/login/perfil de ponta a ponta
├─ Resultado esperado: Busca já tem gente de verdade (prova de vida)
└─ Sem anúncio público — só gente que você convida pessoalmente

WAVE 2 — UM POUCO MAIS ABERTO (50-100 pessoas, 1-2 semanas depois)
├─ Sistema de código de invite está pronto
├─ Inclui primeiros prestadores que vão postar Coluna
├─ Testam Carona com gente que já sabe que vai pro Rio/Friburgo
├─ Testam Push notifications end-to-end
├─ Resultado esperado: 1+ Coluna postada, Alerta rodando
└─ Ainda sem anúncio nos grupos — só "vai chegando gente"

WAVE 3 — ANÚNCIO PÚBLICO
├─ Anuncia nos grupos WhatsApp/Facebook APENAS quando:
│  ├─ Busca tem 50+ serviços ativos (prova que não tá vazio)
│  ├─ Já tem 3+ Colunas postadas (prova que tem conteúdo novo)
│  ├─ Alerta está rodando há 1 semana sem bugs (prova que funciona)
│  └─ Infraestrutura de invite codes testada (não vai quebrar no pico)
├─ Convites por código, liberados em lotes (50 por dia, etc.)
└─ Espaço de "betinha" declarado no app (feedback welcome)

Por que essa ordem:
└─ Garante que V0 não nasce "morto" (app vazio mata engajamento)
└─ Permite descobrir bugs com 20 pessoas antes de 2000
└─ Constrói momentum social ("eh, vi que tá cheio de gente lá")
```

## 🧩 REUSABILIDADE — Jornal/Colunas pode virar produto (decisão de 16/08)

```
Diferente dos outros módulos de Comunidade (que dependem de dado
específico de Lumiar/SPS — geografia de risco, prestadores locais), o
Jornal/Colunas depende só de "gente que quer escrever sobre onde
mora" — isso existe em qualquer cidade pequena do Brasil. Insight do
Rafa: essa pode ser a peça de maior potencial de reuso do projeto.

Existe precedente real disso funcionando como categoria de produto:
"Daily Neighbor" é um template de plataforma de notícia hiperlocal
pronto pra qualquer comunidade montar, sem precisar programar do zero.
Ou seja: se o Jornal/Colunas funcionar bem em Lumiar/SPS, no futuro
pode virar algo oferecido pra outras cidades pequenas — não é
prioridade agora, só um caminho que ficou mais claro com a pesquisa.

Cuidado histórico (caso Patch.com, EUA, achado na pesquisa de 16/08):
a AOL investiu US$300 milhões tentando construir centenas de sites de
notícia hiperlocal contratando jornalista full-time — e quebrou (corte
de 40% da equipe em 2013). O modelo só ficou lucrativo depois que a
empresa foi vendida e reestruturada em cima de colunista
voluntário/comunitário, exatamente o caminho que o Rafa já escolheu
("posso deixar essa frente com alguém"). Lição prática: nunca
contratar jornalista em escala pra isso, e nunca misturar notícia
genérica do mundo no meio do conteúdo local (Patch tentou, os leitores
rejeitaram).
```

## 💰 MODELO DE MONETIZAÇÃO — pesquisa e decisão de 16/08

```
Pergunta do Rafa: pra monetizar (vender módulo pra negócio/governo/etc
pagar pra estar na plataforma), o app precisa primeiro ter base de
usuários grande — construir confiança/densidade local primeiro, depois
vender acesso pra quem quer alcançar essa base. É assim que a Nextdoor
faz?

Resposta: sim, é exatamente o modelo Nextdoor — mas existem dois
modelos de referência com trade-offs bem diferentes, e o que já está
decidido neste roadmap (Comunidade antes de Turismo, seção acima) já
se parece mais com o segundo do que com o primeiro.
```

### Dois modelos de referência

```
NEXTDOOR (EUA, capital de risco, expansão agressiva bairro a bairro)
├─ Monetização: anúncio local (deals patrocinados) + Nextdoor Public
│  Agency (prefeitura/defesa civil/polícia pagam por canal verificado
│  de comunicação direta com moradores) + anúncio nacional em escala
├─ Tem feed algorítmico (não é cronológico puro) — ranqueia por
│  proximidade, engajamento, recência, tipo de conteúdo, parecido com
│  o feed do Facebook. Existe desde ~2018 pra aumentar tempo de uso e
│  ter mais inventário de anúncio.
└─ Ponto fraco real: mesmo com ~100M de usuários, a Nextdoor nunca foi
   consistentemente lucrativa — monetização por usuário em rede
   hiperlocal é baixa, e o feed algorítmico amplificou problema sério
   de moderação (perfil racial em denúncias de "pessoa suspeita" —
   por isso a decisão já tomada aqui de ter moderação humana na
   denúncia de Alerta, seção Fase Comunidade acima).

FRONT PORCH FORUM (Vermont, EUA, permanece pequeno de propósito)
├─ Monetização: "underwriters" locais — negócio paga patrocínio fixo,
   não leilão de anúncio disputado
├─ Sem feed algorítmico — é essencialmente um digest diário por
   região, ordem simples
├─ Não tenta virar rede nacional — aceita o teto de população da
│  região que atende
└─ Lucrativo, sem capital de risco, exatamente por não perseguir
   escala tipo Nextdoor
```

### Por que o modelo daqui puxa mais pro Front Porch Forum

```
Lumiar + São Pedro da Serra é um mercado finito — não vira rede
nacional sozinho. Faz mais sentido tratar escala como "replicar o
pacote pra outras cidades pequenas" (ver seção Reusabilidade acima,
Jornal/Colunas e o precedente "Daily Neighbor") do que "crescer essa
mesma instância até virar Nextdoor".

Sobre feed algorítmico especificamente: NÃO faz sentido agora nem no
médio prazo. Com poucas centenas/milhares de usuários, ordem
cronológica + curadoria (Colunas, Selo) já resolve — algoritmo de
relevância só compensa o custo de manutenção e risco de moderação
quando o volume de conteúdo é grande demais pra cronológico ser
legível. Só reconsiderar se/quando o volume de posts comunitários
virar ruído de verdade.
```

### Sobre "a prefeitura não poderia só criar um canal de graça?"

```
Pode, e provavelmente é exatamente isso que acontece primeiro: o papel
de "curador de alertas" (Fase Comunidade, item Alerta acima) já cobre
isso sem custo nenhum — alguém (voluntário, ou a própria prefeitura
usando uma conta comum) confirma/ajusta o alerta manualmente. Não tem
motivo pra cobrar da prefeitura de Nova Friburgo por um distrito rural
pequeno; o orçamento disponível provavelmente nem justificaria a
venda.

Onde a venda de verdade apareceria: não em "cobrar a prefeitura local
pra postar", mas em "empacotar Alerta + Colunas + Selo como produto e
licenciar pra OUTRAS prefeituras/cidades pequenas" — aí sim vira SaaS
B2G de verdade, e só faz sentido depois que o pacote já roda de forma
confiável e replicável em Lumiar/SPS (mesma lógica já registrada na
seção Reusabilidade sobre Jornal/Colunas). Local = grátis pra sempre,
como ferramenta de confiança. Escala = produto vendável pra outros
lugares, não pra este.
```

---

## 🗺️ MAPA DE FASES — do lançamento até "parecido com Nextdoor"

```
Visão consolidada de ordem de implementação + quando cada coisa vira
monetizável, juntando o plano de implementação técnico
(11_PLANO_IMPLEMENTACAO.md) com este documento de visão. Detalhe
completo em formato visual entregue ao Rafa em 16/08 (fora do repo,
artifact de sessão) — resumo aqui pra não se perder:

1. V0 — Diretório aberto (Fase 0-1 do plano técnico): busca, cadastro
   leve, WhatsApp, Úteis, PWA. 100% grátis, sem algoritmo, sem anúncio.
2. Lançamento em 3 waves (fechadíssimo → aberto → público) — já
   detalhado na seção "Estratégia de Lançamento Gradual" acima.
3. Comunidade (Fase Comunidade acima): Morador account, Colunas,
   Carona, Corrida, Alerta (curadoria voluntária, grátis), Selo.
   Ainda sem monetização — é a fase que constrói confiança.
4. Estrutura genérica de post comunitário → Pede Aí genérico, Pet
   Perdido — mais retenção, ainda grátis.
5. Vendedores/Marketplace leve (Fase 3 deste doc) — primeira
   aproximação de comércio, ainda sem processar pagamento.
6. Turismo (Fase 4 deste doc) — primeiro módulo pensado pra tráfego de
   fora; aqui entra a primeira monetização real: negócio paga por
   destaque/posição, nunca o morador.
7. Ponto de decisão "replicar ou centralizar": se Colunas/Alerta/Selo
   provaram valor em Lumiar/SPS, considerar empacotar pra outras
   cidades pequenas (SaaS B2G leve) em vez de tentar crescer só essa
   instância — é o que mais se parece com escala real de negócio, sem
   copiar a rota de capital de risco da Nextdoor.
8. Feed algorítmico — só entra em pauta se o volume de conteúdo
   comunitário virar ruído real em ordem cronológica. Não está
   planejado, é só um ponto de reavaliação futura.
```

---

## 🧭 REFINAMENTO DE FOCO — sessão de 16/08 (pós-monetização)

```
Depois de mapear o caminho até monetização, o Rafa voltou pro que
importa primeiro: a necessidade real e imediata é uma central de
contatos de prestador, resolvendo o caos do grupo de WhatsApp. Tudo
que não é isso espera a base de prestador crescer.
```

### Lumiar e São Pedro da Serra juntos desde o início (não separar)

```
Pergunta: vale fechar só pra Lumiar e abrir São Pedro da Serra depois,
ou lançar os dois juntos desde a Wave 1?

Decisão: juntos, sem split geográfico no produto. Duas razões:
1. Prestador (motoboy, mototáxi, faxina) tipicamente atende os dois
   lados — restringir a visibilidade a só um distrito tira alcance
   de quem já atenderia o outro sem custo nenhum.
2. Carona (item 3 da Fase Comunidade) depende do mesmo corredor de
   quem desce pra Nova Friburgo/Rio — carona "só de Lumiar" nasce
   capenga.

Risco real a monitorar (não é motivo pra separar, é motivo pra agir):
se a Wave 1 ficar 100% concentrada em Lumiar por causa de rede pessoal
mais forte lá, alguém de SPS que abrir o app e não achar nada de lá
pode achar "não é pra mim" — mesmo o app se chamando dos dois. Puxar
convite pessoal de SPS o quanto antes é o que evita isso, não separar
o produto.
```

### Foco do MVP: serviço primeiro, o resto entra por necessidade comprovada

```
Ordem de prioridade dentro do V0/Fase 1, já validada por sinais reais
que o Rafa já observa na comunidade:
├─ Central de contatos de prestador é a dor #1 (resolve o caos do
│  grupo de WhatsApp) — é o que já está sendo construído
├─ "Quentinha no horário de almoço" — demanda real observada, já tinha
│  sido registrada como ideia de Menu do Dia numa sessão anterior;
│  esta sessão confirma de forma independente que é real
├─ Carona — demanda constante, já é item 3 da Fase Comunidade
└─ Cursos/workshops — CORREÇÃO da leitura inicial desta sessão: não é
   só "categoria Educação cobre isso". A ideia do Rafa é mais
   específica — um prestador já listado numa categoria (educador,
   marceneiro, etc.) pode também publicar uma oferta pontual, tipo
   propaganda de um curso ou workshop específico, além do perfil fixo
   dele. Isso é conteúdo autoral do prestador, geralmente com prazo
   (evento datado) — mais parecido com Colunas (item 20 da Fase 8,
   prestador publica conteúdo, reusa a própria conta) do que com o
   campo de categoria. Quando a Fase 8 chegar em Colunas, vale
   desenhar já pensando nos dois tipos de post: "dica" (evergreen) e
   "oferta/evento" (datado, tipo curso/workshop) — mesma mecânica de
   autoria, tipos de conteúdo diferentes.

Meta explícita da Wave 1/2: conseguir que praticamente todo prestador
de Lumiar se cadastre antes de abrir mais funcionalidade — densidade
de prestador é o que faz a central de contatos valer a pena usar.
```

### Sinal de demanda — medir o que é mais procurado por horário

```
Ideia nova desta sessão: instrumentar busca/categoria com timestamp
pra enxergar padrão de demanda por horário (ex: comida/quentinha
pico no horário de almoço, carona pico no fim de tarde). Dois usos
possíveis, não excludentes:
├─ Interno (admin): prioriza o que construir a seguir com dado real,
│  em vez de achismo — complementa os insights que o Rafa já traz
│  observando os grupos de WhatsApp da comunidade diretamente
└─ Público (futuro, não V0): widget "mais procurado agora" na Home,
   só faz sentido depois de ter volume de busca real pra não mostrar
   dado vazio/enganoso

Caminho técnico natural quando for implementar: Vercel Analytics
(já está no stack, `@vercel/analytics`) cobre eventos customizados
sem precisar de infra nova — não é decisão a tomar agora, só registro
de que o caminho já existe sem custo extra de ferramenta.
```

### "Serviços abertos agora" — reabre parcialmente uma exclusão do CLAUDE.md

```
CLAUDE.md seção 6 marca "status disponível agora / online-offline"
como Fora do V0. A ideia do Rafa (mostrar na Home quem está aberto
agora) é parecida, mas tecnicamente mais simples e não precisa
reabrir aquilo:

├─ Versão excluída (continua excluída): prestador alterna um toggle
│  online/offline manualmente — exige manutenção ativa, informação
│  fica velha se ele esquecer de mexer
└─ Versão candidata (NOVA, ainda não implementada): prestador declara
   um horário de funcionamento uma vez no cadastro; a Home calcula
   "aberto agora" comparando com o relógio — zero manutenção depois
   de cadastrado

Status: registrado como candidato, NÃO entra na Fase 3 atual (cadastro
de serviço real) ainda — decisão explícita do Rafa de só registrar por
enquanto. Quando for pra frente, falta decidir formato (horário fixo
por dia da semana? exceção de feriado?) antes de virar campo de
cadastro de verdade.
```

### Cadastro por terceiro — decisão de 16/08 (pra Fase 3)

```
Pergunta do Rafa: e quem não tem celular ou não sabe usar (ex: um
fretista, um jardineiro)? Alguém que conhece essa pessoa devia poder
cadastrar por ela? Ela vira dona da página sem ser dona do serviço?
Quem cadastra fica responsável, ou delega? Auto-criação sem consentimento
está descartada pelo Rafa (concordo — quebraria confiança rápido numa
comunidade pequena).
```

**Descoberta que muda o desenho:** `prestadores` (schema.sql) hoje **não
tem campo de telefone próprio** — o único telefone que existe é
`profiles.telefone`, de quem fez login. Do jeito que está, o botão de
WhatsApp mostraria o número de quem se cadastrou, não necessariamente o
do prestador de verdade. Isso precisa de campo de contato próprio em
`prestadores`, independente de quem é o dono da conta — verdade
**qualquer que seja** o modelo de permissão escolhido abaixo.

**Modelo escolhido:** reaproveitar o fluxo PENDENTE → APROVADO que já
existe (regra de sensibilidade, CLAUDE.md seção 3), em vez de inventar
mecanismo novo:

```
1. Quem conhece o prestador cadastra a página — vira o profile_id
   dono/responsável tecnicamente, mas nasce PENDENTE como qualquer
   outro cadastro
2. Telefone de contato do serviço é campo PRÓPRIO em prestadores,
   separado do telefone de quem cadastrou (profiles.telefone)
3. A aprovação (admin, Fase 5) é o checkpoint de consentimento real —
   confirmar com a pessoa de verdade antes de aprovar. Não é processo
   novo, é o mesmo approval que já ia existir, só com esse cuidado a mais
4. Flag `cadastrado_por_terceiro` (boolean) sinaliza esses casos pro
   admin dar atenção extra na aprovação; no futuro pode virar aviso
   transparente no perfil público ("página gerenciada por [nome]")
5. Não precisa de fluxo de "reivindicar perfil" agora — se o prestador
   quiser assumir a própria página depois, é só o admin trocar o
   profile_id manualmente. Não é porta fechada, só não é V0.
```

**Impacto técnico a aplicar quando a Fase 3 começar de verdade:**
adicionar campo de telefone de contato em `prestadores` (schema.sql +
nova migration, nunca editando migrations antigas) e o flag
`cadastrado_por_terceiro`. Não implementado ainda — só registrado.

### Pede Aí — nome e filtros

```
Confirmado: o nome "Pede Aí" é provisório (Rafa já sinalizou trocar).
Estrutura genérica de post comunitário (tipo: carona | pede_ai |
pet_perdido | alerta, já descrita na Fase Comunidade acima) já prevê
filtro por tipo — bate com a ideia de "filtro por pet, carona, etc."
Sem mudança de arquitetura, só reforça o que já estava desenhado.
```

---

## 🎯 O QUE ISSO MUDA NO QUE JÁ FOI DECIDIDO

```
Resposta curta: NADA muda agora.

Tudo que já foi fechado (cadastro lazy, geo-restrição,
CNPJ, avaliações, etc.) continua sendo a FASE 0.

Essa conversa de agora é só pra você enxergar que:
1. O MVP não é "só um app" — já nasce sendo o site também
2. As ideias maiores (marketplace, turismo, prestador com
   mais liberdade) têm um lugar claro no roadmap, não
   precisam ser resolvidas agora
3. Dá pra ir testando e validando fase por fase, sem
   comprometer a arquitetura atual
```

---

## 💬 SOBRE A FASE DE PONDERAÇÃO

```
Isso que você tá sentindo — muita reflexão antes de codar —
é completamente normal, e na real é BOM. Um monte de projeto
morre porque começou a codar cedo demais e teve que jogar
tudo fora depois que percebeu um problema estrutural.

Só um ponto de atenção honesto: em algum momento, começar
a construir (mesmo que só os wireframes) vai te dar respostas
mais rápidas do que continuar só pensando. Às vezes ver a
tela desenhada revela um problema (ou uma clareza) que não
aparece só na cabeça.

Não é pra apressar — é só um lembrete de que wireframes
também são uma ferramenta de pensar, não só de "desenhar
o que já foi decidido".
```

---

## 🚀 SUGESTÃO DE PRÓXIMO PASSO

```
Já que a Fase 0 (MVP) está bem definida e nada do que foi
decidido muda com essa visão maior, dá pra:

1. Seguir pros wireframes da Fase 0 (o que já estava
   planejado) — isso não trava nada da visão maior
2. Deixar essa "Visão de Longo Prazo" documentada (como
   já fizemos) pra consultar quando chegar a hora de cada
   fase

Você não precisa decidir login único/separado nem
morador/visitante AGORA pra seguir com os wireframes do MVP.
```

