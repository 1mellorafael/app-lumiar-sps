'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { MessageCircle, MapPin } from 'lucide-react'
import type { NegocioCard } from '@/lib/negocio-card'
import { getCategoria } from '@/lib/mock-data'
import type { ViewMode } from '@/components/shared/view-toggle'
import { cn } from '@/lib/utils'
import { whatsappHref } from '@/lib/whatsapp'

// Cores de placeholder pro avatar — enquanto não há foto real
const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-secondary-500',
  'bg-primary-700',
  'bg-secondary-700',
]

function avatarColor(id: string) {
  // soma de char codes em vez de Number(id) — ids reais são UUID, não int
  const soma = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[soma % AVATAR_COLORS.length]
}

function initials(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

// Efeito de cor no hover só faz sentido com mouse — em touch, :hover pode
// "grudar" depois do toque em alguns navegadores, então o [@media(hover:hover)]
// restringe o efeito a dispositivos que realmente têm hover
const HOVER_TEXT =
  '[@media(hover:hover)]:group-hover:text-primary-500 transition-colors'

// Botão, não <a> — o card inteiro já é um Link (não pode aninhar <a> em <a>)
function openWhatsapp(e: MouseEvent, numero: string, nomeNegocio: string) {
  e.preventDefault()
  e.stopPropagation()
  window.open(
    whatsappHref(numero, nomeNegocio),
    '_blank',
    'noopener,noreferrer'
  )
}

function categoriaLabel(slugs: string[]) {
  return slugs
    .map((s) => getCategoria(s)?.nome ?? s)
    .join(', ')
}

function Avatar({
  negocio,
  className,
  textClassName,
}: {
  negocio: NegocioCard
  className: string
  textClassName: string
}) {
  if (negocio.fotoPrincipalUrl) {
    return (
      <div className={cn('overflow-hidden', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={negocio.fotoPrincipalUrl}
          alt=""
          style={{
            objectPosition: `${negocio.fotoPrincipalPos?.x ?? 50}% ${negocio.fotoPrincipalPos?.y ?? 50}%`,
          }}
          className="size-full object-cover"
        />
      </div>
    )
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center font-semibold text-white',
        avatarColor(negocio.id),
        className,
        textClassName
      )}
    >
      {initials(negocio.nomeNegocio)}
    </div>
  )
}

export type CardVariant = 'a' | 'b'

type ServiceCardProps = {
  negocio: NegocioCard
  view: ViewMode
  variant?: CardVariant
  // true quando já se está dentro da categoria (repetir seria redundante)
  hideCategoria?: boolean
}

// Descrição completa fica só na página de detalhe (/negocio/[id]) — o
// card serve pra escanear/decidir rápido, não pra ler tudo ali
// (decisão de 17/08)
export function ServiceCard({
  negocio,
  view,
  variant = 'a',
  hideCategoria = false,
}: ServiceCardProps) {
  const categoria = categoriaLabel(negocio.categoriaSlugs)
  const local = negocio.localizacaoLabel ?? null

  if (view === 'list') {
    return variant === 'a' ? (
      <Link
        href={`/negocio/${negocio.id}`}
        className="group border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex items-start gap-2 rounded-lg border p-2.5 transition-all duration-200 ease-decelerate"
      >
        <Avatar
          negocio={negocio}
          className="size-9 shrink-0 rounded-full"
          textClassName="text-xs"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn('text-card-foreground text-sm font-semibold', HOVER_TEXT)}>
              {negocio.nomeNegocio}
            </p>
            <button
              type="button"
              onClick={(e) =>
                openWhatsapp(e, negocio.whatsapp, negocio.nomeNegocio)
              }
              aria-label={`Chamar ${negocio.nomeNegocio} no WhatsApp`}
              className="bg-whatsapp flex size-8 shrink-0 items-center justify-center rounded-full text-black shadow-[var(--shadow-card)] transition-all duration-150 ease-standard hover:opacity-90 active:scale-90"
            >
              <MessageCircle className="size-3.5" />
            </button>
          </div>
          {!hideCategoria && (
            <p className="text-muted-foreground text-xs">{categoria}</p>
          )}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            {local && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="size-3" />
                {local}
              </span>
            )}
          </div>
        </div>
      </Link>
    ) : (
      <Link
        href={`/negocio/${negocio.id}`}
        className="group border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col gap-1.5 rounded-lg border p-3 transition-all duration-200 ease-decelerate"
      >
        <div className="flex items-center gap-2">
          <Avatar
            negocio={negocio}
            className="size-10 shrink-0 rounded-full"
            textClassName="text-sm"
          />
          <div className="min-w-0 flex-1">
            <p className={cn('text-card-foreground text-sm font-semibold', HOVER_TEXT)}>
              {negocio.nomeNegocio}
            </p>
            {!hideCategoria && (
              <p className="text-muted-foreground text-xs">{categoria}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            {local && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="size-3" />
                {local}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) =>
              openWhatsapp(e, negocio.whatsapp, negocio.nomeNegocio)
            }
            aria-label={`Chamar ${negocio.nomeNegocio} no WhatsApp`}
            className="bg-whatsapp flex size-8 shrink-0 items-center justify-center rounded-full text-black shadow-[var(--shadow-card)] transition-all duration-150 ease-standard hover:opacity-90 active:scale-90"
          >
            <MessageCircle className="size-3.5" />
          </button>
        </div>
      </Link>
    )
  }

  return variant === 'a' ? (
    <Link
      href={`/negocio/${negocio.id}`}
      className="group border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col overflow-hidden rounded-lg border transition-all duration-200 ease-decelerate"
    >
      {/* Foto composta: capa (cor neutra, sem foto real ainda) + principal
          (círculo central) — seção 9 do CLAUDE.md */}
      <div className="bg-muted relative h-8">
        <Avatar
          negocio={negocio}
          className="border-card absolute left-1/2 top-3 size-10 -translate-x-1/2 rounded-full border shadow-[0_2px_6px_rgb(0_0_0_/_0.15)]"
          textClassName="text-sm"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 pb-2 pt-6 text-center">
        <p className={cn('text-card-foreground text-xs font-semibold', HOVER_TEXT)}>
          {negocio.nomeNegocio}
        </p>
        {!hideCategoria && (
          <p className="text-muted-foreground text-xs">{categoria}</p>
        )}
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px]">
          {local && (
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="size-3" />
              {local}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) =>
            openWhatsapp(e, negocio.whatsapp, negocio.nomeNegocio)
          }
          className="bg-whatsapp mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-black transition-all duration-150 ease-standard hover:opacity-90 active:scale-95"
        >
          <MessageCircle className="size-3" />
          WhatsApp
        </button>
      </div>
    </Link>
  ) : (
    <Link
      href={`/negocio/${negocio.id}`}
      className="group border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col overflow-hidden rounded-lg border transition-all duration-200 ease-decelerate"
    >
      <div className="bg-muted relative h-20">
        <Avatar
          negocio={negocio}
          className="border-card absolute -bottom-6 left-3 size-14 rounded-full border shadow-[0_2px_6px_rgb(0_0_0_/_0.15)]"
          textClassName="text-base"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-3 pt-8">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-card-foreground text-base font-bold', HOVER_TEXT)}>
            {negocio.nomeNegocio}
          </p>
          {!hideCategoria && (
            <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[11px]">
              {categoria}
            </span>
          )}
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
          {local && (
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="size-3" />
              {local}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) =>
            openWhatsapp(e, negocio.whatsapp, negocio.nomeNegocio)
          }
          className="bg-whatsapp mt-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-black transition-all duration-150 ease-standard hover:opacity-90 active:scale-95"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </button>
      </div>
    </Link>
  )
}
