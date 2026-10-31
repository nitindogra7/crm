-- AlterTable: Add environment and origin fields to dashboards
ALTER TABLE "dashboards" ADD COLUMN IF NOT EXISTS "productionOrigin" TEXT;
ALTER TABLE "dashboards" ADD COLUMN IF NOT EXISTS "allowedOrigins" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "dashboards" ADD COLUMN IF NOT EXISTS "activeEnvironment" TEXT DEFAULT 'development';

-- AlterTable: Add environment field to forms
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "environment" TEXT DEFAULT 'development';
CREATE INDEX IF NOT EXISTS "forms_dashboard_environment_idx" ON "forms"("dashboardId", "environment");

-- AlterTable: Add environment field to api_keys
ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "environment" TEXT DEFAULT 'development';
CREATE INDEX IF NOT EXISTS "api_keys_dashboard_environment_idx" ON "api_keys"("dashboardId", "environment");

-- AlterTable: Add environment field to leads
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "environment" TEXT DEFAULT 'development';
CREATE INDEX IF NOT EXISTS "leads_dashboard_environment_idx" ON "leads"("dashboardId", "environment");
CREATE INDEX IF NOT EXISTS "leads_dashboard_environment_received_idx" ON "leads"("dashboardId", "environment", "receivedAt" DESC);

-- AlterTable: Add environment field to spam
ALTER TABLE "spam" ADD COLUMN IF NOT EXISTS "environment" TEXT DEFAULT 'development';
CREATE INDEX IF NOT EXISTS "spam_dashboard_environment_idx" ON "spam"("dashboardId", "environment");
CREATE INDEX IF NOT EXISTS "spam_dashboard_environment_received_idx" ON "spam"("dashboardId", "environment", "receivedAt" DESC);
