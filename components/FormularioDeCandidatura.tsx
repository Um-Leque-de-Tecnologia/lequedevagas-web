"use client";

import { useActionState } from "react";
import { enviarCandidatura } from "@/app/vagas/[id]/acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { ESTADO_INICIAL } from "@/lib/tipos";
import type { Vaga } from "@/lib/tipos";

const HABILIDADES = ["HTML", "CSS", "JavaScript", "React", "SQL"];

/**
 * A candidatura, depois de três aulas:
 *
 * - aula 03: useState em tudo, e o dado morria nesta aba;
 * - aula 05: `action` em vez de `onSubmit` — o dado vai para o servidor, e o
 *   formulário funciona até com o JavaScript desligado;
 * - aula 07: nome e e-mail saíram — vêm da CONTA de quem está na sessão.
 */
export default function FormularioDeCandidatura({ vaga }: { vaga: Vaga }) {
  const [estado, acaoDoForm] = useActionState(enviarCandidatura, ESTADO_INICIAL);

  // A tela de sucesso da aula 03 continua existindo. O que mudou é quem a
  // liga: era um useState local, agora é o `ok` que veio do servidor.
  if (estado.ok) {
    return (
      <div className="ok" role="status">
        <h3>Candidatura enviada</h3>
        <p>A {vaga.empresa} vai receber o seu contato.</p>
      </div>
    );
  }

  return (
    <form action={acaoDoForm} className="formulario" noValidate>
      {/* Campo escondido: a ação precisa saber de QUAL vaga é. Trocá-lo só
          faz a pessoa se candidatar a outra vaga pública — coisa que ela já
          podia fazer clicando. QUEM se candidata vem da sessão, nunca daqui. */}
      <input type="hidden" name="vagaId" value={vaga.id} />
      <p className="numeros">Você se candidata com o nome e o e-mail da sua conta.</p>

      {/* A LISTA. Vários checkboxes com o MESMO name — do outro lado,
          dados.getAll("habilidades"). É a forma que funciona sem JS. */}
      <fieldset>
        <legend>Habilidades</legend>
        {HABILIDADES.map((h) => (
          <label key={h} className="caixa">
            <input
              type="checkbox"
              name="habilidades"
              value={h}
              defaultChecked={estado.valores.habilidades?.split(",").includes(h)}
            />
            {h}
          </label>
        ))}
      </fieldset>
      {estado.erros.habilidades && <p className="erro">{estado.erros.habilidades}</p>}

      <BotaoDeEnviar>Enviar candidatura</BotaoDeEnviar>
      {estado.mensagem && (
        <p role="alert" className="erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
