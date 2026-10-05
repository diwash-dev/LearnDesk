/*
  Warnings:

  - You are about to drop the column `title` on the `PastQuestion` table. All the data in the column will be lost.
  - Added the required column `filePublicId` to the `PastQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paperType` to the `PastQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PastQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaperStatus" AS ENUM ('draft', 'published');

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PastQuestion" DROP COLUMN "title",
ADD COLUMN     "filePublicId" TEXT NOT NULL,
ADD COLUMN     "pages" INTEGER,
ADD COLUMN     "paperType" TEXT NOT NULL,
ADD COLUMN     "status" "PaperStatus" NOT NULL DEFAULT 'draft',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
