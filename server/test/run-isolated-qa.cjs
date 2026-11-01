const { randomBytes } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL to a QA PostgreSQL database.");
  const schema = "crm_qa_" + randomBytes(8).toString("hex");
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  const env = { ...process.env, DATABASE_URL: url.toString() };
  const prisma = new PrismaClient({ datasources: { db: { url: url.toString() } } });
  const run = (module, args) => execFileSync(process.execPath, [require.resolve(module), ...args], {
    cwd: path.resolve(__dirname, ".."), env, stdio: "inherit",
  });
  try {
    console.log("Running QA in temporary schema " + schema);
    run("prisma/build/index.js", ["migrate", "deploy"]);
    run("prisma/build/index.js", ["migrate", "diff", "--from-schema-datasource", "prisma/schema.prisma", "--to-schema-datamodel", "prisma/schema.prisma", "--exit-code"]);
    for (const file of ["leads-qa", "leads-http", "performance-regression", "security-and-spam", "environment-origin-verifier", "production-readiness", "dashboard-read-model"]) {
      run("tsx/cli", ["test/" + file + ".test.ts"]);
    }
  } finally {
    // Only this run's random schema can be removed. Application schemas are never targeted.
    if (!/^crm_qa_[a-f0-9]{16}$/.test(schema)) throw new Error("Invalid QA schema name");
    await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS "' + schema + '" CASCADE');
    await prisma.$disconnect();
    console.log("Removed temporary QA schema " + schema);
  }
}
main().catch((error) => { console.error("Isolated QA failed. See the check output above (exit status " + (error.status || 1) + ")."); process.exitCode = 1; });
