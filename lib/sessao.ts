import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * QUEM ESTÁ AÍ? (aula 07, LAB 3)
 *
 * O cookie diz o id; o banco diz o resto. Por isso trocar o papel de alguém
 * no banco vale no próximo clique, e não daqui a trinta dias, quando o
 * crachá vencer. O `cache` do React faz a consulta rodar UMA vez por pedido,
 * por mais que perguntem.
 *
 * Ler a sessão é ler cookie: toda página que chama isto vira ƒ. Por isso ela
 * só é chamada onde a página já é de uma pessoa só — /painel, /vagas/nova e
 * o editar da empresa — e dentro das ações. Nunca no layout.
 */
export const usuarioAtual = cache(async () => {
  const sessao = await auth();
  const id = sessao?.user?.id;
  if (!id) return null;

  // `select`: a senhaHash nunca sai deste arquivo, nem por engano.
  return prisma.pessoa.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, papel: true, empresaSlug: true },
  });
});

/** O que o `usuarioAtual()` devolve quando alguém entrou. */
export type Quem = NonNullable<Awaited<ReturnType<typeof usuarioAtual>>>;
