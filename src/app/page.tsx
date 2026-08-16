import { Share2, Smartphone, Tv, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WeatherBadge } from '@/components/home/weather-badge'

export default function Home() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-primary-500 text-lg font-bold">
          Lumiar/São Pedro da Serra
        </h1>
        <WeatherBadge tempC={22} condition="ensolarado" />
      </header>

      <section className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4">
        <p className="text-card-foreground text-sm">
          Presta algum serviço em Lumiar ou São Pedro?
        </p>
        <a
          href="/cadastro"
          className="text-primary-500 inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Cadastre-se <ArrowRight className="size-3.5" />
        </a>
      </section>

      <section className="border-border bg-card flex flex-col gap-2 rounded-lg border p-4">
        <p className="text-card-foreground text-sm">
          Conhece alguém que presta serviço? Ou só curte o app? Divulgue o
          Lumiar! 📲
        </p>
        <Button variant="secondary" className="w-fit">
          <Share2 />
          Compartilhar app
        </Button>
      </section>

      <section className="border-border bg-card flex flex-col gap-2 rounded-lg border p-4">
        <p className="text-card-foreground text-sm">
          Adicione o app à tela inicial do seu celular
        </p>
        <Button variant="outline" size="sm" className="w-fit">
          <Smartphone />
          Adicionar
        </Button>
      </section>

      <section className="border-border bg-card flex flex-col gap-2 rounded-lg border p-4">
        <p className="text-card-foreground text-sm">
          Ver um anúncio pra ajudar a manter o app no ar
        </p>
        <Button variant="outline" size="sm" className="w-fit">
          <Tv />
          Ver Anúncio
        </Button>
      </section>
    </main>
  )
}
