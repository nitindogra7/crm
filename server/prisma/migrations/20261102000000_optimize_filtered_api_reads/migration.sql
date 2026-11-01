-- Equality filters precede the sort column.
CREATE INDEX "leads_dashboardId_environment_status_receivedAt_idx" ON "leads"("dashboardId", "environment", "status", "receivedAt" DESC);
CREATE INDEX "leads_dashboardId_environment_formId_receivedAt_idx" ON "leads"("dashboardId", "environment", "formId", "receivedAt" DESC);
CREATE INDEX "forms_dashboardId_environment_createdAt_idx" ON "forms"("dashboardId", "environment", "createdAt" DESC);
CREATE INDEX "api_keys_dashboardId_environment_revoked_createdAt_idx" ON "api_keys"("dashboardId", "environment", "revoked", "createdAt" DESC);
