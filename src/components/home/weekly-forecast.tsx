'use client'

import { useState } from 'react'
import { Sun, Cloud, CloudRain, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type WeatherCondition = 'ensolarado' | 'nublado' | 'chuvoso'

const ICONS: Record<WeatherCondition, LucideIcon> = {
  ensolarado: Sun,
  nublado: Cloud,
  chuvoso: CloudRain,
}

type DiaPrevisao = {
  dia: string
  condition: WeatherCondition
  max: number
  min: number
}

type Localizacao = 'lumiar' | 'sps'

const LOCALIZACOES: Record<Localizacao, { label: string; nome: string }> = {
  lumiar: { label: 'Lumiar', nome: 'Lumiar' },
  sps: { label: 'SPS', nome: 'São Pedro da Serra' },
}

// Dados ilustrativos — mesma ressalva do horário de ônibus, troca quando
// tiver fonte real de previsão. Lumiar e São Pedro da Serra são lugares
// distintos (não a mesma previsão) — diferença pequena aqui só pra
// deixar isso visualmente claro até ter dado real por localização.
const PREVISAO_POR_LOCAL: Record<Localizacao, DiaPrevisao[]> = {
  lumiar: [
    { dia: 'Hoje', condition: 'ensolarado', max: 22, min: 14 },
    { dia: 'Amanhã', condition: 'ensolarado', max: 23, min: 15 },
    { dia: 'Qua', condition: 'nublado', max: 20, min: 13 },
    { dia: 'Qui', condition: 'chuvoso', max: 18, min: 12 },
    { dia: 'Sex', condition: 'chuvoso', max: 19, min: 13 },
    { dia: 'Sáb', condition: 'nublado', max: 21, min: 14 },
    { dia: 'Dom', condition: 'ensolarado', max: 23, min: 15 },
  ],
  sps: [
    { dia: 'Hoje', condition: 'ensolarado', max: 21, min: 13 },
    { dia: 'Amanhã', condition: 'nublado', max: 21, min: 14 },
    { dia: 'Qua', condition: 'nublado', max: 19, min: 12 },
    { dia: 'Qui', condition: 'chuvoso', max: 17, min: 11 },
    { dia: 'Sex', condition: 'chuvoso', max: 18, min: 12 },
    { dia: 'Sáb', condition: 'chuvoso', max: 19, min: 13 },
    { dia: 'Dom', condition: 'ensolarado', max: 22, min: 14 },
  ],
}

// Carrossel horizontal com a semana inteira — widget completo, sem link
// pra lugar nenhum (o próprio celular já tem app de clima)
export function WeeklyForecast() {
  const [local, setLocal] = useState<Localizacao>('lumiar')
  const previsao = PREVISAO_POR_LOCAL[local]

  return (
    <div className="flex flex-col gap-2">
      <div
        role="group"
        aria-label="Alternar entre Lumiar e São Pedro da Serra"
        className="border-border bg-background inline-flex w-fit items-center rounded-lg border p-1"
      >
        {(Object.keys(LOCALIZACOES) as Localizacao[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={local === key}
            onClick={() => setLocal(key)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              local === key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {LOCALIZACOES[key].label}
          </button>
        ))}
      </div>

      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ msOverflowStyle: 'none' }}
      >
        {previsao.map((dia, idx) => {
          const Icon = ICONS[dia.condition]
          const hoje = idx === 0
          return (
            <div
              key={dia.dia}
              className={
                hoje
                  ? 'bg-primary-500 flex w-16 shrink-0 flex-col items-center gap-1 rounded-lg px-2 py-2'
                  : 'border-border/70 bg-card flex w-16 shrink-0 flex-col items-center gap-1 rounded-lg border px-2 py-2'
              }
            >
              <span
                className={
                  hoje
                    ? 'text-xs font-medium text-white'
                    : 'text-neutral-text text-xs font-medium'
                }
              >
                {dia.dia}
              </span>
              <Icon className={hoje ? 'size-5 text-white' : 'text-primary-500 size-5'} />
              <span className={hoje ? 'text-xs text-white' : 'text-neutral-text text-xs'}>
                {dia.max}°
              </span>
              <span
                className={hoje ? 'text-[11px] text-white/80' : 'text-muted-foreground text-[11px]'}
              >
                {dia.min}°
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-muted-foreground text-xs">
        {LOCALIZACOES[local].nome}
      </p>
    </div>
  )
}
