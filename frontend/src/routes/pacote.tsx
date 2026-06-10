import { createFileRoute } from '@tanstack/react-router'
import Pacote from '../pages/Pacote/Pacote'

export const Route = createFileRoute('/pacote')({
  component: Pacote,
})