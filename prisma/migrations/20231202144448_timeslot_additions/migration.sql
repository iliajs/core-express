/*
  Warnings:

  - You are about to drop the column `datetime` on the `TimeSlot` table. All the data in the column will be lost.
  - Added the required column `time` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "datetime",
ADD COLUMN     "archived" BOOLEAN,
ADD COLUMN     "date" VARCHAR(11),
ADD COLUMN     "time" VARCHAR(8) NOT NULL;
