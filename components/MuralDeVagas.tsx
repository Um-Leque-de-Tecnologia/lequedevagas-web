"use client";

import { useState } from "react";
import Filtros from "./Filtros";
import CardDeVaga from "./CardDeVaga";
import type { Vaga } from "@/lib/tipos";

/**
 * O mural é igual para todo mundo, e por isso a página dele é pré-gerada.
 * As arquivadas já chegam fora da lista: quem as tira é a consulta, no
 * lib/api.ts (aula 06) — componente só mostra.
 */
export default function MuralDeVagas({ vagas }: { vagas: Vaga[] }) {
  // O estado mora AQUI, no pai comum dos filtros e da lista.
  const [busca, setBusca] = useState("");
  const [area, setArea] = useState("Todas");

  // Estado derivado: recalculado a cada renderização, nunca guardado.
  const areas = ["Todas", ...new Set(vagas.map((v) => v.area))];

  const visiveis = vagas.filter((vaga) => {
    const termo = busca.toLowerCase();
    // tudo minúsculo dos dois lados: quem busca "React" acha "react"
    const bateBusca =
      vaga.titulo.toLowerCase().includes(termo) ||
      vaga.empresa.toLowerCase().includes(termo);
    const bateArea = area === "Todas" || vaga.area === area;
    return bateBusca && bateArea;
  });

  const aceitamIniciante = visiveis.filter((v) => v.aceitaIniciante).length;

  return (
    <section>
      {/* O dado desce por prop (busca, area) e o aviso sobe por função. */}
      <Filtros
        busca={busca}
        aoMudarBusca={setBusca}
        area={area}
        aoMudarArea={setArea}
        areas={areas}
      />

      {/* aria-live="polite": quando um chip ou a busca muda a conta, o leitor
          de tela lê a frase nova sozinho — sem tirar a pessoa de onde está. */}
      <p className="text-sm text-suave" aria-live="polite">
        <strong>{visiveis.length}</strong> de {vagas.length} vagas ·{" "}
        <strong>{aceitamIniciante}</strong> aceitam quem está começando
      </p>

      {visiveis.length === 0 ? (
        <p>Nenhuma vaga com esse filtro. Tente outra palavra.</p>
      ) : (
        // Uma coluna em qualquer tela; duas a partir de 640px (sm:).
        <ul className="grid gap-3 sm:grid-cols-2">
          {visiveis.map((vaga) => (
            <CardDeVaga key={vaga.id} vaga={vaga} />
          ))}
        </ul>
      )}
    </section>
  );
}
