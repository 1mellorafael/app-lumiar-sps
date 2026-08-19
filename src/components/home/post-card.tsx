import Link from 'next/link'
import { Calendar, GraduationCap, Tag, Dog, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getLocalizacao } from '@/lib/mock-data'
import { formatarTempoRelativo } from '@/lib/format-relative-time'
import type { PostFeed } from '@/lib/posts-data'

const TIPO_INFO: Record<PostFeed['tipo'], { label: string; icon: LucideIcon }> = {
  evento: { label: 'Evento', icon: Calendar },
  curso: { label: 'Curso', icon: GraduationCap },
  anuncio: { label: 'Anúncio', icon: Tag },
  pet_perdido: { label: 'Pet Perdido', icon: Dog },
}

function formatarData(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PostCard({ post }: { post: PostFeed }) {
  const info = TIPO_INFO[post.tipo]
  const Icon = info.icon
  const localizacaoNome = getLocalizacao(post.localizacao)?.nome ?? post.localizacao

  return (
    <Link
      href={`/posts/${post.id}`}
      className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex flex-col gap-2 rounded-lg border p-3 transition-all duration-200 ease-decelerate"
    >
      {post.fotoUrl && (
        // A foto já sai do editor de criação exatamente no formato final
        // (quadrado ou 4:5) — sem sobra pra cortar, então exibe no
        // tamanho natural dela, sem caixa/object-fit tentando adivinhar
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.fotoUrl} alt="" className="w-full rounded-md" />
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

      <h3 className="text-card-foreground text-sm font-semibold">{post.titulo}</h3>

      {post.descricao && (
        <p className="text-muted-foreground text-xs">{post.descricao}</p>
      )}

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {post.dataEvento && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {formatarData(post.dataEvento)}
          </span>
        )}
        {post.localTexto && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {post.localTexto}
          </span>
        )}
        {post.preco != null && (
          <span className="text-card-foreground font-medium">
            {formatarPreco(post.preco)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">Por {post.autorNome}</p>
        <p className="text-muted-foreground text-xs">
          {formatarTempoRelativo(post.createdAt)}
        </p>
      </div>
    </Link>
  )
}
