# ❓ PENDÊNCIAS ABERTAS — precisam da sua decisão

Lista curta e viva. Assim que decidir algo, atualizo `02_ESCOPO_MVP_ATUAL.md`
e removo o item daqui.

---

### 1. Login/endereço de morador — incentivo (pausado por enquanto)

Direção levantada em 14/08: pensar em incentivos reais pra pessoa querer
logar e dar endereço voluntariamente (sem tornar obrigatório). **Decidido:**
sem prioridade por enquanto — fica registrado como ideia futura, sem ação
agora. Ideias anotadas pra quando voltar à mesa:

- Login por telefone/WhatsApp em vez de email+senha (menos fricção)
- Selo "Morador de Lumiar" (cosmético)
- Trocar endereço por utilidade real: "ônibus mais perto de você"
- Acesso antecipado a features futuras pra quem se cadastrar cedo
- **Novo (14/08):** aba de Jogos com "faça login pra jogar" — ver
  `05_IDEIAS_E_DECISOES_UX.md`

### 2. Rede de anúncios — qual usar?

Google AdSense é o mais comum, mas Lumiar é uma comunidade pequena — pode
não qualificar tráfego suficiente no início. Avaliar quando chegar mais
perto do lançamento. Ver `10_WIREFRAMES_SKETCH_BAIXO.md`, seção 11.

### 3. Política de Privacidade e Termos de Uso — escrever

Ainda não existem como texto. Precisam existir antes do lançamento
(rodapé já reserva o espaço). Ver `10_WIREFRAMES_SKETCH_BAIXO.md`,
seção 12.

### 4. ⚠️ LGPD — dados de menores (recomendo consulta jurídica)

Como cadastro de menores agora é permitido (fica pendente, não bloqueado),
a LGPD tem regras específicas sobre dados de crianças/adolescentes
(Art. 14) que costumam exigir consentimento de responsável. Não é algo
pra resolver só com documentação de produto — recomendo consulta jurídica
específica sobre esse ponto antes do lançamento.

---

## ✅ Resolvidas em 14/08/2026

- **Avaliação no V0:** fica de fora.
- **Checklist de segurança:** incorporada no `03_ARQUITETURA_TECNICA.md`.
- **Categorias:** Motoboy, Faxina, Mototáxi, Uber, Estética, Adestramento,
  Hospedagem Pet, Lojas, Babá, Educação, Psicólogo, Artes. Aprovação
  sempre manual.
- **Status online/offline e Rating:** fora do V0.
- **Admin superpoder:** cria qualquer perfil (prestador ou negócio) sem
  esperar cadastro, transfere posse depois. Botão simples no dashboard,
  sem texto explicativo na UI.
- **Endereço:** autocomplete Google Places, normaliza formato padrão.
  Aceita fora da área; sinaliza pro admin decidir, não bloqueia.
- **Menores de idade:** campo de nascimento no cadastro; sem bloqueio
  automático — fica marcado pro admin revisar manualmente.
- **Duplicidade email/telefone:** erro inline se já existir.
- **Login:** ícone dedicado saiu da Home; volta a viver na tela de
  cadastro ("Já tem conta? Login aqui") + dentro do Menu/Perfil.
- **Cadastrar Serviço:** vive no Menu + banner discreto na Home.
- **Idioma:** centralizado só dentro do Menu/Perfil (removido do topo).
- **Ícone de Menu no topo:** removido — acesso só pela barra de baixo.
- **Busca no topo da Home:** removida — já existe na barra de baixo, sem
  duplicar.
- **Ícone de categoria (🏷️):** mantido no detalhe do serviço — era
  remoção minha por conta própria, revertida. Ícones no sketch são
  placeholder; versão final usa icon set próprio, não emoji.
- **Telefone/Email:** telefone com máscara `(xx) xxxxx-xxxx` automática;
  email valida formato.
- **Galeria de fotos:** saiu do formulário de cadastro. Pessoa cai na
  tela do próprio serviço (pós-cadastro) e adiciona fotos por lá, quando
  quiser.
- **Menu vira Perfil:** pra quem já tem login + serviço, o mesmo espaço
  (mesma aba) passa a se chamar "Perfil", com foto/nome, lista "Meus
  Serviços" + adicionar mais, e tudo que tinha no Menu continua lá.
- **Adicionar à Tela Inicial:** migrou do onboarding pro Menu/Perfil
  (fica sempre acessível). Android/Chrome pode ter botão de instalação
  em 1 clique; iPhone/Safari não permite isso (restrição da Apple),
  precisa de passo manual guiado.
- **Design system:** paleta e tipografia aprovadas.
