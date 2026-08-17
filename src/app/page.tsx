import { Briefcase, Tv, ArrowRight } from 'lucide-react'
import { InstallCard } from '@/components/home/install-card'
import { ShareAppCard } from '@/components/home/share-app-card'

export default function Home() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="text-primary-500 text-lg font-bold">
          Lumiar/São Pedro da Serra
        </h1>
      </header>

      {/* Grade compacta — 4 módulos fixos por política (não editáveis pelo
          usuário ainda, ver decisão de 16/08): Cadastro e Compartilhar
          sempre no topo, Instalar some sozinho quando já instalado,
          Anúncio fica até decisão de rede de ads (pendência aberta). */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href="/cadastro-negocio"
          className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col items-start gap-1 rounded-lg border p-3 transition-all duration-200 ease-decelerate"
        >
          <Briefcase className="text-primary-500 size-5" />
          <p className="text-card-foreground text-xs font-medium">
            Tem um negócio?
          </p>
          <span className="text-primary-500 inline-flex items-center gap-0.5 text-xs font-semibold">
            Cadastre-se <ArrowRight className="size-3" />
          </span>
        </a>

        <ShareAppCard />

        <InstallCard />

        <button
          type="button"
          className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.97] flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200 ease-decelerate"
        >
          <Tv className="text-primary-500 size-5" />
          <p className="text-card-foreground text-xs font-medium">
            Ajude o app
          </p>
          <span className="text-primary-500 text-xs font-semibold">
            Ver anúncio
          </span>
        </button>
      </div>
    </main>
  )
}
