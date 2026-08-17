import { NEGOCIOS } from '@/lib/mock-data'
import { mockToCard } from '@/lib/negocio-card'
import { getNegociosAtivos } from '@/lib/negocios'
import { BuscaCategoriaClient } from './busca-categoria-client'

export default async function BuscaCategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const reais = await getNegociosAtivos()
  const negocios = [...reais, ...NEGOCIOS.map(mockToCard)]

  return <BuscaCategoriaClient slug={slug} negocios={negocios} />
}
