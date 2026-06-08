import { createRoute } from '@tanstack/react-router'
import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root'
import Dashboard from '../pages/Dashboard/Dashboard'
import Album from '../pages/Album/Album';
import Cadastro from '../pages/Cadastro/Cadastro';
import Detalhes from '../pages/Detalhes/Detalhes';
import Listagem from '../pages/Listagem/Listagem';
import Edicao from '../pages/Edicao/Edicao';
import Pacote from '../pages/Pacote/Pacote';

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
  path: '/figurinhas/$id',
    component: Detalhes
})

const listagem = createRoute({
  getParentRoute: () => rootRoute,
  path: '/figurinhas',
    component: Listagem
})

const edicao = createRoute({
  getParentRoute: () => rootRoute,
  path: '/figurinhas/$id/editar',
  component: Edicao,
})

const aberturaPacote = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pacote',
  component: Pacote
})

const routeTree = rootRoute.addChildren([
  dashboard,
  listagem,
  album,
  cadastro,
  detalhes,
  edicao,
  aberturaPacote  
]);

const router = createRouter({
  routeTree
})

export default router;


