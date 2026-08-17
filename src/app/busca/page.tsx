'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORIAS, NEGOCIOS } from '@/lib/mock-data'
import { normalizeSearch } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { CategoryList } from '@/components/categorias/category-list'
import { ServiceCard, type CardVariant } from '@/components/busca/service-card'
import { VariantToggle } from '@/components/busca/variant-toggle'

const PAGE_SIZE = 10

export default function BuscaPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [view, setView] = useState<ViewMode>('cards')
  const [cardVariant, setCardVariant] = useState<CardVariant>('a')
  const [listVariant, setListVariant] = useState<CardVariant>('a')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const handleFocusSearch = () => inputRef.current?.focus()
    window.addEventListener('focus-search-input', handleFocusSearch)
    return () =>
      window.removeEventListener('focus-search-input', handleFocusSearch)
  }, [])

  useEffect(() => {
    // Rolar a lista de resultados dispensa o teclado — mesmo padrão do
    // iOS Mail/Mensagens ("scroll-to-dismiss")
    const handleScroll = () => {
      if (document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const resultados = useMemo(() => {
    if (!query) return []
    const q = normalizeSearch(query)
    return NEGOCIOS.filter(
      (n) =>
        normalizeSearch(n.nomeNegocio).includes(q) ||
        normalizeSearch(n.descricao).includes(q)
    )
  }, [query])

  const totalPages = Math.max(1, Math.ceil(resultados.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginados = resultados.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <h1 className="text-primary-500 text-lg font-bold">Busca</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            onKeyDown={(e) => {
              // Enter (tecla "Buscar" do teclado mobile) confirma e some
              if (e.key === 'Enter') inputRef.current?.blur()
            }}
            enterKeyHint="search"
            placeholder="Buscar por nome ou negócio..."
            className="pl-8 pr-8"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setPage(1)
                inputRef.current?.blur()
              }}
              aria-label="Limpar busca"
              className="text-muted-foreground hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {!query && <CategoryList categorias={CATEGORIAS} view={view} />}

      {query && (
        <>
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
              Nenhum negócio encontrado.
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
        </>
      )}
    </main>
  )
}
