'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/page-header'
import { createClient } from '@/lib/supabase/client'
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
} from '@/lib/password-strength'

// Chega aqui pelo link do email (resetPasswordForEmail) — o Supabase já
// estabelece a sessão de recuperação sozinho a partir do token na URL,
// não precisa de rota de API pra isso, só o updateUser do client
export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (novaSenha !== confirmaSenha) {
      setError('As senhas não combinam')
      return
    }
    if (novaSenha.length < 6) {
      setError('Senha precisa ter no mínimo 6 caracteres')
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha,
      })

      if (updateError) {
        setError(
          'Não foi possível trocar a senha. O link pode ter expirado — peça um novo.'
        )
        return
      }

      setSucesso(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sucesso) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <h1 className="text-primary-500 text-lg font-bold">Senha trocada!</h1>
        <p className="text-muted-foreground text-sm">Levando pro login...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Nova Senha" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="novaSenha"
            className="text-neutral-text block text-sm font-medium"
          >
            Nova senha
          </label>
          <Input
            id="novaSenha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="••••••"
            required
          />
          {novaSenha.length > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <div className="bg-muted flex h-1 flex-1 gap-1 overflow-hidden rounded-full">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-full flex-1 rounded-full transition-colors ${
                      getPasswordStrength(novaSenha) >= level
                        ? getPasswordStrength(novaSenha) === 1
                          ? 'bg-destructive'
                          : getPasswordStrength(novaSenha) === 2
                            ? 'bg-secondary'
                            : 'bg-primary'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-xs">
                {PASSWORD_STRENGTH_LABEL[getPasswordStrength(novaSenha)]}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmaSenha"
            className="text-neutral-text block text-sm font-medium"
          >
            Confirmar nova senha
          </label>
          <Input
            id="confirmaSenha"
            type="password"
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
            placeholder="••••••"
            required
          />
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Trocar senha'}
        </Button>
      </form>
    </main>
  )
}
