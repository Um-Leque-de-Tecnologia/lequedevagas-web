"use client";

import { useFormStatus } from "react-dom"; // react-DOM. O useActionState é do react.

/**
 * O botão de todo <form> com Server Action (aula 05, frente 3).
 *
 * A REGRA QUE FAZ ESTE HOOK MENTIR: o useFormStatus lê o <form> que está
 * ACIMA dele na árvore. Chamado no mesmo componente que RENDERIZA o <form>,
 * devolve pending: false para sempre — sem erro, sem aviso. Por isso este
 * arquivo existe: o botão é filho, e é reutilizável de graça.
 */
export default function BotaoDeEnviar({
  children,
  enviando = "Enviando…",
}: {
  children: React.ReactNode;
  enviando?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="botao" disabled={pending}>
      {pending ? enviando : children}
    </button>
  );
}
