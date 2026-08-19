'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function diaKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function MonthGrid({
  diasComEvento,
  selecionado,
  onSelectDia,
}: {
  diasComEvento: Set<string>
  selecionado: string | null
  onSelectDia: (key: string | null) => void
}) {
  const hoje = new Date()
  const [mesAtual, setMesAtual] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1))

  const celulas = useMemo(() => {
    const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1)
    const totalDias = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate()
    const offset = primeiroDia.getDay()
    const dias: (Date | null)[] = Array(offset).fill(null)
    for (let dia = 1; dia <= totalDias; dia++) {
      dias.push(new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia))
    }
    return dias
  }, [mesAtual])

  const hojeKey = diaKey(hoje)

  return (
    <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Mês anterior"
          onClick={() =>
            setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
          }
          className="text-neutral-text hover:text-primary-500 active:scale-90 flex size-7 items-center justify-center rounded-full transition-transform"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-card-foreground text-sm font-semibold">
          {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
        </p>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() =>
            setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
          }
          className="text-neutral-text hover:text-primary-500 active:scale-90 flex size-7 items-center justify-center rounded-full transition-transform"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="text-muted-foreground py-1 text-[10px] font-medium">
            {d}
          </span>
        ))}
        {celulas.map((data, i) => {
          if (!data) return <span key={i} />
          const key = diaKey(data)
          const temEvento = diasComEvento.has(key)
          const isSelecionado = selecionado === key
          const isHoje = key === hojeKey
          return (
            <button
              key={i}
              type="button"
              disabled={!temEvento}
              onClick={() => onSelectDia(isSelecionado ? null : key)}
              className={`relative flex aspect-square items-center justify-center rounded-full text-xs transition-colors ${
                isSelecionado
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : temEvento
                    ? 'text-card-foreground hover:bg-muted font-medium'
                    : 'text-muted-foreground/50'
              } ${isHoje && !isSelecionado ? 'ring-primary-500 ring-1' : ''}`}
            >
              {data.getDate()}
              {temEvento && !isSelecionado && (
                <span className="bg-primary-500 absolute bottom-0.5 size-1 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
