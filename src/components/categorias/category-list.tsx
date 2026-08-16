import Link from 'next/link'
import type { Categoria } from '@/lib/mock-data'
import type { ViewMode } from '@/components/shared/view-toggle'
import { cn } from '@/lib/utils'

type CategoryListProps = {
  categorias: Categoria[]
  view: ViewMode
}

// Clicar numa categoria abre a tela própria de resultados
// (docs/10_WIREFRAMES_SKETCH_BAIXO.md, seção 2️⃣)
export function CategoryList({ categorias, view }: CategoryListProps) {
  if (view === 'cards') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {categorias.map((categoria) => (
          <Link
            key={categoria.slug}
            href={`/categorias/${categoria.slug}`}
            className="border-border bg-card hover:bg-accent flex flex-col items-center gap-1 rounded-lg border px-1 py-3 text-center transition-colors"
          >
            <categoria.icon className="text-primary-500 size-6" />
            <span className="text-card-foreground text-xs leading-tight">
              {categoria.nome}
            </span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {categorias.map((categoria, i) => (
        <Link
          key={categoria.slug}
          href={`/categorias/${categoria.slug}`}
          className={cn(
            'border-border bg-card hover:bg-accent flex items-center gap-3 border-x border-b px-2 py-2.5 transition-colors',
            i === 0 && 'rounded-t-lg border-t',
            i === categorias.length - 1 && 'rounded-b-lg'
          )}
        >
          <categoria.icon className="text-primary-500 size-5 shrink-0" />
          <span className="text-card-foreground text-sm">{categoria.nome}</span>
        </Link>
      ))}
    </div>
  )
}
