import type { Metadata } from "next";
import Link from "next/link";
import FormularioDeCadastro from "./formulario";

export const metadata: Metadata = { title: "Criar conta · Leque de Vagas" };

export default function Cadastro() {
  return (
    <section>
      <h1>Criar conta</h1>
      <p className="text-suave">
        A conta é de candidata: é com ela que você se candidata às vagas. Quem
        publica por uma empresa recebe a conta do time do Leque de Vagas.
      </p>
      <FormularioDeCadastro />
      <p>
        Já tem conta? <Link href="/entrar">Entre</Link>.
      </p>
    </section>
  );
}
