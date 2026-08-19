import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { negocioSchema } from '@/lib/validations/negocio'
import { validarFoto, uploadFoto } from '@/lib/negocio-foto-upload'
import { calcularCamposAlterados, calcularNivelAlerta } from '@/lib/negocio-edicao'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NEGOCIOS_ATIVOS_TAG } from '@/lib/negocios'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // getUser() e a query do negócio não dependem uma da outra — rodar em
  // paralelo corta um round-trip pro Supabase (~90ms), mesmo ajuste já
  // aplicado em src/app/negocio/[id]/page.tsx
  const [
    {
      data: { user },
    },
    { data: existente },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('negocios')
      .select(
        'id, profile_id, nome_negocio, categorias, localizacoes, endereco, descricao, instagram, telefone_contato, visibilidade, foto_principal_url, foto_capa_url'
      )
      .eq('id', id)
      .maybeSingle(),
  ])

  if (!user) {
    return NextResponse.json({ error: 'Faça login pra continuar.' }, { status: 401 })
  }

  if (!existente) {
    return NextResponse.json({ error: 'Negócio não encontrado.' }, { status: 404 })
  }
  // Só o dono edita — CLAUDE.md seção 3, item 8 (whitelist de campos, nunca
  // confiar em quem o cliente diz que é sem checar no servidor)
  if (existente.profile_id !== user.id) {
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
    visibilidade: form.get('visibilidade') || existente.visibilidade,
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
    fotoPrincipal instanceof File && fotoPrincipal.size > 0 ? fotoPrincipal : null,
    false,
    'Foto principal'
  )
  if (erroPrincipal) {
    return NextResponse.json(
      { error: erroPrincipal, field: 'fotoPrincipal' },
      { status: 400 }
    )
  }
  const erroCapa = validarFoto(
    fotoCapa instanceof File && fotoCapa.size > 0 ? fotoCapa : null,
    false,
    'Foto de capa'
  )
  if (erroCapa) {
    return NextResponse.json({ error: erroCapa, field: 'fotoCapa' }, { status: 400 })
  }

  const novaPrincipal = fotoPrincipal instanceof File && fotoPrincipal.size > 0
  const novaCapa = fotoCapa instanceof File && fotoCapa.size > 0

  // Uploads independentes — rodar em paralelo evita dobrar a espera
  // (Storage é a etapa mais lenta desse handler) quando os dois trocam
  const [uploadPrincipal, uploadCapa] = await Promise.all([
    novaPrincipal
      ? uploadFoto(supabase, fotoPrincipal as File, user.id, 'principal')
      : Promise.resolve({ caminho: existente.foto_principal_url, erro: null }),
    novaCapa
      ? uploadFoto(supabase, fotoCapa as File, user.id, 'capa')
      : Promise.resolve({ caminho: existente.foto_capa_url, erro: null }),
  ])

  if (uploadPrincipal.erro) {
    return NextResponse.json({ error: uploadPrincipal.erro }, { status: 500 })
  }
  if (uploadCapa.erro) {
    return NextResponse.json({ error: uploadCapa.erro }, { status: 500 })
  }

  const caminhoPrincipal = uploadPrincipal.caminho
  const caminhoCapa = uploadCapa.caminho

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
    visibilidade,
  } = parsed.data

  const depois = {
    nome_negocio: nomeNegocio,
    categorias,
    localizacoes,
    endereco: endereco || null,
    endereco_lat: enderecoLat ?? null,
    endereco_lng: enderecoLng ?? null,
    descricao: descricao || null,
    instagram: instagram || null,
    telefone_contato: telefoneContato,
    visibilidade,
    foto_principal_url: caminhoPrincipal,
    foto_capa_url: caminhoCapa,
    // Foto nova já chega pré-recortada (PhotoCropField) — reseta a
    // posição pro default, senão um offset salvo da era do drag antigo
    // (pré-recorte) fica aplicado por cima da foto nova, deslocando ela
    ...(novaPrincipal && { foto_principal_pos_x: 50, foto_principal_pos_y: 50 }),
    ...(novaCapa && { foto_capa_pos_x: 50, foto_capa_pos_y: 50 }),
  }

  // Whitelist explícito — "status" nunca entra aqui, então nunca pode vir
  // do cliente (CLAUDE.md seção 3, item 8)
  const { error: updateError } = await supabase
    .from('negocios')
    .update(depois)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json(
      { error: 'Não foi possível salvar as alterações. Tente novamente.' },
      { status: 500 }
    )
  }

  // Se o negócio já era ativo, a edição pode ter mudado algo visível na
  // Busca (foto, nome, categoria) — invalida o cache pra refletir na hora
  revalidateTag(NEGOCIOS_ATIVOS_TAG, 'max')

  const camposAlterados = calcularCamposAlterados(existente, depois)
  if (camposAlterados.length > 0) {
    const admin = createAdminClient()
    const { error: logError } = await admin.from('negocio_edicoes').insert({
      negocio_id: id,
      campos_alterados: camposAlterados,
      nivel_alerta: calcularNivelAlerta(camposAlterados),
    })
    // A edição em si já foi salva — log de auditoria falhar não deve
    // impedir o dono de salvar, só perde o registro pro admin ver depois
    if (logError) {
      console.error('Falha ao registrar negocio_edicoes:', logError)
    }
  }

  return NextResponse.json({ id })
}
