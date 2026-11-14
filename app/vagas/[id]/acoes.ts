"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { buscarVagaNoBanco, guardarCandidatura } from "@/lib/api";
import { EsquemaDaCandidatura } from "@/lib/esquemas";
import { porCampo } from "@/lib/formulario";
import { podeCandidatar } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";
import type { Estado } from "@/lib/tipos";

/**
 * Candidatar-se (aula 05, frente 3 → aula 06 → aula 07).
 *
 * DOIS parâmetros: com useActionState o Next chama a ação com o estado
 * anterior na frente. Quem declara só (dados: FormData) recebe o ESTADO no
 * lugar do formulário, e todo campo vira undefined sem erro nenhum.
 */
export async function enviarCandidatura(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  // As habilidades são uma LISTA, e Object.fromEntries só guardaria a
  // última. Para lista existe o getAll.
  const habilidades = dados.getAll("habilidades").map(String);
  const valores = { habilidades: habilidades.join(",") };

  /* 0. QUEM ESTÁ CHAMANDO? (aula 07) A página da vaga é estática (●): ela
        não sabe quem está olhando. Quem sabe é a AÇÃO, que roda com o
        cookie de quem mandou. */
  const quem = await usuarioAtual();
  if (!podeCandidatar(quem)) {
    return { ok: false, erros: {}, valores, mensagem: "Entre como candidata para se candidatar." };
  }

  // 1. DESCONFIE. Nada do que chegou aqui passou pelo seu formulário.
  const analise = EsquemaDaCandidatura.safeParse({ vagaId: dados.get("vagaId"), habilidades });
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  /* 2. A RELAÇÃO OBRIGA a vaga a existir NA TABELA (aula 06). Sem esta
        checagem, o Prisma lança, e exceção dentro de ação manda a pessoa
        para o error.tsx. Vaga que não existe é conversa, não falha. */
  const vaga = await buscarVagaNoBanco(analise.data.vagaId);
  if (!vaga || vaga.arquivada) {
    return { ok: false, erros: {}, valores, mensagem: "Esta vaga não recebe mais candidaturas." };
  }

  // 3. Nome e e-mail vêm da CONTA, não de um campo: ninguém se candidata em
  //    nome de outra pessoa. E a dona é argumento, não campo.
  await guardarCandidatura(
    {
      ...analise.data,
      nome: quem.nome,
      email: quem.email,
      id: crypto.randomUUID(),
      enviadaEm: new Date().toISOString(),
    },
    quem.id,
  );

  // 4. AVISE O CACHE: a página da vaga mostra quantas candidaturas ela tem.
  revalidatePath(`/vagas/${vaga.id}`);

  return { ok: true, erros: {}, valores: {}, mensagem: "Candidatura enviada!" };
}
