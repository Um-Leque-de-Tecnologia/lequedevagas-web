// FRENTE 1 · sem estado e SEM "use client". Ele só desenha o que recebe.
import { Vaga } from "@/lib/tipos";
import Link from "next/link";
import { arquivar } from "@/app/vagas/acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";

/* Aula 05, frente 4: o botão Arquivar. Um <form> com uma Server Action no
   action= não precisa de "use client" — quem precisa é o BotaoDeEnviar, e
   ele já tem a diretiva no arquivo dele. */
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

      {/* Um <form> por cartão. O id vai num hidden — e AQUI ele pode ir num
          hidden mesmo: arquivar é uma ação sobre uma vaga pública, e o dia
          em que "só o dono arquiva" for regra é a aula 07. */}
      <form action={arquivar} className="arquivar">
        <input type="hidden" name="id" value={vaga.id} />
        <BotaoDeEnviar enviando="Arquivando…">Arquivar</BotaoDeEnviar>
      </form>
    </li>
  );
}
