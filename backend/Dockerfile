FROM node:lts-trixie AS tester

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run test

FROM node:lts-alpine AS builder

WORKDIR /app
# hadolint ignore=DL3018
RUN apk add --no-cache python3 make g++

COPY . .

RUN npm ci
RUN npm run build
RUN NODE_ENV=production npm prune


FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/build/src .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/migrations ./migrations

ENTRYPOINT [ "node" ]
CMD [ "main/server.js" ]