'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

// Cabeçalho padrão de toda página interna: só a seta (sem "Voltar"
// escrito, mesmo padrão do FloatingBackButton na tela de detalhe do
// negócio) + título centralizado — referência: apps de delivery
// (decisão de 17/08). `right` é um slot opcional pro lado direito (ex:
// toggle de visualização, botão de ação) — hoje raramente usado, mas
// é onde uma futura barra de filtros por página entraria.
export function PageHeader({
  title,
  backHref,
  right,
}: {
  title: React.ReactNode
  backHref?: string
  right?: React.ReactNode
}) {
  const router = useRouter()
  const backButtonClass =
    'text-neutral-text hover:text-primary-500 active:scale-90 flex size-9 shrink-0 items-center justify-center rounded-full transition-transform'

  return (
    <div className="flex items-center gap-1">
      {backHref ? (
        <Link href={backHref} aria-label="Voltar" className={backButtonClass}>
          <ArrowLeft className="size-5" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className={backButtonClass}
        >
          <ArrowLeft className="size-5" />
        </button>
      )}
      <h1 className="text-primary-500 flex flex-1 items-center justify-center gap-2 truncate text-lg font-bold">
        {title}
      </h1>
      <div className="flex size-9 shrink-0 items-center justify-center">
        {right}
      </div>
    </div>
  )
}
