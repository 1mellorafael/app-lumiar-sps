import {
  Bike,
  Sparkles,
  Navigation,
  Car,
  Scissors,
  Dog,
  Cat,
  Store,
  Baby,
  GraduationCap,
  Brain,
  Palette,
  type LucideIcon,
} from 'lucide-react'

export type Categoria = {
  slug: string
  nome: string
  icon: LucideIcon
}

// Mesma ordem/lista do seed em database/schema.sql
export const CATEGORIAS: Categoria[] = [
  { slug: 'motoboy', nome: 'Motoboy', icon: Bike },
  { slug: 'faxina', nome: 'Faxina', icon: Sparkles },
  { slug: 'mototaxi', nome: 'Mototáxi', icon: Navigation },
  { slug: 'uber', nome: 'Uber', icon: Car },
  { slug: 'estetica', nome: 'Estética', icon: Scissors },
  { slug: 'adestramento', nome: 'Adestramento', icon: Dog },
  { slug: 'hospedagem-pet', nome: 'Hospedagem Pet', icon: Cat },
  { slug: 'lojas', nome: 'Lojas', icon: Store },
  { slug: 'baba', nome: 'Babá', icon: Baby },
  { slug: 'educacao', nome: 'Educação', icon: GraduationCap },
  { slug: 'psicologo', nome: 'Psicólogo', icon: Brain },
  { slug: 'artes', nome: 'Artes', icon: Palette },
]

export function getCategoria(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug)
}

export type HorarioBloco = {
  dias: string // texto livre por enquanto — ex: "Seg-Sex", "Todos os dias"
  abre: string // "09:00"
  fecha: string // "18:00"
}

export type Negocio = {
  id: string
  nome: string
  nomeNegocio: string
  categoriaSlug: string
  descricao: string
  whatsapp: string
  telefoneDisplay: string
  // Distrito é sempre público (chip curto nos cards/lista). Diferente do
  // endereço da CONTA (Passo 1 do cadastro), que é dado sensível — este
  // aqui é o endereço do NEGÓCIO, opcional, que o dono escolhe
  // divulgar (ex: "atendo só em domicílio" → nem preenche)
  localizacao: 'Lumiar' | 'São Pedro da Serra'
  endereco?: string
  horarios?: HorarioBloco[]
  instagram?: string
}

// Chip curto pra caber no card/lista — "São Pedro da Serra" não cabe
export function localizacaoAbrev(loc: Negocio['localizacao']): string {
  return loc === 'São Pedro da Serra' ? 'SPS' : 'Lumiar'
}

function formatHora(h: string): string {
  const [hh, mm] = h.split(':')
  return mm === '00' ? `${Number(hh)}h` : `${Number(hh)}h${mm}`
}

// Resumo de 1 linha pro card/lista — a página de detalhe mostra todos
// os blocos, aqui só o primeiro (+N se tiver mais)
export function horarioResumo(horarios?: HorarioBloco[]): string | null {
  if (!horarios || horarios.length === 0) return null
  const [primeiro, ...resto] = horarios
  const base = `${primeiro.dias} ${formatHora(primeiro.abre)}-${formatHora(primeiro.fecha)}`
  return resto.length > 0 ? `${base} +${resto.length}` : base
}

export function getNegocio(id: string): Negocio | undefined {
  return NEGOCIOS.find((p) => p.id === id)
}

// Dados fake pra Fase 1 (telas estáticas) — substituído por dados reais
// do Supabase na Fase 2/3
export const NEGOCIOS: Negocio[] = [
  {
    id: '1',
    nome: 'João da Silva',
    nomeNegocio: 'Motoboy João - Entrega Rápida',
    categoriaSlug: 'motoboy',
    descricao: 'Entrego qualquer coisa. Rápido e seguro, todo dia até 22h.',
    whatsapp: '5521987654321',
    telefoneDisplay: '(21) 98765-4321',
    localizacao: 'Lumiar',
    // Sem endereço — atende em movimento, não faz sentido divulgar local fixo
    horarios: [{ dias: 'Todos os dias', abre: '08:00', fecha: '22:00' }],
    instagram: 'joao_moto',
  },
  {
    id: '2',
    nome: 'Maria Aparecida',
    nomeNegocio: 'Faxina da Maria',
    categoriaSlug: 'faxina',
    descricao: 'Faxina completa, com ou sem produtos. Referências na região.',
    whatsapp: '5521987654322',
    telefoneDisplay: '(21) 98765-4322',
    localizacao: 'São Pedro da Serra',
    // Sem horário preenchido — dona do negócio ainda não quis marcar
  },
  {
    id: '3',
    nome: 'Carlos Mototáxi',
    nomeNegocio: 'Carlão Mototáxi',
    categoriaSlug: 'mototaxi',
    descricao: 'Corridas em Lumiar e São Pedro, 24h.',
    whatsapp: '5521987654323',
    telefoneDisplay: '(21) 98765-4323',
    localizacao: 'Lumiar',
    horarios: [{ dias: 'Todos os dias', abre: '00:00', fecha: '23:59' }],
    instagram: 'carlao_mototaxi',
  },
  {
    id: '4',
    nome: 'Pedro Santos',
    nomeNegocio: 'Pedro Uber',
    categoriaSlug: 'uber',
    descricao: 'Carro confortável, ar-condicionado. Viagens até Nova Friburgo.',
    whatsapp: '5521987654324',
    telefoneDisplay: '(21) 98765-4324',
    localizacao: 'Lumiar',
  },
  {
    id: '5',
    nome: 'Ana Beatriz',
    nomeNegocio: 'Espaço Bela Ana',
    categoriaSlug: 'estetica',
    descricao:
      'Manicure, pedicure, sobrancelha e depilação. Atendo em domicílio ou no espaço, marcação por WhatsApp com pelo menos um dia de antecedência. Trabalho com esmaltação em gel e uso só produtos de primeira linha, sempre esterilizados entre um atendimento e outro.',
    whatsapp: '5521987654325',
    telefoneDisplay: '(21) 98765-4325',
    localizacao: 'São Pedro da Serra',
    endereco: 'Rua das Flores, 123 - Centro',
    horarios: [
      { dias: 'Seg-Sex', abre: '09:00', fecha: '19:00' },
      { dias: 'Sáb', abre: '09:00', fecha: '13:00' },
    ],
    instagram: 'espacobelaana',
  },
  {
    id: '6',
    nome: 'Roberto Dias',
    nomeNegocio: 'Adestra Bicho',
    categoriaSlug: 'adestramento',
    descricao: 'Adestramento básico e comportamental, cães de todas as idades.',
    whatsapp: '5521987654326',
    telefoneDisplay: '(21) 98765-4326',
    localizacao: 'Lumiar',
    instagram: 'adestrabicho',
  },
  {
    id: '7',
    nome: 'Fernanda Lima',
    nomeNegocio: 'Hotel Pet da Fê',
    categoriaSlug: 'hospedagem-pet',
    descricao: 'Hospedagem com carinho pro seu pet enquanto você viaja.',
    whatsapp: '5521987654327',
    telefoneDisplay: '(21) 98765-4327',
    localizacao: 'São Pedro da Serra',
    endereco: 'Estrada do Rio Bonito, km 3',
    instagram: 'hotelpetdafe',
  },
  {
    id: '8',
    nome: 'José Ferreira',
    nomeNegocio: 'Mercadinho do Zé',
    categoriaSlug: 'lojas',
    descricao: 'Mercearia com produtos frescos direto da roça.',
    whatsapp: '5521987654328',
    telefoneDisplay: '(21) 98765-4328',
    localizacao: 'Lumiar',
    endereco: 'Rua Principal, 45',
    horarios: [{ dias: 'Seg-Dom', abre: '07:00', fecha: '20:00' }],
  },
  {
    id: '9',
    nome: 'Juliana Costa',
    nomeNegocio: 'Baby Ju',
    categoriaSlug: 'baba',
    descricao: 'Babá experiente, referências de famílias da região.',
    whatsapp: '5521987654329',
    telefoneDisplay: '(21) 98765-4329',
    localizacao: 'São Pedro da Serra',
  },
  {
    id: '10',
    nome: 'Marcos Vinícius',
    nomeNegocio: 'Reforço Escolar MV',
    categoriaSlug: 'educacao',
    descricao: 'Aulas de reforço pra ensino fundamental e médio.',
    whatsapp: '5521987654330',
    telefoneDisplay: '(21) 98765-4330',
    localizacao: 'Lumiar',
    instagram: 'reforcomv',
  },
  {
    id: '11',
    nome: 'Camila Rocha',
    nomeNegocio: 'Psicóloga Camila Rocha',
    categoriaSlug: 'psicologo',
    descricao: 'Atendimento psicológico presencial e online, CRP ativo.',
    whatsapp: '5521987654331',
    telefoneDisplay: '(21) 98765-4331',
    localizacao: 'São Pedro da Serra',
    horarios: [{ dias: 'Ter e Qui', abre: '14:00', fecha: '20:00' }],
    instagram: 'camilarocha.psi',
  },
  {
    id: '12',
    nome: 'Rafael Artes',
    nomeNegocio: 'Ateliê Rafael',
    categoriaSlug: 'artes',
    descricao: 'Pinturas, retratos e encomendas personalizadas.',
    whatsapp: '5521987654332',
    telefoneDisplay: '(21) 98765-4332',
    localizacao: 'Lumiar',
    instagram: 'atelierafael',
  },
  {
    id: '13',
    nome: 'Luciana Mendes',
    nomeNegocio: 'Faxina Express Luciana',
    categoriaSlug: 'faxina',
    descricao: 'Diaristas disponíveis de segunda a sábado.',
    whatsapp: '5521987654333',
    telefoneDisplay: '(21) 98765-4333',
    localizacao: 'São Pedro da Serra',
  },
  {
    id: '14',
    nome: 'Bruno Motoboy',
    nomeNegocio: 'Bruno Entregas',
    categoriaSlug: 'motoboy',
    descricao: 'Entrega de encomendas e documentos, mesmo dia.',
    whatsapp: '5521987654334',
    telefoneDisplay: '(21) 98765-4334',
    localizacao: 'Lumiar',
  },
  {
    id: '15',
    nome: 'Patrícia Gomes',
    nomeNegocio: 'Studio Patrícia Estética',
    categoriaSlug: 'estetica',
    descricao: 'Design de sobrancelha, cílios e limpeza de pele.',
    whatsapp: '5521987654335',
    telefoneDisplay: '(21) 98765-4335',
    localizacao: 'São Pedro da Serra',
    endereco: 'Centro',
    horarios: [{ dias: 'Seg-Sáb', abre: '08:30', fecha: '18:30' }],
    instagram: 'studiopatriciaestetica',
  },
]
