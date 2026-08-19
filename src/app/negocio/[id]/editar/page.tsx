import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fotoSignedUrl } from '@/lib/supabase/signed-url'
import { NegocioForm } from '@/components/cadastro-negocio/form'

export default async function EditarNegocioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
        'id, profile_id, nome_negocio, categorias, localizacoes, endereco, endereco_lat, endereco_lng, descricao, instagram, telefone_contato, visibilidade, foto_principal_url, foto_capa_url'
      )
      .eq('id', id)
      .maybeSingle(),
  ])

  if (!user) redirect('/login')

  // Só o dono edita — quem não é dono nem vê que essa página existe
  if (!negocio || negocio.profile_id !== user.id) redirect(`/negocio/${id}`)

  const [fotoPrincipalUrl, fotoCapaUrl] = await Promise.all([
    fotoSignedUrl(negocio.foto_principal_url),
    fotoSignedUrl(negocio.foto_capa_url),
  ])

  return (
    <NegocioForm
      telefoneConta=""
      negocioExistente={{
        id: negocio.id,
        nomeNegocio: negocio.nome_negocio,
        categorias: negocio.categorias,
        localizacoes: negocio.localizacoes,
        endereco: negocio.endereco ?? '',
        enderecoLat: negocio.endereco_lat,
        enderecoLng: negocio.endereco_lng,
        descricao: negocio.descricao ?? '',
        instagram: negocio.instagram ?? '',
        telefoneContato: negocio.telefone_contato,
        visibilidade: negocio.visibilidade,
        fotoPrincipalUrl,
        fotoCapaUrl,
      }}
    />
  )
}
