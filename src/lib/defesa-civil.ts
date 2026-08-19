import * as cheerio from 'cheerio'
import { createAdminClient } from '@/lib/supabase/admin'

// Tabela de pluviômetros do Corpo de Bombeiros (CBMERJ) — junta CEMADEN
// RJ, CEMADEN MCTIC, Niterói e INEA numa única lista pública, sem
// autenticação. Tem estações com o nome exato "Lumiar" e "São Pedro da
// Serra" (Nova Friburgo). Página serve em ISO-8859-1, não UTF-8 — fetch
// decodifica como UTF-8 por padrão e quebra acento, por isso o decode
// manual abaixo.
const CBMERJ_URL =
  'https://sirene.cbmerj.rj.gov.br:8443/sirenesestadorj/ConsultaPluviometros?cmd=dadosPluviometrosTotal'

const ESTACOES_ALVO = ['Lumiar', 'São Pedro da Serra']

export type SeveridadeMeteorologica =
  | 'sem-chuva'
  | 'fraca'
  | 'moderada'
  | 'forte'
  | 'muito-forte'

export type RiscoDeslizamento = 'baixo' | 'moderado' | 'alto' | 'atrasado'

export type LeituraChuva = {
  fonte: string
  estacao: string
  chuva15min: number | null
  chuva1h: number | null
  chuva24h: number | null
  chuva96h: number | null
  chuva1mes: number | null
  dataHora: string | null
  severidadeMeteorologica: SeveridadeMeteorologica
  riscoDeslizamento: RiscoDeslizamento
}

function parseNumero(texto: string): number | null {
  const limpo = texto.replace(',', '.').trim()
  if (!limpo) return null
  const n = Number(limpo)
  return Number.isFinite(n) ? n : null
}

// Limiares do INMET pra intensidade de chuva (mm/h), publicados na
// própria legenda da página do CBMERJ
function classificarSeveridade(mmHora: number | null): SeveridadeMeteorologica {
  if (mmHora === null || mmHora <= 0.1) return 'sem-chuva'
  if (mmHora <= 5) return 'fraca'
  if (mmHora <= 25) return 'moderada'
  if (mmHora <= 50) return 'forte'
  return 'muito-forte'
}

// O CBMERJ já calcula e publica a própria classificação de risco
// geológico — não como texto, como a cor de fundo da célula "Geo" da
// tabela (conferido em 19/08 direto no HTML da página). Lemos a cor
// deles em vez de recalcular por conta própria, então isso é a
// classificação OFICIAL deles, não uma estimativa nossa.
const COR_GEO_PARA_RISCO: Record<string, RiscoDeslizamento> = {
  '#bebebe': 'atrasado', // sensor sem transmitir há um tempo — dado não confiável
  '#e6b8b7': 'moderado', // 30-50mm/h ou 80-100mm/24h
  '#ccc0d9': 'alto', // acima de 50mm/h ou 100mm/24h
}

function classificarDeslizamentoPorCor(corFundo: string | null): RiscoDeslizamento {
  if (!corFundo) return 'baixo'
  return COR_GEO_PARA_RISCO[corFundo.toLowerCase()] ?? 'baixo'
}

// Estações do INEA rio acima de Lumiar — servem de alerta antecipado
// real, não só "estação mais próxima". Confirmado em 19/08 via
// OpenStreetMap: Macaé de Cima (896m) e Galdinópolis (758m) ficam no
// próprio Rio Macaé, que passa por Lumiar (635m). Piller (674m) fica no
// Rio Bonito — a princípio pareceria outro rio, mas o Rio Bonito
// deságua no Rio Macaé ~4,5km rio abaixo de Piller (confluência
// confirmada via OSM), perto o suficiente de Lumiar pra continuar
// relevante — por isso as três entram, não só as duas do Macaé.
const ESTACOES_INEA = [
  { id: 'BE706772', nome: 'Macaé de Cima' },
  { id: 'BE7135F4', nome: 'Galdinópolis' },
  { id: 'BE707404', nome: 'Piller' },
]

export type RiscoHidrologico = 'baixo' | 'alerta' | 'transbordamento'

export type NivelRio = {
  nome: string
  nivelM: number | null
  chuvaMm: number | null
  dataHora: string | null
  temLeitura: boolean
  riscoHidrologico: RiscoHidrologico | null
  subindoRapido: boolean
  variacao3hM: number | null
}

// Sem limiar oficial de nível, então o único jeito honesto de sinalizar
// perigo é pela VELOCIDADE da subida, não por um valor fixo — rio de
// cabeceira de serra (pequeno, íngreme) sobe rápido em enchente
// relâmpago. 0,3m em 3h é uma estimativa nossa (não vem de nenhuma
// fonte oficial): a leitura normal aqui oscila uns 0,2-0,4m, então uma
// subida dessa ordem já é fora do padrão observado.
const JANELA_SUBIDA_HORAS = 3
const LIMIAR_SUBIDA_RAPIDA_M = 0.3

type LeituraLatest = {
  estacao: string
  ts: string | null
  chuva: number | null
  nivel: number | null
}

type EstacaoMeta = {
  id_numero: string
  cota_alerta_m: number | null
  cota_transbordamento_m: number | null
}

// Classifica só quando o INEA publicar as duas cotas pra estação —
// hoje elas vêm nulas pras 3 estações que usamos (conferido em 19/08),
// mas o código já fica pronto: se um dia aparecerem, o risco passa a
// ser calculado automaticamente, sem precisar mexer aqui de novo.
function classificarRiscoHidrologico(
  nivelM: number | null,
  cotaAlerta: number | null,
  cotaTransbordamento: number | null
): RiscoHidrologico | null {
  if (nivelM === null || cotaAlerta === null || cotaTransbordamento === null) return null
  if (nivelM >= cotaTransbordamento) return 'transbordamento'
  if (nivelM >= cotaAlerta) return 'alerta'
  return 'baixo'
}

function formatarDataHoraInea(ts: string | null): string | null {
  if (!ts) return null
  // "2026-08-19T03:00-03:00" -> "19/08/2026 03:00"
  const match = ts.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/)
  if (!match) return ts
  const [, ano, mes, dia, hora] = match
  return `${dia}/${mes}/${ano} ${hora}`
}

// Grava as leituras atuais no histórico (best-effort — se falhar, não
// derruba a página, só fica sem calcular variação dessa vez) e devolve
// a leitura mais antiga de cada estação dentro da janela, pra comparar.
async function registrarEBuscarHistorico(
  leituras: { estacaoId: string; nivelM: number | null; chuvaMm: number | null; ts: string | null }[]
): Promise<Map<string, number | null>> {
  const comTimestamp = leituras.filter((l) => l.ts !== null)
  const maisAntigaPorEstacao = new Map<string, number | null>()
  if (comTimestamp.length === 0) return maisAntigaPorEstacao

  try {
    const supabase = createAdminClient()

    await supabase
      .from('leituras_nivel_rio')
      .upsert(
        comTimestamp.map((l) => ({
          estacao_id: l.estacaoId,
          nivel_m: l.nivelM,
          chuva_mm: l.chuvaMm,
          medido_em: l.ts,
        })),
        { onConflict: 'estacao_id,medido_em', ignoreDuplicates: true }
      )

    const desde = new Date(Date.now() - JANELA_SUBIDA_HORAS * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('leituras_nivel_rio')
      .select('estacao_id, nivel_m, medido_em')
      .in(
        'estacao_id',
        comTimestamp.map((l) => l.estacaoId)
      )
      .gte('medido_em', desde)
      .order('medido_em', { ascending: true })

    for (const row of data ?? []) {
      if (!maisAntigaPorEstacao.has(row.estacao_id)) {
        maisAntigaPorEstacao.set(row.estacao_id, row.nivel_m)
      }
    }
  } catch {
    // histórico é auxiliar (só pra "subindo rápido") — segue sem ele
  }

  return maisAntigaPorEstacao
}

export async function buscarNivelRio(): Promise<NivelRio[]> {
  const [latestRes, metaRes] = await Promise.all([
    fetch('https://alertadecheias.com.br/stations/latest', { next: { revalidate: 300 } }).catch(() => null),
    fetch('https://alertadecheias.com.br/stations/meta', { next: { revalidate: 300 } }).catch(() => null),
  ])

  if (!latestRes?.ok) return []

  const latest: LeituraLatest[] = await latestRes.json().catch(() => [])
  const meta: EstacaoMeta[] = metaRes?.ok ? await metaRes.json().catch(() => []) : []

  const maisAntigaPorEstacao = await registrarEBuscarHistorico(
    ESTACOES_INEA.map(({ id }) => {
      const leitura = latest.find((l) => l.estacao === id)
      return { estacaoId: id, nivelM: leitura?.nivel ?? null, chuvaMm: leitura?.chuva ?? null, ts: leitura?.ts ?? null }
    })
  )

  return ESTACOES_INEA.map(({ id, nome }) => {
    const leitura = latest.find((l) => l.estacao === id)
    const estacaoMeta = meta.find((m) => m.id_numero === id)
    const nivelM = leitura?.nivel ?? null
    const nivelAntigo = maisAntigaPorEstacao.get(id) ?? null
    const variacao3hM = nivelM !== null && nivelAntigo !== null ? Number((nivelM - nivelAntigo).toFixed(2)) : null

    return {
      nome,
      nivelM,
      chuvaMm: leitura?.chuva ?? null,
      dataHora: formatarDataHoraInea(leitura?.ts ?? null),
      temLeitura: leitura ? leitura.nivel !== null || leitura.chuva !== null : false,
      riscoHidrologico: classificarRiscoHidrologico(
        nivelM,
        estacaoMeta?.cota_alerta_m ?? null,
        estacaoMeta?.cota_transbordamento_m ?? null
      ),
      subindoRapido: variacao3hM !== null && variacao3hM >= LIMIAR_SUBIDA_RAPIDA_M,
      variacao3hM,
    }
  })
}

export async function buscarChuvaLumiarESPS(): Promise<LeituraChuva[]> {
  const res = await fetch(CBMERJ_URL, { next: { revalidate: 300 } }).catch(() => null)
  if (!res || !res.ok) return []

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('iso-8859-1').decode(buffer)
  const $ = cheerio.load(html)
  const leituras: LeituraChuva[] = []

  $('tr').each((_, tr) => {
    const tds = $(tr).find('td')
    if (tds.length < 11) return

    const cidade = $(tds[2]).text().trim()
    const estacao = $(tds[3]).text().trim()
    if (cidade !== 'Nova Friburgo' || !ESTACOES_ALVO.includes(estacao)) return

    const chuva1h = parseNumero($(tds[5]).text())
    const corGeo = $(tds[9]).attr('style')?.match(/background-color:\s*(#[0-9a-fA-F]{6})/)?.[1] ?? null

    leituras.push({
      fonte: $(tds[0]).text().trim(),
      estacao,
      chuva15min: parseNumero($(tds[4]).text()),
      chuva1h,
      chuva24h: parseNumero($(tds[6]).text()),
      chuva96h: parseNumero($(tds[7]).text()),
      chuva1mes: parseNumero($(tds[8]).text()),
      dataHora: $(tds[10]).text().trim() || null,
      severidadeMeteorologica: classificarSeveridade(chuva1h),
      riscoDeslizamento: classificarDeslizamentoPorCor(corGeo),
    })
  })

  return leituras
}
