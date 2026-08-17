'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Link2, Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VoltarButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar"
      className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
    >
      <ArrowLeft className="size-4" />
      Voltar
    </button>
  )
}

export function ServicoActions({ nomeServico }: { nomeServico: string }) {
  const [copiado, setCopiado] = useState<'sucesso' | 'erro' | null>(null)

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado('sucesso')
    } catch {
      setCopiado('erro')
    }
    setTimeout(() => setCopiado(null), 2000)
  }

  async function compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({ title: nomeServico, url: window.location.href })
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          await copiarLink()
        }
      }
    } else {
      await copiarLink()
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="flex-1" onClick={copiarLink}>
        {copiado === 'sucesso' ? <Check /> : <Link2 />}
        {copiado === 'sucesso'
          ? 'Copiado!'
          : copiado === 'erro'
            ? 'Não foi possível copiar'
            : 'Copiar link'}
      </Button>
      <Button variant="outline" className="flex-1" onClick={compartilhar}>
        <Share2 />
        Compartilhar
      </Button>
    </div>
  )
}
