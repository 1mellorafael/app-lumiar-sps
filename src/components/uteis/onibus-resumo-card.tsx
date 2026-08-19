'use client'

import Link from 'next/link'
import { Bus, ChevronRight } from 'lucide-react'
import { LINHAS_ONIBUS, proximasPartidas } from '@/lib/bus-data'
import { useClientDate } from '@/lib/use-client-date'

// "Agora" só é lido no client (useClientDate) — no primeiro render
// (servidor) mostra "—" pra todas as linhas.
export function OnibusResumoCard() {
  const agora = useClientDate()

  return (
    <Link
      href="/onibus"
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col gap-2 rounded-lg border p-4 transition-all duration-200 ease-decelerate"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="text-primary-500 size-5" />
          <h2 className="text-neutral-text font-semibold">Horários de ônibus</h2>
        </div>
        <ChevronRight className="text-muted-foreground size-4 shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {LINHAS_ONIBUS.filter((linha) => linha.codigo !== '49').map((linha) => {
          const proximas = agora ? proximasPartidas(linha, agora, 2) : []
          return (
            <div key={linha.codigo} className="border-border/70 rounded-lg border p-2.5">
              <p className="text-neutral-text text-xs font-medium">
                {linha.codigo} {linha.nome}
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">
                {proximas.length > 0
                  ? proximas.map((p) => `${p.hora}${p.amanha ? ' (amanhã)' : ''}`).join(' · ')
                  : '—'}
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-muted-foreground text-[11px] italic">Toque pra ver os horários completos</p>
    </Link>
  )
}
