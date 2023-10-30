-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscriptionExpiry" TIMESTAMP(3),
ADD COLUMN     "subscriptionPlan" TEXT;
