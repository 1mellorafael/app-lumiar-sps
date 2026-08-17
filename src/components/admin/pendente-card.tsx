'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Phone, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Pendente = {
  id: string
  nomeServico: string
  categoriaNome: string
  telefoneContato: string
  descricao: string | null
  fotoPrincipalUrl: string | null
  criadoEm: string
}

export function PendenteCard({ pendente }: { pendente: Pendente }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'ativo' | 'rejeitado' | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function atualizarStatus(status: 'ativo' | 'rejeitado') {
    setLoading(status)
    setErro(null)
    try {
      const res = await fetch(`/api/admin/prestadores/${pendente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setErro(data?.error ?? 'Não foi possível atualizar.')
        return
      }
      router.refresh()
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="bg-muted size-12 shrink-0 overflow-hidden rounded-full">
          {pendente.fotoPrincipalUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pendente.fotoPrincipalUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-card-foreground truncate text-sm font-semibold">
            {pendente.nomeServico}
          </p>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Tag className="size-3" />
            {pendente.categoriaNome}
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Phone className="size-3" />
            {pendente.telefoneContato}
          </div>
        </div>
      </div>

      {pendente.descricao && (
        <p className="text-card-foreground text-xs">{pendente.descricao}</p>
      )}

      {erro && <p className="text-destructive text-xs">{erro}</p>}

      <div className="flex gap-2">
        <Button
          className="flex-1"
          size="sm"
          disabled={loading !== null}
          onClick={() => atualizarStatus('ativo')}
        >
          <Check className="mr-1 size-3.5" />
          {loading === 'ativo' ? 'Aprovando...' : 'Aprovar'}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          size="sm"
          disabled={loading !== null}
          onClick={() => atualizarStatus('rejeitado')}
        >
          <X className="mr-1 size-3.5" />
          {loading === 'rejeitado' ? 'Rejeitando...' : 'Rejeitar'}
        </Button>
      </div>
    </div>
  )
}
