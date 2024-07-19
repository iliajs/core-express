/*
  Warnings:

  - A unique constraint covering the columns `[botName]` on the table `TelegramBot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `botName` to the `TelegramBot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TelegramBot" ADD COLUMN     "botName" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TelegramBot_botName_key" ON "TelegramBot"("botName");
