'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Tag,
  Instagram,
  MessageCircle,
  Link2,
  Share2,
  Check,
} from 'lucide-react'
import { getPrestador, getCategoria } from '@/lib/mock-data'
import { whatsappHref } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'

const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-secondary-500',
  'bg-primary-700',
  'bg-secondary-700',
]

function avatarColor(id: string) {
  return AVATAR_COLORS[Number(id) % AVATAR_COLORS.length]
}

function initials(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function ServicoPage() {
  const params = useParams<{ id: string }>()
  const prestador = getPrestador(params.id)
  const [copiado, setCopiado] = useState<'sucesso' | 'erro' | null>(null)

  if (!prestador) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <p className="text-muted-foreground text-sm">Serviço não encontrado.</p>
        <Link
          href="/"
          className="text-primary-500 text-sm font-medium hover:underline"
        >
          Voltar pra Home
        </Link>
      </main>
    )
  }

  const categoria = getCategoria(prestador.categoriaSlug)

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado('sucesso')
    } catch {
      setCopiado('erro')
    }
    setTimeout(() => setCopiado(null), 2000)
  }

  async function compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prestador!.nomeServico,
          url: window.location.href,
        })
      } catch (e) {
        // Usuário cancelou o share sheet — não é erro, ignora
        if ((e as Error).name !== 'AbortError') {
          await copiarLink()
        }
      }
    } else {
      await copiarLink()
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Link
        href="/buscar"
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      {/* Foto composta: capa (cor neutra) + principal (círculo central) —
          nome fica fora da moldura, abaixo — seção 9 do CLAUDE.md */}
      <div className="flex flex-col items-center gap-2">
        <div className="bg-muted relative h-28 w-full rounded-lg">
          <div
            className={`border-background absolute left-1/2 top-14 flex size-24 -translate-x-1/2 items-center justify-center rounded-full border-4 text-2xl font-semibold text-white ${avatarColor(prestador.id)}`}
          >
            {initials(prestador.nome)}
          </div>
        </div>
        <p className="text-card-foreground mt-10 text-lg font-bold">
          {prestador.nome}
        </p>
      </div>

      <section className="border-border bg-card flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="text-neutral-text text-sm font-semibold uppercase tracking-wide">
          Informações
        </h2>
        <div className="text-card-foreground flex items-center gap-2 text-sm">
          <MapPin className="text-primary-500 size-4 shrink-0" />
          {prestador.endereco}
        </div>
        <div className="text-card-foreground flex items-center gap-2 text-sm">
          <Phone className="text-primary-500 size-4 shrink-0" />
          {prestador.telefoneDisplay}
        </div>
        <div className="text-card-foreground flex items-center gap-2 text-sm">
          <Tag className="text-primary-500 size-4 shrink-0" />
          {categoria?.nome}
        </div>
      </section>

      <section className="border-border bg-card flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="text-neutral-text text-sm font-semibold uppercase tracking-wide">
          Sobre
        </h2>
        <p className="text-card-foreground text-sm">{prestador.descricao}</p>
      </section>

      {prestador.instagram && (
        <a
          href={`https://instagram.com/${prestador.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-card text-card-foreground hover:bg-accent flex items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors"
        >
          <Instagram className="text-primary-500 size-4" />@
          {prestador.instagram}
        </a>
      )}

      <a
        href={whatsappHref(prestador.whatsapp, prestador.nomeServico)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-whatsapp inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle className="size-4" />
        Chamar no WhatsApp
      </a>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={copiarLink}>
          {copiado === 'sucesso' ? <Check /> : <Link2 />}
          {copiado === 'sucesso'
            ? 'Copiado!'
            : copiado === 'erro'
              ? 'Não foi possível copiar'
              : 'Copiar link'}
        </Button>
        <Button variant="outline" className="flex-1" onClick={compartilhar}>
          <Share2 />
          Compartilhar
        </Button>
      </div>
    </main>
  )
}
