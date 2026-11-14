import type { Metadata } from "next";

// A metadata da página sobrescreve a do layout.
export const metadata: Metadata = {
  title: "Sobre · Leque de Vagas",
};

export default function Sobre() {
  return (
    <section>
      <h1>Sobre o projeto</h1>
      <p>
        Este é o projeto de referência do curso Introdução ao Next.js. Ele
        cresce junto com as aulas: a cada semana entra o recurso que foi
        ensinado, e nada além dele.
      </p>
      <p>
        As vagas e as empresas publicadas pelo time moram em{" "}
        <code>dados/vagas.json</code> e <code>dados/empresas.json</code>,
        buscados por rede desde a aula 04. O que se escreve pelo site — vagas
        novas, perfis editados, candidaturas, contas — mora num banco de dados
        desde a aula 06. Um único arquivo conhece as duas fontes,{" "}
        <code>lib/api.ts</code>: nenhuma página escreve <code>fetch</code> nem
        fala com o banco.
      </p>
      <p>
        Toda escrita é uma Server Action que valida com Zod (aula 05) e
        pergunta quem está chamando antes de fazer qualquer coisa (aula 07). E
        o estilo mora junto de cada componente, com cores de nome de função que
        valem nos temas claro e escuro (aula 08).
      </p>
    </section>
  );
}
