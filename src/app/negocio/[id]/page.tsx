import Link from 'next/link'
import { MapPin, Phone, Tag, Instagram, MessageCircle, Pencil } from 'lucide-react'
import { getNegocio, getCategoria, getLocalizacao } from '@/lib/mock-data'
import { whatsappHref } from '@/lib/whatsapp'
import { formatarTelefone } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { FloatingBackButton, NegocioActions } from '@/components/negocio-detalhe/negocio-actions'
import { AdminActions } from '@/components/admin/admin-actions'
import { TransferirDono } from '@/components/admin/transferir-dono'
import { MapEmbed } from '@/components/shared/map-embed'

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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Quebra o container centralizado (main tem max-w-md) e estica até a
// borda de verdade da tela — só em telas de celular (< sm). Em desktop
// (>= sm) volta pro normal, dentro da coluna de max-w-md — o sangramento
// é coisa de layout mobile, não faz sentido esticar até a janela inteira
// do navegador num monitor
const FULL_BLEED =
  'relative ml-[50%] w-screen -translate-x-1/2 sm:ml-0 sm:w-full sm:translate-x-0'

type DadosNegocio = {
  id: string
  nomeNegocio: string
  categoriaNomes: string[]
  localizacaoNome: string | null
  endereco: string | null
  enderecoLat: number | null
  enderecoLng: number | null
  descricao: string | null
  instagram: string | null
  whatsapp: string
  telefoneDisplay: string
  fotoPrincipalUrl: string | null
  fotoCapaUrl: string | null
  fotoPrincipalPos: { x: number; y: number }
  fotoCapaPos: { x: number; y: number }
  pendente: boolean
  souDono: boolean
  souAdmin: boolean
  naoReivindicado: boolean
}

async function buscarNegocioReal(id: string): Promise<DadosNegocio | null> {
  const supabase = await createClient()

  // getUser() e a query do negócio não dependem uma da outra — rodar em
  // paralelo corta um round-trip pro Supabase (~90ms)
  const [
    {
      data: { user },
    },
    { data: negocio },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('negocios')
      .select(
        'id, profile_id, nome_negocio, categorias, localizacoes, endereco, endereco_lat, endereco_lng, descricao, instagram, telefone_contato, foto_principal_url, foto_capa_url, foto_principal_pos_x, foto_principal_pos_y, foto_capa_pos_x, foto_capa_pos_y, status'
      )
      .eq('id', id)
      .maybeSingle(),
  ])

  // RLS já barra pendente de quem não é dono nem admin — se voltou
  // linha, pode mostrar
  if (!negocio) return null

  // souAdmin só importa quando pendente (AdminActions) ou sem dono
  // (TransferirDono) — pula mais um round-trip pro Supabase na visita
  // comum de um negócio ativo já reivindicado
  const profile =
    (negocio.status === 'pendente' || !negocio.profile_id) && user
      ? (
          await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
        ).data
      : null

  const [fotoPrincipalUrl, fotoCapaUrl] = await Promise.all([
    fotoSignedUrl(negocio.foto_principal_url),
    fotoSignedUrl(negocio.foto_capa_url),
  ])

  return {
    id: negocio.id,
    nomeNegocio: negocio.nome_negocio,
    categoriaNomes: negocio.categorias.map(
      (c: string) => getCategoria(c)?.nome ?? c
    ),
    localizacaoNome: negocio.localizacoes
      .map((l: string) => getLocalizacao(l)?.nome ?? l)
      .join(', '),
    endereco: negocio.endereco,
    enderecoLat: negocio.endereco_lat,
    enderecoLng: negocio.endereco_lng,
    descricao: negocio.descricao,
    instagram: negocio.instagram,
    whatsapp: negocio.telefone_contato,
    telefoneDisplay: formatarTelefone(negocio.telefone_contato),
    fotoPrincipalUrl,
    fotoCapaUrl,
    fotoPrincipalPos: { x: negocio.foto_principal_pos_x, y: negocio.foto_principal_pos_y },
    fotoCapaPos: { x: negocio.foto_capa_pos_x, y: negocio.foto_capa_pos_y },
    pendente: negocio.status === 'pendente',
    souDono: user?.id === negocio.profile_id,
    souAdmin: profile?.is_admin ?? false,
    naoReivindicado: !negocio.profile_id,
  }
}

export default async function NegocioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const real = UUID_RE.test(id) ? await buscarNegocioReal(id) : null
  const mock = !real ? getNegocio(id) : null

  if (!real && !mock) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <p className="text-muted-foreground text-sm">Negócio não encontrado.</p>
        <Link
          href="/"
          className="text-primary-500 text-sm font-medium hover:underline"
        >
          Voltar pra Home
        </Link>
      </main>
    )
  }

  const dados: DadosNegocio = real ?? {
    id: mock!.id,
    nomeNegocio: mock!.nomeNegocio,
    categoriaNomes: [getCategoria(mock!.categoriaSlug)?.nome ?? mock!.categoriaSlug],
    localizacaoNome: mock!.localizacao,
    endereco: mock!.endereco ?? null,
    enderecoLat: null,
    enderecoLng: null,
    descricao: mock!.descricao,
    instagram: mock!.instagram ?? null,
    whatsapp: mock!.whatsapp,
    telefoneDisplay: mock!.telefoneDisplay,
    fotoPrincipalUrl: null,
    fotoCapaUrl: null,
    fotoPrincipalPos: { x: 50, y: 50 },
    fotoCapaPos: { x: 50, y: 50 },
    pendente: false,
    souDono: false,
    souAdmin: false,
    naoReivindicado: false,
  }

  return (
    <main className="mx-auto flex max-w-md flex-col">
      {/* Capa em tela cheia, do topo até o avatar transbordar por baixo —
          botão de voltar flutua sobre a própria foto (referência: apps de
          delivery) em vez de reservar uma linha só pra seta. Decisão de
          17/08, substitui o layout anterior (capa em faixa curta, nome
          sempre fora da moldura) — CLAUDE.md seção 9 atualizada. */}
      <div className={`${FULL_BLEED} z-10`}>
        <div className="bg-muted relative h-44 w-full overflow-hidden">
          {dados.fotoCapaUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dados.fotoCapaUrl}
              alt=""
              style={{
                objectPosition: `${dados.fotoCapaPos.x}% ${dados.fotoCapaPos.y}%`,
              }}
              className="size-full object-cover"
            />
          )}
        </div>
        <FloatingBackButton />
        {/* Avatar centralizado, mais pra dentro da capa do que transbordando
            embaixo — o nome não fica mais aqui, foi pro card de Informações */}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 translate-y-1/4">
          <div
            className={`border-background flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow-[0_2px_6px_rgb(0_0_0_/_0.15)] text-lg font-semibold text-white ${avatarColor(dados.id)}`}
          >
            {dados.fotoPrincipalUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dados.fotoPrincipalUrl}
                alt=""
                style={{
                  objectPosition: `${dados.fotoPrincipalPos.x}% ${dados.fotoPrincipalPos.y}%`,
                }}
                className="size-full object-cover"
              />
            ) : (
              initials(dados.nomeNegocio)
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        {dados.pendente && (
          <div className="border-secondary-500 bg-secondary-500/10 text-secondary-700 mx-4 rounded-lg border px-3 py-2 text-sm">
            {dados.souDono
              ? 'Seu cadastro está em análise. Só você (e o admin) consegue ver esta página por enquanto — assim que for aprovado, fica visível pra todo mundo.'
              : 'Este cadastro ainda está pendente de aprovação — você está vendo como admin, não é público ainda.'}
          </div>
        )}

        {dados.pendente && dados.souAdmin && (
          <div className="mx-4">
            <AdminActions negocioId={dados.id} />
          </div>
        )}

        {dados.naoReivindicado && dados.souAdmin && (
          <div className="mx-4">
            <TransferirDono negocioId={dados.id} />
          </div>
        )}

        {/* Cards "sangram" até a borda da tela — só em cima/embaixo têm
            acabamento de card (borda + sombra), dos lados eles vazam.
            O de cima (Informações) fica logo abaixo do avatar/nome de
            propósito, quase encostando (decisão de 17/08). */}
        <section
          className={`${FULL_BLEED} border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 border-y px-4 pt-4 pb-4`}
        >
          <h1 className="text-card-foreground text-lg font-bold">
            {dados.nomeNegocio}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {dados.categoriaNomes.map((nome) => (
              <span
                key={nome}
                className="bg-primary-500/10 text-primary-700 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              >
                <Tag className="size-3 shrink-0" />
                {nome}
              </span>
            ))}
          </div>
          {dados.descricao && (
            <p className="text-card-foreground pt-2 text-sm">{dados.descricao}</p>
          )}
        </section>

        <section
          className={`${FULL_BLEED} border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 border-y px-4 py-4`}
        >
          {(dados.endereco || dados.localizacaoNome) && (
            <div className="text-card-foreground flex items-center gap-2 text-sm">
              <MapPin className="text-primary-500 size-4 shrink-0" />
              {dados.endereco
                ? `${dados.endereco} — ${dados.localizacaoNome}`
                : dados.localizacaoNome}
            </div>
          )}
          <div className="text-card-foreground flex items-center gap-2 text-sm">
            <Phone className="text-primary-500 size-4 shrink-0" />
            {dados.telefoneDisplay}
          </div>
          {dados.enderecoLat != null && dados.enderecoLng != null && (
            <MapEmbed lat={dados.enderecoLat} lng={dados.enderecoLng} />
          )}
        </section>

        {dados.instagram && (
          <a
            href={`https://instagram.com/${dados.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${FULL_BLEED} border-border/70 bg-card text-card-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98] flex items-center gap-2 border-y px-4 py-4 text-sm font-medium transition-all duration-200 ease-decelerate`}
          >
            <Instagram className="text-primary-500 size-4" />@{dados.instagram}
          </a>
        )}

        <a
          href={whatsappHref(dados.whatsapp, dados.nomeNegocio)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-whatsapp active:scale-[0.98] active:translate-y-px mx-4 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-black transition-all duration-150 ease-standard hover:opacity-90"
        >
          <MessageCircle className="size-4" />
          Chamar no WhatsApp
        </a>

        {dados.souDono && (
          <Link
            href={`/negocio/${dados.id}/editar`}
            className="border-border text-neutral-text hover:bg-muted active:scale-[0.98] active:translate-y-px mx-4 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-150 ease-standard"
          >
            <Pencil className="size-4" />
            Editar negócio
          </Link>
        )}

        <div className="mx-4">
          <NegocioActions nomeNegocio={dados.nomeNegocio} />
        </div>
      </div>
    </main>
  )
}
