'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

// Tile "Compartilhar app" — usa a share sheet nativa quando existe
// (celular), cai pra copiar link quando não existe (desktop)
export function ShareAppCard() {
  const [copiado, setCopiado] = useState(false)

  async function compartilhar() {
    const url = window.location.origin
    if (navigator.share) {
      try {
        await navigator.share({ title: 'App de Lumiar/São Pedro da Serra', url })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        // cai pro clipboard abaixo se o share sheet falhar
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // sem permissão de clipboard — sem feedback melhor a oferecer aqui
    }
  }

  return (
    <button
      type="button"
      onClick={compartilhar}
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200 ease-out"
    >
      {copiado ? (
        <Check className="text-primary-500 size-5" />
      ) : (
        <Share2 className="text-secondary-500 size-5" />
      )}
      <p className="text-card-foreground text-xs font-medium">Divulgar</p>
      <span className="text-secondary-600 text-xs font-semibold">
        {copiado ? 'Link copiado!' : 'Compartilhar'}
      </span>
    </button>
  )
}
