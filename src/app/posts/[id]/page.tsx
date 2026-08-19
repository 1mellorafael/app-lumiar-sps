import { notFound } from 'next/navigation'
import { Calendar, GraduationCap, Tag, Dog, MapPin, Mail, Instagram } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { buscarPostPorId } from '@/lib/posts-data'
import { getLocalizacao } from '@/lib/mock-data'
import { formatarTempoRelativo } from '@/lib/format-relative-time'
import { PageHeader } from '@/components/shared/page-header'
import { MapEmbed } from '@/components/shared/map-embed'
import type { PostTipo } from '@/lib/validations/posts'

const TIPO_INFO: Record<PostTipo, { label: string; icon: LucideIcon }> = {
  evento: { label: 'Evento', icon: Calendar },
  curso: { label: 'Curso', icon: GraduationCap },
  anuncio: { label: 'Anúncio', icon: Tag },
  pet_perdido: { label: 'Pet Perdido', icon: Dog },
}

function formatarData(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function PostDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await buscarPostPorId(id)
  if (!post) notFound()

  const info = TIPO_INFO[post.tipo]
  const Icon = info.icon
  const localizacaoNome = getLocalizacao(post.localizacao)?.nome ?? post.localizacao

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title={info.label} backHref="/" />

      <div className="flex flex-col gap-3">
        {post.fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.fotoUrl} alt="" className="w-full rounded-lg" />
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-primary-500/10 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
            <Icon className="size-3" />
            {info.label}
          </span>
          {post.tipo === 'pet_perdido' && (
            <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-medium">
              Urgente
            </span>
          )}
          <span className="text-muted-foreground text-xs">{localizacaoNome}</span>
        </div>

        <h1 className="text-card-foreground text-xl font-bold">{post.titulo}</h1>
        <p className="text-muted-foreground text-xs">Por {post.autorNome}</p>

        {post.descricao && (
          <p className="text-card-foreground text-sm">{post.descricao}</p>
        )}

        {post.dataEvento && (
          <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex items-center gap-2 rounded-lg border p-3">
            <Calendar className="text-primary-500 size-4 shrink-0" />
            <p className="text-card-foreground text-sm capitalize">
              {formatarData(post.dataEvento)}
            </p>
          </div>
        )}

        {post.localTexto && (
          <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary-500 size-4 shrink-0" />
              <p className="text-card-foreground text-sm">{post.localTexto}</p>
            </div>
            {post.enderecoLat != null && post.enderecoLng != null && (
              <MapEmbed lat={post.enderecoLat} lng={post.enderecoLng} />
            )}
          </div>
        )}

        {post.preco != null && (
          <p className="text-card-foreground text-lg font-semibold">
            {formatarPreco(post.preco)}
          </p>
        )}

        {(post.emailContato || post.redeSocial) && (
          <div className="flex flex-col gap-1">
            {post.emailContato && (
              <a
                href={`mailto:${post.emailContato}`}
                className="text-primary-500 inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <Mail className="size-3.5" />
                {post.emailContato}
              </a>
            )}
            {post.redeSocial && (
              <a
                href={`https://instagram.com/${post.redeSocial}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <Instagram className="size-3.5" />@{post.redeSocial}
              </a>
            )}
          </div>
        )}

        <p className="text-muted-foreground text-center text-xs">
          Criado {formatarTempoRelativo(post.createdAt)}
        </p>
      </div>
    </main>
  )
}
