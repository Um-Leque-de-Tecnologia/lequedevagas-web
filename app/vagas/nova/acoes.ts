"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buscarEmpresa, guardarVaga } from "@/lib/api";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado, Vaga } from "@/lib/tipos";

/**
 * Publicar uma vaga (aula 05, frente 1 → aula 06). A ordem das linhas é o
 * conteúdo.
 *
 * DOIS parâmetros: com useActionState o Next chama a ação com o estado
 * anterior na frente. Quem declara só (dados: FormData) recebe o ESTADO no
 * lugar do formulário, e todo campo vira undefined sem erro nenhum.
 */
export async function criarVaga(estadoAnterior: Estado, dados: FormData): Promise<Estado> {
  const valores = valoresDe(dados);

  // 1. DESCONFIE. Primeira instrução da ação, sempre. Nada do que chegou
  //    aqui passou pelo seu formulário: este POST pode ter sido montado na
  //    mão, sem HTML nenhum no meio.
  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  // 2. AS REGRAS QUE O ZOD NÃO SABE. O esquema garante que o slug é um texto
  //    não vazio; ele não tem como saber se essa empresa existe.
  const empresa = await buscarEmpresa(analise.data.empresaSlug);
  if (!empresa) {
    return { ok: false, erros: { empresaSlug: "Essa empresa não está cadastrada." }, valores };
  }

  /* 3. FAÇA O TRABALHO. O id nasce AQUI, no servidor — nunca vindo do
        formulário: um id de fora deixaria quem manda o POST escolher
        sobrescrever a vaga de outra pessoa. */
  const vaga: Vaga = {
    ...analise.data,
    id: crypto.randomUUID(),
    empresa: empresa.nome,
  };
  await guardarVaga(vaga); // aula 06: virou banco, e ganhou o await

  /* 4. AVISE O CACHE. Toda rota que mostra a lista ou a conta de vagas —
        senão a vaga existe e a listagem não mostra, porque na aula 04 vocês
        mandaram, por escrito, que ela não fosse buscar antes de 60 segundos. */
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/empresas");
  revalidatePath(`/empresas/${empresa.slug}`);

  /* 5. SAIA. O redirect é a ÚLTIMA linha, e fora de qualquer try/catch — ele
        funciona lançando um erro de controle que o Next intercepta, e um
        catch em volta engole o redirecionamento em silêncio. */
  redirect(`/vagas/${vaga.id}`);
}
