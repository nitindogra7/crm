BEGIN;

-- Stop if an existing public URL is ambiguous. Resolve duplicates before retrying.
CREATE UNIQUE INDEX "forms_slug_key" ON "forms"("slug");

-- Earlier environment columns were nullable, despite required Prisma fields.
UPDATE "dashboards" SET "allowedOrigins" = ARRAY[]::TEXT[] WHERE "allowedOrigins" IS NULL;
UPDATE "dashboards" SET "activeEnvironment" = 'development' WHERE "activeEnvironment" IS NULL;
ALTER TABLE "dashboards" ALTER COLUMN "allowedOrigins" SET NOT NULL;
ALTER TABLE "dashboards" ALTER COLUMN "activeEnvironment" SET NOT NULL;
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_active_environment_check"
  CHECK ("activeEnvironment" IN ('development', 'production'));

DO $$
DECLARE table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['forms', 'api_keys', 'leads', 'spam'] LOOP
    EXECUTE format('UPDATE %I SET "environment" = ''development'' WHERE "environment" IS NULL', table_name);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN "environment" SET NOT NULL', table_name);
    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I CHECK ("environment" IN (''development'', ''production''))', table_name, table_name || '_environment_check');
  END LOOP;
END $$;

ALTER TABLE "forms" ADD CONSTRAINT "forms_nonnegative_counts_check"
  CHECK ("leadCount" >= 0 AND "spamCount" >= 0);

-- Match Prisma's index names so future migrations do not recreate existing indexes.
ALTER INDEX "forms_dashboard_environment_idx" RENAME TO "forms_dashboardId_environment_idx";
ALTER INDEX "api_keys_dashboard_environment_idx" RENAME TO "api_keys_dashboardId_environment_idx";
ALTER INDEX "leads_dashboard_environment_idx" RENAME TO "leads_dashboardId_environment_idx";
ALTER INDEX "leads_dashboard_environment_received_idx" RENAME TO "leads_dashboardId_environment_receivedAt_idx";
ALTER INDEX "spam_dashboard_environment_idx" RENAME TO "spam_dashboardId_environment_idx";
ALTER INDEX "spam_dashboard_environment_received_idx" RENAME TO "spam_dashboardId_environment_receivedAt_idx";

ALTER TABLE "api_keys" ALTER COLUMN "name" SET DEFAULT 'Development API Key';
ALTER TABLE "api_keys" ALTER COLUMN "keyPrefix" SET DEFAULT 'sln_test_';

COMMIT;
