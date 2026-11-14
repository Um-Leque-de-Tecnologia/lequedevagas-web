"use client"; // a PRIMEIRA linha do arquivo, antes dos imports

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  // usePathname devolve o endereço atual: "/", "/vagas", "/vagas/1"...
  const caminho = usePathname();
  const ativo = caminho === href;

  return (
    <Link
      href={href}
      // aria-current avisa o leitor de tela qual é a página atual.
      aria-current={ativo ? "page" : undefined}
      // Uma classe só, sem ternário: quem acende o link é o aria-current.
      // O que o leitor de tela ouve e o que o olho vê não têm como discordar.
      className="text-suave no-underline hover:text-principal aria-[current=page]:font-semibold aria-[current=page]:text-principal"
    >
      {children}
    </Link>
  );
}
