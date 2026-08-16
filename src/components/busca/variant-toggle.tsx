'use client'

import { cn } from '@/lib/utils'
import type { CardVariant } from './service-card'

type VariantToggleProps = {
  label: string
  value: CardVariant
  onChange: (variant: CardVariant) => void
}

// Só pra fase de teste visual — comparar opções de layout lado a lado.
// Remover quando o design for decidido (docs/10_WIREFRAMES_SKETCH_BAIXO.md)
export function VariantToggle({ label, value, onChange }: VariantToggleProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="border-border bg-background inline-flex overflow-hidden rounded-md border">
        {(['a', 'b'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              'w-6 py-1 font-medium uppercase transition-colors',
              value === v
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
