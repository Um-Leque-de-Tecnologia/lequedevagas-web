"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { buscarVagaNoBanco, guardarCandidatura } from "@/lib/api";
import { EsquemaDaCandidatura } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";

/**
 * Candidatar-se (aula 05, frente 3 → aula 06).
 *
 * DOIS parâmetros: com useActionState o Next chama a ação com o estado
 * anterior na frente. Quem declara só (dados: FormData) recebe o ESTADO no
 * lugar do formulário, e todo campo vira undefined sem erro nenhum.
 */
export async function enviarCandidatura(
  estadoAnterior: Estado,
  dados: FormData,
): Promise<Estado> {
  // As habilidades são uma LISTA, e Object.fromEntries só guarda o último
  // valor de cada chave repetida. Para lista existe o getAll.
  const habilidades = dados.getAll("habilidades").map(String);
  const valores = { ...valoresDe(dados), habilidades: habilidades.join(",") };

  // 1. DESCONFIE. Nada do que chegou aqui passou pelo seu formulário.
  const analise = EsquemaDaCandidatura.safeParse({
    vagaId: dados.get("vagaId"),
    nome: dados.get("nome"),
    email: dados.get("email"),
    habilidades,
  });
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

  await guardarCandidatura({
    ...analise.data,
    id: crypto.randomUUID(),
    enviadaEm: new Date().toISOString(),
  });

  // 3. AVISE O CACHE: a página da vaga passou a mostrar quantas
  //    candidaturas ela tem (aula 06). Na aula 05 não havia o que revalidar.
  revalidatePath(`/vagas/${vaga.id}`);

  return { ok: true, erros: {}, valores: {}, mensagem: "Candidatura enviada!" };
}
