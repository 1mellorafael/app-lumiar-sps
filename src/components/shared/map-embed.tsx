// Só aparece quando existe endereço com coordenadas reais (escolhido via
// autocomplete) — sem key configurada, não renderiza nada
export function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!key) return null

  return (
    <iframe
      title="Mapa do endereço"
      className="h-40 w-full rounded-lg border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/view?key=${key}&center=${lat},${lng}&zoom=15`}
    />
  )
}
