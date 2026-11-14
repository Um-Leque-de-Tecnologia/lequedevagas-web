import { useId, type ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  rotulo: string;
  erro?: string;
};

/* O campo inteiro (aula 08): rótulo, entrada e erro, já ligados entre si.
   Quem liga é o id — e quem sorteia o id é o React, para dois formulários na
   mesma página não disputarem o mesmo nome. */
export default function Campo({ rotulo, erro, className = "", ...props }: Props) {
  const id = useId();
  const idDoErro = `${id}-erro`;

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm text-suave">
        {rotulo}
      </label>
      <input
        id={id}
        // O leitor de tela diz "inválido" e, em seguida, lê a frase do erro.
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idDoErro : undefined}
        // A borda vermelha sai do MESMO atributo que o leitor de tela lê.
        className={`rounded-lg border border-borda-campo bg-superficie px-3 py-2.5 aria-[invalid=true]:border-erro ${className}`}
        {...props}
      />
      {erro && (
        <p id={idDoErro} className="m-0 text-sm text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
