import { localizacaoAbrev, type Negocio } from '@/lib/mock-data'

// Formato comum que o ServiceCard entende — negócios mock (exemplo) e
// negócios reais (Supabase) têm campos diferentes, então cada fonte vira
// esse formato antes de chegar no card
export type NegocioCard = {
  id: string
  nomeNegocio: string
  categoriaSlugs: string[]
  descricao: string
  whatsapp: string
  telefoneDisplay: string
  localizacaoLabel?: string
  fotoPrincipalUrl?: string | null
  fotoPrincipalPos?: { x: number; y: number }
}

export function mockToCard(n: Negocio): NegocioCard {
  return {
    id: n.id,
    nomeNegocio: n.nomeNegocio,
    categoriaSlugs: [n.categoriaSlug],
    descricao: n.descricao,
    whatsapp: n.whatsapp,
    telefoneDisplay: n.telefoneDisplay,
    localizacaoLabel: localizacaoAbrev(n.localizacao),
  }
}
