-- AlterTable
ALTER TABLE "onboarding" ADD COLUMN IF NOT EXISTS "ownerEmail" TEXT;
ALTER TABLE "onboarding" ADD COLUMN IF NOT EXISTS "endpointUrl" TEXT;
ALTER TABLE "onboarding" ADD COLUMN IF NOT EXISTS "isOnboarded" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "onboarding_userId_key" ON "onboarding"("userId");

