import { NextResponse } from 'next/server'
import {
  prestadorSchema,
  FOTO_MAX_BYTES,
  FOTO_TIPOS_ACEITOS,
} from '@/lib/validations/prestador'
import { createClient } from '@/lib/supabase/server'

function extensaoPor(mime: string) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'jpg'
}

function validarFoto(file: File | null, obrigatoria: boolean) {
  if (!file || file.size === 0) {
    return obrigatoria ? 'Foto principal é obrigatória' : null
  }
  if (!FOTO_TIPOS_ACEITOS.includes(file.type)) {
    return 'Formato de imagem inválido (use JPG, PNG ou WEBP)'
  }
  if (file.size > FOTO_MAX_BYTES) {
    return 'Imagem muito grande (máximo 5MB)'
  }
  return null
}

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

  const parsed = prestadorSchema.safeParse({
    nomeServico: form.get('nomeServico'),
    categoria: form.get('categoria'),
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
    true
  )
  if (erroPrincipal) {
    return NextResponse.json(
      { error: erroPrincipal, field: 'fotoPrincipal' },
      { status: 400 }
    )
  }

  const erroCapa = validarFoto(fotoCapa instanceof File ? fotoCapa : null, false)
  if (erroCapa) {
    return NextResponse.json({ error: erroCapa, field: 'fotoCapa' }, { status: 400 })
  }

  const principal = fotoPrincipal as File
  const caminhoPrincipal = `${user.id}/principal-${Date.now()}.${extensaoPor(principal.type)}`

  const { error: uploadPrincipalError } = await supabase.storage
    .from('prestador-fotos')
    .upload(caminhoPrincipal, principal, { contentType: principal.type })

  if (uploadPrincipalError) {
    return NextResponse.json(
      { error: 'Não foi possível enviar a foto principal. Tente novamente.' },
      { status: 500 }
    )
  }

  let caminhoCapa: string | null = null
  if (fotoCapa instanceof File && fotoCapa.size > 0) {
    caminhoCapa = `${user.id}/capa-${Date.now()}.${extensaoPor(fotoCapa.type)}`
    const { error: uploadCapaError } = await supabase.storage
      .from('prestador-fotos')
      .upload(caminhoCapa, fotoCapa, { contentType: fotoCapa.type })

    if (uploadCapaError) {
      return NextResponse.json(
        { error: 'Não foi possível enviar a foto de capa. Tente novamente.' },
        { status: 500 }
      )
    }
  }

  const { nomeServico, categoria, descricao, instagram, telefoneContato } = parsed.data

  const { data: prestador, error: insertError } = await supabase
    .from('prestadores')
    .insert({
      profile_id: user.id,
      nome_servico: nomeServico || null,
      categoria,
      descricao: descricao || null,
      instagram: instagram || null,
      telefone_contato: telefoneContato,
      foto_principal_url: caminhoPrincipal,
      foto_capa_url: caminhoCapa,
    })
    .select('id')
    .single()

  if (insertError || !prestador) {
    return NextResponse.json(
      { error: 'Não foi possível criar o cadastro. Tente novamente.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: prestador.id })
}
