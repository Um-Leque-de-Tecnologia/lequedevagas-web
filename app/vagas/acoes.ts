"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { arquivarVaga } from "@/lib/api";
import { EsquemaDeArquivar } from "@/lib/esquemas";

/**
 * Arquivar (aula 05, frente 4).
 *
 * Esta ação não usa useActionState: não tem erro para mostrar nem campo para
 * devolver preenchido. Então ela recebe UM argumento só — o FormData — e é
 * ligada direto no action= do <form>.
 */
export async function arquivar(dados: FormData) {
  // Sim, validar mesmo com um campo só: um id vazio percorreria o resto da
  // função sem ninguém notar.
  const analise = EsquemaDeArquivar.safeParse(Object.fromEntries(dados));
  if (!analise.success) return;

  arquivarVaga(analise.data.id);

  /* ─── O TESTE QUE VALE NOTA ───────────────────────────────────────────
     revalidateTag("vagas") manda buscar o vagas.json de novo. Só que a lista
     de arquivadas NÃO veio de fetch nenhum: ela é um Set em memória. O JSON
     volta igualzinho, e a vaga continua na tela.

     O que precisa ser refeito é a RENDERIZAÇÃO das rotas que mostram esta
     vaga ou a conta dela — e quem faz isso é o revalidatePath. */
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath(`/vagas/${analise.data.id}`);
}
