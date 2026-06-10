import { createFileRoute } from '@tanstack/react-router'
import Listagem from '../../pages/Listagem/Listagem'

export const Route = createFileRoute('/figurinhas/')({
  component: Listagem,
})