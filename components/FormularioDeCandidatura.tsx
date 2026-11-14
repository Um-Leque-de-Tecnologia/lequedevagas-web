"use client";

import { useActionState } from "react";
import { enviarCandidatura } from "@/app/vagas/[id]/acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { ESTADO_INICIAL } from "@/lib/tipos";
import type { Vaga } from "@/lib/tipos";

const HABILIDADES = ["HTML", "CSS", "JavaScript", "React", "SQL"];

/**
 * A candidatura, de `onSubmit` para `action` (aula 05).
 *
 * Na aula 03 eram cinco useState, um preventDefault e um "enviada" que só
 * existia nesta aba. Agora o dado vai para o servidor, e o formulário
 * funciona até com o JavaScript desligado.
 */
export default function FormularioDeCandidatura({ vaga }: { vaga: Vaga }) {
  const [estado, acaoDoForm] = useActionState(enviarCandidatura, ESTADO_INICIAL);
  const { valores, erros } = estado;

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
      {/* Campo escondido: a ação precisa saber de QUAL vaga é. Aqui um hidden
          serve — trocá-lo só faz a pessoa se candidatar a outra vaga pública,
          que é uma coisa que ela já podia fazer clicando. */}
      <input type="hidden" name="vagaId" value={vaga.id} />

      {/* Sem value, sem onChange, sem useState: o campo voltou a ser NÃO
          CONTROLADO, e é o <form> que sabe o que tem dentro dele. */}
      <label>
        Nome completo
        <input name="nome" autoComplete="name" defaultValue={valores.nome} />
      </label>
      {erros.nome && <p className="erro">{erros.nome}</p>}

      <label>
        E-mail
        <input name="email" type="email" autoComplete="email" defaultValue={valores.email} />
      </label>
      {erros.email && <p className="erro">{erros.email}</p>}

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
              defaultChecked={valores.habilidades?.split(",").includes(h)}
            />
            {h}
          </label>
        ))}
      </fieldset>
      {erros.habilidades && <p className="erro">{erros.habilidades}</p>}

      <BotaoDeEnviar>Enviar candidatura</BotaoDeEnviar>
      {estado.mensagem && (
        <p role="alert" className="erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
