/*
  Warnings:

  - You are about to drop the column `clientId` on the `TimeSlot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_clientId_fkey";

-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "clientId";
