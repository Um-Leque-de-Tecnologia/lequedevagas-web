"use client"; // useActionState é hook: exige cliente

import { useActionState } from "react"; // REACT (era react-dom antes do 19)
import { criarVaga } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { ESTADO_INICIAL } from "@/lib/tipos";
import type { Empresa } from "@/lib/tipos";

/**
 * Os campos são NÃO CONTROLADOS: `defaultValue`, e não `value` — com Server
 * Actions é o <form> que sabe o que tem dentro dele. `value` sem `onChange`
 * trava o campo. O defaultValue vem do estado, para uma recusa devolver o
 * que a pessoa tinha digitado.
 */
export default function FormularioDeVaga({ empresas }: { empresas: Empresa[] }) {
  // estado     → o que a ação devolveu (erros, valores, mensagem)
  // acaoDoForm → é ISTO que vai no action=, e não a criarVaga
  const [estado, acaoDoForm] = useActionState(criarVaga, ESTADO_INICIAL);
  const { valores, erros } = estado;

  return (
    // noValidate: quem valida é a ação, em português e embaixo do campo.
    <form action={acaoDoForm} className="formulario" noValidate>
      <label>
        Título
        <input name="titulo" defaultValue={valores.titulo} />
      </label>
      {erros.titulo && <p className="erro">{erros.titulo}</p>}

      <label>
        Empresa
        {/* <select>, e não campo de texto: assim ninguém digita um slug que
            não existe. A checagem do passo 2 da ação continua necessária —
            mas agora ela é a rede, não a porta. */}
        <select name="empresaSlug" defaultValue={valores.empresaSlug ?? ""}>
          <option value="">Escolha…</option>
          {empresas.map((e) => (
            <option key={e.slug} value={e.slug}>
              {e.nome}
            </option>
          ))}
        </select>
      </label>
      {erros.empresaSlug && <p className="erro">{erros.empresaSlug}</p>}

      <label>
        Área
        <input name="area" defaultValue={valores.area} />
      </label>
      {erros.area && <p className="erro">{erros.area}</p>}

      <label>
        Senioridade
        <input name="senioridade" defaultValue={valores.senioridade} />
      </label>
      {erros.senioridade && <p className="erro">{erros.senioridade}</p>}

      <label>
        Local
        <input name="local" defaultValue={valores.local} />
      </label>
      {erros.local && <p className="erro">{erros.local}</p>}

      <label>
        Descrição
        <textarea name="descricao" rows={6} defaultValue={valores.descricao} />
      </label>
      {erros.descricao && <p className="erro">{erros.descricao}</p>}

      <label className="caixa">
        <input
          type="checkbox"
          name="aceitaIniciante"
          defaultChecked={valores.aceitaIniciante === "on"}
        />
        Aceita quem está começando
      </label>

      <BotaoDeEnviar>Publicar vaga</BotaoDeEnviar>
    </form>
  );
}
