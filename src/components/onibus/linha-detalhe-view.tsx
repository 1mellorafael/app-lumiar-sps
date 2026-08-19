'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { DIA_TIPO_LABEL, diaTipoDeHoje, type DiaTipo, type LinhaOnibus } from '@/lib/bus-data'
import { colunasComCores, agruparIdaVolta, hubDaLinha, CLASSE_COR, CORES_SEM_PDF } from '@/lib/bus-grupos'
import { useClientDate } from '@/lib/use-client-date'

const DIAS: DiaTipo[] = ['util', 'sabado', 'domingo']

export function LinhaDetalheView({ linha }: { linha: LinhaOnibus }) {
  const agora = useClientDate()
  const [diaTipoManual, setDiaTipoManual] = useState<DiaTipo | null>(null)
  const diaTipo = diaTipoManual ?? (agora ? diaTipoDeHoje(agora) : 'util')

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border/70 bg-card flex gap-1 rounded-lg border p-1">
        {DIAS.map((dia) => (
          <button
            key={dia}
            type="button"
            onClick={() => setDiaTipoManual(dia)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-150 ease-standard ${
              diaTipo === dia ? 'bg-primary-500 text-white' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            {DIA_TIPO_LABEL[dia]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">Atualizado em: {linha.atualizadoEm[diaTipo]} (FAOL)</p>
        <a
          href={linha.pdfUrl[diaTipo]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 inline-flex shrink-0 items-center gap-1 text-xs font-medium"
        >
          PDF oficial <ExternalLink className="size-3" />
        </a>
      </div>

      {linha.codigo === '400' ? (
        <Linha400 linha={linha} horarios={linha.horarios[diaTipo]} />
      ) : (
        <LinhaComCores linha={linha} horarios={linha.horarios[diaTipo]} />
      )}

      <p className="text-muted-foreground text-[11px] italic">
        Horários podem sofrer alterações por motivos técnicos, tráfego ou clima.
      </p>
    </div>
  )
}

// Linhas 47/48/49: mesma cor de cada variante usada no PDF oficial —
// a coluna "Estação Livre" é compartilhada por todas as variantes da
// linha, então cada horário ali sai colorido conforme pra qual lugar
// ele vai (vermelho = variante A, cinza = linha base, amarelo = B).
function LinhaComCores({ linha, horarios }: { linha: LinhaOnibus; horarios: Record<string, string[]> }) {
  const { colunas, hubLabel, hubHorarios } = colunasComCores(linha, horarios)

  return (
    <div className="flex flex-col gap-3">
      {colunas.map((coluna) => (
        <section
          key={coluna.codigo ?? coluna.label}
          className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-4"
        >
          <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${CLASSE_COR[coluna.cor]}`}>
            {coluna.codigo ? `${coluna.codigo} · ${coluna.label}` : coluna.label}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {coluna.horarios.length > 0 ? (
              coluna.horarios.map((h) => (
                <span key={h} className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${CLASSE_COR[coluna.cor]}`}>
                  {h}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </div>
        </section>
      ))}

      <section className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-4">
        <p className="text-neutral-text text-sm font-semibold">{hubLabel}</p>
        <p className="text-muted-foreground text-[11px]">
          Cada horário sai daqui rumo a um destino diferente — a cor indica qual (mesma cor das colunas acima).
        </p>
        <div className="flex flex-wrap gap-1.5">
          {hubHorarios.length > 0 ? (
            hubHorarios.map((item, i) => (
              <span
                key={`${item.hora}-${i}`}
                className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${CLASSE_COR[item.cor]}`}
              >
                {item.hora}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </div>
      </section>
    </div>
  )
}

function Linha400({ linha, horarios }: { linha: LinhaOnibus; horarios: Record<string, string[]> }) {
  const grupos = agruparIdaVolta(linha, horarios)
  const hub = hubDaLinha(linha.codigo)

  return (
    <div className="flex flex-col gap-3">
      {grupos.map((grupo, indice) => {
        const cor = CLASSE_COR[CORES_SEM_PDF[indice % CORES_SEM_PDF.length]]
        return (
          <section
            key={grupo.chave}
            className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col gap-2 rounded-lg border p-4"
          >
            <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${cor}`}>{grupo.label}</span>

            <div>
              <p className="text-neutral-text text-xs font-medium">
                {grupo.label} → {hub}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {grupo.chegando.length > 0 ? (
                  grupo.chegando.map((h) => (
                    <span key={h} className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${cor}`}>
                      {h}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-neutral-text text-xs font-medium">
                {hub} → {grupo.label}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {grupo.saindo.length > 0 ? (
                  grupo.saindo.map((h) => (
                    <span key={h} className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${cor}`}>
                      {h}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
