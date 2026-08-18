import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { negocioSchema } from '@/lib/validations/negocio'
import { validarFoto, uploadFoto } from '@/lib/negocio-foto-upload'
import { createClient } from '@/lib/supabase/server'
import { NEGOCIOS_ATIVOS_TAG } from '@/lib/negocios'

// Cadastro direto pelo admin — negócio nasce sem dono (profile_id null)
// e já ativo (admin verificou a fonte, não precisa de aprovação de novo).
// Fica visível na Busca até alguém reivindicar (PATCH /api/admin/negocios/[id]
// com telefoneNovoDono transfere a posse).
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Faça login pra continuar.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  const form = await request.formData().catch(() => null)
  if (!form) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const parsed = negocioSchema.safeParse({
    nomeNegocio: form.get('nomeNegocio'),
    categorias: form.getAll('categorias'),
    localizacoes: form.getAll('localizacoes'),
    endereco: form.get('endereco'),
    enderecoLat: form.get('enderecoLat') || undefined,
    enderecoLng: form.get('enderecoLng') || undefined,
    descricao: form.get('descricao'),
    instagram: form.get('instagram'),
    telefoneContato: form.get('telefoneContato'),
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const fotoPrincipal = form.get('fotoPrincipal')
  const fotoCapa = form.get('fotoCapa')

  const erroPrincipal = validarFoto(
    fotoPrincipal instanceof File ? fotoPrincipal : null,
    true,
    'Foto principal'
  )
  if (erroPrincipal) {
    return NextResponse.json(
      { error: erroPrincipal, field: 'fotoPrincipal' },
      { status: 400 }
    )
  }

  const erroCapa = validarFoto(
    fotoCapa instanceof File ? fotoCapa : null,
    false,
    'Foto de capa'
  )
  if (erroCapa) {
    return NextResponse.json({ error: erroCapa, field: 'fotoCapa' }, { status: 400 })
  }

  const temCapa = fotoCapa instanceof File && fotoCapa.size > 0

  const [uploadPrincipal, uploadCapa] = await Promise.all([
    uploadFoto(supabase, fotoPrincipal as File, user.id, 'principal'),
    temCapa
      ? uploadFoto(supabase, fotoCapa as File, user.id, 'capa')
      : Promise.resolve({ caminho: null, erro: null }),
  ])

  if (uploadPrincipal.erro) {
    return NextResponse.json({ error: uploadPrincipal.erro }, { status: 500 })
  }
  if (uploadCapa.erro) {
    return NextResponse.json({ error: uploadCapa.erro }, { status: 500 })
  }

  const {
    nomeNegocio,
    categorias,
    localizacoes,
    endereco,
    enderecoLat,
    enderecoLng,
    descricao,
    instagram,
    telefoneContato,
  } = parsed.data

  const { data: negocio, error: insertError } = await supabase
    .from('negocios')
    .insert({
      profile_id: null,
      status: 'ativo',
      nome_negocio: nomeNegocio,
      categorias,
      localizacoes,
      endereco: endereco || null,
      endereco_lat: enderecoLat ?? null,
      endereco_lng: enderecoLng ?? null,
      descricao: descricao || null,
      instagram: instagram || null,
      telefone_contato: telefoneContato,
      foto_principal_url: uploadPrincipal.caminho,
      foto_capa_url: uploadCapa.caminho,
    })
    .select('id')
    .single()

  if (insertError || !negocio) {
    return NextResponse.json(
      { error: 'Não foi possível criar o cadastro. Tente novamente.' },
      { status: 500 }
    )
  }

  revalidateTag(NEGOCIOS_ATIVOS_TAG, 'max')

  return NextResponse.json({ id: negocio.id })
}
