/*
  Warnings:

  - You are about to drop the column `name` on the `TimeSlot` table. All the data in the column will be lost.
  - You are about to drop the `EncryptedRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EncryptedRecord" DROP CONSTRAINT "EncryptedRecord_userId_fkey";

-- DropIndex
DROP INDEX "TimeSlot_name_key";

-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "name";

-- DropTable
DROP TABLE "EncryptedRecord";
