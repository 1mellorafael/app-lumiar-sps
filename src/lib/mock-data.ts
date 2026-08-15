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

export type Prestador = {
  id: string
  nome: string
  nomeServico: string
  categoriaSlug: string
  descricao: string
  whatsapp: string
}

// Dados fake pra Fase 1 (telas estáticas) — substituído por dados reais
// do Supabase na Fase 2/3
export const PRESTADORES: Prestador[] = [
  {
    id: '1',
    nome: 'João da Silva',
    nomeServico: 'Motoboy João - Entrega Rápida',
    categoriaSlug: 'motoboy',
    descricao: 'Entrego qualquer coisa. Rápido e seguro, todo dia até 22h.',
    whatsapp: '5521987654321',
  },
  {
    id: '2',
    nome: 'Maria Aparecida',
    nomeServico: 'Faxina da Maria',
    categoriaSlug: 'faxina',
    descricao: 'Faxina completa, com ou sem produtos. Referências na região.',
    whatsapp: '5521987654322',
  },
  {
    id: '3',
    nome: 'Carlos Mototáxi',
    nomeServico: 'Carlão Mototáxi',
    categoriaSlug: 'mototaxi',
    descricao: 'Corridas em Lumiar e São Pedro, 24h.',
    whatsapp: '5521987654323',
  },
  {
    id: '4',
    nome: 'Pedro Santos',
    nomeServico: 'Pedro Uber',
    categoriaSlug: 'uber',
    descricao: 'Carro confortável, ar-condicionado. Viagens até Nova Friburgo.',
    whatsapp: '5521987654324',
  },
  {
    id: '5',
    nome: 'Ana Beatriz',
    nomeServico: 'Espaço Bela Ana',
    categoriaSlug: 'estetica',
    descricao: 'Manicure, pedicure e sobrancelha. Atendo em domicílio.',
    whatsapp: '5521987654325',
  },
  {
    id: '6',
    nome: 'Roberto Dias',
    nomeServico: 'Adestra Bicho',
    categoriaSlug: 'adestramento',
    descricao: 'Adestramento básico e comportamental, cães de todas as idades.',
    whatsapp: '5521987654326',
  },
  {
    id: '7',
    nome: 'Fernanda Lima',
    nomeServico: 'Hotel Pet da Fê',
    categoriaSlug: 'hospedagem-pet',
    descricao: 'Hospedagem com carinho pro seu pet enquanto você viaja.',
    whatsapp: '5521987654327',
  },
  {
    id: '8',
    nome: 'José Ferreira',
    nomeServico: 'Mercadinho do Zé',
    categoriaSlug: 'lojas',
    descricao: 'Mercearia com produtos frescos direto da roça.',
    whatsapp: '5521987654328',
  },
  {
    id: '9',
    nome: 'Juliana Costa',
    nomeServico: 'Baby Ju',
    categoriaSlug: 'baba',
    descricao: 'Babá experiente, referências de famílias da região.',
    whatsapp: '5521987654329',
  },
  {
    id: '10',
    nome: 'Marcos Vinícius',
    nomeServico: 'Reforço Escolar MV',
    categoriaSlug: 'educacao',
    descricao: 'Aulas de reforço pra ensino fundamental e médio.',
    whatsapp: '5521987654330',
  },
  {
    id: '11',
    nome: 'Camila Rocha',
    nomeServico: 'Psicóloga Camila Rocha',
    categoriaSlug: 'psicologo',
    descricao: 'Atendimento psicológico presencial e online, CRP ativo.',
    whatsapp: '5521987654331',
  },
  {
    id: '12',
    nome: 'Rafael Artes',
    nomeServico: 'Ateliê Rafael',
    categoriaSlug: 'artes',
    descricao: 'Pinturas, retratos e encomendas personalizadas.',
    whatsapp: '5521987654332',
  },
  {
    id: '13',
    nome: 'Luciana Mendes',
    nomeServico: 'Faxina Express Luciana',
    categoriaSlug: 'faxina',
    descricao: 'Diaristas disponíveis de segunda a sábado.',
    whatsapp: '5521987654333',
  },
  {
    id: '14',
    nome: 'Bruno Motoboy',
    nomeServico: 'Bruno Entregas',
    categoriaSlug: 'motoboy',
    descricao: 'Entrega de encomendas e documentos, mesmo dia.',
    whatsapp: '5521987654334',
  },
  {
    id: '15',
    nome: 'Patrícia Gomes',
    nomeServico: 'Studio Patrícia Estética',
    categoriaSlug: 'estetica',
    descricao: 'Design de sobrancelha, cílios e limpeza de pele.',
    whatsapp: '5521987654335',
  },
]
