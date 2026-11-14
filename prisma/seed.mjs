import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Senha escrita aqui de propósito: é um banco de teste, na sua máquina.
// Estas três pessoas NUNCA podem ir para um banco publicado.
const SENHA = "leque1234";

const PESSOAS = [
  { nome: "Ana Souza", email: "ana@exemplo.com", papel: "empresa", empresaSlug: "aurora-tech" },
  { nome: "Bruno Lima", email: "bruno@exemplo.com", papel: "empresa", empresaSlug: "nuvem-rosa" },
  { nome: "Carla Dias", email: "carla@exemplo.com", papel: "candidata", empresaSlug: null },
];

for (const pessoa of PESSOAS) {
  // Um hash por pessoa: o bcrypt sorteia um "sal" a cada chamada.
  const senhaHash = await bcrypt.hash(SENHA, 10);

  // upsert: rodar o seed duas vezes não duplica ninguém.
  await prisma.pessoa.upsert({
    where: { email: pessoa.email },
    update: { ...pessoa, senhaHash },
    create: { ...pessoa, senhaHash },
  });
}

console.log(`${PESSOAS.length} pessoas de laboratório, todas com a senha "${SENHA}"`);
await prisma.$disconnect();
