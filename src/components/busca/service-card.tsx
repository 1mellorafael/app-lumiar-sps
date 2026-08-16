'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import type { Prestador } from '@/lib/mock-data'
import { getCategoria, localizacaoAbrev, horarioResumo } from '@/lib/mock-data'
import type { ViewMode } from '@/components/shared/view-toggle'
import { cn } from '@/lib/utils'
import { whatsappHref } from '@/lib/whatsapp'

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

export type CardVariant = 'a' | 'b'

type ServiceCardProps = {
  prestador: Prestador
  view: ViewMode
  variant?: CardVariant
  // true quando já se está dentro da categoria (repetir seria redundante)
  hideCategoria?: boolean
}

export function ServiceCard({
  prestador,
  view,
  variant = 'a',
  hideCategoria = false,
}: ServiceCardProps) {
  const categoria = getCategoria(prestador.categoriaSlug)
  const local = localizacaoAbrev(prestador.localizacao)
  const horario = horarioResumo(prestador.horarios)

  if (view === 'list') {
    return variant === 'a' ? (
      <Link
        href={`/servico/${prestador.id}`}
        className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex items-start gap-2 rounded-lg border p-2.5 transition-all duration-200 ease-out"
      >
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
            avatarColor(prestador.id)
          )}
        >
          {initials(prestador.nomeServico)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-card-foreground text-sm font-semibold">
              {prestador.nomeServico}
            </p>
            <button
              type="button"
              onClick={(e) =>
                openWhatsapp(e, prestador.whatsapp, prestador.nomeServico)
              }
              aria-label={`Chamar ${prestador.nomeServico} no WhatsApp`}
              className="bg-whatsapp flex size-8 shrink-0 items-center justify-center rounded-full text-black shadow-[var(--shadow-card)] transition-all duration-150 ease-out hover:opacity-90 active:scale-90"
            >
              <MessageCircle className="size-3.5" />
            </button>
          </div>
          {!hideCategoria && (
            <p className="text-muted-foreground text-xs">{categoria?.nome}</p>
          )}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="size-3" />
              {local}
            </span>
            {horario && (
              <span className="inline-flex items-center gap-0.5">
                <Clock className="size-3" />
                {horario}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {prestador.descricao}
          </p>
        </div>
      </Link>
    ) : (
      <Link
        href={`/servico/${prestador.id}`}
        className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col gap-1.5 rounded-lg border p-3 transition-all duration-200 ease-out"
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
              avatarColor(prestador.id)
            )}
          >
            {initials(prestador.nomeServico)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-card-foreground text-sm font-semibold">
              {prestador.nomeServico}
            </p>
            {!hideCategoria && (
              <p className="text-muted-foreground text-xs">
                {categoria?.nome}
              </p>
            )}
          </div>
        </div>
        <p className="text-card-foreground text-sm">{prestador.descricao}</p>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="size-3" />
              {local}
            </span>
            {horario && (
              <span className="inline-flex items-center gap-0.5">
                <Clock className="size-3" />
                {horario}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) =>
              openWhatsapp(e, prestador.whatsapp, prestador.nomeServico)
            }
            aria-label={`Chamar ${prestador.nomeServico} no WhatsApp`}
            className="bg-whatsapp flex size-8 shrink-0 items-center justify-center rounded-full text-black shadow-[var(--shadow-card)] transition-all duration-150 ease-out hover:opacity-90 active:scale-90"
          >
            <MessageCircle className="size-3.5" />
          </button>
        </div>
      </Link>
    )
  }

  return variant === 'a' ? (
    <Link
      href={`/servico/${prestador.id}`}
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col overflow-hidden rounded-lg border transition-all duration-200 ease-out"
    >
      {/* Foto composta: capa (cor neutra, sem foto real ainda) + principal
          (círculo central) — seção 9 do CLAUDE.md */}
      <div className="bg-muted relative h-8">
        <div
          className={cn(
            'border-card absolute left-1/2 top-3 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border shadow-[0_2px_6px_rgb(0_0_0_/_0.15)] text-sm font-semibold text-white',
            avatarColor(prestador.id)
          )}
        >
          {initials(prestador.nomeServico)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 pb-2 pt-6 text-center">
        <p className="text-card-foreground text-xs font-semibold">
          {prestador.nomeServico}
        </p>
        {!hideCategoria && (
          <p className="text-muted-foreground text-xs">{categoria?.nome}</p>
        )}
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px]">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="size-3" />
            {local}
          </span>
          {horario && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="size-3" />
              {horario}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-xs">{prestador.descricao}</p>
        <button
          type="button"
          onClick={(e) =>
            openWhatsapp(e, prestador.whatsapp, prestador.nomeServico)
          }
          className="bg-whatsapp mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-black transition-all duration-150 ease-out hover:opacity-90 active:scale-95"
        >
          <MessageCircle className="size-3" />
          WhatsApp
        </button>
      </div>
    </Link>
  ) : (
    <Link
      href={`/servico/${prestador.id}`}
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col overflow-hidden rounded-lg border transition-all duration-200 ease-out"
    >
      <div className="bg-muted relative h-20">
        <div
          className={cn(
            'border-card absolute -bottom-6 left-3 flex size-14 items-center justify-center rounded-full border shadow-[0_2px_6px_rgb(0_0_0_/_0.15)] text-base font-semibold text-white',
            avatarColor(prestador.id)
          )}
        >
          {initials(prestador.nomeServico)}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-3 pt-8">
        <div className="flex items-start justify-between gap-2">
          <p className="text-card-foreground text-base font-bold">
            {prestador.nomeServico}
          </p>
          {!hideCategoria && (
            <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[11px]">
              {categoria?.nome}
            </span>
          )}
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="size-3" />
            {local}
          </span>
          {horario && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="size-3" />
              {horario}
            </span>
          )}
        </div>
        <p className="text-card-foreground text-sm">{prestador.descricao}</p>
        <button
          type="button"
          onClick={(e) =>
            openWhatsapp(e, prestador.whatsapp, prestador.nomeServico)
          }
          className="bg-whatsapp mt-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-black transition-all duration-150 ease-out hover:opacity-90 active:scale-95"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </button>
      </div>
    </Link>
  )
}
