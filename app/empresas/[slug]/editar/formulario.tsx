"use client";

import { useActionState } from "react";
import { salvarEmpresa } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { ESTADO_INICIAL } from "@/lib/tipos";
import type { Empresa } from "@/lib/tipos";

export default function FormularioDaEmpresa({ empresa }: { empresa: Empresa }) {
  // .bind prende o slug como PRIMEIRO argumento da ação. Ele viaja junto,
  // mas não como campo do formulário — não dá para trocá-lo pelo HTML.
  const acaoComSlug = salvarEmpresa.bind(null, empresa.slug);
  const [estado, acaoDoForm] = useActionState(acaoComSlug, ESTADO_INICIAL);
  const { valores, erros } = estado;

  return (
    <form action={acaoDoForm} className="formulario" noValidate>
      {/* O ?? garante que o primeiro carregamento mostre o valor atual, e
          uma recusa devolva o que a pessoa tinha acabado de digitar. O slug
          não aparece: ele não é editável. */}
      <label>
        Nome
        <input name="nome" defaultValue={valores.nome ?? empresa.nome} />
      </label>
      {erros.nome && <p className="erro">{erros.nome}</p>}

      <label>
        Sobre
        <textarea name="sobre" rows={6} defaultValue={valores.sobre ?? empresa.sobre} />
      </label>
      {erros.sobre && <p className="erro">{erros.sobre}</p>}

      <label>
        Site
        <input name="site" type="url" defaultValue={valores.site ?? empresa.site} />
      </label>
      {erros.site && <p className="erro">{erros.site}</p>}

      <BotaoDeEnviar enviando="Salvando…">Salvar</BotaoDeEnviar>

      {/* O recado geral. role="status" faz o leitor de tela anunciar a
          mudança — quem não está olhando a tela precisa saber que salvou. */}
      {estado.mensagem && (
        <p role="status" className={estado.ok ? "salvo" : "erro"}>
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
