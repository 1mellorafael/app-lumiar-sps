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
            href={`/busca/${categoria.slug}`}
            className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col items-center gap-1 rounded-lg border px-1 py-3 text-center transition-all duration-200 ease-decelerate"
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
    <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col overflow-hidden rounded-lg border">
      {categorias.map((categoria, i) => (
        <Link
          key={categoria.slug}
          href={`/busca/${categoria.slug}`}
          className={cn(
            'hover:bg-accent active:bg-accent/70 flex items-center gap-3 px-2 py-2.5 transition-colors duration-150 ease-standard',
            i !== categorias.length - 1 && 'border-border/70 border-b'
          )}
        >
          <categoria.icon className="text-primary-500 size-5 shrink-0" />
          <span className="text-card-foreground text-sm">{categoria.nome}</span>
        </Link>
      ))}
    </div>
  )
}
