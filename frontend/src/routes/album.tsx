import { createFileRoute } from '@tanstack/react-router'
import Album from '../pages/Album/Album'

export const Route = createFileRoute('/album')({
  component: Album,
})