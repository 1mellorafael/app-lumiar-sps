import { Sun, Cloud, CloudRain, type LucideIcon } from 'lucide-react'

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

// Dados ilustrativos — mesma ressalva do horário de ônibus, troca quando
// tiver fonte real de previsão
const PREVISAO_SEMANA: DiaPrevisao[] = [
  { dia: 'Hoje', condition: 'ensolarado', max: 22, min: 14 },
  { dia: 'Amanhã', condition: 'ensolarado', max: 23, min: 15 },
  { dia: 'Qua', condition: 'nublado', max: 20, min: 13 },
  { dia: 'Qui', condition: 'chuvoso', max: 18, min: 12 },
  { dia: 'Sex', condition: 'chuvoso', max: 19, min: 13 },
  { dia: 'Sáb', condition: 'nublado', max: 21, min: 14 },
  { dia: 'Dom', condition: 'ensolarado', max: 23, min: 15 },
]

// Carrossel horizontal com a semana inteira — widget completo, sem link
// pra lugar nenhum (o próprio celular já tem app de clima)
export function WeeklyForecast() {
  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ msOverflowStyle: 'none' }}
    >
      {PREVISAO_SEMANA.map((dia, idx) => {
        const Icon = ICONS[dia.condition]
        const hoje = idx === 0
        return (
          <div
            key={dia.dia}
            className={
              hoje
                ? 'bg-primary-500 flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2'
                : 'border-border/70 bg-card flex shrink-0 flex-col items-center gap-1 rounded-lg border px-3 py-2'
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
  )
}
