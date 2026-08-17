import { NEGOCIOS } from '@/lib/mock-data'
import { mockToCard } from '@/lib/negocio-card'
import { getNegociosAtivos } from '@/lib/negocios'
import { BuscaClient } from './busca-client'

// Sem cookies() nem outra API dinâmica aqui (getNegociosAtivos usa client
// público, de propósito, pra poder cachear) — o Next tentava pré-renderar
// isso como página estática NO BUILD, onde as env vars do Supabase não
// estão disponíveis, e quebrava o deploy inteiro. Força sempre renderizar
// na hora da requisição (onde o cache de 30s dentro de getNegociosAtivos
// já resolve a performance).
export const dynamic = 'force-dynamic'

export default async function BuscaPage() {
  const reais = await getNegociosAtivos()
  const negocios = [...reais, ...NEGOCIOS.map(mockToCard)]

  return <BuscaClient negocios={negocios} />
}
