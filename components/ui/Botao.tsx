import type { ComponentProps } from "react";

/* O design system do Leque de Vagas começa aqui (aula 08): um botão, três
   jeitos. Quem usa escolhe a VARIANTE, não as classes — e no dia em que o
   botão mudar, ele muda neste arquivo só. */
const VARIANTES = {
  primario: "bg-principal text-fundo hover:opacity-90",
  secundario: "border border-borda-campo hover:bg-superficie",
  perigo: "border border-erro text-erro hover:bg-erro hover:text-fundo",
};

type Props = ComponentProps<"button"> & {
  variante?: keyof typeof VARIANTES;
};

/* O className de quem usa serve para margem e posição, NUNCA para mudar a
   cara: <Botao className="px-6"> fica com px-4 e px-6, e quem ganha é a ordem
   das regras no CSS, não a da string. Mudar a cara é variante nova. */
export default function Botao({
  variante = "primario",
  type = "button",
  className = "",
  ...props
}: Props) {
  return (
    <button
      // type="button" por padrão: dentro de um <form>, botão sem type envia
      // o formulário. Quem envia de propósito pede type="submit".
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...props}
    />
  );
}
