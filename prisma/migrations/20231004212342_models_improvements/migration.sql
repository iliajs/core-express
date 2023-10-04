/*
  Warnings:

  - You are about to drop the `credentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `words` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wordsAndTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_wordId_fkey";

-- DropForeignKey
ALTER TABLE "wordsAndTags" DROP CONSTRAINT "wordsAndTags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "wordsAndTags" DROP CONSTRAINT "wordsAndTags_wordId_fkey";

-- DropTable
DROP TABLE "credentials";

-- DropTable
DROP TABLE "tags";

-- DropTable
DROP TABLE "translations";

-- DropTable
DROP TABLE "words";

-- DropTable
DROP TABLE "wordsAndTags";

-- CreateTable
CREATE TABLE "EncryptedRecord" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "data" BYTEA NOT NULL,
    "id" UUID NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "userId" UUID NOT NULL,

    CONSTRAINT "EncryptedRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "userId" UUID NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnWords" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tagId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "wordId" UUID NOT NULL,

    CONSTRAINT "TagsOnWords_pkey" PRIMARY KEY ("wordId","tagId")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" UUID NOT NULL,
    "text" CHAR(1000) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "wordId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "userId" UUID NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Word_title_key" ON "Word"("title");

-- AddForeignKey
ALTER TABLE "EncryptedRecord" ADD CONSTRAINT "EncryptedRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnWords" ADD CONSTRAINT "TagsOnWords_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnWords" ADD CONSTRAINT "TagsOnWords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnWords" ADD CONSTRAINT "TagsOnWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
