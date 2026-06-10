import { createFileRoute } from '@tanstack/react-router'
import Detalhes from '../../pages/Detalhes/Detalhes'

export const Route = createFileRoute('/figurinhas/$id')({
  component: Detalhes,
})