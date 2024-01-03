-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_clientId_fkey";

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
