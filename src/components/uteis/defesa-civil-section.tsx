import { CloudRain, Waves } from 'lucide-react'
import type {
  LeituraChuva,
  SeveridadeMeteorologica,
  RiscoDeslizamento,
  RiscoHidrologico,
  NivelRio,
} from '@/lib/defesa-civil'

const SEVERIDADE_LABEL: Record<SeveridadeMeteorologica, string> = {
  'sem-chuva': 'Sem chuva',
  fraca: 'Fraca',
  moderada: 'Moderada',
  forte: 'Forte',
  'muito-forte': 'Muito forte',
}

const SEVERIDADE_CLASSE: Record<SeveridadeMeteorologica, string> = {
  'sem-chuva': 'bg-primary-500/10 text-primary-700',
  fraca: 'bg-primary-500/10 text-primary-700',
  moderada: 'bg-secondary-500/10 text-secondary-700',
  forte: 'bg-destructive/10 text-destructive',
  'muito-forte': 'bg-destructive/10 text-destructive',
}

const RISCO_LABEL: Record<RiscoDeslizamento, string> = {
  baixo: 'Baixo',
  moderado: 'Moderado',
  alto: 'Alto',
  atrasado: 'Dado atrasado',
}

const RISCO_CLASSE: Record<RiscoDeslizamento, string> = {
  baixo: 'bg-primary-500/10 text-primary-700',
  moderado: 'bg-secondary-500/10 text-secondary-700',
  alto: 'bg-destructive/10 text-destructive',
  atrasado: 'bg-neutral-500/10 text-muted-foreground',
}

const RISCO_HIDRO_LABEL: Record<RiscoHidrologico, string> = {
  baixo: 'Baixo',
  alerta: 'Alerta',
  transbordamento: 'Transbordamento',
}

const RISCO_HIDRO_CLASSE: Record<RiscoHidrologico, string> = {
  baixo: 'bg-primary-500/10 text-primary-700',
  alerta: 'bg-secondary-500/10 text-secondary-700',
  transbordamento: 'bg-destructive/10 text-destructive',
}

export function DefesaCivilSection({
  leituras,
  nivelRio,
}: {
  leituras: LeituraChuva[]
  nivelRio: NivelRio[]
}) {
  if (leituras.length === 0 && nivelRio.length === 0) return null

  return (
    <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-3 rounded-lg border p-4">
      {leituras.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <CloudRain className="text-primary-500 size-5" />
            <h2 className="text-neutral-text font-semibold">Chuva agora — Lumiar/SPS</h2>
          </div>

          <div className="flex flex-col gap-2">
            {leituras.map((leitura) => (
              <div key={leitura.estacao} className="border-border/70 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-neutral-text text-sm font-medium">{leitura.estacao}</p>
                  {leitura.dataHora && (
                    <p className="text-muted-foreground text-[10px]">{leitura.dataHora}</p>
                  )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="text-muted-foreground">
                    Última hora: <span className="text-neutral-text font-medium">{leitura.chuva1h ?? '—'}mm</span>
                  </span>
                  <span className="text-muted-foreground">
                    24h: <span className="text-neutral-text font-medium">{leitura.chuva24h ?? '—'}mm</span>
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERIDADE_CLASSE[leitura.severidadeMeteorologica]}`}
                  >
                    Chuva: {SEVERIDADE_LABEL[leitura.severidadeMeteorologica]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${RISCO_CLASSE[leitura.riscoDeslizamento]}`}
                  >
                    Deslizamento: {RISCO_LABEL[leitura.riscoDeslizamento]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-[11px] italic">
            Dado do Corpo de Bombeiros (CBMERJ), atualizado a cada poucos minutos.
            Risco de deslizamento é a classificação oficial deles (CEMADEN/INEA),
            não é o alerta da Defesa Civil — em caso de chuva forte, siga sempre
            a orientação oficial.
          </p>
        </>
      )}

      {nivelRio.some((r) => r.temLeitura) && (
        <>
          <div className="border-border/70 flex items-center gap-2 border-t pt-3">
            <Waves className="text-primary-500 size-5" />
            <h2 className="text-neutral-text font-semibold">Nível do rio — rio acima de Lumiar</h2>
          </div>

          <div className="flex flex-col gap-2">
            {nivelRio
              .filter((r) => r.temLeitura)
              .map((rio) => (
                <div key={rio.nome} className="border-border/70 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-neutral-text text-sm font-medium">{rio.nome}</p>
                    {rio.dataHora && (
                      <p className="text-muted-foreground text-[10px]">{rio.dataHora}</p>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="text-muted-foreground">
                      Nível: <span className="text-neutral-text font-medium">{rio.nivelM ?? '—'}m</span>
                    </span>
                    <span className="text-muted-foreground">
                      Chuva: <span className="text-neutral-text font-medium">{rio.chuvaMm ?? '—'}mm</span>
                    </span>
                  </div>
                  {(rio.riscoHidrologico || rio.subindoRapido) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rio.riscoHidrologico && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${RISCO_HIDRO_CLASSE[rio.riscoHidrologico]}`}
                        >
                          Rio: {RISCO_HIDRO_LABEL[rio.riscoHidrologico]}
                        </span>
                      )}
                      {rio.subindoRapido && (
                        <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-medium">
                          Subindo rápido (+{rio.variacao3hM}m em 3h)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <p className="text-muted-foreground text-[11px] italic">
            Dado do INEA, rio acima de Lumiar: Macaé de Cima e Galdinópolis no
            Rio Macaé (o mesmo que passa por Lumiar), Piller no Rio Bonito
            (que deságua no Rio Macaé perto dali) — todas servem de alerta
            antecipado. Sem limiar oficial de nível pra essas estações, então
            &ldquo;Subindo rápido&rdquo; é uma estimativa nossa (mais de 0,3m
            de subida em 3h), não um alerta oficial; o período exato da chuva
            também não é informado pelo INEA.
          </p>
        </>
      )}
    </section>
  )
}
