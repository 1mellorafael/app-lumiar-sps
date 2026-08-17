import Link from 'next/link'
import { MapPin, Phone, Tag, Clock, Instagram, MessageCircle } from 'lucide-react'
import { getPrestador, getCategoria } from '@/lib/mock-data'
import { whatsappHref } from '@/lib/whatsapp'
import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { VoltarButton, ServicoActions } from '@/components/servico/servico-actions'

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

type DadosServico = {
  id: string
  nomeServico: string
  categoriaNome: string
  descricao: string | null
  instagram: string | null
  whatsapp: string
  fotoPrincipalUrl: string | null
  fotoCapaUrl: string | null
  pendente: boolean
  souDono: boolean
}

async function buscarPrestadorReal(id: string): Promise<DadosServico | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: prestador } = await supabase
    .from('prestadores')
    .select(
      'id, profile_id, nome_servico, categoria, descricao, instagram, telefone_contato, foto_principal_url, foto_capa_url, status'
    )
    .eq('id', id)
    .maybeSingle()

  // RLS já barra pendente de quem não é dono nem admin — se voltou
  // linha, pode mostrar
  if (!prestador) return null

  const [fotoPrincipalUrl, fotoCapaUrl] = await Promise.all([
    fotoSignedUrl(prestador.foto_principal_url),
    fotoSignedUrl(prestador.foto_capa_url),
  ])

  return {
    id: prestador.id,
    nomeServico: prestador.nome_servico || 'Serviço sem nome',
    categoriaNome: getCategoria(prestador.categoria)?.nome ?? prestador.categoria,
    descricao: prestador.descricao,
    instagram: prestador.instagram,
    whatsapp: prestador.telefone_contato,
    fotoPrincipalUrl,
    fotoCapaUrl,
    pendente: prestador.status === 'pendente',
    souDono: user?.id === prestador.profile_id,
  }
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const real = UUID_RE.test(id) ? await buscarPrestadorReal(id) : null
  const mock = !real ? getPrestador(id) : null

  if (!real && !mock) {
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

  const dados: DadosServico = real ?? {
    id: mock!.id,
    nomeServico: mock!.nomeServico,
    categoriaNome: getCategoria(mock!.categoriaSlug)?.nome ?? mock!.categoriaSlug,
    descricao: mock!.descricao,
    instagram: mock!.instagram ?? null,
    whatsapp: mock!.whatsapp,
    fotoPrincipalUrl: null,
    fotoCapaUrl: null,
    pendente: false,
    souDono: false,
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <VoltarButton />

      {dados.pendente && (
        <div className="border-secondary-500 bg-secondary-500/10 text-secondary-700 rounded-lg border px-3 py-2 text-sm">
          {dados.souDono
            ? 'Seu cadastro está em análise. Só você (e o admin) consegue ver esta página por enquanto — assim que for aprovado, fica visível pra todo mundo.'
            : 'Este cadastro ainda está pendente de aprovação — você está vendo como admin, não é público ainda.'}
        </div>
      )}

      {/* Foto composta: capa (opcional, fundo) + principal (círculo
          central) — nome fica fora da moldura, abaixo — seção 9 do
          CLAUDE.md */}
      <div className="flex flex-col items-center">
        {/* overflow-hidden fica só na capa, não no wrapper — senão corta a
            metade de baixo do avatar, que precisa transbordar por cima */}
        <div className="relative h-16 w-full">
          <div className="bg-muted size-full overflow-hidden rounded-lg">
            {dados.fotoCapaUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dados.fotoCapaUrl}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
          <div
            className={`border-background absolute left-1/2 top-8 flex size-16 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border shadow-[0_2px_6px_rgb(0_0_0_/_0.15)] text-lg font-semibold text-white ${avatarColor(dados.id)}`}
          >
            {dados.fotoPrincipalUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dados.fotoPrincipalUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials(dados.nomeServico)
            )}
          </div>
        </div>
        {/* mt-12: a foto (size-16, top-8) transborda 32px abaixo da moldura
            (h-16) — precisa de margem maior que o normal pra não sobrepor */}
        <p className="text-card-foreground mt-12 text-lg font-bold">
          {dados.nomeServico}
        </p>
      </div>

      <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="text-neutral-text text-sm font-semibold uppercase tracking-wide">
          Informações
        </h2>
        {!real && mock?.endereco && (
          <div className="text-card-foreground flex items-center gap-2 text-sm">
            <MapPin className="text-primary-500 size-4 shrink-0" />
            {mock.endereco} — {mock.localizacao}
          </div>
        )}
        {!real && mock?.horarios && mock.horarios.length > 0 && (
          <div className="text-card-foreground flex items-start gap-2 text-sm">
            <Clock className="text-primary-500 mt-0.5 size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              {mock.horarios.map((h, i) => (
                <span key={i}>
                  {h.dias}: {h.abre} – {h.fecha}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="text-card-foreground flex items-center gap-2 text-sm">
          <Phone className="text-primary-500 size-4 shrink-0" />
          {mock?.telefoneDisplay ?? dados.whatsapp}
        </div>
        <div className="text-card-foreground flex items-center gap-2 text-sm">
          <Tag className="text-primary-500 size-4 shrink-0" />
          {dados.categoriaNome}
        </div>
      </section>

      {dados.descricao && (
        <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-4">
          <h2 className="text-neutral-text text-sm font-semibold uppercase tracking-wide">
            Sobre
          </h2>
          <p className="text-card-foreground text-sm">{dados.descricao}</p>
        </section>
      )}

      {dados.instagram && (
        <a
          href={`https://instagram.com/${dados.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border/70 bg-card text-card-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] flex items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-all duration-200 ease-out"
        >
          <Instagram className="text-primary-500 size-4" />@{dados.instagram}
        </a>
      )}

      <a
        href={whatsappHref(dados.whatsapp, dados.nomeServico)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-whatsapp inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-black transition-opacity ease-out hover:opacity-90"
      >
        <MessageCircle className="size-4" />
        Chamar no WhatsApp
      </a>

      <ServicoActions nomeServico={dados.nomeServico} />
    </main>
  )
}
