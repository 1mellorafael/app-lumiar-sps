'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORIAS } from '@/lib/mock-data'

const formatarTelefone = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}

export function ServicoForm({ telefoneConta }: { telefoneConta: string }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nomeServico: '',
    categoria: '',
    descricao: '',
    instagram: '',
    telefoneContato: formatarTelefone(telefoneConta),
  })
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null)
  const [fotoCapa, setFotoCapa] = useState<File | null>(null)
  const [termosPresta, setTermosPresta] = useState(false)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      telefoneContato: formatarTelefone(e.target.value),
    }))
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

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Link
        href="/menu"
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-primary-500 text-lg font-bold">
          Cadastrar Serviço
        </h1>
        <p className="text-muted-foreground text-sm">
          Fica pendente até um admin aprovar
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
