import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Categoria } from '@/lib/mock-data'
import type { ViewMode } from '@/components/shared/view-toggle'
import { cn } from '@/lib/utils'

type Trailing = {
  href: string
  label: string
}

type CategoryListProps = {
  categorias: Categoria[]
  view: ViewMode
  // Célula extra ao final (ex: "Ver todas" na Home) — estilo distinto
  // das categorias normais, mas ocupa a mesma grade/lista
  trailing?: Trailing
}

// Clicar numa categoria abre direto a Busca filtrada por ela (ver
// docs/10_WIREFRAMES_SKETCH_BAIXO.md, seção 2️⃣)
export function CategoryList({
  categorias,
  view,
  trailing,
}: CategoryListProps) {
  const total = categorias.length + (trailing ? 1 : 0)

  if (view === 'cards') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {categorias.map((categoria) => (
          <Link
            key={categoria.slug}
            href={`/buscar?categoria=${categoria.slug}`}
            className="border-border bg-card hover:bg-accent flex flex-col items-center gap-1 rounded-lg border px-1 py-3 text-center transition-colors"
          >
            <categoria.icon className="text-primary-500 size-6" />
            <span className="text-card-foreground text-xs leading-tight">
              {categoria.nome}
            </span>
          </Link>
        ))}
        {trailing && (
          <Link
            href={trailing.href}
            className="border-primary-500 text-primary-500 hover:bg-accent flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-1 py-3 text-center transition-colors"
          >
            <ArrowRight className="size-6" />
            <span className="text-xs font-medium leading-tight">
              {trailing.label}
            </span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {categorias.map((categoria, i) => (
        <Link
          key={categoria.slug}
          href={`/buscar?categoria=${categoria.slug}`}
          className={cn(
            'border-border bg-card hover:bg-accent flex items-center gap-3 border-x border-b px-2 py-2.5 transition-colors',
            i === 0 && 'rounded-t-lg border-t',
            i === total - 1 && 'rounded-b-lg'
          )}
        >
          <categoria.icon className="text-primary-500 size-5 shrink-0" />
          <span className="text-card-foreground text-sm">{categoria.nome}</span>
        </Link>
      ))}
      {trailing && (
        <Link
          href={trailing.href}
          className="border-border bg-card text-primary-500 hover:bg-accent flex items-center justify-center gap-2 rounded-b-lg border-x border-b px-2 py-2.5 font-medium transition-colors"
        >
          {trailing.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
