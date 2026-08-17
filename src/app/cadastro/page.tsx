'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { capitalizeWords } from '@/lib/utils'
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
} from '@/lib/password-strength'

// Cadastro de CONTA só — cadastro de negócio é uma etapa separada
// (/cadastro-negocio), não amarrada aqui. Conta serve pra qualquer
// morador, não só pra quem tem negócio.
export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmaSenha: '',
  })
  const [termos, setTermos] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  const [accountErrorField, setAccountErrorField] = useState<string | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)
  const [contaCriada, setContaCriada] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Capitaliza só ao sair do campo, não a cada tecla — em campo controlado,
  // capitalizar durante a digitação jogava o cursor pro fim do texto e
  // desfazia maiúscula intencional no meio do nome (ex: "McDonald")
  const handleNomeBlur = () => {
    setFormData((prev) => ({ ...prev, nome: capitalizeWords(prev.nome) }))
  }

  const formatarTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 7)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, telefone: formatarTelefone(value) }))
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAccountError(null)
    setAccountErrorField(null)

    if (!termos) {
      alert('Precisa aceitar os termos pra continuar')
      return
    }
    if (formData.senha !== formData.confirmaSenha) {
      setAccountError('As senhas não combinam')
      return
    }
    if (formData.senha.length < 6) {
      setAccountError('Senha precisa ter no mínimo 6 caracteres')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          senha: formData.senha,
          confirmaSenha: formData.confirmaSenha,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setAccountError(data.error ?? 'Não foi possível criar a conta.')
        setAccountErrorField(data.field ?? null)
        return
      }

      setContaCriada(true)
    } catch {
      setAccountError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (contaCriada) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <div className="bg-primary-500 flex size-12 items-center justify-center rounded-full text-white">
          <Check className="size-6" />
        </div>
        <div>
          <h1 className="text-primary-500 text-lg font-bold">
            Conta criada!
          </h1>
          <p className="text-muted-foreground text-sm">
            {formData.nome}, sua conta já está pronta.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/cadastro-negocio">Cadastrar meu negócio</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/menu">Ir pro Menu</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Link
        href="/"
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-primary-500 text-lg font-bold">Criar Conta</h1>
        <p className="text-muted-foreground text-sm">
          Pra ter um negócio, sugerir algo ou participar da comunidade
        </p>
      </div>

      <form onSubmit={handleAccountSubmit} className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="nome"
            className="text-neutral-text block text-sm font-medium"
          >
            Nome
          </label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            onBlur={handleNomeBlur}
            placeholder="João Silva"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-neutral-text block text-sm font-medium"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            aria-invalid={accountErrorField === 'email'}
            required
          />
          {accountErrorField === 'email' && (
            <p className="text-destructive mt-1 text-xs">
              {accountError}{' '}
              <Link href="/login" className="underline">
                Fazer login
              </Link>
            </p>
          )}
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
            name="telefone"
            value={formData.telefone}
            onChange={handleTelefoneChange}
            placeholder="(22) 99999-9999"
            maxLength={18}
            aria-invalid={accountErrorField === 'telefone'}
            required
          />
          {accountErrorField === 'telefone' && (
            <p className="text-destructive mt-1 text-xs">
              {accountError}{' '}
              <Link href="/login" className="underline">
                Fazer login
              </Link>
            </p>
          )}
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
            value={formData.senha}
            onChange={handleInputChange}
            placeholder="••••••"
            required
          />
          {formData.senha.length > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <div className="bg-muted flex h-1 flex-1 gap-1 overflow-hidden rounded-full">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-full flex-1 rounded-full transition-colors ${
                      getPasswordStrength(formData.senha) >= level
                        ? getPasswordStrength(formData.senha) === 1
                          ? 'bg-destructive'
                          : getPasswordStrength(formData.senha) === 2
                            ? 'bg-secondary'
                            : 'bg-primary'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-xs">
                {PASSWORD_STRENGTH_LABEL[getPasswordStrength(formData.senha)]}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmaSenha"
            className="text-neutral-text block text-sm font-medium"
          >
            Confirmar Senha
          </label>
          <Input
            id="confirmaSenha"
            name="confirmaSenha"
            type="password"
            value={formData.confirmaSenha}
            onChange={handleInputChange}
            placeholder="••••••"
            required
          />
        </div>

        {accountError && !accountErrorField && (
          <p className="text-destructive text-xs">{accountError}</p>
        )}

        <div className="bg-orange-50 border-orange-200 rounded-lg border p-3">
          <p className="text-orange-800 text-xs">
            ⚠️ Plataforma apenas para <strong>Lumiar</strong> e{' '}
            <strong>São Pedro da Serra</strong>. Cadastros fora da região
            podem ser removidos sem aviso prévio.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <input
            id="termos"
            type="checkbox"
            checked={termos}
            onChange={(e) => setTermos(e.target.checked)}
            className="mt-1"
          />
          <label
            htmlFor="termos"
            className="text-muted-foreground text-xs cursor-pointer"
          >
            Aceito os{' '}
            <Link
              href="/termos"
              className="text-primary-500 underline hover:no-underline"
            >
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link
              href="/privacidade"
              className="text-primary-500 underline hover:no-underline"
            >
              Política de Privacidade
            </Link>
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </form>
    </main>
  )
}
