'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Smartphone } from 'lucide-react'

// Evento não padronizado no lib.dom.d.ts — Chrome/Edge/Android o disparam
// antes do usuário instalar, guardamos pra chamar prompt() no clique
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari não tem display-mode: standalone, usa essa propriedade legada
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

// Estado de "já instalado" vem do browser (matchMedia + evento
// appinstalled), não do React — useSyncExternalStore evita o mismatch de
// hidratação (servidor não sabe se está instalado, sempre assume que não)
function subscribe(callback: () => void) {
  const mq = window.matchMedia('(display-mode: standalone)')
  mq.addEventListener('change', callback)
  window.addEventListener('appinstalled', callback)
  return () => {
    mq.removeEventListener('change', callback)
    window.removeEventListener('appinstalled', callback)
  }
}

function getServerSnapshot() {
  return false
}

// Tile "Adicionar à tela inicial" — some sozinho assim que o app já está
// instalado (não faz sentido continuar pedindo depois que a pessoa já fez)
export function InstallCard() {
  const installed = useSyncExternalStore(
    subscribe,
    isStandalone,
    getServerSnapshot
  )
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  if (installed) return null

  const handleClick = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200 ease-out"
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
