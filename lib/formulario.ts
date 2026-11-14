import type { ZodError } from "zod";

/**
 * Os dois ajudantes que toda ação usa (aula 05). Uma ação tem sempre a mesma
 * forma — valida, grava, avisa o cache, devolve estado —, então o que é comum
 * mora aqui, e cada ação fica com quatro linhas de miolo.
 */

// O Zod devolve uma LISTA de problemas, e a tela quer UM por campo.
export function porCampo(erro: ZodError): Record<string, string> {
  const erros: Record<string, string> = {};

  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "_");

    // A PRIMEIRA mensagem de cada campo, e só ela. Três frases empilhadas
    // embaixo do mesmo input não ajudam ninguém a consertar nada.
    if (!erros[campo]) erros[campo] = problema.message;
  }

  return erros;
}

// Devolve o que a pessoa digitou, para o formulário voltar preenchido. Um
// formulário longo recusado e devolvido em branco faz qualquer um desistir.
export function valoresDe(dados: FormData): Record<string, string> {
  const valores: Record<string, string> = {};

  for (const [chave, valor] of dados.entries()) {
    // FormData também carrega File, e chaves internas do React ($ACTION_…).
    // Só texto de campo nosso volta para a tela.
    if (typeof valor === "string" && !chave.startsWith("$")) valores[chave] = valor;
  }

  return valores;
}
