// "há 5 min" / "há 3 h" / "há 2 dias" etc — usado no rodapé dos posts
export function formatarTempoRelativo(iso: string): string {
  const segundos = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)

  if (segundos < 60) return 'agora mesmo'
  const minutos = Math.floor(segundos / 60)
  if (minutos < 60) return `há ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `há ${horas}h`
  const dias = Math.floor(horas / 24)
  if (dias < 30) return `há ${dias} dia${dias > 1 ? 's' : ''}`
  const meses = Math.floor(dias / 30)
  if (meses < 12) return `há ${meses} mês${meses > 1 ? 'es' : ''}`
  const anos = Math.floor(meses / 12)
  return `há ${anos} ano${anos > 1 ? 's' : ''}`
}
