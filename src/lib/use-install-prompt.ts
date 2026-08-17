import { useEffect, useState, useSyncExternalStore } from 'react'

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

// Compartilhado entre o tile da Home e o botão do Menu — os dois usam o
// mesmo beforeinstallprompt (só um pode existir por vez no browser)
export function useInstallPrompt() {
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

  const canInstall = !installed && !!deferredPrompt

  const promptInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  return { installed, canInstall, promptInstall }
}
