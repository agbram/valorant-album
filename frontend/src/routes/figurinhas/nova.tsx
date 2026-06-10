import { createFileRoute } from '@tanstack/react-router'
import Cadastro from '../../pages/Cadastro/Cadastro'

export const Route = createFileRoute('/figurinhas/nova')({
  component: Cadastro,
})