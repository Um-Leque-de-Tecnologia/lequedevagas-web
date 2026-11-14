import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarEmpresa } from "@/lib/api";
import FormularioDaEmpresa from "./formulario";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Editar perfil · Leque de Vagas" };

/**
 * Hoje qualquer pessoa que chegar aqui edita qualquer empresa. Saber QUEM
 * está editando é a aula 07 — com sessão, conferida dentro da ação.
 */
export default async function EditarEmpresa({ params }: Props) {
  const { slug } = await params;
  const empresa = await buscarEmpresa(slug);

  if (!empresa) notFound();

  return (
    <section>
      <h1>Editar {empresa.nome}</h1>
      <FormularioDaEmpresa empresa={empresa} />
      <p>
        <Link href={`/empresas/${empresa.slug}`}>← ver o perfil público</Link>
      </p>
    </section>
  );
}
