# Valorant Stickers 🎴

Álbum de figurinhas digital temático do jogo Valorant, desenvolvido como atividade de estágio full stack. O álbum representa os agentes do jogo organizados por classe e raridade, permitindo ao colecionador gerenciar sua coleção, visualizar o progresso e abrir pacotes diários para ganhar novas figurinhas.

---

## Tecnologias

**Backend**
- Node.js v22 + Express
- Prisma ORM v5
- PostgreSQL

**Frontend**
- React + Vite
- TanStack Query — cache e sincronização com a API
- TanStack Router — navegação entre telas
- TanStack Table — listagem com ordenação, filtros e paginação
- CSS Modules

**Ferramentas**
- Bruno — testes de API
- Git — controle de versão

---

## Como rodar localmente

### Pré-requisitos

- Node.js v18 ou superior
- PostgreSQL instalado e rodando

### 1. Clone o repositório

```bash
git clone https://github.com/agbram/valorant-album.git
cd valorant-album
```

### 2. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/valorant_album"
PORT=3333
```

Substitua `usuario` e `senha` pelas suas credenciais do PostgreSQL e crie o banco `valorant_album` antes de continuar.

Execute a migration e o seed:

```bash
npx prisma migrate dev
node src/db/seed.js
```

Suba o servidor:

```bash
npm run dev
```

O backend estará disponível em `http://localhost:3333`.

### 3. Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env` na pasta `frontend/`:

```env
VITE_API_URL=http://localhost:3333
```

Suba o servidor:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Estrutura do projeto

valorant-album/
├── backend/
│   ├── src/
│   │   ├── controllers/   # lógica de cada recurso
│   │   ├── routes/        # definição dos endpoints
│   │   └── db/            # configuração do Prisma e seed
│   └── prisma/
│       └── schema.prisma
└── frontend/
└── src/
├── pages/         # telas da aplicação
├── components/    # componentes reutilizáveis
├── services/      # funções de chamada à API
└── routes/        # configuração do TanStack Router

---

## Endpoints da API

### Catálogo

| Método |     Rota      |                                 Descrição                                     |                               
|--------|---------------|-------------------------------------------------------------------------------|
| GET    | /catalogo     | Lista figurinhas com filtros opcionais por `numero`, `categoria` e `raridade` |
| GET    | /catalogo/:id | Retorna uma figurinha pelo ID                                                 |
| POST   | /catalogo     | Cria uma nova figurinha                                                       |
| PUT    | /catalogo/:id | Atualiza uma figurinha existente                                              |
| DELETE | /catalogo/:id | Remove uma figurinha do catálogo                                              |

### Álbum

| Método |        Rota         |                             Descrição                                      |
|--------|-------------------- |----------------------------------------------------------------------------|
| GET    | /album              | Lista o álbum com filtros opcionais por `categoria`, `raridade` e `status` |
| GET    | /album/stats        | Retorna estatísticas de progresso da coleção                               |
| POST   | /album/:figurinhaId | Adiciona uma figurinha ao álbum (incrementa se já existir)                 |
| DELETE | /album/:figurinhaId | Remove uma cópia da figurinha do álbum                                     |

---

## Decisões técnicas

**Banco de dados — PostgreSQL**
Escolhido pelo suporte nativo a enums, permitindo modelar `Categoria` e `Raridade` diretamente no banco com validação automática.

**Prisma v5**
Downgrade da v7 foi necessário pois a v7 introduziu breaking changes na configuração do datasource que fogem do escopo do projeto.

**Status calculado em runtime**
O status da figurinha (faltando, colada, repetida) não é uma coluna no banco — é derivado da quantidade em tempo real:
-  não possui entrada no álbum → faltando (não está no álbum)
- `quantidade >= 1` → colada
- `quantidade > 1` → repetida

Isso evita redundância e mantém o dado consistente sem precisar de uma coluna extra.

**Cascade delete**
Ao deletar uma figurinha do catálogo, ela é removida automaticamente do álbum via `onDelete: Cascade` no Prisma. Comportamento documentado e intencional.

**Paginação client-side**
Com 29 agentes o volume é pequeno, tornando a paginação client-side suficiente e mais simples. Em um cenário de crescimento do catálogo, a migração para server-side seria feita passando os parâmetros `page` e `limit` para a API.

**TanStack Query — cache invalidation**
Após cada mutation (criar, editar, deletar figurinha, adicionar ou remover do álbum), as queries relacionadas são invalidadas. O TanStack Query refaz a busca automaticamente e a tela atualiza sem reload.

**Optimistic update**
Implementado nos botões `+` e `-` da tela de Detalhes. A quantidade atualiza na tela imediatamente, antes da confirmação da API. Em caso de erro, o cache é revertido para o estado anterior via rollback no `onError`.

**Decisão de filtragem**
- Filtro de status (colada/repetida/faltando) disponível apenas na tela do Álbum Visual — por decisão de UX, filtrar por status no catálogo não faz sentido conceitual. O catálogo representa o que existe no jogo; o status é uma informação do colecionador, não do catálogo.

---

## Funcionalidades extras

**Tela de Abertura de Pacote**
Feature não prevista no escopo original, desenvolvida após alinhamento com a equipe. O usuário pode abrir 1 pacote por dia (cooldown de 24h via localStorage). O sorteio é ponderado por raridade:
- Comum: 70% de chance
- Rara: 25% de chance
- Lendária: 5% de chance

A figurinha sorteada é adicionada automaticamente ao álbum, com feedback indicando se é nova ou repetida e a quantidade já possuída.

---

**🛡️ Desafio Goleiro: Validação de Dados**
Implementado com sucesso utilizando a biblioteca **Zod**. As rotas de criação (`POST /catalogo`) e edição (`PUT /catalogo/:id`) contam com uma camada de validação rigorosa no backend que:
- Exige a presença de todos os campos obrigatórios (nome, número, categoria, etc).
- Garante que os tipos estão corretos (ex: impede o envio de um texto no lugar do número da figurinha).
- Valida se o link enviado é realmente uma URL válida.
- Impede a criação de figurinhas com número negativo.
- Bloqueia categorias e raridades que não existam no jogo.
- Limpa dados extras não solicitados enviados por engano ou má fé no payload (comportamento padrão do `.safeParse`).

---

## Limitações conhecidas
- Sistema de autenticação não implementado — o álbum pertence a um único colecionador padrão.
- Upload de imagem próprio não implementado — as imagens são URLs públicas da `valorant-api.com`.
- Responsividade mobile parcialmente implementada.