/*
  Warnings:

  - You are about to alter the column `authCode` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(6)` to `VarChar(4)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "regCode" VARCHAR(6),
ADD COLUMN     "regCodeTime" TIMESTAMPTZ(6),
ADD COLUMN     "rpCode" UUID,
ADD COLUMN     "rpCodeTime" TIMESTAMPTZ(6),
ALTER COLUMN "authCode" SET DATA TYPE VARCHAR(4);
