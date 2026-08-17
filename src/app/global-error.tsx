'use client'

import { useEffect } from 'react'
import './globals.css'

// error.tsx não cobre erro no próprio layout.tsx raiz — só esse arquivo
// pega isso, e precisa renderizar <html>/<body> do zero porque substitui
// o layout inteiro quando ativado.
export default function GlobalError({
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
    <html lang="pt-BR">
      <body>
        <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
          <p className="text-card-foreground text-sm font-medium">
            Algo deu errado.
          </p>
          <p className="text-muted-foreground text-sm">
            Tenta de novo — se continuar acontecendo, volta daqui a pouco.
          </p>
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  )
}
