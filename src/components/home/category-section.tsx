'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIAS } from '@/lib/mock-data'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { cn } from '@/lib/utils'

// Home mostra um recorte das categorias (12 células, última é "Ver
// todas"); a lista completa fica na tela própria de Categorias
const PREVIEW_COUNT = 11

export function CategorySection() {
  const [view, setView] = useState<ViewMode>('cards')
  const preview = CATEGORIAS.slice(0, PREVIEW_COUNT)

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-neutral-text text-sm font-semibold uppercase tracking-wide">
          Categorias
        </h2>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-3 gap-2">
          {preview.map((categoria) => (
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
          <Link
            href="/categorias"
            className="border-primary-500 text-primary-500 hover:bg-accent flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-1 py-3 text-center transition-colors"
          >
            <ArrowRight className="size-6" />
            <span className="text-xs font-medium leading-tight">Ver todas</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {preview.map((categoria, i) => (
            <Link
              key={categoria.slug}
              href={`/categorias/${categoria.slug}`}
              className={cn(
                'border-border bg-card hover:bg-accent flex items-center gap-3 px-2 py-2.5 transition-colors',
                i === 0 && 'rounded-t-lg border-t',
                'border-x border-b'
              )}
            >
              <categoria.icon className="text-primary-500 size-5 shrink-0" />
              <span className="text-card-foreground text-sm">
                {categoria.nome}
              </span>
            </Link>
          ))}
          <Link
            href="/categorias"
            className="border-border bg-card text-primary-500 hover:bg-accent flex items-center justify-center gap-2 rounded-b-lg border-x border-b px-2 py-2.5 font-medium transition-colors"
          >
            Ver todas
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  )
}
