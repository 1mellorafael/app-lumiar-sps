import { buscarChuvaLumiarESPS, buscarNivelRio } from '@/lib/defesa-civil'
import { DefesaCivilSection } from '@/components/uteis/defesa-civil-section'
import { TelefonesUteisSection } from '@/components/uteis/telefones-uteis-section'
import { OnibusResumoCard } from '@/components/uteis/onibus-resumo-card'

export default async function UteisPage() {
  const [leituras, nivelRio] = await Promise.all([
    buscarChuvaLumiarESPS(),
    buscarNivelRio(),
  ])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <DefesaCivilSection leituras={leituras} nivelRio={nivelRio} />
      <OnibusResumoCard />
      <TelefonesUteisSection />
    </main>
  )
}
