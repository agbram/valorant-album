import { createFileRoute } from '@tanstack/react-router'
import Editar from '../../pages/Edicao/Edicao'

export const Route = createFileRoute('/figurinhas/$id/editar')({
  component: Editar
})

