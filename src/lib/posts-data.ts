import { createClient } from '@/lib/supabase/server'
import type { PostTipo } from '@/lib/validations/posts'

export type PostFeed = {
  id: string
  tipo: PostTipo
  titulo: string
  descricao: string
  fotoUrl: string | null
  localizacao: string
  telefoneContato: string
  emailContato: string | null
  redeSocial: string | null
  dataEvento: string | null
  localTexto: string | null
  enderecoLat: number | null
  enderecoLng: number | null
  preco: number | null
  autorNome: string
  createdAt: string
}

const SELECT_COLS =
  'id, tipo, titulo, descricao, foto_url, localizacao, telefone_contato, email_contato, rede_social, data_evento, local_texto, endereco_lat, endereco_lng, preco, autor_nome, created_at'

type PostRow = {
  id: string
  tipo: PostTipo
  titulo: string
  descricao: string | null
  foto_url: string | null
  localizacao: string
  telefone_contato: string
  email_contato: string | null
  rede_social: string | null
  data_evento: string | null
  local_texto: string | null
  endereco_lat: number | null
  endereco_lng: number | null
  preco: number | null
  autor_nome: string
  created_at: string
}

function mapRow(p: PostRow): PostFeed {
  return {
    id: p.id,
    tipo: p.tipo,
    titulo: p.titulo,
    descricao: p.descricao ?? '',
    fotoUrl: p.foto_url,
    localizacao: p.localizacao,
    telefoneContato: p.telefone_contato,
    emailContato: p.email_contato,
    redeSocial: p.rede_social,
    dataEvento: p.data_evento,
    localTexto: p.local_texto,
    enderecoLat: p.endereco_lat,
    enderecoLng: p.endereco_lng,
    preco: p.preco,
    autorNome: p.autor_nome,
    createdAt: p.created_at,
  }
}

// pet_perdido sempre no topo (urgência real — quanto mais rápido acha,
// melhor), resto por mais recente. Só essa exceção fura a ordem
// cronológica — eventos/anúncios não têm motivo pra furar fila.
export async function buscarPostsFeed(): Promise<PostFeed[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select(SELECT_COLS)
    .eq('status', 'ativo')
    .order('created_at', { ascending: false })

  const posts = (data ?? []).map(mapRow)
  const petsPerdidos = posts.filter((p) => p.tipo === 'pet_perdido')
  const resto = posts.filter((p) => p.tipo !== 'pet_perdido')
  return [...petsPerdidos, ...resto]
}

// Agenda: só evento/curso, ordenado por data, escondendo o que já
// passou (não faz sentido pesquisar por data um evento que já rolou) —
// o post em si continua salvo e acessível pelo link direto
// (histórico/linha do tempo), só some dessa lista de "próximos".
export async function buscarEventos(): Promise<PostFeed[]> {
  const supabase = await createClient()
  const inicioDeHoje = new Date()
  inicioDeHoje.setHours(0, 0, 0, 0)

  const { data } = await supabase
    .from('posts')
    .select(SELECT_COLS)
    .eq('status', 'ativo')
    .in('tipo', ['evento', 'curso'])
    .gte('data_evento', inicioDeHoje.toISOString())
    .order('data_evento', { ascending: true })

  return (data ?? []).map(mapRow)
}

export async function buscarPostPorId(id: string): Promise<PostFeed | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select(SELECT_COLS)
    .eq('id', id)
    .eq('status', 'ativo')
    .maybeSingle()

  return data ? mapRow(data) : null
}
