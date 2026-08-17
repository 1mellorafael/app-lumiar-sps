export type PixelCrop = { x: number; y: number; width: number; height: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = src
  })
}

// Recorta a imagem original pro retângulo escolhido no editor e devolve
// como File pronto pra upload — a partir daqui a foto salva já nasce no
// formato certo, não depende mais de object-position em tela nenhuma
export async function getCroppedImageFile(
  imageSrc: string,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D não disponível')

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9)
  )
  if (!blob) throw new Error('Não foi possível gerar a imagem recortada')

  return new File([blob], fileName, { type: 'image/jpeg' })
}
