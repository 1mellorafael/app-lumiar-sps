'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { capitalizeWords, formatarTelefone } from '@/lib/utils'

export function PerfilForm({
  nomeInicial,
  telefoneInicial,
}: {
  nomeInicial: string
  telefoneInicial: string
}) {
  const [nome, setNome] = useState(nomeInicial)
  const [telefone, setTelefone] = useState(formatarTelefone(telefoneInicial))
  const [error, setError] = useState<string | null>(null)
  const [errorField, setErrorField] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [salvo, setSalvo] = useState(false)

  const handleNomeBlur = () => setNome((v) => capitalizeWords(v))

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setErrorField(null)
    setSalvo(false)
    setSubmitting(true)

    try {
      const res = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Não foi possível salvar.')
        setErrorField(data.field ?? null)
        return
      }

      setSalvo(true)
      setTimeout(() => setSalvo(false), 2000)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="nome" className="text-neutral-text block text-sm font-medium">
          Nome
        </label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={handleNomeBlur}
          required
        />
      </div>

      <div>
        <label
          htmlFor="telefone"
          className="text-neutral-text block text-sm font-medium"
        >
          Telefone
        </label>
        <Input
          id="telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          placeholder="(22) 99999-9999"
          maxLength={18}
          aria-invalid={errorField === 'telefone'}
          required
        />
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          'Salvando...'
        ) : salvo ? (
          <>
            <Check className="size-4" />
            Salvo!
          </>
        ) : (
          'Salvar'
        )}
      </Button>
    </form>
  )
}
