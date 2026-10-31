-- Performance Optimization Migration: Composite Indexes & Duplicate Index Removal
-- Deployment Note: In high-traffic production environments, consider running index creation
-- with CREATE INDEX CONCURRENTLY outside of a transaction block to prevent table lock contention.

-- Drop redundant duplicate indexes (already uniquely indexed via primary/unique constraint)
DROP INDEX IF EXISTS "api_keys_key_idx";
DROP INDEX IF EXISTS "onboarding_userId_idx";

-- Create composite index for forms listed by dashboard ordered by creation date
CREATE INDEX IF NOT EXISTS "forms_dashboardId_createdAt_idx" ON "forms"("dashboardId", "createdAt" DESC);

-- Create composite index for leads paginated by dashboard ordered by receivedAt DESC
CREATE INDEX IF NOT EXISTS "leads_dashboardId_receivedAt_idx" ON "leads"("dashboardId", "receivedAt" DESC);

-- Create composite index for leads filtered by pipeline status and ordered by receivedAt DESC
CREATE INDEX IF NOT EXISTS "leads_dashboardId_status_receivedAt_idx" ON "leads"("dashboardId", "status", "receivedAt" DESC);

-- Create composite index for spam quarantined by dashboard ordered by receivedAt DESC
CREATE INDEX IF NOT EXISTS "spam_dashboardId_receivedAt_idx" ON "spam"("dashboardId", "receivedAt" DESC);
