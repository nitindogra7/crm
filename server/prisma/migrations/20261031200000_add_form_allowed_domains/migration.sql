-- AlterTable
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "allowedDomains" TEXT[] DEFAULT ARRAY[]::TEXT[];

