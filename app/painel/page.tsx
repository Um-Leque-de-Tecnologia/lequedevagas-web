import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioAtual, type Quem } from "@/lib/sessao";
import { buscarEmpresa, listarCandidaturasDe, listarVagasDoAutor } from "@/lib/api";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { sair } from "./acoes";
import { arquivar } from "@/app/vagas/acoes";

export const metadata: Metadata = { title: "Minha área · Leque de Vagas" };

/**
 * A página que é de uma pessoa só — a única do site que lê a sessão para
 * DESENHAR. Ela é ƒ, e isso não custa nada às outras (aula 07, LAB 3).
 */
export default async function Painel() {
  const quem = await usuarioAtual();

  /* O proxy já mandou para /entrar quem não tem crachá. Isto cobre o outro
     caso: crachá válido de alguém que não existe mais no banco. */
  if (!quem) redirect("/entrar");

  return (
    <section>
      <h1>Olá, {quem.nome}</h1>
      {quem.papel === "empresa" ? (
        <PainelDaEmpresa quem={quem} />
      ) : (
        <PainelDaCandidata quem={quem} />
      )}
      <form action={sair} className="sair">
        <BotaoDeEnviar enviando="Saindo…">Sair</BotaoDeEnviar>
      </form>
    </section>
  );
}

/* Frente 2 · o painel de quem publica: as vagas DELA, e não o mural inteiro. */
async function PainelDaEmpresa({ quem }: { quem: Quem }) {
  const [empresa, vagas] = await Promise.all([
    quem.empresaSlug ? buscarEmpresa(quem.empresaSlug) : undefined,
    listarVagasDoAutor(quem.id),
  ]);

  return (
    <>
      <p className="numeros">
        Você publica pela {empresa?.nome ?? quem.empresaSlug} ·{" "}
        <Link href={`/empresas/${quem.empresaSlug}/editar`}>editar o perfil</Link>
        {" · "}
        <Link href="/vagas/nova">publicar uma vaga</Link>
      </p>

      <h2>Suas vagas</h2>
      {vagas.length === 0 ? (
        <p>
          Nenhuma vaga publicada por você. <Link href="/vagas/nova">Publicar a primeira</Link>
        </p>
      ) : (
        <ul className="lista">
          {vagas.map((vaga) => (
            <li key={vaga.id}>
              <Link href={`/vagas/${vaga.id}`}>
                {vaga.titulo}
                {/* Plural é conta, como o número do mural. */}
                <span>
                  {vaga._count.candidaturas === 1
                    ? "1 candidatura"
                    : `${vaga._count.candidaturas} candidaturas`}
                </span>
              </Link>

              {/* Frente 4 · o botão mora AQUI, e não no mural: o mural é
                  igual para todo mundo (○), e o botão é de uma pessoa só. O
                  id vai escondido — ele diz QUAL vaga, nunca SE pode. */}
              <form action={arquivar} className="arquivar">
                <input type="hidden" name="id" value={vaga.id} />
                <BotaoDeEnviar enviando="Arquivando…">Arquivar</BotaoDeEnviar>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* Frente 3 · o painel de quem se candidata: as candidaturas DELA. */
async function PainelDaCandidata({ quem }: { quem: Quem }) {
  const candidaturas = await listarCandidaturasDe(quem.id);

  return (
    <>
      <h2>Suas candidaturas</h2>
      {candidaturas.length === 0 ? (
        <p>
          Nenhuma ainda. <Link href="/vagas">Ver as vagas</Link>
        </p>
      ) : (
        <ul className="lista">
          {candidaturas.map((c) => (
            <li key={c.id}>
              <Link href={`/vagas/${c.vaga.id}`}>
                {c.vaga.titulo}
                <span>
                  {c.vaga.empresa} · enviada em {c.criadaEm.toLocaleDateString("pt-BR")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
