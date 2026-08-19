import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { LinhaDetalheView } from '@/components/onibus/linha-detalhe-view'
import { LINHAS_ONIBUS } from '@/lib/bus-data'

export function generateStaticParams() {
  return LINHAS_ONIBUS.map((linha) => ({ codigo: linha.codigo }))
}

export default async function LinhaOnibusPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params
  const linha = LINHAS_ONIBUS.find((l) => l.codigo === codigo)
  if (!linha) notFound()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title={`${linha.codigo} ${linha.nome}`} backHref="/onibus" />
      <LinhaDetalheView linha={linha} />
    </main>
  )
}
