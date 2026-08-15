import { Suspense } from 'react'
import { BuscarContent } from './buscar-content'

export default function BuscarPage() {
  return (
    <Suspense>
      <BuscarContent />
    </Suspense>
  )
}
