"use client";

import { useActionState } from "react";
import { cadastrar } from "./acoes";
import BotaoDeEnviar from "@/components/BotaoDeEnviar";
import { ESTADO_INICIAL } from "@/lib/tipos";

export default function FormularioDeCadastro() {
  const [estado, acaoDoForm] = useActionState(cadastrar, ESTADO_INICIAL);
  const { valores, erros } = estado;

  return (
    <form action={acaoDoForm} className="formulario" noValidate>
      {/* O autoComplete diz ao navegador O QUE é cada campo: o celular sugere
          o e-mail, e o gerenciador de senha oferece uma senha forte no
          new-password — e não a senha antiga, como no current-password. */}
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

      <label>
        Senha
        <input name="senha" type="password" autoComplete="new-password" />
      </label>
      {erros.senha && <p className="erro">{erros.senha}</p>}

      <BotaoDeEnviar enviando="Criando…">Criar conta</BotaoDeEnviar>
      {estado.mensagem && (
        <p role="alert" className="erro">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
