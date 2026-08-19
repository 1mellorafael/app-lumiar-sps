import { NextResponse } from 'next/server'
import { postSchema } from '@/lib/validations/posts'
import { validarFotoPost, uploadFotoPost } from '@/lib/post-foto-upload'
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

  const parsed = postSchema.safeParse({
    tipo: form.get('tipo'),
    negocioId: form.get('negocioId') || undefined,
    localizacao: form.get('localizacao'),
    visibilidade: form.get('visibilidade') || undefined,
    titulo: form.get('titulo'),
    descricao: form.get('descricao') || undefined,
    telefoneContato: form.get('telefoneContato'),
    emailContato: form.get('emailContato') || undefined,
    redeSocial: form.get('redeSocial') || undefined,
    dataEvento: form.get('dataEvento') || undefined,
    localTexto: form.get('localTexto') || undefined,
    enderecoLat: form.get('enderecoLat') || undefined,
    enderecoLng: form.get('enderecoLng') || undefined,
    preco: form.get('preco') || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const {
    tipo,
    negocioId,
    localizacao,
    visibilidade,
    titulo,
    descricao,
    telefoneContato,
    emailContato,
    redeSocial,
    dataEvento,
    localTexto,
    enderecoLat,
    enderecoLng,
    preco,
  } = parsed.data

  // negócio precisa ser do próprio autor e já estar ativo — a policy de
  // insert já reforça isso no banco, mas checar aqui devolve um erro
  // legível em vez de "novo registro viola política de segurança".
  // autorNome é sempre resolvido no servidor (nunca aceito do cliente),
  // pra não dar pra "postar em nome de outra pessoa" só editando o form.
  let autorNome = ''
  if (negocioId) {
    const { data: negocio } = await supabase
      .from('negocios')
      .select('nome_negocio')
      .eq('id', negocioId)
      .eq('profile_id', user.id)
      .eq('status', 'ativo')
      .maybeSingle()

    if (!negocio) {
      return NextResponse.json(
        { error: 'Negócio inválido pra publicar esse post.' },
        { status: 400 }
      )
    }
    autorNome = negocio.nome_negocio
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome')
      .eq('id', user.id)
      .single()
    autorNome = profile?.nome ?? ''
  }

  const foto = form.get('foto')
  const erroFoto = validarFotoPost(foto instanceof File ? foto : null, tipo === 'pet_perdido')
  if (erroFoto) {
    return NextResponse.json({ error: erroFoto, field: 'foto' }, { status: 400 })
  }

  const temFoto = foto instanceof File && foto.size > 0
  const { url: fotoUrl, erro: erroUpload } = temFoto
    ? await uploadFotoPost(supabase, foto as File, user.id)
    : { url: null, erro: null }

  if (erroUpload) {
    return NextResponse.json({ error: erroUpload }, { status: 500 })
  }

  const { data: post, error: insertError } = await supabase
    .from('posts')
    .insert({
      profile_id: user.id,
      negocio_id: negocioId ?? null,
      autor_nome: autorNome,
      tipo,
      localizacao,
      visibilidade,
      titulo,
      descricao: descricao || null,
      foto_url: fotoUrl,
      telefone_contato: telefoneContato,
      email_contato: emailContato || null,
      rede_social: redeSocial || null,
      data_evento: dataEvento ?? null,
      local_texto: localTexto || null,
      endereco_lat: enderecoLat ?? null,
      endereco_lng: enderecoLng ?? null,
      preco: preco ?? null,
    })
    .select('id')
    .single()

  if (insertError || !post) {
    return NextResponse.json(
      { error: 'Não foi possível criar o post. Tente novamente.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: post.id })
}
