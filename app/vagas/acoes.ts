"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { arquivarVaga, buscarVagaNoBanco } from "@/lib/api";
import { EsquemaDeArquivar } from "@/lib/esquemas";

/**
 * Arquivar (aula 05, frente 4 → aula 06).
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

  /* Aula 06: arquivar é um UPDATE numa linha da tabela — e as vagas do
     dados/vagas.json não estão na tabela. Essas saem do site como entraram:
     pelo time, num commit no JSON. Sem esta checagem, o update de uma linha
     que não existe lança, e a pessoa cai no error.tsx. */
  const vaga = await buscarVagaNoBanco(analise.data.id);
  if (!vaga) return;

  await arquivarVaga(vaga.id);

  /* O banco não avisa o cache — nunca avisou. Toda rota que MOSTRA esta vaga
     ou a conta dela precisa ser renderizada de novo.

     revalidateTag("vagas") aqui NÃO bastaria: ele manda buscar o vagas.json
     de novo, e o JSON volta igualzinho. O que mudou foi o banco, e o que
     precisa ser refeito é a RENDERIZAÇÃO das rotas — isso é revalidatePath. */
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath(`/vagas/${vaga.id}`);
  revalidatePath("/empresas");
  revalidatePath(`/empresas/${vaga.empresaSlug}`);
}
