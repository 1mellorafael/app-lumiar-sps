'use client'

import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { loadGoogleMaps } from '@/lib/google-maps-loader'

type PlaceSelecionado = {
  endereco: string
  lat: number
  lng: number
}

type AddressAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onPlaceSelected: (place: PlaceSelecionado) => void
}

// Autocomplete do Google sobre um input comum — sem key configurada, o
// script nunca carrega e o campo continua funcionando normal, como texto
// livre (sem sugestão e sem mapa)
export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const onChangeRef = useRef(onChange)
  const onPlaceSelectedRef = useRef(onPlaceSelected)

  useEffect(() => {
    onChangeRef.current = onChange
    onPlaceSelectedRef.current = onPlaceSelected
  }, [onChange, onPlaceSelected])

  useEffect(() => {
    let listener: google.maps.MapsEventListener | undefined
    let cancelado = false

    loadGoogleMaps()
      .then(() => {
        if (cancelado || !inputRef.current) return
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry'],
          componentRestrictions: { country: 'br' },
        })
        listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          const lat = place.geometry?.location?.lat()
          const lng = place.geometry?.location?.lng()
          if (place.formatted_address && lat != null && lng != null) {
            onChangeRef.current(place.formatted_address)
            onPlaceSelectedRef.current({ endereco: place.formatted_address, lat, lng })
          }
        })
      })
      .catch(() => {
        // sem key ou falha de rede — segue como texto livre
      })

    return () => {
      cancelado = true
      listener?.remove()
    }
  }, [])

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Opcional — comece a digitar o endereço..."
    />
  )
}
