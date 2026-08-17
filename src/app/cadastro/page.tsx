'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { capitalizeWords } from '@/lib/utils'
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
} from '@/lib/password-strength'

export default function CadastroPage() {
  const [step, setStep] = useState<'account' | 'service'>('account')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmaSenha: '',
    nomeServico: '',
    categoria: '',
    descricao: '',
    instagram: '',
  })
  const [termos, setTermos] = useState(false)
  const [termosPresta, setTermosPresta] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  const [accountErrorField, setAccountErrorField] = useState<string | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
    const formatted = formatarTelefone(e.target.value)
    setFormData((prev) => ({
      ...prev,
      telefone: formatted,
    }))
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

      setStep('service')
    } catch {
      setAccountError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termosPresta) {
      alert('Precisa aceitar os termos de prestador pra continuar')
      return
    }
    alert('Cadastro enviado! Em breve você receberá um email de confirmação.')
  }

  if (step === 'account') {
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
          <h1 className="text-primary-500 text-lg font-bold">Sua Conta</h1>
          <p className="text-muted-foreground text-sm">
            Passo 1 de 2 — Dados básicos
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
              placeholder="(24) 99999-9999"
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
            {submitting ? 'Criando conta...' : 'Próximo'}
          </Button>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <button
        onClick={() => setStep('account')}
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </button>

      <div>
        <h1 className="text-primary-500 text-lg font-bold">Seu Serviço</h1>
        <p className="text-muted-foreground text-sm">
          Passo 2 de 2 — Dados do serviço
        </p>
      </div>

      <form onSubmit={handleServiceSubmit} className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="nomeServico"
            className="text-neutral-text block text-sm font-medium"
          >
            Nome do Serviço <span className="text-muted-foreground">(opcional)</span>
          </label>
          <Input
            id="nomeServico"
            name="nomeServico"
            value={formData.nomeServico}
            onChange={handleInputChange}
            placeholder="Ex: João Manutenção"
          />
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="text-neutral-text block text-sm font-medium"
          >
            Categoria <span className="text-muted-foreground">(obrigatória)</span>
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            className="border-border bg-background text-foreground w-full rounded-md border px-3 py-2"
            required
          >
            <option value="">Selecione uma categoria...</option>
            <option value="motoboy">Motoboy</option>
            <option value="faxina">Faxina</option>
            <option value="mototaxi">Mototáxi</option>
            <option value="uber">Uber</option>
            <option value="estetica">Estética</option>
            <option value="adestramento">Adestramento</option>
            <option value="hospedagem-pet">Hospedagem Pet</option>
            <option value="lojas">Lojas</option>
            <option value="baba">Babá</option>
            <option value="educacao">Educação</option>
            <option value="psicologo">Psicólogo</option>
            <option value="artes">Artes</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="text-neutral-text block text-sm font-medium"
          >
            Descrição <span className="text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Descreva brevemente o seu serviço..."
            className="border-border bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div>
          <label
            htmlFor="instagram"
            className="text-neutral-text block text-sm font-medium"
          >
            Instagram <span className="text-muted-foreground">(opcional)</span>
          </label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            placeholder="@seuinstagram"
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="termosPresta"
            type="checkbox"
            checked={termosPresta}
            onChange={(e) => setTermosPresta(e.target.checked)}
            className="mt-1"
          />
          <label
            htmlFor="termosPresta"
            className="text-muted-foreground text-xs cursor-pointer"
          >
            Aceito os{' '}
            <Link
              href="/termos"
              className="text-primary-500 underline hover:no-underline"
            >
              Termos de Prestador
            </Link>
          </label>
        </div>

        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>
    </main>
  )
}
