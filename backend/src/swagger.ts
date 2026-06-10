import swaggerUi from 'swagger-ui-express'
import type { Express } from 'express'

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Valorant Stickers API',
    version: '1.0.0',
    description: 'API para gerenciamento do álbum de figurinhas de Valorant',
  },
  tags: [
    { name: 'Catálogo', description: 'Gerenciamento das figurinhas do catálogo' },
    { name: 'Álbum', description: 'Gerenciamento do álbum do colecionador' },
  ],
  components: {
    schemas: {
      Figurinha: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          numero: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Jett' },
          categoria: { type: 'string', enum: ['Duelista', 'Controlador', 'Sentinela', 'Iniciador'], example: 'Duelista' },
          raridade: { type: 'string', enum: ['Comum', 'Rara', 'Lendaria'], example: 'Rara' },
          imagem: { type: 'string', example: 'https://media.valorant-api.com/agents/.../displayicon.png' },
          descricao: { type: 'string', nullable: true, example: 'Mestre da mobilidade.' },
        },
      },
      CriarFigurinhaBody: {
        type: 'object',
        required: ['numero', 'nome', 'categoria', 'raridade', 'imagem'],
        properties: {
          numero: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Jett' },
          categoria: { type: 'string', enum: ['Duelista', 'Controlador', 'Sentinela', 'Iniciador'] },
          raridade: { type: 'string', enum: ['Comum', 'Rara', 'Lendaria'] },
          imagem: { type: 'string', example: 'https://...' },
          descricao: { type: 'string', example: 'Mestre da mobilidade.' },
        },
      },
      EntradaAlbum: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          figurinhaId: { type: 'integer', example: 1 },
          quantidade: { type: 'integer', example: 2 },
          figurinha: { '$ref': '#/components/schemas/Figurinha' },
        },
      },
      Stats: {
        type: 'object',
        properties: {
          totalCatalago: { type: 'integer', example: 29 },
          totalColadas: { type: 'integer', example: 10 },
          totalFaltando: { type: 'integer', example: 19 },
          totalRepetidas: { type: 'integer', example: 3 },
          percentual: { type: 'integer', example: 34 },
        },
      },
      Erro: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Figurinha não encontrada' },
        },
      },
    },
  },
  paths: {
    '/catalogo': {
      get: {
        tags: ['Catálogo'],
        summary: 'Lista figurinhas do catálogo',
        description: 'Retorna todas as figurinhas com filtros opcionais combinávels.',
        parameters: [
          { name: 'numero', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por número' },
          { name: 'categoria', in: 'query', schema: { type: 'string', enum: ['Duelista', 'Controlador', 'Sentinela', 'Iniciador'] }, description: 'Filtrar por categoria' },
          { name: 'raridade', in: 'query', schema: { type: 'string', enum: ['Comum', 'Rara', 'Lendaria'] }, description: 'Filtrar por raridade' },
        ],
        responses: {
          200: { description: 'Lista de figurinhas', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/Figurinha' } } } } },
        },
      },
      post: {
        tags: ['Catálogo'],
        summary: 'Cria uma nova figurinha',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { '$ref': '#/components/schemas/CriarFigurinhaBody' } } },
        },
        responses: {
          201: { description: 'Figurinha criada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Figurinha' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Erro' } } } },
        },
      },
    },
    '/catalogo/{id}': {
      get: {
        tags: ['Catálogo'],
        summary: 'Retorna uma figurinha pelo ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Figurinha encontrada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Figurinha' } } } },
          404: { description: 'Figurinha não encontrada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Erro' } } } },
        },
      },
      put: {
        tags: ['Catálogo'],
        summary: 'Atualiza uma figurinha existente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { '$ref': '#/components/schemas/CriarFigurinhaBody' } } },
        },
        responses: {
          200: { description: 'Figurinha atualizada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Figurinha' } } } },
          404: { description: 'Figurinha não encontrada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Erro' } } } },
        },
      },
      delete: {
        tags: ['Catálogo'],
        summary: 'Remove uma figurinha do catálogo',
        description: 'Remove em cascata a entrada do álbum correspondente.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Figurinha removida com sucesso' },
          404: { description: 'Figurinha não encontrada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Erro' } } } },
        },
      },
    },
    '/album': {
      get: {
        tags: ['Álbum'],
        summary: 'Lista o álbum do colecionador',
        parameters: [
          { name: 'categoria', in: 'query', schema: { type: 'string', enum: ['Duelista', 'Controlador', 'Sentinela', 'Iniciador'] } },
          { name: 'raridade', in: 'query', schema: { type: 'string', enum: ['Comum', 'Rara', 'Lendaria'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['colada', 'repetida'] } },
        ],
        responses: {
          200: { description: 'Entradas do álbum', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/EntradaAlbum' } } } } },
        },
      },
    },
    '/album/stats': {
      get: {
        tags: ['Álbum'],
        summary: 'Retorna estatísticas de progresso do álbum',
        responses: {
          200: { description: 'Estatísticas', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Stats' } } } },
        },
      },
    },
    '/album/{figurinhaId}': {
      post: {
        tags: ['Álbum'],
        summary: 'Adiciona uma figurinha ao álbum',
        description: 'Se já existir, incrementa a quantidade. Se não existir, cria com quantidade 1.',
        parameters: [{ name: 'figurinhaId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Figurinha adicionada ou incrementada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/EntradaAlbum' } } } },
        },
      },
      delete: {
        tags: ['Álbum'],
        summary: 'Remove uma cópia da figurinha do álbum',
        description: 'Decrementa a quantidade. Figurinhas coladas (quantidade = 1) não podem ser removidas.',
        parameters: [{ name: 'figurinhaId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Cópia removida com sucesso' },
          400: { description: 'Figurinha colada não pode ser removida', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Erro' } } } },
          404: { description: 'Figurinha não encontrada no álbum', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Erro' } } } },
        },
      },
    },
  },
}

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}