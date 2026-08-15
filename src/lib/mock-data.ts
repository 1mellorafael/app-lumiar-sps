import {
  Bike,
  Sparkles,
  Navigation,
  Car,
  Scissors,
  Dog,
  Cat,
  Store,
  Baby,
  GraduationCap,
  Brain,
  Palette,
  type LucideIcon,
} from 'lucide-react'

export type Categoria = {
  slug: string
  nome: string
  icon: LucideIcon
}

// Mesma ordem/lista do seed em database/schema.sql
export const CATEGORIAS: Categoria[] = [
  { slug: 'motoboy', nome: 'Motoboy', icon: Bike },
  { slug: 'faxina', nome: 'Faxina', icon: Sparkles },
  { slug: 'mototaxi', nome: 'Mototáxi', icon: Navigation },
  { slug: 'uber', nome: 'Uber', icon: Car },
  { slug: 'estetica', nome: 'Estética', icon: Scissors },
  { slug: 'adestramento', nome: 'Adestramento', icon: Dog },
  { slug: 'hospedagem-pet', nome: 'Hospedagem Pet', icon: Cat },
  { slug: 'lojas', nome: 'Lojas', icon: Store },
  { slug: 'baba', nome: 'Babá', icon: Baby },
  { slug: 'educacao', nome: 'Educação', icon: GraduationCap },
  { slug: 'psicologo', nome: 'Psicólogo', icon: Brain },
  { slug: 'artes', nome: 'Artes', icon: Palette },
]
