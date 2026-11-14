"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { buscarVaga, guardarCandidatura } from "@/lib/api";
import { EsquemaDaCandidatura } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";

/**
 * Candidatar-se (aula 05, frente 3).
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

  // 2. A vaga existe? O id veio de um campo escondido, e campo escondido
  //    também se troca.
  const vaga = await buscarVaga(analise.data.vagaId);
  if (!vaga) {
    return { ok: false, erros: {}, valores, mensagem: "Essa vaga não existe mais." };
  }

  guardarCandidatura({
    ...analise.data,
    id: crypto.randomUUID(),
    enviadaEm: new Date().toISOString(),
  });

  // Nenhum revalidate aqui: nenhuma tela pública mostra candidatura. Sim,
  // de propósito — revalidar "por garantia" é jogar fora cache que ninguém
  // pediu para jogar.
  return { ok: true, erros: {}, valores: {}, mensagem: "Candidatura enviada!" };
}
