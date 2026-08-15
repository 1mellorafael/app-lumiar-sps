'use client'

import { useState } from 'react'
import { CATEGORIAS } from '@/lib/mock-data'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { CategoryList } from '@/components/categorias/category-list'

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

      <CategoryList
        categorias={preview}
        view={view}
        trailing={{ href: '/categorias', label: 'Ver todas' }}
      />
    </section>
  )
}
