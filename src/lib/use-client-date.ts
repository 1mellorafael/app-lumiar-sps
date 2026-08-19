'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

// Cacheado, não lido de novo a cada chamada: se getSnapshot() devolvesse
// Date.now() puro, o valor mudaria entre a renderização e a checagem de
// consistência do useSyncExternalStore logo depois, e o React nunca
// convergiria — loop de "Maximum update depth exceeded". Só precisamos
// da hora do client UMA VEZ (não um relógio vivo), então cacheamos a
// primeira leitura pro módulo inteiro.
let cachedMs: number | null = null

function getSnapshot() {
  if (cachedMs === null) cachedMs = Date.now()
  return cachedMs
}

function getServerSnapshot() {
  return null
}

// Lê a hora atual só no client (evita mismatch de hidratação entre o
// horário do servidor e o do navegador). useSyncExternalStore, não
// useEffect+setState — é o jeito recomendado pelo React de ler um
// valor externo (não gerenciado pelo React) sem cascata de render.
export function useClientDate(): Date | null {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return ms === null ? null : new Date(ms)
}
