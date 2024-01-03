-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_clientId_fkey";

-- AlterTable
ALTER TABLE "TimeSlot" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
