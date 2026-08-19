'use client'

import { useMemo, useState } from 'react'
import { Calendar, List } from 'lucide-react'
import { PostCard } from '@/components/home/post-card'
import { MonthGrid, diaKey } from '@/components/agenda/month-grid'
import type { PostFeed } from '@/lib/posts-data'

type Modo = 'calendario' | 'lista'

function formatarCabecalhoDia(iso: string) {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Agrupa em blocos "Sáb, 23 ago" — cada evento já vem ordenado por data
function agruparPorDia(eventos: PostFeed[]) {
  const grupos: { chave: string; titulo: string; eventos: PostFeed[] }[] = []
  for (const evento of eventos) {
    if (!evento.dataEvento) continue
    const chave = diaKey(new Date(evento.dataEvento))
    const ultimo = grupos[grupos.length - 1]
    if (ultimo?.chave === chave) {
      ultimo.eventos.push(evento)
    } else {
      grupos.push({ chave, titulo: formatarCabecalhoDia(evento.dataEvento), eventos: [evento] })
    }
  }
  return grupos
}

export function AgendaView({ eventos }: { eventos: PostFeed[] }) {
  const [modo, setModo] = useState<Modo>('calendario')
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)

  const diasComEvento = useMemo(() => {
    const set = new Set<string>()
    eventos.forEach((e) => {
      if (e.dataEvento) set.add(diaKey(new Date(e.dataEvento)))
    })
    return set
  }, [eventos])

  const eventosFiltrados = useMemo(() => {
    if (!diaSelecionado) return eventos
    return eventos.filter((e) => e.dataEvento && diaKey(new Date(e.dataEvento)) === diaSelecionado)
  }, [eventos, diaSelecionado])

  const grupos = useMemo(() => agruparPorDia(eventosFiltrados), [eventosFiltrados])

  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-label="Alternar entre calendário e lista"
        className="border-border bg-background inline-flex items-center self-end rounded-lg border p-1"
      >
        <button
          type="button"
          aria-pressed={modo === 'calendario'}
          aria-label="Ver como calendário"
          onClick={() => setModo('calendario')}
          className={`rounded-md p-1.5 transition-colors ${
            modo === 'calendario'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="size-4" />
        </button>
        <button
          type="button"
          aria-pressed={modo === 'lista'}
          aria-label="Ver como lista"
          onClick={() => {
            setModo('lista')
            setDiaSelecionado(null)
          }}
          className={`rounded-md p-1.5 transition-colors ${
            modo === 'lista'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <List className="size-4" />
        </button>
      </div>

      {modo === 'calendario' && (
        <MonthGrid
          diasComEvento={diasComEvento}
          selecionado={diaSelecionado}
          onSelectDia={setDiaSelecionado}
        />
      )}

      {diaSelecionado && (
        <button
          type="button"
          onClick={() => setDiaSelecionado(null)}
          className="text-primary-500 self-start text-xs font-medium underline"
        >
          Ver todos os dias
        </button>
      )}

      {eventosFiltrados.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          {diaSelecionado ? 'Nenhum evento nesse dia.' : 'Nenhum evento marcado ainda.'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {grupos.map((grupo) => (
            <div key={grupo.chave} className="flex flex-col gap-2">
              <h2 className="text-neutral-text text-xs font-semibold">{grupo.titulo}</h2>
              <div className="flex flex-col gap-3">
                {grupo.eventos.map((evento) => (
                  <PostCard key={evento.id} post={evento} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
