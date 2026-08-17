// Embed do OpenStreetMap — gratuito, sem API key. Só aparece quando
// existe endereço com coordenadas reais (escolhido via autocomplete).
export function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const delta = 0.006
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`

  return (
    <iframe
      title="Mapa do endereço"
      className="h-40 w-full rounded-lg border-0"
      loading="lazy"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
    />
  )
}
