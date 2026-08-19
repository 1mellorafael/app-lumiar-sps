import type { LinhaOnibus } from './bus-data'

// "Hub" é o ponto comum de onde saem/chegam as variantes de uma linha
// — Estação Livre (rodoviária) pras linhas 47/48/49, ou Lumiar pra
// circular 400 (que roda em loop, não passa pela rodoviária).
const HUB: Record<string, string> = {
  '47': 'Estação Livre',
  '48': 'Estação Livre',
  '49': 'Estação Livre',
  '400': 'Lumiar',
}

export function hubDaLinha(codigo: string): string {
  return HUB[codigo] ?? 'Estação Livre'
}

function nomeSemPrefixo(texto: string): string {
  return texto.includes(' · ') ? texto.split(' · ')[1] : texto
}

function prefixoDe(texto: string): string | null {
  return texto.includes(' · ') ? texto.split(' · ')[0] : null
}

// Cor OFICIAL de cada variante — a mesma do PDF (lido direto do fill
// da célula, ver bus-data.ts): sem sufixo (linha base) = cinza,
// sufixo "A" = vermelho, sufixo "B" = amarelo. Confirmado igual nas
// 3 linhas (47/48/49). "Verde" entra pro banco pra casos sem cor
// oficial no PDF (ex: linha 400) — banco provisório, pode mudar.
export type CorVariante = 'vermelho' | 'cinza' | 'amarelo' | 'verde'

export function corDoCodigo(codigo: string | null): CorVariante {
  if (!codigo) return 'cinza'
  if (codigo.endsWith('B')) return 'amarelo'
  if (codigo.endsWith('A')) return 'vermelho'
  return 'cinza'
}

export const CLASSE_COR: Record<CorVariante, string> = {
  vermelho: 'bg-[#E04537]/10 text-[#C23A2A]',
  cinza: 'bg-[#D9D9D9]/50 text-[#5A5A5A]',
  amarelo: 'bg-[#DEA333]/15 text-[#8A6118]',
  verde: 'bg-primary-500/10 text-primary-700',
}

// Pra linhas sem cor oficial do PDF (ex: 400, que não tem coluna
// compartilhada ambígua) — um bairro/variante por cor, ciclando.
export const CORES_SEM_PDF: CorVariante[] = ['vermelho', 'amarelo', 'verde']

export type ColunaNomeada = {
  codigo: string | null
  label: string
  cor: CorVariante
  horarios: string[]
}

export type ItemHub = { hora: string; cor: CorVariante }

// Pras linhas com coluna "Estação Livre" compartilhada (47/48/49):
// devolve as colunas nomeadas (Bocaina, São Pedro, etc, cada uma na
// sua cor) na ordem "linha base primeiro, depois variantes com letra"
// — e a coluna do hub como lista única com cada horário na cor da
// variante que ele atende (pra mostrar visualmente que uma partida da
// Estação Livre vai ora pra um lugar, ora pra outro).
export function colunasComCores(
  linha: LinhaOnibus,
  horarios: Record<string, string[]>
): { colunas: ColunaNomeada[]; hubLabel: string; hubHorarios: ItemHub[] } {
  const hub = HUB[linha.codigo] ?? 'Estação Livre'
  const colunas = new Map<string, ColunaNomeada>()
  const hubHorarios: ItemHub[] = []

  for (const [chaveCompleta, horas] of Object.entries(horarios)) {
    const [origem] = chaveCompleta.split(' → ')
    const origemEhHub = origem === hub || origem.endsWith(` ${hub}`)

    if (origemEhHub) {
      // partida saindo do hub — pertence à coluna mista do hub, colorida
      // conforme a variante indicada no lado do hub (ex: "47A · Estação Livre")
      const codigo = prefixoDe(origem)
      const cor = corDoCodigo(codigo)
      for (const hora of horas) hubHorarios.push({ hora, cor })
    } else {
      // coluna nomeada (chegando ao hub)
      const codigo = prefixoDe(origem)
      const label = nomeSemPrefixo(origem)
      const chave = codigo ?? label
      if (!colunas.has(chave)) {
        colunas.set(chave, { codigo, label, cor: corDoCodigo(codigo), horarios: [] })
      }
      colunas.get(chave)!.horarios.push(...horas)
    }
  }

  const sufixo = (codigo: string | null) => (codigo ? codigo.replace(linha.codigo, '') : '')
  const ordenadas = [...colunas.values()].sort((a, b) =>
    // linha base (sem letra, sufixo "") primeiro, depois A, B, ... em ordem
    sufixo(a.codigo).localeCompare(sufixo(b.codigo))
  )

  hubHorarios.sort((a, b) => a.hora.localeCompare(b.hora))

  return { colunas: ordenadas, hubLabel: hub, hubHorarios }
}

export type GrupoIdaVolta = {
  chave: string
  label: string
  chegando: string[]
  saindo: string[]
}

// Pra linha 400 (circular, sem coluna compartilhada/ambígua): ida e
// volta de cada bairro já vêm em colunas limpas, sem precisar de cor
// pra desambiguar — só junta as duas pontas de cada bairro.
export function agruparIdaVolta(linha: LinhaOnibus, horarios: Record<string, string[]>): GrupoIdaVolta[] {
  const hub = HUB[linha.codigo] ?? 'Estação Livre'
  const grupos = new Map<string, GrupoIdaVolta>()

  for (const [chaveCompleta, horas] of Object.entries(horarios)) {
    const [origem, destino] = chaveCompleta.split(' → ')
    const origemEhHub = origem === hub || origem.endsWith(` ${hub}`)
    const outro = origemEhHub ? destino : origem
    const label = nomeSemPrefixo(outro)

    if (!grupos.has(label)) grupos.set(label, { chave: label, label, chegando: [], saindo: [] })
    const grupo = grupos.get(label)!
    if (origemEhHub) grupo.saindo.push(...horas)
    else grupo.chegando.push(...horas)
  }

  return [...grupos.values()]
}
