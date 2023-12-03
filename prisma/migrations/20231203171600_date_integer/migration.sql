/*
  Warnings:

  - The `date` column on the `TimeSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `time` on the `TimeSlot` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `VarChar(7)`.

*/
-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "date",
ADD COLUMN     "date" INTEGER,
ALTER COLUMN "time" SET DATA TYPE VARCHAR(7);
