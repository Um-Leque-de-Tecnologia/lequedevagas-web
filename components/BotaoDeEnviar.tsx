"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom"; // react-DOM. O useActionState é do react.
import Botao from "@/components/ui/Botao";

/**
 * O botão de todo <form> com Server Action (aula 05, frente 3).
 *
 * A REGRA QUE FAZ ESTE HOOK MENTIR: o useFormStatus lê o <form> que está
 * ACIMA dele na árvore. Chamado no mesmo componente que RENDERIZA o <form>,
 * devolve pending: false para sempre — sem erro, sem aviso. Por isso este
 * arquivo existe: o botão é filho, e é reutilizável de graça.
 *
 * Aula 08: a cara vem do Botao do design system, e a variante passa direto —
 * o "Arquivar" do painel é perigo, o "Publicar" continua primário.
 */
export default function BotaoDeEnviar({
  children,
  enviando = "Enviando…",
  variante,
}: {
  children: React.ReactNode;
  enviando?: string;
  variante?: ComponentProps<typeof Botao>["variante"];
}) {
  const { pending } = useFormStatus();

  return (
    <Botao type="submit" variante={variante} disabled={pending}>
      {pending ? enviando : children}
    </Botao>
  );
}
