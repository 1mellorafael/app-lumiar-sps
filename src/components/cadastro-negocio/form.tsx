'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORIAS, LOCALIZACOES } from '@/lib/mock-data'
import { PhotoCropField } from '@/components/cadastro-negocio/photo-crop-field'
import { AddressAutocomplete } from '@/components/cadastro-negocio/address-autocomplete'
import { MapEmbed } from '@/components/shared/map-embed'

const formatarTelefone = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}

export type NegocioExistente = {
  id: string
  nomeNegocio: string
  categorias: string[]
  localizacoes: string[]
  endereco: string
  enderecoLat: number | null
  enderecoLng: number | null
  descricao: string
  instagram: string
  telefoneContato: string
  fotoPrincipalUrl: string | null
  fotoCapaUrl: string | null
}

export function NegocioForm({
  telefoneConta,
  negocioExistente,
}: {
  telefoneConta: string
  negocioExistente?: NegocioExistente
}) {
  const router = useRouter()
  const editando = !!negocioExistente
  const [formData, setFormData] = useState({
    nomeNegocio: negocioExistente?.nomeNegocio ?? '',
    endereco: negocioExistente?.endereco ?? '',
    descricao: negocioExistente?.descricao ?? '',
    instagram: negocioExistente?.instagram ?? '',
    telefoneContato: negocioExistente
      ? formatarTelefone(negocioExistente.telefoneContato)
      : formatarTelefone(telefoneConta),
  })
  const [categorias, setCategorias] = useState<string[]>(
    negocioExistente?.categorias ?? []
  )
  const [localizacoes, setLocalizacoes] = useState<string[]>(
    negocioExistente?.localizacoes ?? []
  )
  const [enderecoCoords, setEnderecoCoords] = useState<
    { lat: number; lng: number } | null
  >(
    negocioExistente?.enderecoLat != null && negocioExistente?.enderecoLng != null
      ? { lat: negocioExistente.enderecoLat, lng: negocioExistente.enderecoLng }
      : null
  )
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null)
  const [fotoCapa, setFotoCapa] = useState<File | null>(null)
  const [termosPresta, setTermosPresta] = useState(editando)
  const [negocioError, setNegocioError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleCategoria = (slug: string) => {
    setCategorias((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    )
  }

  const toggleLocalizacao = (slug: string) => {
    setLocalizacoes((prev) =>
      prev.includes(slug) ? prev.filter((l) => l !== slug) : [...prev, slug]
    )
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      telefoneContato: formatarTelefone(e.target.value),
    }))
  }

  const handleNegocioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNegocioError(null)

    if (!termosPresta) {
      alert('Precisa aceitar os termos pra continuar')
      return
    }
    if (!fotoPrincipal && !negocioExistente?.fotoPrincipalUrl) {
      setNegocioError('Foto principal é obrigatória')
      return
    }
    if (categorias.length === 0) {
      setNegocioError('Escolha ao menos uma categoria')
      return
    }
    if (localizacoes.length === 0) {
      setNegocioError('Escolha ao menos uma localização')
      return
    }

    setSubmitting(true)
    try {
      const body = new FormData()
      body.set('nomeNegocio', formData.nomeNegocio)
      categorias.forEach((c) => body.append('categorias', c))
      localizacoes.forEach((l) => body.append('localizacoes', l))
      body.set('endereco', formData.endereco)
      if (enderecoCoords) {
        body.set('enderecoLat', String(enderecoCoords.lat))
        body.set('enderecoLng', String(enderecoCoords.lng))
      }
      body.set('descricao', formData.descricao)
      body.set('instagram', formData.instagram)
      body.set('telefoneContato', formData.telefoneContato)
      if (fotoPrincipal) body.set('fotoPrincipal', fotoPrincipal)
      if (fotoCapa) body.set('fotoCapa', fotoCapa)

      const url = editando
        ? `/api/negocios/${negocioExistente.id}`
        : '/api/negocios'
      const res = await fetch(url, {
        method: editando ? 'PATCH' : 'POST',
        body,
      })
      const data = await res.json()

      if (!res.ok) {
        setNegocioError(
          data.error ??
            (editando
              ? 'Não foi possível salvar as alterações.'
              : 'Não foi possível criar o cadastro.')
        )
        return
      }

      router.push(`/negocio/${editando ? negocioExistente.id : data.id}`)
    } catch {
      setNegocioError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Link
        href={editando ? `/negocio/${negocioExistente.id}` : '/menu'}
        aria-label="Voltar"
        className="text-neutral-text hover:text-primary-500 flex w-fit items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-primary-500 text-lg font-bold">
          {editando ? 'Editar Negócio' : 'Cadastrar Negócio'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {editando
            ? 'As mudanças ficam visíveis na hora'
            : 'Fica pendente até um admin aprovar'}
        </p>
      </div>

      <form onSubmit={handleNegocioSubmit} className="flex flex-col gap-3">
        {/* Foto em duas camadas: capa (opcional, banner) + principal
            (obrigatória, círculo) — CLAUDE.md seção 9. O recorte acontece
            num editor com zoom/pan sobre a foto inteira (PhotoCropField),
            não arrastando dentro do espaço final já cortado. */}
        <div className="flex flex-row items-start justify-center gap-6">
          <PhotoCropField
            label="Foto principal"
            trocarLabel="Trocar foto principal"
            icon="camera"
            shape="round"
            aspect={1}
            initialUrl={negocioExistente?.fotoPrincipalUrl}
            previewClassName="size-24"
            onFileChange={setFotoPrincipal}
          />
          <PhotoCropField
            label="Foto de capa"
            trocarLabel="Trocar capa"
            icon="imagem"
            shape="rect"
            aspect={2.5}
            initialUrl={negocioExistente?.fotoCapaUrl}
            previewClassName="h-24 w-32"
            onFileChange={setFotoCapa}
          />
        </div>

        {negocioError && (
          <p className="text-destructive text-xs">{negocioError}</p>
        )}

        <div>
          <label
            htmlFor="nomeNegocio"
            className="text-neutral-text block text-sm font-medium"
          >
            Nome do Negócio
          </label>
          <Input
            id="nomeNegocio"
            name="nomeNegocio"
            value={formData.nomeNegocio}
            onChange={handleInputChange}
            placeholder="Ex: João Manutenção"
            required
          />
        </div>

        <div>
          <span className="text-neutral-text block text-sm font-medium">
            Categoria
          </span>
          <p className="text-muted-foreground mb-1.5 text-xs">
            Pode escolher mais de uma, se o negócio cobrir mais de uma coisa
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIAS.map((c) => {
              const selecionada = categorias.includes(c.slug)
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleCategoria(c.slug)}
                  aria-pressed={selecionada}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selecionada
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-neutral-text hover:bg-muted'
                  }`}
                >
                  {c.nome}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-neutral-text block text-sm font-medium">
            Localização
          </span>
          <p className="text-muted-foreground mb-1.5 text-xs">
            Onde o negócio atende — pode escolher os dois
          </p>
          <div className="flex flex-wrap gap-1.5">
            {LOCALIZACOES.map((l) => {
              const selecionada = localizacoes.includes(l.slug)
              return (
                <button
                  key={l.slug}
                  type="button"
                  onClick={() => toggleLocalizacao(l.slug)}
                  aria-pressed={selecionada}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selecionada
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-neutral-text hover:bg-muted'
                  }`}
                >
                  {l.nome}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="endereco"
            className="text-neutral-text block text-sm font-medium"
          >
            Endereço
          </label>
          <AddressAutocomplete
            value={formData.endereco}
            onChange={(v) => {
              // Não zera enderecoCoords aqui — digitar (ex: corrigir um
              // typo) sem reselecionar uma sugestão não pode apagar o
              // pin do mapa já salvo. Só é substituído quando um lugar
              // novo é escolhido de verdade (onPlaceSelected abaixo).
              setFormData((prev) => ({ ...prev, endereco: v }))
            }}
            onPlaceSelected={({ endereco, lat, lng }) => {
              setFormData((prev) => ({ ...prev, endereco }))
              setEnderecoCoords({ lat, lng })
            }}
          />
          {enderecoCoords && (
            <div className="mt-2">
              <MapEmbed lat={enderecoCoords.lat} lng={enderecoCoords.lng} />
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="telefoneContato"
            className="text-neutral-text block text-sm font-medium"
          >
            Telefone de contato do negócio
          </label>
          <Input
            id="telefoneContato"
            name="telefoneContato"
            value={formData.telefoneContato}
            onChange={handleTelefoneChange}
            placeholder="(22) 99999-9999"
            maxLength={18}
            required
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Quem clicar em WhatsApp fala com este número — pode ser diferente
            do telefone da sua conta.
          </p>
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="text-neutral-text block text-sm font-medium"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Descreva brevemente o seu negócio..."
            className="border-border bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div>
          <label
            htmlFor="instagram"
            className="text-neutral-text block text-sm font-medium"
          >
            Instagram
          </label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            placeholder="@seuinstagram"
          />
        </div>

        {!editando && (
          <div className="flex items-start gap-2">
            <input
              id="termosPresta"
              type="checkbox"
              checked={termosPresta}
              onChange={(e) => setTermosPresta(e.target.checked)}
              className="mt-1"
            />
            <label
              htmlFor="termosPresta"
              className="text-muted-foreground text-xs cursor-pointer"
            >
              Aceito os{' '}
              <Link
                href="/termos"
                className="text-primary-500 underline hover:no-underline"
              >
                Termos de Uso pra Negócios
              </Link>
            </label>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting
            ? 'Enviando...'
            : editando
              ? 'Salvar alterações'
              : 'Cadastrar'}
        </Button>
      </form>
    </main>
  )
}
