import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`select 1`;
  res.json({ ok: true });
});

app.listen(port, () => console.log(`API on :${port}`));