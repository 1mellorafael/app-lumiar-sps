'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

// Sem isso, qualquer erro não tratado numa página derruba a navegação
// inteira com a tela nativa do navegador ("esta página não pode ser
// carregada") em vez de uma tela dentro do próprio app com botão de
// tentar de novo.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
      <p className="text-card-foreground text-sm font-medium">
        Algo deu errado.
      </p>
      <p className="text-muted-foreground text-sm">
        Tenta de novo — se continuar acontecendo, volta daqui a pouco.
      </p>
      <Button onClick={() => reset()}>Tentar de novo</Button>
    </main>
  )
}
