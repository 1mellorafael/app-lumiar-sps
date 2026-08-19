'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { ViewToggle, type ViewMode } from '@/components/shared/view-toggle'

const TELEFONES_UTEIS = [
  { categoria: 'Segurança', items: [
    { nome: 'Delegacia de Polícia', numero: '(24) 2522-2500' },
    { nome: 'Polícia Militar', numero: '190' },
  ]},
  { categoria: 'Saúde', items: [
    { nome: 'Hospital São Pedro', numero: '(24) 2522-1111' },
    { nome: 'UPA 24h', numero: '(24) 2522-3333' },
    { nome: 'Bombeiros', numero: '193' },
  ]},
  { categoria: 'Prefeitura', items: [
    { nome: 'Prefeitura de Nova Friburgo', numero: '(24) 2533-1000' },
    { nome: 'Defesa Civil', numero: '199' },
  ]},
]

// É a única seção que é de fato uma coleção de itens equivalentes (nome
// + número), então é a única que responde ao toggle Cards/Lista de
// verdade — mesmo padrão visual dos cards de negócio.
export function TelefonesUteisSection() {
  const [view, setView] = useState<ViewMode>('cards')

  return (
    <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="text-primary-500 size-5" />
          <h2 className="text-neutral-text font-semibold">Telefones úteis</h2>
        </div>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          {TELEFONES_UTEIS.map((grupo, idx) => (
            <div key={idx}>
              <h3 className="text-neutral-text mb-1 text-xs font-semibold">
                {grupo.categoria}
              </h3>
              <div className="space-y-1">
                {grupo.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={`tel:${item.numero.replace(/\D/g, '')}`}
                    className="hover:bg-accent active:bg-accent/70 -mx-1 flex items-center justify-between gap-2 rounded-md px-1 py-1 transition-colors duration-150 ease-standard"
                  >
                    <span className="text-neutral-text text-xs">
                      {item.nome}
                    </span>
                    <span className="text-primary-500 inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                      <Phone className="size-3" />
                      {item.numero}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {TELEFONES_UTEIS.flatMap((grupo) =>
            grupo.items.map((item, itemIdx) => (
              <a
                key={`${grupo.categoria}-${itemIdx}`}
                href={`tel:${item.numero.replace(/\D/g, '')}`}
                className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col gap-0.5 rounded-lg border p-2.5 transition-all duration-200 ease-decelerate"
              >
                <span className="text-muted-foreground text-[10px] uppercase tracking-wide">
                  {grupo.categoria}
                </span>
                <span className="text-neutral-text text-xs font-medium">
                  {item.nome}
                </span>
                <span className="text-primary-500 inline-flex items-center gap-1 text-xs font-semibold">
                  <Phone className="size-3" />
                  {item.numero}
                </span>
              </a>
            ))
          )}
        </div>
      )}
    </section>
  )
}
