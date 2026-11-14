// FRENTE 1 · sem estado e SEM "use client". Ele só desenha o que recebe.
import { Vaga } from "@/lib/tipos";
import Link from "next/link";

/* Aula 07, frente 4: o botão Arquivar SAIU daqui. Este cartão aparece no
   mural, e o mural é igual para todo mundo — é por isso que ele pode ser
   pré-gerado (○). Um botão que só o dono pode usar mora no /painel. */
export default function CardDeVaga({ vaga }: { vaga: Vaga }) {
  return (
    <li>
      <Link href={`/vagas/${vaga.id}`}>
        {vaga.titulo}
        <span>
          {vaga.empresa} · {vaga.area} · {vaga.senioridade} · {vaga.local}
        </span>
      </Link>
      {vaga.aceitaIniciante && <span className="selo">aceita iniciante</span>}
    </li>
  );
}
