/*
  Warnings:

  - You are about to drop the column `creditsIssued` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `creditsLeft` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropIndex
DROP INDEX "subscriptions_userId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "creditsIssued",
DROP COLUMN "creditsLeft",
ADD COLUMN     "subscriptionPlan" TEXT;

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");
