/*
  Warnings:

  - You are about to drop the column `purchaseBannerSent` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "purchaseBannerSent",
ADD COLUMN     "expiryWarningSentAt" TIMESTAMP(3);
