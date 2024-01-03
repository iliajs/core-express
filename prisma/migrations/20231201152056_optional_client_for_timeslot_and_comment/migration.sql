/*
  Warnings:

  - Added the required column `comment` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "comment" VARCHAR(500) NOT NULL;
