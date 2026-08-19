'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, GraduationCap, Tag, Dog, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LOCALIZACOES, matchLocalizacao } from '@/lib/mock-data'
import { POST_TIPOS, type PostTipo, type Visibilidade } from '@/lib/validations/posts'
import { PostPhotoField } from '@/components/postar/post-photo-field'
import { AddressAutocomplete } from '@/components/cadastro-negocio/address-autocomplete'
import { MapEmbed } from '@/components/shared/map-embed'
import { PageHeader } from '@/components/shared/page-header'
import { formatarTelefone } from '@/lib/utils'

const TIPO_INFO: Record<PostTipo, { label: string; icon: typeof Calendar }> = {
  evento: { label: 'Evento', icon: Calendar },
  curso: { label: 'Curso', icon: GraduationCap },
  anuncio: { label: 'Anúncio', icon: Tag },
  pet_perdido: { label: 'Pet Perdido', icon: Dog },
}

type NegocioOption = { id: string; nomeNegocio: string; telefoneContato: string }

export function PostForm({
  nomePerfil,
  telefonePerfil,
  negocios,
}: {
  nomePerfil: string
  telefonePerfil: string
  negocios: NegocioOption[]
}) {
  const router = useRouter()
  const [tipo, setTipo] = useState<PostTipo>('evento')
  const [autorId, setAutorId] = useState<string>('perfil')
  const [localizacao, setLocalizacao] = useState<string>(LOCALIZACOES[0].slug)
  const [visibilidade, setVisibilidade] = useState<Visibilidade>('publico')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [telefoneContato, setTelefoneContato] = useState(
    formatarTelefone(telefonePerfil)
  )
  const [emailContato, setEmailContato] = useState('')
  const [redeSocial, setRedeSocial] = useState('')
  const [dataEvento, setDataEvento] = useState('')
  const [localTexto, setLocalTexto] = useState('')
  const [enderecoCoords, setEnderecoCoords] = useState<{ lat: number; lng: number } | null>(
    null
  )
  const [preco, setPreco] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // evento/curso ficam salvos com data marcada, mesmo depois de passar
  // (histórico/linha do tempo) — não são apagados nem escondidos daqui
  // pra frente, só o feed/agenda que filtram o que já passou
  const precisaData = tipo === 'evento' || tipo === 'curso'
  const localObrigatorio = tipo === 'evento' || tipo === 'curso'
  const precisaLocalTexto = tipo === 'evento' || tipo === 'curso' || tipo === 'pet_perdido'
  const temRedeSocial = tipo === 'evento' || tipo === 'curso'
  const temEmail = tipo === 'evento' || tipo === 'curso' || tipo === 'anuncio'
  const fotoObrigatoria = tipo === 'pet_perdido'

  const escolherAutor = (id: string) => {
    setAutorId(id)
    if (id === 'perfil') {
      setTelefoneContato(formatarTelefone(telefonePerfil))
    } else {
      const negocio = negocios.find((n) => n.id === id)
      if (negocio) setTelefoneContato(formatarTelefone(negocio.telefoneContato))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!titulo.trim()) {
      setErro('Título é obrigatório')
      return
    }
    if (precisaData && !dataEvento) {
      setErro('Data é obrigatória pra evento ou curso')
      return
    }
    if (localObrigatorio && !localTexto.trim()) {
      setErro('Local é obrigatório pra evento ou curso')
      return
    }
    if (fotoObrigatoria && !foto) {
      setErro('Foto é obrigatória pra pet perdido — é o principal jeito de reconhecer')
      return
    }

    setSubmitting(true)
    try {
      const body = new FormData()
      body.set('tipo', tipo)
      if (autorId !== 'perfil') body.set('negocioId', autorId)
      body.set('localizacao', localizacao)
      body.set('visibilidade', visibilidade)
      body.set('titulo', titulo)
      body.set('descricao', descricao)
      body.set('telefoneContato', telefoneContato)
      if (temEmail && emailContato) body.set('emailContato', emailContato)
      if (temRedeSocial && redeSocial) body.set('redeSocial', redeSocial)
      if (precisaData) body.set('dataEvento', new Date(dataEvento).toISOString())
      if (precisaLocalTexto) {
        body.set('localTexto', localTexto)
        if (enderecoCoords) {
          body.set('enderecoLat', String(enderecoCoords.lat))
          body.set('enderecoLng', String(enderecoCoords.lng))
        }
      }
      if (tipo === 'anuncio' && preco) body.set('preco', preco)
      if (foto) body.set('foto', foto)

      const res = await fetch('/api/posts', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        setErro(data.error ?? 'Não foi possível publicar o post.')
        return
      }

      router.push('/')
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Publicar Post" backHref="/menu" />
      <p className="text-muted-foreground text-center text-sm">
        Fica visível na hora — sem esperar aprovação
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <span className="text-neutral-text block text-sm font-medium">Tipo</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {POST_TIPOS.map((t) => {
              const info = TIPO_INFO[t]
              const Icon = info.icon
              const selecionado = tipo === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  aria-pressed={selecionado}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selecionado
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-neutral-text hover:bg-muted'
                  }`}
                >
                  <Icon className="size-3.5" />
                  {info.label}
                </button>
              )
            })}
          </div>
        </div>

        {negocios.length > 0 && (
          <div>
            <span className="text-neutral-text block text-sm font-medium">
              Publicar como
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => escolherAutor('perfil')}
                aria-pressed={autorId === 'perfil'}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  autorId === 'perfil'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-neutral-text hover:bg-muted'
                }`}
              >
                {nomePerfil || 'Perfil pessoal'}
              </button>
              {negocios.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => escolherAutor(n.id)}
                  aria-pressed={autorId === n.id}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    autorId === n.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-neutral-text hover:bg-muted'
                  }`}
                >
                  {n.nomeNegocio}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="text-neutral-text block text-sm font-medium">
            Localização
          </span>
          {localObrigatorio && (
            <p className="text-muted-foreground mb-1 text-xs">
              Detectada sozinha pelo endereço abaixo — corrija aqui se precisar
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {LOCALIZACOES.map((l) => (
              <button
                key={l.slug}
                type="button"
                onClick={() => setLocalizacao(l.slug)}
                aria-pressed={localizacao === l.slug}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  localizacao === l.slug
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-neutral-text hover:bg-muted'
                }`}
              >
                {l.nome}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-neutral-text block text-sm font-medium">
            Quem pode ver
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setVisibilidade('publico')}
              aria-pressed={visibilidade === 'publico'}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                visibilidade === 'publico'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-neutral-text hover:bg-muted'
              }`}
            >
              <Globe className="size-3.5" />
              Qualquer um
            </button>
            <button
              type="button"
              onClick={() => setVisibilidade('logado')}
              aria-pressed={visibilidade === 'logado'}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                visibilidade === 'logado'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-neutral-text hover:bg-muted'
              }`}
            >
              <Lock className="size-3.5" />
              Só quem tem login
            </button>
          </div>
        </div>

        <PostPhotoField
          label={fotoObrigatoria ? 'Foto (obrigatória)' : 'Foto (opcional)'}
          onFileChange={setFoto}
        />

        {erro && <p className="text-destructive text-xs">{erro}</p>}

        <div>
          <label htmlFor="titulo" className="text-neutral-text block text-sm font-medium">
            Título
          </label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder={
              tipo === 'pet_perdido' ? 'Ex: Cachorro caramelo perdido' : 'Ex: Feira de artesanato'
            }
            required
          />
        </div>

        <div>
          <label htmlFor="descricao" className="text-neutral-text block text-sm font-medium">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border-border bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {precisaData && (
          <div>
            <label htmlFor="dataEvento" className="text-neutral-text block text-sm font-medium">
              Data e hora
            </label>
            <Input
              id="dataEvento"
              type="datetime-local"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
              required
            />
          </div>
        )}

        {precisaLocalTexto && (
          <div>
            <label htmlFor="localTexto" className="text-neutral-text block text-sm font-medium">
              {tipo === 'pet_perdido'
                ? 'Visto por último em'
                : `Local${localObrigatorio ? '' : ' (opcional)'}`}
            </label>
            <AddressAutocomplete
              value={localTexto}
              placeholder={
                localObrigatorio
                  ? 'Comece a digitar o endereço...'
                  : 'Opcional — comece a digitar o endereço...'
              }
              onChange={(v) => {
                // Digitar sem reselecionar (ex: corrigir typo) não pode
                // apagar o pin do mapa já escolhido — só um lugar novo
                // selecionado de verdade substitui (onPlaceSelected abaixo)
                setLocalTexto(v)
              }}
              onPlaceSelected={({ endereco, lat, lng, localidade }) => {
                setLocalTexto(endereco)
                setEnderecoCoords({ lat, lng })
                // detecta a tag de localização sozinho pelo bairro/vila
                // do endereço; se não reconhecer, mantém a seleção atual
                // (nem toda localidade da região tem bairro bem mapeado)
                const slug = matchLocalizacao(localidade)
                if (slug) setLocalizacao(slug)
              }}
            />
            {enderecoCoords && (
              <div className="mt-2">
                <MapEmbed lat={enderecoCoords.lat} lng={enderecoCoords.lng} />
              </div>
            )}
          </div>
        )}

        {tipo === 'anuncio' && (
          <div>
            <label htmlFor="preco" className="text-neutral-text block text-sm font-medium">
              Preço (opcional)
            </label>
            <Input
              id="preco"
              type="number"
              min="0"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Deixe em branco pra 'a combinar'"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="telefoneContato"
            className="text-neutral-text block text-sm font-medium"
          >
            Telefone de contato
          </label>
          <Input
            id="telefoneContato"
            value={telefoneContato}
            onChange={(e) => setTelefoneContato(formatarTelefone(e.target.value))}
            placeholder="(22) 99999-9999"
            maxLength={18}
            required
          />
        </div>

        {temEmail && (
          <div>
            <label htmlFor="emailContato" className="text-neutral-text block text-sm font-medium">
              Email (opcional)
            </label>
            <Input
              id="emailContato"
              type="email"
              value={emailContato}
              onChange={(e) => setEmailContato(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
        )}

        {temRedeSocial && (
          <div>
            <label htmlFor="redeSocial" className="text-neutral-text block text-sm font-medium">
              Rede social (opcional)
            </label>
            <Input
              id="redeSocial"
              value={redeSocial}
              onChange={(e) => setRedeSocial(e.target.value)}
              placeholder="@seuinstagram"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Publicando...' : 'Publicar'}
        </Button>
      </form>
    </main>
  )
}
