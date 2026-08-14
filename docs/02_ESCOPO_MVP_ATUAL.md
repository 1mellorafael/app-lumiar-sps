# 🚀 ESCOPO MVP (V0) — ESTADO ATUAL

**Este é o documento que manda.** Se outro documento (mesmo um antigo que
sobrou por aí) disser algo diferente disto aqui, vale o que está aqui.

---

## 1. Arquitetura de acesso: app aberto, cadastro só quando precisa

Decisão fechada: **o app é navegável sem login.**

```
SEM CONTA, qualquer pessoa pode:
✅ Ver a home, categorias, busca
✅ Ver o perfil de qualquer prestador (fotos, serviços, descrição)
✅ Clicar em "Chamar no WhatsApp"

PRECISA DE CONTA só para:
🔒 Cadastrar Serviço (virar prestador)
```

Por quê: turista/visitante usa sem fricção, o link do perfil funciona pra
compartilhar e pra SEO, e o app não perde tráfego logo na entrada. Pedir
conta e endereço de todo mundo na porta de entrada mataria isso.

O cadastro **rápido** (nome, email, senha etc.) só aparece quando a pessoa
clica em "Cadastrar Serviço". Não existe cadastro "solto" pra quem só quer
navegar — e como avaliação ficou fora do V0 (ver item 2), esse é o
**único** gatilho de cadastro por enquanto.

> 💬 Incentivo pra morador logar/dar endereço voluntariamente (sem tornar
> obrigatório) segue em maturação, sem prioridade agora — ver
> `08_PENDENCIAS_ABERTAS.md`.

---

## 2. Escopo do V0 — só Prestador (Negócio fica pra Fase 1)

```
ENTRA no V0:
✅ Navegação livre (sem login)
✅ Cadastro de Prestador de Serviço
✅ Categorias: Motoboy, Faxina, Mototáxi, Uber, Estética, Adestramento,
   Hospedagem Pet, Lojas, Babá, Educação, Psicólogo, Artes
✅ Botão de WhatsApp em cada perfil
✅ Admin aprova cada serviço manualmente (status pendente até aprovar)
✅ Horários de ônibus (aba Úteis)
✅ Clima compacto (Home) + completo (aba Úteis)
✅ Telefones úteis (aba Úteis)

FICA DE FORA do V0 (não cancelado, só adiado — ver 06_VISAO_LONGO_PRAZO.md):
❌ Negócio (CNPJ, geo-restrição de negócio, badge, galeria)
❌ Cadastro geral aberto (só cadastra quem quer virar prestador)
❌ Avaliações/rating — decidido: fica de fora do V0. App é puramente
   "diretório + WhatsApp" por enquanto; avaliação entra numa fase seguinte
❌ Feed de notícias/eventos — fica de fora do V0 (substituído pelo widget
   de Clima, mais enxuto e focado em segurança/utilidade prática)
❌ Chat interno, pagamento, app nativo — nunca fizeram parte do escopo
```

Nota: "Hospedagem Pet", "Lojas" e casos como um prestador que também tem uma
estrutura maior (ex: petshop) entram por enquanto como categoria de
**serviço**, sem distinção formal de "negócio"/CNPJ. Isso simplifica
bastante o V0 — toda aprovação continua manual (admin aprova um a um),
inclusive pra essas categorias mais "loja-like".

---

## 3. Cadastro — fluxo e campos

Detalhado visualmente em `10_WIREFRAMES_SKETCH_BAIXO.md`. Resumo funcional:

### Passo 1 — Sua Conta (só acontece ao clicar "Cadastrar Serviço")

```
Foto de perfil (obrigatória)
Nome           ← auto-capitaliza
Sobrenome      ← auto-capitaliza
Email                 ← valida formato (nome@dominio.com)
Telefone (WhatsApp)   ← máscara automática (xx) xxxxx-xxxx
Data de nascimento    ← formato xx/xx/xxxx, com ícone de calendário;
                          ver regra no item 4 (menor pode enviar, fica
                          sinalizado)
Senha + confirmar senha  ← medidor de força (fraca/média/forte)
Endereço               ← autocomplete Google Places, normaliza formato
                          (maiúsculas, número, bairro, cidade, UF, CEP);
                          aceita fora da área, sinaliza pro admin
☑️ Aceito os Termos de Uso

→ Se email ou telefone já existirem: erro inline, sugere login
```

### Passo 2 — Seu Serviço (direto na sequência, sem etapa separada)

```
Foto Principal (obrigatória — pode ser a mesma da perfil, um logo,
                 ou outra imagem; fica no centro do card/perfil)
Foto de Capa (opcional — fica como fundo atrás da Foto Principal;
               sem capa, mostra só uma cor neutra de fundo)
Categoria (dropdown com as categorias do item 2)
Nome do serviço (opcional)     ← auto-capitaliza primeira letra
Descrição (opcional)           ← auto-capitaliza primeira letra
Instagram (opcional)           ← única rede social do V0
☑️ Aceito os termos de prestador

→ Status: PENDENTE até admin aprovar
→ Depois de enviar, cai na tela do próprio serviço (não no formulário) —
  é lá que existe a Galeria de fotos (até 5), adicionada quando quiser,
  não durante o cadastro
```

Prestador logado pode adicionar mais serviços depois, pela aba "Perfil" →
"Meus Serviços" → "+ Adicionar outro serviço". Cada serviço novo entra
pendente individualmente, mesmo que o prestador já tenha outros ativos.

### Login

Login único (uma conta, "flags" internas) — confirmado. A mesma pessoa pode
ser cliente e prestador de vários serviços com a mesma conta; não precisa
de contas separadas. Sessão fica salva entre visitas (cookie seguro +
refresh token via Supabase Auth) — não precisa logar toda vez.

Quem tem login + pelo menos 1 serviço vê a aba "Perfil" (em vez de "Menu")
na barra de navegação — mesmo espaço, conteúdo expandido com foto, nome,
lista de serviços próprios, e tudo que o Menu normal já tinha
(Configurações, Enviar Sugestão, etc.).

---

## 4. Menores de idade

**Regra atualizada em 14/08 (rodada 2):** não existe mais bloqueio
silencioso/automático. O campo de Data de Nascimento **fica visível** no
cadastro (Passo 1). Se a pessoa for menor de idade, ela **consegue
preencher e enviar** o cadastro normalmente — não é impedida na hora.

```
IF data_nasc indica menor de 18 anos:
   Cadastro é aceito e enviado, mas fica marcado
   ⚠️ "MENOR DE IDADE" no dashboard do admin
   → Revisão 100% manual, você decide (provavelmente recusa, mas é
     caso a caso, não automático)

IF data_nasc indica maior de 18 anos:
   Segue fluxo normal de aprovação manual (como qualquer outro cadastro)
```

Por quê essa mudança: o bloqueio automático simplificava demais uma
decisão que na prática você quer tomar você mesmo, olhando o caso (ex:
talvez um adolescente de 17 anos ajudando no negócio da família seja um
caso que você queira avaliar, não simplesmente recusar por regra fixa).

### Por que não mostrar aviso explícito de "você precisa ter 18+"

Decisão deliberada (confirmada em 14/08, rodada 4): o formulário **não**
mostra uma mensagem de bloqueio em tempo real avisando que menor não pode.
O motivo é evitar ensinar o mecanismo de burla — se o app disser
explicitamente "você precisa ter 18 anos", fica óbvio pra qualquer pessoa
que basta digitar uma data diferente pra passar. Mantendo o fluxo
silencioso (aceita, fica pendente, você decide depois sem expor o
critério), a regra existe mas não vem com instrução de como contornar.

### Sobre proteção legal do checkbox "confirmo que sou maior"

Não é parecer jurídico, é só o raciocínio de produto (confirmar com
advogado antes do lançamento, ver `08_PENDENCIAS_ABERTAS.md`):

- Se a pessoa **mentir** a data de nascimento (colocar uma data que a faz
  parecer maior) e marcar o checkbox: o sistema não tinha como saber que
  era falso, isso tende a ser defensável — é o mesmo princípio de sites
  que pedem confirmação de idade pra álcool, por exemplo.
- Se a pessoa for **honesta** e a data mostrar que é menor: aí o sistema
  **sabe**, o dado está explícito. Esse é o caso que precisa de cuidado
  real — o checkbox sozinho não cobre essa situação, porque há uma
  contradição visível entre o que foi declarado e o que foi digitado.

---

## 5. Geo-restrição (Lumiar / São Pedro da Serra)

O endereço do prestador é pedido só pra validar que ele atende na região —
**não aparece publicamente** no perfil dele.

```
User digita endereço → geocoding (Google Maps API) → verifica se está
dentro do polígono de Lumiar + São Pedro da Serra

Dentro da área → prossegue
Fora da área  → bloqueia: "Cadastro disponível apenas para Lumiar e
                São Pedro da Serra"
```

*(Falta definir as coordenadas exatas do polígono quando for implementar.)*

---

## 6. Aprovação do Admin

```
Todo serviço criado entra como PENDENTE.

Admin vê no dashboard:
├─ Foto, categoria, dados preenchidos
├─ Pode ver no Maps
└─ [Ver perfil] [✅ Aprovar] [❌ Rejeitar]

Só depois de aprovado, o serviço aparece na busca pública.
```

MVP: aprovação é manual, baseada em inspeção visual + contato via WhatsApp
se tiver dúvida. Sem CPF, sem documento, sem API complexa — você é o
"gatekeeper" no início.

Admin também pode cadastrar um serviço **em nome de outra pessoa** (se o
dono não sabe usar o app) e depois transferir a propriedade pra ela.

### Regra de sensibilidade de dados: antes vs. depois da aprovação

**Decidido em 14/08 (rodada 5):** enquanto um cadastro (de pessoa ou de
serviço) está **PENDENTE**, **todas** as informações dele são tratadas
como sensíveis/privadas — inclusive campos que, uma vez aprovados, seriam
públicos (foto, nome, categoria, descrição). Nada disso fica visível
publicamente enquanto está pendente: não aparece em busca, não tem URL
pública acessível, só o admin vê no dashboard.

```
STATUS PENDENTE:
   → TODAS as informações são sensíveis, sem exceção
   → Nada aparece publicamente, nem os campos "normalmente públicos"

STATUS APROVADO:
   → Só as informações marcadas como públicas ficam visíveis
     (foto, nome, categoria, descrição, Instagram, telefone via
     botão de WhatsApp)
   → O resto continua sempre privado (email, senha, data de
     nascimento, endereço completo) — ver item 11 abaixo
```

Isso vale igualmente pra dados da **pessoa** (cadastro, Passo 1) e pra
dados do **serviço** (Passo 2) — o princípio é o mesmo nos dois casos.

---

## 7. Verificação / Badge

Sistema de badge "Verificado" fica **pausado por enquanto** (não é
automático). Se e quando fizer sentido reativar:
- **Prestador:** manual — você marca quem conhece/confia.
- CPF + selfie com documento é uma opção mais forte, mas fica como recurso
  **oculto**, usado pontualmente só se você achar necessário — não é padrão,
  ninguém mais sabe que existe.

---

## 8. Busca

```
Texto digitado deve BATER NO INÍCIO de uma palavra, em qualquer lugar da
string (nome, categoria, descrição).

"joa" → João, Joana, "Restaurante do João" (bate no início de "João")
      → NÃO bate "aJoão" (não é início de palavra)

Resultados ordenados alfabeticamente (A-Z) — sem rating (fora do V0) e
sem "mais procurados" artificial.
```

---

## 9. Moderação — filtro de linguagem

Campos de texto livre atuais (nome, bio do prestador, descrição do serviço)
usam filtro **bloqueante** (não mascara): se detectar linguagem inadequada,
rejeita o envio com mensagem genérica pedindo pra revisar. Biblioteca
sugerida: `obscenity` (npm) + lista customizada PT-BR.

> Se avaliação com comentário livre entrar no escopo (ver pendência),
> aí faz sentido usar **mascaramento** (asteriscos) em vez de bloqueio,
> porque é opinião de terceiro sobre o prestador, não uma auto-descrição.

---

## 10. CNPJ / CPF

Fora do escopo do V0. Não pede CNPJ (Negócio não existe no V0). CPF também
não é pedido no cadastro padrão — só entra, pontualmente e de forma oculta,
se o admin quiser reforçar confiança em um prestador específico.

---

## 11. Segurança de dados

```
NUNCA público: email, senha, data de nascimento, telefone pessoal
(WhatsApp aparece só porque o prestador optou por publicar pra contato)

PODE ser público: nome, foto, serviço/categoria, rating, descrição
```

Senha com hash (bcrypt/Argon2), HTTPS obrigatório, dados sensíveis nunca em
logs, backup criptografado.
