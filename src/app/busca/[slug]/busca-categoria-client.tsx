'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCategoria } from '@/lib/mock-data'
import type { NegocioCard } from '@/lib/negocio-card'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { ServiceCard, type CardVariant } from '@/components/busca/service-card'
import { VariantToggle } from '@/components/busca/variant-toggle'
import { PageHeader } from '@/components/shared/page-header'

const PAGE_SIZE = 10

export function BuscaCategoriaClient({
  slug,
  negocios,
}: {
  slug: string
  negocios: NegocioCard[]
}) {
  const categoria = getCategoria(slug)
  const [view, setView] = useState<ViewMode>('list')
  const [cardVariant, setCardVariant] = useState<CardVariant>('a')
  const [listVariant, setListVariant] = useState<CardVariant>('a')
  const [page, setPage] = useState(1)

  const resultados = useMemo(
    () => negocios.filter((n) => n.categoriaSlugs.includes(slug)),
    [negocios, slug]
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
          href="/busca"
          className="text-primary-500 text-sm font-medium hover:underline"
        >
          Voltar pra Categorias
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader
        title={
          <>
            <categoria.icon className="size-5" />
            {categoria.nome}
          </>
        }
        backHref="/busca"
      />

      <div className="flex justify-end">
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
          Nenhum negócio encontrado nessa categoria ainda.
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
            {paginados.map((negocio) => (
              <ServiceCard
                key={negocio.id}
                negocio={negocio}
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
