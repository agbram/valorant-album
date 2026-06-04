-- CreateEnum
CREATE TYPE "Raridade" AS ENUM ('Comum', 'Rara', 'Lendaria');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Duelista', 'Controlador', 'Sentinela', 'Iniciador');

-- CreateTable
CREATE TABLE "figurinha" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "raridade" "Raridade" NOT NULL,
    "imagem" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "figurinha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album" (
    "id" SERIAL NOT NULL,
    "figurinhaId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "album_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "figurinha_numero_key" ON "figurinha"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "album_figurinhaId_key" ON "album"("figurinhaId");

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "album_figurinhaId_fkey" FOREIGN KEY ("figurinhaId") REFERENCES "figurinha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
