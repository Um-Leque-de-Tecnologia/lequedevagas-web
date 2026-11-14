"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { arquivarVaga, buscarVagaNoBanco } from "@/lib/api";
import { EsquemaDeArquivar } from "@/lib/esquemas";
import { podeArquivar } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";

/**
 * Arquivar (aula 05, frente 4 → aula 06 → aula 07).
 *
 * Esta ação não usa useActionState: não tem erro para mostrar nem campo para
 * devolver preenchido. Então ela recebe UM argumento só — o FormData — e é
 * ligada direto no action= do <form>, no /painel.
 */
export async function arquivar(dados: FormData) {
  // Sim, validar mesmo com um campo só: um id vazio percorreria o resto da
  // função sem ninguém notar.
  const analise = EsquemaDeArquivar.safeParse(Object.fromEntries(dados));
  if (!analise.success) return;

  /* O id continua num campo escondido, e continua trocável por qualquer
     pessoa com o DevTools aberto. Tudo bem: a ação não confia nele para
     decidir NADA. Ela busca o dono DAQUELA vaga no banco e compara com quem
     está na sessão (aula 07). */
  const [quem, vaga] = await Promise.all([
    usuarioAtual(),
    buscarVagaNoBanco(analise.data.id),
  ]);

  /* Recusado não mostra mensagem: a tela nunca ofereceria este botão para
     esta vaga — quem chegou aqui montou o pedido à mão. */
  if (!vaga || !podeArquivar(quem, vaga)) return;

  await arquivarVaga(vaga.id);

  /* O banco não avisa o cache — nunca avisou. Toda rota que MOSTRA esta vaga
     ou a conta dela precisa ser renderizada de novo. O painel não precisa:
     ele é ƒ, e renderiza a cada visita.

     revalidateTag("vagas") aqui NÃO bastaria: ele manda buscar o vagas.json
     de novo, e o JSON volta igualzinho. O que mudou foi o banco, e o que
     precisa ser refeito é a RENDERIZAÇÃO das rotas — isso é revalidatePath. */
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath(`/vagas/${vaga.id}`);
  revalidatePath("/empresas");
  revalidatePath(`/empresas/${vaga.empresaSlug}`);
}
