import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buscarEventos } from '@/lib/posts-data'
import { PageHeader } from '@/components/shared/page-header'
import { AgendaView } from '@/components/agenda/agenda-view'

export default async function AgendaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const eventos = await buscarEventos()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Agenda" backHref="/" />
      <AgendaView eventos={eventos} />
    </main>
  )
}
