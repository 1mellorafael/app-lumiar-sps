'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { capitalizeWords } from '@/lib/utils'
import { CATEGORIAS } from '@/lib/mock-data'
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
} from '@/lib/password-strength'

export default function CadastroPage() {
  const router = useRouter()
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
    telefoneContato: '',
  })
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null)
  const [fotoCapa, setFotoCapa] = useState<File | null>(null)
  const [termos, setTermos] = useState(false)
  const [termosPresta, setTermosPresta] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  const [accountErrorField, setAccountErrorField] = useState<string | null>(
    null
  )
  const [serviceError, setServiceError] = useState<string | null>(null)
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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: formatarTelefone(value),
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

      // Telefone de contato do serviço é campo próprio (pode ser diferente
      // de quem cadastrou — ver docs/06, "Cadastro por terceiro"), mas
      // pré-preenche com o telefone da conta por conveniência no caso comum
      setFormData((prev) => ({ ...prev, telefoneContato: prev.telefone }))
      setStep('service')
    } catch {
      setAccountError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServiceError(null)

    if (!termosPresta) {
      alert('Precisa aceitar os termos de prestador pra continuar')
      return
    }
    if (!fotoPrincipal) {
      setServiceError('Foto principal é obrigatória')
      return
    }

    setSubmitting(true)
    try {
      const body = new FormData()
      body.set('nomeServico', formData.nomeServico)
      body.set('categoria', formData.categoria)
      body.set('descricao', formData.descricao)
      body.set('instagram', formData.instagram)
      body.set('telefoneContato', formData.telefoneContato)
      body.set('fotoPrincipal', fotoPrincipal)
      if (fotoCapa) body.set('fotoCapa', fotoCapa)

      const res = await fetch('/api/prestadores', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        setServiceError(data.error ?? 'Não foi possível criar o cadastro.')
        return
      }

      router.push(`/servico/${data.id}`)
    } catch {
      setServiceError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
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
        {/* Foto em duas camadas: capa (opcional, fundo) + principal
            (obrigatória, círculo central) — CLAUDE.md seção 9. Botões de
            trocar foto ficam perto, nunca sobrepostos na foto. */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted relative h-20 w-full overflow-hidden rounded-lg">
            {fotoCapa && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(fotoCapa)}
                alt=""
                className="size-full object-cover"
              />
            )}
            <div className="border-background bg-muted absolute left-1/2 top-10 flex size-20 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-2 shadow-[0_2px_6px_rgb(0_0_0_/_0.15)]">
              {fotoPrincipal ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(fotoPrincipal)}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-xs">Foto</span>
              )}
            </div>
          </div>

          <div className="mt-10 flex gap-2">
            <label className="border-border text-neutral-text hover:bg-muted flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium">
              <Camera className="size-3.5" />
              {fotoPrincipal ? 'Trocar foto principal' : 'Foto principal *'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setFotoPrincipal(e.target.files?.[0] ?? null)}
              />
            </label>
            <label className="border-border text-neutral-text hover:bg-muted flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium">
              <ImagePlus className="size-3.5" />
              {fotoCapa ? 'Trocar capa' : 'Foto de capa'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setFotoCapa(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          {serviceError && (
            <p className="text-destructive text-xs">{serviceError}</p>
          )}
        </div>

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
            {CATEGORIAS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="telefoneContato"
            className="text-neutral-text block text-sm font-medium"
          >
            Telefone de contato do serviço
          </label>
          <Input
            id="telefoneContato"
            name="telefoneContato"
            value={formData.telefoneContato}
            onChange={handleTelefoneChange}
            placeholder="(24) 99999-9999"
            maxLength={18}
            required
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Quem clicar em WhatsApp fala com este número — pode ser diferente
            do telefone da sua conta.
          </p>
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

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Cadastrar'}
        </Button>
      </form>
    </main>
  )
}
