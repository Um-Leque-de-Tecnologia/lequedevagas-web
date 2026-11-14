"use client";
// ↑ Primeira linha do arquivo, antes de qualquer import.
//   Sem ela não existe useState, e o onClick lá embaixo não tem quem escute.

import { useId, useState } from "react";
import Botao from "@/components/ui/Botao";

// Fora do componente de propósito: é uma constante do arquivo.
const LIMITE = 180;

export default function DescricaoDaVaga({ texto }: { texto: string }) {
  // A memória do componente. Um booleano: aberta ou fechada.
  const [aberta, setAberta] = useState(false);
  // O botão precisa apontar para o parágrafo que ele abre: um id, sorteado
  // pelo React, como no Campo (aula 08).
  const idDoTexto = useId();

  // Estado derivado: as duas linhas abaixo saem do texto e do estado.
  // Nenhuma vira useState. Se dá para calcular, não guarde.
  const cabeInteira = texto.length <= LIMITE;
  const visivel = aberta || cabeInteira ? texto : texto.slice(0, LIMITE) + "…";

  return (
    <div>
      <p id={idDoTexto}>{visivel}</p>
      {!cabeInteira && (
        <Botao
          variante="secundario"
          // aria-expanded: o leitor de tela diz "recolhido" ou "expandido".
          // aria-controls: diz qual pedaço da página este botão abre.
          aria-expanded={aberta}
          aria-controls={idDoTexto}
          // setAberta(!aberta) — nunca "aberta = !aberta".
          onClick={() => setAberta(!aberta)}
          // "group" não muda a cara do botão: só deixa a seta perguntar
          // pelo aria-expanded dele.
          className="group"
        >
          {aberta ? "ver menos" : "ver mais"}
          {/* A seta é desenho, não texto: aria-hidden tira ela do leitor de
              tela, e quem gira é o atributo — o mesmo que o leitor lê. Ela
              gira porque é item do flex do Botao: rotate não vale em inline. */}
          <span
            aria-hidden="true"
            className="text-xs motion-safe:transition-transform group-aria-expanded:rotate-180"
          >
            ▼
          </span>
        </Botao>
      )}
    </div>
  );
}
