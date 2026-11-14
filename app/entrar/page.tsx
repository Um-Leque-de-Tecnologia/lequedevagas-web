import type { Metadata } from "next";
import Link from "next/link";
import FormularioDeEntrada from "./formulario";

export const metadata: Metadata = { title: "Entrar · Leque de Vagas" };

// Igual para todo mundo, então continua ○: quem lê o cookie é a ação.
export default function Entrar() {
  return (
    <section>
      <h1>Entrar</h1>
      <FormularioDeEntrada />
      <p>
        Ainda não tem conta? <Link href="/cadastro">Crie a sua</Link>.
      </p>
    </section>
  );
}
