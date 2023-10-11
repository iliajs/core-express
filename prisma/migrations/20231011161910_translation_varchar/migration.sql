-- DropForeignKey
ALTER TABLE "TagsOnWords" DROP CONSTRAINT "TagsOnWords_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnWords" DROP CONSTRAINT "TagsOnWords_wordId_fkey";

-- AlterTable
ALTER TABLE "Translation" ALTER COLUMN "text" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "TagsOnWords" ADD CONSTRAINT "TagsOnWords_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnWords" ADD CONSTRAINT "TagsOnWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
