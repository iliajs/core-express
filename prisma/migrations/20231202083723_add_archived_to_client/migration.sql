-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "archived" BOOLEAN;

-- AlterTable
ALTER TABLE "TimeSlot" ALTER COLUMN "comment" DROP NOT NULL;
