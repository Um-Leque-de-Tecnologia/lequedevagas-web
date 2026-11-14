// Com este arquivo presente, o Prisma 6 deixa de ler o .env sozinho — por
// isso a primeira linha. O Next lê o .env por conta própria quando sobe.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // aula 07 · LAB 2: `npx prisma db seed` roda isto.
    seed: "node prisma/seed.mjs",
  },
});
