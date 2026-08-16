'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { getCategoria, PRESTADORES } from '@/lib/mock-data'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { ServiceCard, type CardVariant } from '@/components/busca/service-card'
import { VariantToggle } from '@/components/busca/variant-toggle'

const PAGE_SIZE = 10

export default function CategoriaResultadosPage() {
  const params = useParams<{ slug: string }>()
  const categoria = getCategoria(params.slug)
  const [view, setView] = useState<ViewMode>('list')
  const [cardVariant, setCardVariant] = useState<CardVariant>('a')
  const [listVariant, setListVariant] = useState<CardVariant>('a')
  const [page, setPage] = useState(1)

  const resultados = useMemo(
    () => PRESTADORES.filter((p) => p.categoriaSlug === params.slug),
    [params.slug]
  )

  const totalPages = Math.max(1, Math.ceil(resultados.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginados = resultados.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  if (!categoria) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Categoria não encontrada.
        </p>
        <Link
          href="/categorias"
          className="text-primary-500 text-sm font-medium hover:underline"
        >
          Voltar pra Categorias
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Link
        href="/categorias"
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-primary-500 flex items-center gap-2 text-lg font-bold">
          <categoria.icon className="size-5" />
          {categoria.nome}
        </h1>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {/* Comparador de layout — temporário, pra decidir o design final */}
      {view === 'cards' ? (
        <VariantToggle
          label="Estilo do card"
          value={cardVariant}
          onChange={setCardVariant}
        />
      ) : (
        <VariantToggle
          label="Estilo da lista"
          value={listVariant}
          onChange={setListVariant}
        />
      )}

      {paginados.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          Nenhum serviço encontrado nessa categoria ainda.
        </p>
      ) : (
        <>
          <div
            className={
              view === 'cards'
                ? cardVariant === 'a'
                  ? 'grid grid-cols-2 gap-2'
                  : 'flex flex-col gap-2'
                : 'flex flex-col gap-2'
            }
          >
            {paginados.map((prestador) => (
              <ServiceCard
                key={prestador.id}
                prestador={prestador}
                view={view}
                variant={view === 'cards' ? cardVariant : listVariant}
                hideCategoria
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="border-border text-foreground flex size-8 items-center justify-center rounded-md border disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-muted-foreground text-sm">
                {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                className="border-border text-foreground flex size-8 items-center justify-center rounded-md border disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
