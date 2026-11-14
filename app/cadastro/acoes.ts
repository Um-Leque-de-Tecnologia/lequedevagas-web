"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { emailJaTemConta, guardarPessoa } from "@/lib/api";
import { EsquemaDoCadastro } from "@/lib/esquemas";
import { porCampo, valoresDe } from "@/lib/formulario";
import type { Estado } from "@/lib/tipos";

/** Criar conta (aula 07, frente 3). Qualquer pessoa pode — sempre como candidata. */
export async function cadastrar(estadoAnterior: Estado, dados: FormData): Promise<Estado> {
  const valores = valoresDe(dados);
  delete valores.senha; // a senha nunca volta para a tela

  const analise = EsquemaDoCadastro.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return { ok: false, erros: porCampo(analise.error), valores };
  }

  const { nome, email, senha } = analise.data;

  /* A mensagem certa, embaixo do campo certo. É CONVENIÊNCIA: a tranca é o
     @unique do esquema, que recusa o segundo e-mail igual mesmo que duas
     pessoas cheguem no mesmo segundo. O mesmo par da aula: tela e tranca. */
  if (await emailJaTemConta(email)) {
    return { ok: false, erros: { email: "Esse e-mail já tem conta. Entre com ele." }, valores };
  }

  await guardarPessoa({
    nome,
    email,
    // hash, nunca a senha. O 10 é o custo: quanto maior, mais lento para
    // quem tenta adivinhar — e para o seu servidor também.
    senhaHash: await bcrypt.hash(senha, 10),
    // O PAPEL NÃO VEM DO FORMULÁRIO. Um campo papel=empresa enfiado pelo
    // DevTools nem passa pelo esquema.
    papel: "candidata",
  });

  // Cadastrou, já entra. O signIn lança o redirect para /painel, e ele sobe:
  // não há try/catch em volta.
  await signIn("credentials", { email, senha, redirectTo: "/painel" });
  return { ok: true, erros: {}, valores };
}
