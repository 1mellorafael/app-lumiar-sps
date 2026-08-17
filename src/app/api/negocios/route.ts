import { NextResponse } from 'next/server'
import { negocioSchema } from '@/lib/validations/negocio'
import { validarFoto, uploadFoto } from '@/lib/negocio-foto-upload'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Faça login pra continuar.' }, { status: 401 })
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

  const { caminho: caminhoPrincipal, erro: erroUploadPrincipal } = await uploadFoto(
    supabase,
    fotoPrincipal as File,
    user.id,
    'principal'
  )
  if (erroUploadPrincipal) {
    return NextResponse.json({ error: erroUploadPrincipal }, { status: 500 })
  }

  let caminhoCapa: string | null = null
  if (fotoCapa instanceof File && fotoCapa.size > 0) {
    const { caminho, erro } = await uploadFoto(supabase, fotoCapa, user.id, 'capa')
    if (erro) {
      return NextResponse.json({ error: erro }, { status: 500 })
    }
    caminhoCapa = caminho
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
      profile_id: user.id,
      nome_negocio: nomeNegocio,
      categorias,
      localizacoes,
      endereco: endereco || null,
      endereco_lat: enderecoLat ?? null,
      endereco_lng: enderecoLng ?? null,
      descricao: descricao || null,
      instagram: instagram || null,
      telefone_contato: telefoneContato,
      foto_principal_url: caminhoPrincipal,
      foto_capa_url: caminhoCapa,
    })
    .select('id')
    .single()

  if (insertError || !negocio) {
    return NextResponse.json(
      { error: 'Não foi possível criar o cadastro. Tente novamente.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: negocio.id })
}
