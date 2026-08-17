'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

type PlaceSelecionado = {
  endereco: string
  lat: number
  lng: number
}

type NominatimResult = {
  display_name: string
  lat: string
  lon: string
}

type AddressAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onPlaceSelected: (place: PlaceSelecionado) => void
}

const DEBOUNCE_MS = 400

// Autocomplete via Nominatim (OpenStreetMap) — gratuito, sem API key nem
// billing. Uso respeitoso da policy pública: debounce de 400ms (bem
// abaixo do limite de 1 req/s deles) e cancela a busca anterior a cada
// nova letra digitada.
export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
}: AddressAutocompleteProps) {
  const [sugestoes, setSugestoes] = useState<NominatimResult[]>([])
  const [aberto, setAberto] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  // Sem isso, sair da tela no meio do debounce (ex: digitou e navegou
  // antes dos 400ms) deixa o setTimeout disparar sozinho depois —
  // request desnecessária pro Nominatim e setState em componente já
  // desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      abortRef.current?.abort()
    }
  }, [])

  const buscar = (query: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    abortRef.current?.abort()

    if (query.trim().length < 3) {
      setSugestoes([])
      return
    }

    timeoutRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      setBuscando(true)
      try {
        const url = new URL('https://nominatim.openstreetmap.org/search')
        url.searchParams.set('q', query)
        url.searchParams.set('format', 'json')
        url.searchParams.set('countrycodes', 'br')
        url.searchParams.set('limit', '5')
        const res = await fetch(url, { signal: controller.signal })
        const data: NominatimResult[] = await res.json()
        setSugestoes(data)
        setAberto(true)
      } catch {
        // busca cancelada (nova letra digitada) ou falha de rede — segue
        // como texto livre, sem sugestão
      } finally {
        setBuscando(false)
      }
    }, DEBOUNCE_MS)
  }

  const selecionar = (item: NominatimResult) => {
    onChange(item.display_name)
    onPlaceSelected({
      endereco: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
    })
    setSugestoes([])
    setAberto(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          buscar(e.target.value)
        }}
        onFocus={() => sugestoes.length > 0 && setAberto(true)}
        placeholder="Opcional — comece a digitar o endereço..."
      />
      {aberto && sugestoes.length > 0 && (
        <ul className="border-border bg-card absolute z-10 mt-1 w-full overflow-hidden rounded-md border shadow-[var(--shadow-card-hover)]">
          {sugestoes.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => selecionar(item)}
                className="hover:bg-muted active:bg-muted/70 w-full px-3 py-2 text-left text-xs transition-colors duration-150 ease-standard"
              >
                {item.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {buscando && (
        <p className="text-muted-foreground mt-1 text-xs">Buscando...</p>
      )}
    </div>
  )
}
