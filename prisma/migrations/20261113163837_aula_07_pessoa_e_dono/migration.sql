-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'candidata',
    "empresaSlug" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Candidatura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "habilidades" TEXT NOT NULL DEFAULT '',
    "vagaId" TEXT NOT NULL,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pessoaId" TEXT,
    CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Candidatura_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Candidatura" ("criadaEm", "email", "habilidades", "id", "nome", "vagaId") SELECT "criadaEm", "email", "habilidades", "id", "nome", "vagaId" FROM "Candidatura";
DROP TABLE "Candidatura";
ALTER TABLE "new_Candidatura" RENAME TO "Candidatura";
CREATE TABLE "new_Vaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "empresaSlug" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "senioridade" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "aceitaIniciante" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT NOT NULL,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arquivada" BOOLEAN NOT NULL DEFAULT false,
    "autorId" TEXT,
    CONSTRAINT "Vaga_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Pessoa" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vaga" ("aceitaIniciante", "area", "arquivada", "criadaEm", "descricao", "empresa", "empresaSlug", "id", "local", "senioridade", "titulo") SELECT "aceitaIniciante", "area", "arquivada", "criadaEm", "descricao", "empresa", "empresaSlug", "id", "local", "senioridade", "titulo" FROM "Vaga";
DROP TABLE "Vaga";
ALTER TABLE "new_Vaga" RENAME TO "Vaga";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");
