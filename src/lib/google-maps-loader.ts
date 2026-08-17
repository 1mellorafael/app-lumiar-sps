let loadPromise: Promise<void> | null = null

// Carrega o script da Places API uma única vez, mesmo com vários
// componentes montando/desmontando (ex: form de negócio remontando)
export function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    if (!key) {
      reject(new Error('Google Places API key não configurada'))
      return
    }
    if (window.google?.maps?.places) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Falha ao carregar o Google Maps'))
    document.head.appendChild(script)
  })

  return loadPromise
}
