import { PageHeader } from '@/components/shared/page-header'
import { OnibusLista } from '@/components/onibus/onibus-lista'

export default function OnibusPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Horários de ônibus" backHref="/uteis" />
      <p className="text-muted-foreground -mt-2 text-xs">Toque numa linha pra ver a grade completa</p>
      <OnibusLista />
    </main>
  )
}
