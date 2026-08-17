// Campos que mudam a identidade pública do negócio — mudar sozinho já
// levanta alerta alto; mudar junto de qualquer outra coisa, também
const CAMPOS_CRITICOS = [
  'nome_negocio',
  'categorias',
  'telefone_contato',
  'foto_principal_url',
]

// Mudam onde/como encontrar o negócio, mas não a identidade dele
const CAMPOS_MEDIOS = ['localizacoes', 'endereco']

export type NivelAlerta = 'baixo' | 'medio' | 'alto'

export const CAMPO_LABELS: Record<string, string> = {
  nome_negocio: 'Nome',
  categorias: 'Categoria',
  localizacoes: 'Localização',
  endereco: 'Endereço',
  descricao: 'Descrição',
  instagram: 'Instagram',
  telefone_contato: 'Telefone',
  foto_principal_url: 'Foto principal',
  foto_capa_url: 'Foto de capa',
}

export function calcularNivelAlerta(camposAlterados: string[]): NivelAlerta {
  const criticos = camposAlterados.filter((c) => CAMPOS_CRITICOS.includes(c))
  const outros = camposAlterados.filter((c) => !CAMPOS_CRITICOS.includes(c))

  if (criticos.length >= 2 || (criticos.length === 1 && outros.length > 0)) {
    return 'alto'
  }
  if (criticos.length === 1) return 'medio'
  if (camposAlterados.some((c) => CAMPOS_MEDIOS.includes(c))) return 'medio'
  return 'baixo'
}

type CamposComparaveis = {
  nome_negocio: string
  categorias: string[]
  localizacoes: string[]
  endereco: string | null
  descricao: string | null
  instagram: string | null
  telefone_contato: string
  foto_principal_url: string | null
  foto_capa_url: string | null
}

function arraysIguais(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const sa = [...a].sort()
  const sb = [...b].sort()
  return sa.every((v, i) => v === sb[i])
}

export function calcularCamposAlterados(
  antes: CamposComparaveis,
  depois: CamposComparaveis
): string[] {
  const alterados: string[] = []
  if (antes.nome_negocio !== depois.nome_negocio) alterados.push('nome_negocio')
  if (!arraysIguais(antes.categorias, depois.categorias)) alterados.push('categorias')
  if (!arraysIguais(antes.localizacoes, depois.localizacoes))
    alterados.push('localizacoes')
  if ((antes.endereco ?? '') !== (depois.endereco ?? '')) alterados.push('endereco')
  if ((antes.descricao ?? '') !== (depois.descricao ?? '')) alterados.push('descricao')
  if ((antes.instagram ?? '') !== (depois.instagram ?? '')) alterados.push('instagram')
  if (antes.telefone_contato !== depois.telefone_contato)
    alterados.push('telefone_contato')
  if (antes.foto_principal_url !== depois.foto_principal_url)
    alterados.push('foto_principal_url')
  if (antes.foto_capa_url !== depois.foto_capa_url) alterados.push('foto_capa_url')
  return alterados
}
