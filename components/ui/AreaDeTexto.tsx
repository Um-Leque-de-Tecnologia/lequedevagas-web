import { useId, type ComponentProps } from "react";

type Props = ComponentProps<"textarea"> & {
  rotulo: string;
  erro?: string;
};

/* O irmão do Campo para texto longo (aula 08, frente 2). Mesmo rótulo, mesmo
   erro, mesma ligação pelo id — só a entrada é um <textarea>. Se um dia o
   Campo mudar o jeito de mostrar erro, este muda junto, no mesmo commit. */
export default function AreaDeTexto({ rotulo, erro, className = "", ...props }: Props) {
  const id = useId();
  const idDoErro = `${id}-erro`;

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm text-suave">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={5}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idDoErro : undefined}
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
