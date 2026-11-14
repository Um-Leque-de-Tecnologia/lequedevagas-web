import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarEmpresa } from "@/lib/api";
import { podeEditarEmpresa } from "@/lib/permissoes";
import { usuarioAtual } from "@/lib/sessao";
import FormularioDaEmpresa from "./formulario";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Editar perfil · Leque de Vagas" };

/**
 * Lê a sessão, então é ƒ — e é de uma pessoa só, então tudo bem.
 *
 * O link para cá mora no /painel, e não na página pública da empresa. Mas o
 * endereço existe para quem digitar: esconder o link não é a tranca. A
 * tranca é a ação, que faz a mesma pergunta a cada envio.
 */
export default async function EditarEmpresa({ params }: Props) {
  const { slug } = await params;
  const [empresa, quem] = await Promise.all([buscarEmpresa(slug), usuarioAtual()]);

  if (!empresa) notFound();

  // A tela pergunta a MESMA regra que a ação: conveniência, não tranca.
  if (!podeEditarEmpresa(quem, empresa.slug)) {
    return (
      <section>
        <h1>Editar {empresa.nome}</h1>
        <p>Só quem fala pela {empresa.nome} edita este perfil.</p>
        <p>
          <Link href={`/empresas/${empresa.slug}`}>← voltar para a empresa</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Editar {empresa.nome}</h1>
      <FormularioDaEmpresa empresa={empresa} />
      <p>
        <Link href={`/empresas/${empresa.slug}`}>Ver o perfil público</Link>
        {" · "}
        <Link href="/painel">Voltar para a sua área</Link>
      </p>
    </section>
  );
}
