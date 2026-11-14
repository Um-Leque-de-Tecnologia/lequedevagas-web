"use client";

import { useActionState } from "react";
import { entrar } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { ESTADO_INICIAL } from "@/lib/tipos";

export default function FormularioDeEntrada() {
  const [estado, acaoDoForm] = useActionState(entrar, ESTADO_INICIAL);
  const { valores, erros } = estado;

  return (
    <form action={acaoDoForm} className="formulario" noValidate>
      {/* O autoComplete diz ao navegador O QUE é cada campo: o gerenciador
          de senha preenche os dois de uma vez. */}
      <label>
        E-mail
        <input name="email" type="email" autoComplete="username" defaultValue={valores.email} />
      </label>
      {erros.email && <p className="erro">{erros.email}</p>}

      {/* A senha NUNCA volta preenchida: ela não está no `valores`. */}
      <label>
        Senha
        <input name="senha" type="password" autoComplete="current-password" />
      </label>
      {erros.senha && <p className="erro">{erros.senha}</p>}

      <BotaoDeEnviar enviando="Entrando…">Entrar</BotaoDeEnviar>
      {estado.mensagem && (
        <p role="alert" className="erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
