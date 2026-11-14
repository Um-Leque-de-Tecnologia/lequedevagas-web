"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Empresa, Vaga } from "@/lib/tipos";

// A ordem das abas mora numa lista: é ela que as setas percorrem.
const ABAS = ["sobre", "vagas"] as const;
type Aba = (typeof ABAS)[number];

/**
 * Abas de verdade, no padrão do WAI-ARIA (aula 08, frente 2): tablist, tab e
 * tabpanel; ← e → trocam de aba e levam o foco junto; só a aba aberta fica
 * no caminho do Tab.
 *
 * O estado continua sendo TEXTO, como na aula 03 — com booleano, a terceira
 * aba (que um dia vem) não caberia.
 */
export default function AbasDaEmpresa({
  empresa,
  vagas,
}: {
  empresa: Empresa;
  vagas: Vaga[];
}) {
  const [aba, setAba] = useState<Aba>("sobre");
  const id = useId();
  // As setas mudam o FOCO, e não só o estado: para isso é preciso alcançar o
  // botão de cada aba. Um ref por aba, guardados pelo nome.
  const botoes = useRef<Record<Aba, HTMLButtonElement | null>>({ sobre: null, vagas: null });
  const rotulos: Record<Aba, string> = { sobre: "Sobre", vagas: `Vagas (${vagas.length})` };

  function aoTeclar(evento: KeyboardEvent) {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    evento.preventDefault();
    const passo = evento.key === "ArrowRight" ? 1 : -1;
    // O % dá a volta: depois da última, a primeira.
    const proxima = ABAS[(ABAS.indexOf(aba) + passo + ABAS.length) % ABAS.length];
    setAba(proxima);
    botoes.current[proxima]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={`Sobre a ${empresa.nome}`}
        className="my-4 flex gap-2"
        onKeyDown={aoTeclar}
      >
        {ABAS.map((nome) => (
          <button
            key={nome}
            ref={(botao) => {
              botoes.current[nome] = botao;
            }}
            type="button"
            role="tab"
            id={`${id}-${nome}`}
            aria-selected={aba === nome}
            aria-controls={`${id}-painel`}
            // Só a aba aberta fica no caminho do Tab. A outra, as setas acham.
            tabIndex={aba === nome ? 0 : -1}
            onClick={() => setAba(nome)}
            // A aba aberta se pinta pelo aria-selected: a classe "ativa" não
            // existe mais, e o que o olho vê é o que o leitor de tela diz.
            className="rounded-lg border border-borda px-3.5 py-2 text-suave aria-selected:border-principal aria-selected:font-semibold aria-selected:text-principal"
          >
            {rotulos[nome]}
          </button>
        ))}
      </div>

      {/* Um painel só, para as duas abas: o conteúdo troca dentro dele, e o
          aria-labelledby aponta para a aba aberta. */}
      <div role="tabpanel" id={`${id}-painel`} aria-labelledby={`${id}-${aba}`} tabIndex={0}>
        {aba === "sobre" ? (
          <>
            <p>{empresa.sobre}</p>
            <p>
              <a href={empresa.site} target="_blank" rel="noopener noreferrer">
                {empresa.site}
              </a>
            </p>
          </>
        ) : vagas.length === 0 ? (
          // Lista vazia é um estado da tela, não um esquecimento.
          <p>Esta empresa não tem vaga aberta agora.</p>
        ) : (
          <ul className="grid gap-2">
            {vagas.map((vaga) => (
              <li key={vaga.id}>
                <Link href={`/vagas/${vaga.id}`}>{vaga.titulo}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
