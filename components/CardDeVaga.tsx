import Link from "next/link";
import type { Vaga } from "@/lib/tipos";

/**
 * Sem estado e SEM "use client": ele só desenha o que recebe.
 *
 * Aula 07, frente 4: o botão Arquivar SAIU daqui. Este cartão aparece no
 * mural, e o mural é igual para todo mundo — é por isso que ele pode ser
 * pré-gerado (○). Um botão que só o dono pode usar mora no /painel.
 *
 * Aula 08: as classes moram no componente, e as cores são tokens — o
 * text-suave passa nos dois temas; o text-zinc-400 de antes reprovava no claro.
 */
export default function CardDeVaga({ vaga }: { vaga: Vaga }) {
  return (
    <li className="rounded-xl border border-borda transition-colors hover:border-borda-campo">
      <Link href={`/vagas/${vaga.id}`} className="block px-4 py-3.5 no-underline">
        <span className="font-semibold">{vaga.titulo}</span>
        <span className="block text-sm text-suave">
          {vaga.empresa} · {vaga.area} · {vaga.senioridade} · {vaga.local}
        </span>
      </Link>
      {vaga.aceitaIniciante && (
        <span className="mb-3.5 ml-4 inline-block rounded-full bg-sucesso-fundo px-2.5 py-1 text-xs font-medium text-sucesso">
          aceita iniciante
        </span>
      )}
    </li>
  );
}
