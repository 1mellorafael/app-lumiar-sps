'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatarTelefone } from '@/lib/utils'

// Negócio cadastrado direto pelo admin (sem dono ainda) — dono real
// precisa ter criado conta antes; admin só informa o telefone dela e a
// API confere se existe (senão, é a pessoa que precisa se cadastrar)
export function TransferirDono({ negocioId }: { negocioId: string }) {
  const router = useRouter()
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function transferir(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/negocios/${negocioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefoneNovoDono: telefone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.error ?? 'Não foi possível transferir.')
        return
      }
      router.refresh()
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={transferir}
      className="border-secondary-500 bg-secondary-500/10 flex flex-col gap-2 rounded-lg border p-3"
    >
      <p className="text-secondary-700 text-sm font-medium">
        Sem dono — transferir pra uma conta
      </p>
      <div className="flex gap-2">
        <Input
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          placeholder="(22) 99999-9999"
          maxLength={18}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={submitting}>
          <UserPlus className="mr-1 size-3.5" />
          {submitting ? 'Transferindo...' : 'Transferir'}
        </Button>
      </div>
      {erro && <p className="text-destructive text-xs">{erro}</p>}
      <p className="text-muted-foreground text-xs">
        A pessoa precisa já ter criado conta com esse telefone.
      </p>
    </form>
  )
}
