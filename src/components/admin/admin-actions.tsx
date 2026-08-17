'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mesma ação do card em /admin, só que a partir da página de detalhe —
// admin pode aprovar/rejeitar sem precisar voltar pra lista
export function AdminActions({ negocioId }: { negocioId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'ativo' | 'rejeitado' | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function atualizarStatus(status: 'ativo' | 'rejeitado') {
    setLoading(status)
    setErro(null)
    try {
      const res = await fetch(`/api/admin/negocios/${negocioId}`, {
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
    <div className="border-secondary-500 bg-secondary-500/10 flex flex-col gap-2 rounded-lg border p-3">
      <p className="text-secondary-700 text-sm font-medium">
        Ação de admin
      </p>
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
