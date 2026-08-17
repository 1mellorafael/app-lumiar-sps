'use client'

import { Smartphone } from 'lucide-react'
import { useInstallPrompt } from '@/lib/use-install-prompt'

// Tile "Adicionar à tela inicial" — some sozinho assim que o app já está
// instalado (não faz sentido continuar pedindo depois que a pessoa já fez)
export function InstallCard() {
  const { installed, promptInstall } = useInstallPrompt()

  if (installed) return null

  return (
    <button
      type="button"
      onClick={promptInstall}
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200 ease-decelerate"
    >
      <Smartphone className="text-primary-500 size-5" />
      <p className="text-card-foreground text-xs font-medium">
        Tela inicial
      </p>
      <span className="text-primary-500 text-xs font-semibold">
        Adicionar
      </span>
    </button>
  )
}
