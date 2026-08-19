// Horários de ônibus/van da FAOL relevantes pra Lumiar/São Pedro da
// Serra. Extraídos manualmente em 19/08 a partir dos PDFs oficiais
// (https://faol.com.br/tabelas/{código}-{U|S|D}, sem API/tabela HTML
// disponível) — parse único, guardado aqui como dado estático. Se a
// FAOL atualizar os PDFs, isso fica desatualizado até alguém rodar o
// parse de novo à mão (não há atualização automática).
//
// As chaves de `horarios` são "variante · sentido": cada linha tem uma
// ou mais variantes numeradas (legenda no rodapé do PDF, ex: "47" =
// São Pedro, "47A" = Bocaina), e cada variante tem ida (chegando na
// Estação Livre) e volta (saindo da Estação Livre). No PDF as duas
// direções aparecem em colunas diferentes, exceto a coluna "Estação
// Livre" (saídas), que mistura todas as variantes da linha na mesma
// coluna — só dá pra saber qual horário é de qual variante pela COR de
// fundo da célula (vermelho/cinza/amarelo, sem legenda de texto).
// Extraímos isso lendo a cor de cada célula no PDF (mesmo truque que
// usamos pro "Geo" do CBMERJ), não tem como pegar isso só do texto.
export type DiaTipo = 'util' | 'sabado' | 'domingo'

export const DIA_TIPO_LABEL: Record<DiaTipo, string> = {
  util: 'Dias úteis',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export type LinhaOnibus = {
  codigo: string
  nome: string
  atualizadoEm: Record<DiaTipo, string>
  horarios: Record<DiaTipo, Record<string, string[]>>
  pdfUrl: Record<DiaTipo, string>
}

const PDF_47_48_49 = (codigo: string): Record<DiaTipo, string> => ({
  util: `https://faol.com.br/tabelas/${codigo}-U`,
  sabado: `https://faol.com.br/tabelas/${codigo}-S`,
  domingo: `https://faol.com.br/tabelas/${codigo}-D`,
})

export const LINHAS_ONIBUS: LinhaOnibus[] = [
  {
    codigo: '47',
    nome: 'São Pedro',
    atualizadoEm: { util: '24/06/2026', sabado: '10/08/2024', domingo: '11/08/2024' },
    pdfUrl: PDF_47_48_49('47'),
    horarios: {
      util: {
        '47A · Bocaina → Estação Livre': ['06:20', '07:15', '09:25', '11:50', '13:35', '16:55', '17:40', '19:15', '22:10'],
        '47A · Estação Livre → Bocaina': ['04:55', '05:45', '07:55', '10:15', '11:50', '15:15', '15:50', '17:00', '20:40'],
        '47 · São Pedro → Estação Livre': [
          '00:35', '04:25', '06:00', '06:23', '07:18', '08:30', '09:28', '10:20', '11:25', '11:53',
          '12:40', '13:38', '14:40', '15:45', '16:58', '17:43', '19:18', '20:20', '21:50', '22:13', '23:30',
        ],
        '47 · Estação Livre → São Pedro': ['04:40', '07:00', '08:45', '09:50', '11:04', '13:00', '14:10', '18:10', '19:15', '22:10', '23:15'],
      },
      sabado: {
        '47A · Bocaina → Estação Livre': ['06:30', '11:05', '14:20', '18:30', '21:00'],
        '47A · Estação Livre → Bocaina': ['05:00', '09:25', '12:40', '15:35', '17:00', '19:25'],
        '47 · São Pedro → Estação Livre': [
          '00:40', '04:50', '06:35', '08:00', '09:40', '11:10', '12:45', '14:25', '15:40', '17:10',
          '18:35', '19:40', '21:05', '22:10', '23:35',
        ],
        '47 · Estação Livre → São Pedro': ['06:05', '07:40', '11:10', '14:00', '18:05', '20:40', '22:10', '23:20'],
      },
      domingo: {
        '47A · Bocaina → Estação Livre': ['06:25', '11:00', '14:35', '18:55'],
        '47A · Estação Livre → Bocaina': ['05:00', '09:20', '12:35', '17:15'],
        '47 · São Pedro → Estação Livre': [
          '00:30', '05:00', '06:30', '08:00', '09:35', '11:05', '13:00', '14:40', '15:45', '17:00',
          '19:00', '20:30', '21:55', '23:30',
        ],
        '47 · Estação Livre → São Pedro': ['06:15', '07:40', '11:15', '14:25', '15:41', '19:00', '20:30', '21:50', '23:15'],
      },
    },
  },
  {
    codigo: '48',
    nome: 'Lumiar',
    atualizadoEm: { util: '24/06/2026', sabado: '03/05/2025', domingo: '01/05/2025' },
    pdfUrl: PDF_47_48_49('48'),
    horarios: {
      util: {
        '48A · Boa Esperança → Estação Livre': ['05:30', '07:10', '09:00', '11:10', '13:00', '15:10', '16:30', '18:05', '20:10', '22:55'],
        '48A · Estação Livre → Boa Esperança': ['04:10', '05:40', '07:30', '09:30', '11:30', '13:35', '14:45', '16:30', '18:40', '21:40'],
        '48B · Lumiar → Estação Livre': ['19:30'],
        '48B · Estação Livre → Lumiar': ['04:20'],
        '48 · Benfica → Estação Livre': ['06:15', '12:05', '19:15'],
        '48 · Estação Livre → Benfica': ['05:05', '10:35', '17:45'],
      },
      sabado: {
        '48A · Boa Esperança → Estação Livre': ['07:00', '10:20', '13:20', '15:10', '16:35', '20:00', '22:50'],
        '48A · Estação Livre → Boa Esperança': ['05:40', '08:55', '11:50', '13:30', '15:05', '18:30', '21:30'],
        '48B · Lumiar → Estação Livre': ['19:05'],
        '48B · Estação Livre → Lumiar': ['04:35'],
        '48 · Benfica → Estação Livre': ['12:00'],
        '48 · Estação Livre → Benfica': ['10:20', '16:35'],
      },
      domingo: {
        '48A · Boa Esperança → Estação Livre': ['07:05', '10:30', '13:26', '16:30', '20:05', '22:47'],
        '48A · Estação Livre → Boa Esperança': ['05:45', '09:00', '12:00', '15:00', '18:35', '21:30'],
        '48B · Lumiar → Estação Livre': ['19:05'],
        '48B · Estação Livre → Lumiar': ['04:35'],
        '48 · Benfica → Estação Livre': ['12:00', '18:05'],
        '48 · Estação Livre → Benfica': ['10:25', '16:35'],
      },
    },
  },
  {
    codigo: '49',
    nome: 'Rio Bonito',
    atualizadoEm: { util: '24/06/2026', sabado: '15/02/2025', domingo: '16/02/2025' },
    pdfUrl: PDF_47_48_49('49'),
    horarios: {
      util: {
        '49A · Macaé de Cima → Estação Livre': ['06:03', '18:55'],
        '49A · Estação Livre → Macaé de Cima': ['04:35', '17:20'],
        '49 · Rio Bonito → Estação Livre': ['05:20', '10:00', '14:50'],
        '49 · Estação Livre → Rio Bonito': ['07:30', '12:00', '17:15'],
      },
      sabado: {
        '49A · Macaé de Cima → Estação Livre': ['10:00', '19:10'],
        '49A · Estação Livre → Macaé de Cima': ['08:40', '17:40'],
        '49 · Rio Bonito → Estação Livre': ['07:00', '10:00', '15:00'],
        '49 · Estação Livre → Rio Bonito': ['07:30', '12:00', '17:00'],
      },
      domingo: {
        '49A · Macaé de Cima → Estação Livre': ['10:00', '19:10'],
        '49A · Estação Livre → Macaé de Cima': ['08:40', '17:40'],
        '49 · Rio Bonito → Estação Livre': ['07:00', '10:00', '15:00'],
        '49 · Estação Livre → Rio Bonito': ['07:30', '12:00', '17:00'],
      },
    },
  },
  {
    codigo: '400',
    nome: 'Lumiar (circular)',
    atualizadoEm: { util: '21/07/2025', sabado: '21/07/2025', domingo: '21/07/2025' },
    pdfUrl: { util: 'https://faol.com.br/tabelas/400', sabado: 'https://faol.com.br/tabelas/400', domingo: 'https://faol.com.br/tabelas/400' },
    horarios: {
      util: {
        'Benfica → Lumiar': ['07:20', '11:00', '12:50', '17:00'],
        'Lumiar → Benfica': ['06:55', '10:35', '12:25', '16:30'],
        'Boa Esperança → Lumiar': ['08:10', '11:55', '16:00', '19:10'],
        'Lumiar → Boa Esperança': ['07:45', '11:30', '15:30', '18:50'],
        'São Romão → Lumiar': ['05:50', '09:50', '14:00', '18:10'],
        'Lumiar → São Romão': ['05:15', '09:10', '13:20', '17:30'],
      },
      sabado: {
        'Benfica → Lumiar': ['07:20', '11:00', '13:25', '16:20'],
        'Lumiar → Benfica': ['06:55', '10:35', '13:00', '15:50'],
        'Boa Esperança → Lumiar': ['08:10', '11:55', '17:10'],
        'Lumiar → Boa Esperança': ['07:45', '11:30', '16:50'],
        'São Romão → Lumiar': ['06:10', '09:50', '14:30', '18:20'],
        'Lumiar → São Romão': ['05:30', '09:10', '13:50', '17:35'],
      },
      domingo: {
        'Benfica → Lumiar': ['07:20', '11:00', '16:20'],
        'Lumiar → Benfica': ['06:55', '10:35', '15:50'],
        'Boa Esperança → Lumiar': ['08:10', '11:55', '17:10'],
        'Lumiar → Boa Esperança': ['07:45', '11:30', '16:50'],
        'São Romão → Lumiar': ['06:10', '13:40', '18:20'],
        'Lumiar → São Romão': ['05:30', '13:00', '17:35'],
      },
    },
  },
]

export function diaTipoDeHoje(agora: Date): DiaTipo {
  const dia = agora.getDay()
  if (dia === 0) return 'domingo'
  if (dia === 6) return 'sabado'
  return 'util'
}

export type ProximaPartida = { parada: string; hora: string; amanha: boolean }

function paraMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

// Um horário que já passou continua sendo "o próximo" por mais 30min —
// senão, no minuto exato em que passa, a tela troca pro de depois e dá
// a entender que já era, quando a pessoa ainda pode alcançar esse
// ônibus (atraso, ela só olhou 1min tarde, etc).
const TOLERANCIA_MIN = 30

function partidasOrdenadas(linha: LinhaOnibus, diaTipo: DiaTipo): { parada: string; hora: string }[] {
  const todas: { parada: string; hora: string }[] = []
  for (const [parada, horarios] of Object.entries(linha.horarios[diaTipo])) {
    for (const hora of horarios) todas.push({ parada, hora })
  }
  return todas.sort((a, b) => paraMinutos(a.hora) - paraMinutos(b.hora))
}

// Devolve as próximas N partidas a partir de agora (voltando pro
// início da lista, marcadas como "amanhã", se acabarem as de hoje).
// Junta todas as variantes/sentidos da linha numa linha do tempo só —
// pra "próxima saída" o usuário quer saber quando pegar QUALQUER
// ônibus dessa linha, não de uma variante específica.
export function proximasPartidas(linha: LinhaOnibus, agora: Date, quantidade: number): ProximaPartida[] {
  const diaTipo = diaTipoDeHoje(agora)
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes() - TOLERANCIA_MIN
  const todas = partidasOrdenadas(linha, diaTipo)
  if (todas.length === 0) return []

  const hojeRestantes = todas.filter((p) => paraMinutos(p.hora) >= minutosAgora)
  const resultado: ProximaPartida[] = hojeRestantes
    .slice(0, quantidade)
    .map((p) => ({ ...p, amanha: false }))

  let i = 0
  while (resultado.length < quantidade) {
    resultado.push({ ...todas[i % todas.length], amanha: true })
    i++
  }
  return resultado
}

// Mesma lógica, mas separada por variante/sentido — pra tela
// detalhada, onde cada uma mostra suas próprias próximas partidas.
export function proximasPartidasPorVariante(
  linha: LinhaOnibus,
  agora: Date,
  quantidade: number
): { parada: string; partidas: ProximaPartida[] }[] {
  const diaTipo = diaTipoDeHoje(agora)
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes() - TOLERANCIA_MIN

  return Object.entries(linha.horarios[diaTipo]).map(([parada, horarios]) => {
    const ordenados = [...horarios].sort((a, b) => paraMinutos(a) - paraMinutos(b))
    const hojeRestantes = ordenados.filter((h) => paraMinutos(h) >= minutosAgora)
    const partidas: ProximaPartida[] = hojeRestantes.slice(0, quantidade).map((hora) => ({ parada, hora, amanha: false }))
    let i = 0
    while (partidas.length < quantidade && ordenados.length > 0) {
      partidas.push({ parada, hora: ordenados[i % ordenados.length], amanha: true })
      i++
    }
    return { parada, partidas }
  })
}
