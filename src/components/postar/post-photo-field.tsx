'use client'

import { useRef, useState } from 'react'
import Cropper, { type Area, type Point, type MediaSize } from 'react-easy-crop'
import { Camera, Expand, Shrink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCroppedImageFile } from '@/lib/crop-image'

// Só dois tamanhos de post são aceitos, igual Instagram: "menor"
// (quadrado, 1:1) e "maior" (retrato, 4:5). Ao escolher a foto, o modo
// inicial já é o que melhor encaixa a foto original (mais alta que 4:5
// → maior; senão → menor) — o botão de expandir/encolher (mesmo ícone
// de "duas setas" do Instagram) deixa trocar de modo a qualquer hora.
// Sempre passa pelo popup — não tem "pular direto sem decidir o tamanho".
const ASPECTS = { menor: 1, maior: 4 / 5 } as const
type Modo = keyof typeof ASPECTS

export function PostPhotoField({
  label,
  onFileChange,
}: {
  label: string
  onFileChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rawUrl, setRawUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [ajustando, setAjustando] = useState(false)
  const [modo, setModo] = useState<Modo>('menor')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleFileSelected = (file: File | null) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setRawUrl(url)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setAjustando(true) // sempre abre o popup — decidir o tamanho não é opcional
  }

  // Define o modo inicial pela proporção real da foto, assim que ela carrega
  const handleMediaLoaded = (mediaSize: MediaSize) => {
    const proporcao = mediaSize.naturalWidth / mediaSize.naturalHeight
    setModo(proporcao >= ASPECTS.maior ? 'menor' : 'maior')
  }

  const toggleModo = () => {
    setModo((m) => (m === 'menor' ? 'maior' : 'menor'))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const onCropComplete = (_: Area, pixels: Area) => setCroppedAreaPixels(pixels)

  const cancelar = () => {
    setAjustando(false)
    if (!previewUrl) {
      setRawUrl(null)
      onFileChange(null)
    }
  }

  const confirmar = async () => {
    if (!rawUrl || !croppedAreaPixels) return
    setProcessing(true)
    try {
      const file = await getCroppedImageFile(rawUrl, croppedAreaPixels, 'foto.jpg')
      setPreviewUrl(URL.createObjectURL(file))
      onFileChange(file)
      setAjustando(false)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`bg-muted flex w-36 items-center justify-center overflow-hidden rounded-lg ${
          modo === 'menor' ? 'aspect-square' : 'aspect-[4/5]'
        }`}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-muted-foreground text-xs">{label}</span>
        )}
      </div>

      <label className="border-border text-neutral-text hover:bg-muted flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium">
        <Camera className="size-3.5" />
        {previewUrl ? 'Trocar foto' : label}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFileSelected(e.target.files?.[0] ?? null)
            e.target.value = ''
          }}
        />
      </label>

      {ajustando && rawUrl && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/80 p-4">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
            <Cropper
              image={rawUrl}
              crop={crop}
              zoom={zoom}
              aspect={ASPECTS[modo]}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={handleMediaLoaded}
            />
            <button
              type="button"
              onClick={toggleModo}
              aria-label={modo === 'menor' ? 'Usar tamanho maior' : 'Usar tamanho menor'}
              className="active:scale-90 absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition-transform"
            >
              {modo === 'menor' ? (
                <Expand className="size-4" />
              ) : (
                <Shrink className="size-4" />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            {/* No touch dá pra beliscar pra dar zoom — o slider some no
                mobile e fica só como fallback pra quem tá no mouse/desktop */}
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Zoom"
              className="hidden w-full [@media(pointer:fine)]:block"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-white"
                onClick={cancelar}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button type="button" className="flex-1" onClick={confirmar} disabled={processing}>
                {processing ? 'Aplicando...' : 'Usar foto'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
