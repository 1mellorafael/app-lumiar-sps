'use client'

import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'cards' | 'list'

type ViewToggleProps = {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

// Toggle Cards/Lista — reutilizado em Home, Categorias, Busca e Úteis
// (seção 9 do CLAUDE.md)
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Alternar entre cards e lista"
      className="border-border bg-background inline-flex items-center rounded-lg border p-1"
    >
      <button
        type="button"
        aria-pressed={value === 'cards'}
        aria-label="Ver como cards"
        onClick={() => onChange('cards')}
        className={cn(
          'rounded-md p-1.5 transition-colors',
          value === 'cards'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        aria-pressed={value === 'list'}
        aria-label="Ver como lista"
        onClick={() => onChange('list')}
        className={cn(
          'rounded-md p-1.5 transition-colors',
          value === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <List className="size-4" />
      </button>
    </div>
  )
}
