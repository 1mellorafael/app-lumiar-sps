'use client'

import { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { PRESTADORES, getCategoria } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { ServiceCard } from '@/components/busca/service-card'

const PAGE_SIZE = 10

export function BuscarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoriaSlug = searchParams.get('categoria')
  const categoria = categoriaSlug ? getCategoria(categoriaSlug) : undefined

  const [view, setView] = useState<ViewMode>('cards')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return PRESTADORES.filter((p) => {
      const matchCategoria = categoriaSlug
        ? p.categoriaSlug === categoriaSlug
        : true
      const matchQuery = query
        ? p.nomeServico.toLowerCase().includes(query.toLowerCase()) ||
          p.descricao.toLowerCase().includes(query.toLowerCase())
        : true
      return matchCategoria && matchQuery
    })
  }, [categoriaSlug, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function clearCategoria() {
    router.push('/buscar')
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <h1 className="text-primary-500 text-lg font-bold">Buscar Serviços</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar por nome ou serviço..."
            className="pl-8"
          />
        </div>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {categoria && (
        <div className="flex items-center gap-2">
          <span className="bg-accent text-accent-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <categoria.icon className="size-3.5" />
            {categoria.nome}
            <button
              type="button"
              onClick={clearCategoria}
              aria-label="Remover filtro de categoria"
              className="ml-0.5 hover:opacity-70"
            >
              <X className="size-3.5" />
            </button>
          </span>
        </div>
      )}

      {paginated.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          Nenhum serviço encontrado.
        </p>
      ) : (
        <div
          className={
            view === 'cards' ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'
          }
        >
          {paginated.map((prestador) => (
            <ServiceCard key={prestador.id} prestador={prestador} view={view} />
          ))}
        </div>
      )}

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
    </main>
  )
}
