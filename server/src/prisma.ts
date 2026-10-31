import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Raw queries need the same schema qualification as Prisma's generated queries.
export function sqlTable(table: "forms" | "leads"): Prisma.Sql {
  const schema = new URL(process.env.DATABASE_URL || "postgresql://localhost/app")
    .searchParams.get("schema") || "public";
  const identifier = '"' + schema.replaceAll('"', '""') + '"."' + table + '"';
  return Prisma.sql`${Prisma.raw(identifier)}`;
}

export default prisma;
