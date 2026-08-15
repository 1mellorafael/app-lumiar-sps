'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { MessageCircle } from 'lucide-react'
import type { Prestador } from '@/lib/mock-data'
import { getCategoria } from '@/lib/mock-data'
import type { ViewMode } from '@/components/shared/view-toggle'
import { cn } from '@/lib/utils'

// Cores de placeholder pro avatar — enquanto não existe foto real
// (upload de foto chega na Fase 3), cicla por essas cores de marca
const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-secondary-500',
  'bg-primary-700',
  'bg-secondary-700',
]

function avatarColor(id: string) {
  const index = Number(id) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

function initials(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function whatsappHref(numero: string, nomeServico: string) {
  const mensagem = encodeURIComponent(
    `Olá! Vi seu serviço "${nomeServico}" no app Lumiar/São Pedro da Serra.`
  )
  return `https://wa.me/${numero}?text=${mensagem}`
}

// Botão, não <a> — o card inteiro já é um Link (não pode aninhar <a> em <a>)
function openWhatsapp(e: MouseEvent, numero: string, nomeServico: string) {
  e.preventDefault()
  e.stopPropagation()
  window.open(
    whatsappHref(numero, nomeServico),
    '_blank',
    'noopener,noreferrer'
  )
}

type ServiceCardProps = {
  prestador: Prestador
  view: ViewMode
}

export function ServiceCard({ prestador, view }: ServiceCardProps) {
  const categoria = getCategoria(prestador.categoriaSlug)

  if (view === 'list') {
    return (
      <Link
        href={`/servico/${prestador.id}`}
        className="border-border bg-card hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
      >
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
            avatarColor(prestador.id)
          )}
        >
          {initials(prestador.nome)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-card-foreground truncate text-sm font-medium">
            {prestador.nomeServico}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {categoria?.nome}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) =>
            openWhatsapp(e, prestador.whatsapp, prestador.nomeServico)
          }
          aria-label={`Chamar ${prestador.nomeServico} no WhatsApp`}
          className="bg-whatsapp flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-4" />
        </button>
      </Link>
    )
  }

  return (
    <Link
      href={`/servico/${prestador.id}`}
      className="border-border bg-card hover:bg-accent flex flex-col overflow-hidden rounded-lg border transition-colors"
    >
      {/* Foto composta: capa (cor neutra, sem foto real ainda) + principal
          (círculo central) — seção 9 do CLAUDE.md */}
      <div className="bg-muted relative h-14">
        <div
          className={cn(
            'border-card absolute left-1/2 top-7 flex size-14 -translate-x-1/2 items-center justify-center rounded-full border-4 text-base font-semibold text-white',
            avatarColor(prestador.id)
          )}
        >
          {initials(prestador.nome)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 pb-3 pt-8 text-center">
        <p className="text-card-foreground line-clamp-1 text-sm font-medium">
          {prestador.nomeServico}
        </p>
        <p className="text-muted-foreground text-xs">{categoria?.nome}</p>
        <p className="text-muted-foreground line-clamp-2 text-xs">
          {prestador.descricao}
        </p>
        <button
          type="button"
          onClick={(e) =>
            openWhatsapp(e, prestador.whatsapp, prestador.nomeServico)
          }
          className="bg-whatsapp mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-3.5" />
          WhatsApp
        </button>
      </div>
    </Link>
  )
}
