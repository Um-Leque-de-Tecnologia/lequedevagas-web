import type { Metadata } from "next";
import { listarEmpresas } from "@/lib/api";
import FormularioDeVaga from "./formulario";

export const metadata: Metadata = { title: "Publicar vaga · Leque de Vagas" };

/**
 * A página continua Server Component, e continua async: quem busca as
 * empresas para o <select> é ela. O cliente recebe a lista pronta —
 * exatamente a divisão da aula 03, sem uma linha de novidade.
 */
export default async function PublicarVaga() {
  const empresas = await listarEmpresas();

  return (
    <section>
      <h1>Publicar uma vaga</h1>
      <FormularioDeVaga empresas={empresas} />
    </section>
  );
}
