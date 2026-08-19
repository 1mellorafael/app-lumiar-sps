'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/page-header'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Não foi possível entrar.')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Entrar" />
      <p className="text-muted-foreground text-center text-sm">
        Acesse sua conta pra gerenciar seu negócio
      </p>

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
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu_usuario"
            autoCapitalize="none"
            required
          />
          <p className="mt-1 text-right text-xs">
            <Link
              href="/recuperar-usuario"
              className="text-primary-500 underline hover:no-underline"
            >
              Esqueci meu usuário
            </Link>
          </p>
        </div>

        <div>
          <label
            htmlFor="senha"
            className="text-neutral-text block text-sm font-medium"
          >
            Senha
          </label>
          <Input
            id="senha"
            name="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••"
            required
          />
          <p className="mt-1 text-right text-xs">
            <Link
              href="/recuperar-senha"
              className="text-primary-500 underline hover:no-underline"
            >
              Esqueci minha senha
            </Link>
          </p>
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Ainda não tem conta?{' '}
          <Link
            href="/cadastro"
            className="text-primary-500 underline hover:no-underline"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </main>
  )
}
