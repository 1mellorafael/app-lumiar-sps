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

### FASE 2 — Vendedores / Marketplace leve
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

### FASE 3 — Módulo de Turismo
```
O que muda:
├─ Cachoeiras, trilhas, pontos turísticos como novo "tipo
│  de conteúdo" (parecido com negócio, mas sem prestador
│  de serviço — é só informação + localização)
├─ Esse conteúdo funciona MUITO bem sem precisar de login
│  (turista chega, vê, usa)
└─ Pode ter dica de acesso, nível de dificuldade, fotos

Esse módulo é o que passa a trazer tráfego de FORA de
Lumiar — pessoas pesquisando "cachoeiras perto de Nova
Friburgo" no Google podem cair no seu site.

Aqui entra a questão que você levantou: diferenciar
morador de visitante. Não precisa decidir agora — mas
a arquitetura de login único (Opção A que recomendei)
já aguenta isso numa flag futura tipo "é_morador: true/false"
sem precisar redesenhar nada.
```

### FASE 4 — App Nativo (opcional, só se fizer sentido)
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

