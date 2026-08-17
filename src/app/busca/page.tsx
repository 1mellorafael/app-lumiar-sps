import { NEGOCIOS } from '@/lib/mock-data'
import { mockToCard } from '@/lib/negocio-card'
import { getNegociosAtivos } from '@/lib/negocios'
import { BuscaClient } from './busca-client'

export default async function BuscaPage() {
  const reais = await getNegociosAtivos()
  const negocios = [...reais, ...NEGOCIOS.map(mockToCard)]

  return <BuscaClient negocios={negocios} />
}
