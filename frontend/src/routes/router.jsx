import { createRoute } from '@tanstack/react-router'
import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root'
import Dashboard from '../pages/Dashboard'
import Album from '../pages/Album';
import Cadastro from '../pages/Cadastro';
import Detalhes from '../pages/Detalhes';
import Listagem from '../pages/Listagem';

const dashboard = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

const album = createRoute({
  getParentRoute: () => rootRoute,
  path: '/album',
  component: Album,
})

const cadastro = createRoute({
  getParentRoute: () => rootRoute,
  path: '/figurinhas/nova',
    component: Cadastro
})

const detalhes = createRoute({
  getParentRoute: () => rootRoute,
  path: '/figurinhas/:id',
    component: Detalhes
})

const listagem = createRoute({
  getParentRoute: () => rootRoute,
  path: '/figurinhas',
    component: Listagem
})

const routeTree = rootRoute.addChildren([
  dashboard,
  listagem,
  album,
  cadastro,
  detalhes
])
const router = createRouter({
  routeTree
})

export default router;


