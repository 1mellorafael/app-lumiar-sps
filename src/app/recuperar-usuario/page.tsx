'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/page-header'

export default function RecuperarUsuarioPage() {
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/recuperar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setMensagem(data.message ?? 'Se esse email tiver uma conta, mandamos o usuário pra ele.')
    } catch {
      setMensagem('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Recuperar Usuário" />
      <p className="text-muted-foreground text-center text-sm">
        Informe o email da conta — mandamos seu usuário pra ele
      </p>

      {mensagem ? (
        <p className="text-card-foreground border-border/70 bg-card shadow-[var(--shadow-card)] rounded-lg border p-4 text-center text-sm">
          {mensagem}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="text-neutral-text block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar usuário'}
          </Button>
        </form>
      )}
    </main>
  )
}
