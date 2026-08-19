'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { LINHAS_ONIBUS, proximasPartidas } from '@/lib/bus-data'
import { useClientDate } from '@/lib/use-client-date'

export function OnibusLista() {
  const agora = useClientDate()

  return (
    <div className="flex flex-col gap-2">
      {LINHAS_ONIBUS.map((linha) => {
        const proximas = agora ? proximasPartidas(linha, agora, 2) : []
        return (
          <Link
            key={linha.codigo}
            href={`/onibus/${linha.codigo}`}
            className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex items-center justify-between gap-2 rounded-lg border p-4 transition-all duration-200 ease-decelerate"
          >
            <div>
              <p className="text-neutral-text font-semibold">
                {linha.codigo} {linha.nome}
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">
                {proximas.length > 0
                  ? proximas.map((p) => `${p.hora}${p.amanha ? ' (amanhã)' : ''}`).join(' · ')
                  : '—'}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground size-4 shrink-0" />
          </Link>
        )
      })}
    </div>
  )
}
