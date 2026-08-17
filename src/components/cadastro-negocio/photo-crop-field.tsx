'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { Camera, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCroppedImageFile } from '@/lib/crop-image'

type PhotoCropFieldProps = {
  label: string
  trocarLabel: string
  icon: 'camera' | 'imagem'
  shape: 'round' | 'rect'
  aspect: number
  initialUrl?: string | null
  previewClassName: string
  onFileChange: (file: File | null) => void
}

// Modal com a foto inteira + máscara translúcida do formato final (círculo
// ou banner) sobreposta — dá pra mover e dar zoom até encaixar, em vez de
// arrastar dentro do espaço minúsculo já cortado (react-easy-crop cuida
// do pan/zoom, a gente só recorta pro arquivo final na confirmação)
export function PhotoCropField({
  label,
  trocarLabel,
  icon,
  shape,
  aspect,
  initialUrl = null,
  previewClassName,
  onFileChange,
}: PhotoCropFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    return () => {
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl)
    }
  }, [rawImageUrl])

  const handleFileSelected = (file: File | null) => {
    if (!file) return
    setRawImageUrl(URL.createObjectURL(file))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const cancelar = () => {
    setRawImageUrl(null)
  }

  const confirmar = async () => {
    if (!rawImageUrl || !croppedAreaPixels) return
    setProcessing(true)
    try {
      const file = await getCroppedImageFile(
        rawImageUrl,
        croppedAreaPixels,
        'foto.jpg'
      )
      setPreviewUrl(URL.createObjectURL(file))
      onFileChange(file)
      setRawImageUrl(null)
    } finally {
      setProcessing(false)
    }
  }

  const Icon = icon === 'camera' ? Camera : ImagePlus

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`bg-muted flex items-center justify-center overflow-hidden ${previewClassName} ${shape === 'round' ? 'rounded-full' : 'rounded-lg'}`}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-muted-foreground text-xs">Foto</span>
        )}
      </div>

      <label className="border-border text-neutral-text hover:bg-muted flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium">
        <Icon className="size-3.5" />
        {previewUrl ? trocarLabel : label}
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

      {rawImageUrl && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/80 p-4">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
            <Cropper
              image={rawImageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={shape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Zoom"
              className="w-full"
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
              <Button
                type="button"
                className="flex-1"
                onClick={confirmar}
                disabled={processing}
              >
                {processing ? 'Aplicando...' : 'Usar foto'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
