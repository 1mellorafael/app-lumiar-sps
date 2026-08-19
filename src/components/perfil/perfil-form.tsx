'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhotoCropField } from '@/components/cadastro-negocio/photo-crop-field'
import { capitalizeWords, formatarTelefone } from '@/lib/utils'
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
} from '@/lib/password-strength'

export function PerfilForm({
  nomeInicial,
  telefoneInicial,
  email,
  fotoInicial,
}: {
  nomeInicial: string
  telefoneInicial: string
  email: string
  fotoInicial: string | null
}) {
  const [nome, setNome] = useState(nomeInicial)
  const [telefone, setTelefone] = useState(formatarTelefone(telefoneInicial))
  const [error, setError] = useState<string | null>(null)
  const [errorField, setErrorField] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [fotoError, setFotoError] = useState<string | null>(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaNovaSenha, setConfirmaNovaSenha] = useState('')
  const [senhaError, setSenhaError] = useState<string | null>(null)
  const [senhaErrorField, setSenhaErrorField] = useState<string | null>(null)
  const [trocandoSenha, setTrocandoSenha] = useState(false)
  const [senhaTrocada, setSenhaTrocada] = useState(false)

  const handleNomeBlur = () => setNome((v) => capitalizeWords(v))

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value))
  }

  // Foto salva na hora, separada do "Salvar" de nome/telefone — troca de
  // foto é uma ação isolada, não faz sentido segurar até o resto do form
  const handleFotoChange = async (file: File | null) => {
    if (!file) return
    setFotoError(null)
    setEnviandoFoto(true)
    try {
      const body = new FormData()
      body.set('foto', file)
      const res = await fetch('/api/perfil/foto', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) {
        setFotoError(data.error ?? 'Não foi possível salvar a foto.')
      }
    } catch {
      setFotoError('Erro de conexão. Tente novamente.')
    } finally {
      setEnviandoFoto(false)
    }
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

  const handleTrocarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    setSenhaError(null)
    setSenhaErrorField(null)
    setSenhaTrocada(false)

    if (novaSenha !== confirmaNovaSenha) {
      setSenhaError('As senhas não combinam')
      return
    }
    if (novaSenha.length < 6) {
      setSenhaError('Senha precisa ter no mínimo 6 caracteres')
      return
    }

    setTrocandoSenha(true)
    try {
      const res = await fetch('/api/perfil/senha', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha, confirmaNovaSenha }),
      })
      const data = await res.json()

      if (!res.ok) {
        setSenhaError(data.error ?? 'Não foi possível trocar a senha.')
        setSenhaErrorField(data.field ?? null)
        return
      }

      setSenhaAtual('')
      setNovaSenha('')
      setConfirmaNovaSenha('')
      setSenhaTrocada(true)
      setTimeout(() => setSenhaTrocada(false), 2000)
    } catch {
      setSenhaError('Erro de conexão. Tente novamente.')
    } finally {
      setTrocandoSenha(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-1">
          <PhotoCropField
            label="Adicionar foto"
            trocarLabel="Trocar foto"
            icon="camera"
            shape="round"
            aspect={1}
            initialUrl={fotoInicial}
            previewClassName="size-20"
            onFileChange={handleFotoChange}
          />
          {enviandoFoto && (
            <p className="text-muted-foreground text-xs">Salvando foto...</p>
          )}
          {fotoError && <p className="text-destructive text-xs">{fotoError}</p>}
        </div>

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
          <label htmlFor="email" className="text-neutral-text block text-sm font-medium">
            Email
          </label>
          <Input id="email" value={email} disabled />
          <p className="text-muted-foreground mt-1 text-xs">
            Não pode ser alterado por aqui.
          </p>
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

      <form
        onSubmit={handleTrocarSenha}
        className="border-border/70 flex flex-col gap-3 border-t pt-6"
      >
        <h2 className="text-neutral-text text-sm font-semibold">Trocar senha</h2>

        <div>
          <label
            htmlFor="senhaAtual"
            className="text-neutral-text block text-sm font-medium"
          >
            Senha atual
          </label>
          <Input
            id="senhaAtual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            placeholder="••••••"
            aria-invalid={senhaErrorField === 'senhaAtual'}
            required
          />
        </div>

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
            htmlFor="confirmaNovaSenha"
            className="text-neutral-text block text-sm font-medium"
          >
            Confirmar nova senha
          </label>
          <Input
            id="confirmaNovaSenha"
            type="password"
            value={confirmaNovaSenha}
            onChange={(e) => setConfirmaNovaSenha(e.target.value)}
            placeholder="••••••"
            required
          />
        </div>

        {senhaError && <p className="text-destructive text-xs">{senhaError}</p>}

        <Button type="submit" variant="outline" className="w-full" disabled={trocandoSenha}>
          {trocandoSenha ? (
            'Trocando...'
          ) : senhaTrocada ? (
            <>
              <Check className="size-4" />
              Senha trocada!
            </>
          ) : (
            'Trocar senha'
          )}
        </Button>
      </form>
    </div>
  )
}
