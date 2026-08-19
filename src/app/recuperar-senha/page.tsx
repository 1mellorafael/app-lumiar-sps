'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/page-header'

export default function RecuperarSenhaPage() {
  const [username, setUsername] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      setMensagem(
        data.message ??
          'Se esse usuário existir, mandamos um link de recuperação pro email cadastrado.'
      )
    } catch {
      setMensagem('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Recuperar Senha" />
      <p className="text-muted-foreground text-center text-sm">
        Informe seu usuário — mandamos um link pro email da conta
      </p>

      {mensagem ? (
        <p className="text-card-foreground border-border/70 bg-card shadow-[var(--shadow-card)] rounded-lg border p-4 text-center text-sm">
          {mensagem}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="username"
              className="text-neutral-text block text-sm font-medium"
            >
              Usuário
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu_usuario"
              autoCapitalize="none"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar link'}
          </Button>
        </form>
      )}
    </main>
  )
}
