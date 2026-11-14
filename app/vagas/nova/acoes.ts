"use server"; // PRIMEIRA linha do arquivo. Antes de qualquer import.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buscarEmpresa, guardarVaga } from "@/lib/api";
import { EsquemaDaVaga } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import { podePublicar } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";
import type { Estado, Vaga } from "@/lib/tipos";

/**
 * Publicar uma vaga (aula 05, frente 1 → aula 06 → aula 07).
 * A ordem das linhas é o conteúdo.
 */
export async function criarVaga(estadoAnterior: Estado, dados: FormData): Promise<Estado> {
  const valores = valoresDe(dados);

  /* 0. QUEM ESTÁ CHAMANDO? (aula 07) Antes de validar um campo sequer. A
        tela que mandou este POST pode ter sido desenhada para outra pessoa —
        ou nem ter existido. O que vale é o cookie que chegou AGORA. */
  const quem = await usuarioAtual();
  if (!podePublicar(quem)) {
    return {
      ok: false,
      erros: {},
      valores,
      mensagem: "Só quem publica por uma empresa pode abrir vaga.",
    };
  }

  // 1. DESCONFIE. Este POST pode ter sido montado na mão, sem HTML nenhum.
  const analise = EsquemaDaVaga.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  /* 2. POR QUAL EMPRESA? Pela da SESSÃO (aula 07). O formulário não escolhe
        mais — e o podePublicar lá em cima já garantiu que quem.empresaSlug
        é texto. Um campo empresaSlug enfiado no POST é ignorado. */
  const empresa = await buscarEmpresa(quem.empresaSlug);
  if (!empresa) {
    return { ok: false, erros: {}, valores, mensagem: "Sua empresa não está cadastrada." };
  }

  /* 3. FAÇA O TRABALHO. O id nasce AQUI, no servidor — nunca vindo do
        formulário: um id de fora deixaria quem manda o POST escolher
        sobrescrever a vaga de outra pessoa. E o dono é quem está na sessão. */
  const vaga: Vaga = {
    ...analise.data,
    id: crypto.randomUUID(),
    empresa: empresa.nome,
    empresaSlug: empresa.slug,
  };
  await guardarVaga(vaga, quem.id);

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
