'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CATEGORIAS } from '@/lib/mock-data'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'
import { CategoryList } from '@/components/categorias/category-list'

export default function CategoriasPage() {
  const [view, setView] = useState<ViewMode>('cards')

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Voltar"
          className="text-neutral-text hover:text-primary-500 flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <ViewToggle value={view} onChange={setView} />
      </header>

      <h1 className="text-primary-500 text-lg font-bold">
        Todas as Categorias
      </h1>

      <CategoryList categorias={CATEGORIAS} view={view} />
    </main>
  )
}
