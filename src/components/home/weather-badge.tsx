import { Sun, Cloud, CloudRain, type LucideIcon } from 'lucide-react'

type WeatherCondition = 'ensolarado' | 'nublado' | 'chuvoso'

const ICONS: Record<WeatherCondition, LucideIcon> = {
  ensolarado: Sun,
  nublado: Cloud,
  chuvoso: CloudRain,
}

type WeatherBadgeProps = {
  tempC: number
  condition: WeatherCondition
}

// Versão compacta do clima (só ícone + graus) — fica no topo da Home.
// A versão completa (previsão, alerta) mora na aba Úteis (Fase 6).
export function WeatherBadge({ tempC, condition }: WeatherBadgeProps) {
  const Icon = ICONS[condition]

  return (
    <div className="text-neutral-text flex items-center gap-1 text-sm font-medium">
      <Icon className="text-primary-500 size-4" />
      <span>{tempC}°C</span>
    </div>
  )
}
