/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `album` table. All the data in the column will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "album" DROP CONSTRAINT "album_usuarioId_fkey";

-- AlterTable
ALTER TABLE "album" DROP COLUMN "usuarioId";

-- DropTable
DROP TABLE "usuario";
