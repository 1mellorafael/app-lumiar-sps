// Embed do OpenStreetMap — gratuito, sem API key. Só aparece quando
// existe endereço com coordenadas reais (escolhido via autocomplete).
// Clicável (decisão de 18/08): o iframe sozinho intercepta o clique, por
// isso o link fica por cima como camada transparente, abrindo o Google
// Maps com rota — mais útil pra quem quer chegar lá do que só olhar.
export function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const delta = 0.006
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg">
      <iframe
        title="Mapa do endereço"
        className="pointer-events-none size-full border-0"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir rota no Google Maps"
        className="active:bg-black/10 absolute inset-0 transition-colors"
      />
    </div>
  )
}
