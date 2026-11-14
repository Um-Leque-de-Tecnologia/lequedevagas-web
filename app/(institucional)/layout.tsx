/* Route group: o nome entre parênteses NÃO entra na URL. Ele existe só para
   dar um layout a um conjunto de páginas — aqui, /termos e /privacidade. */
export default function LayoutInstitucional({
  children,
}: {
  children: React.ReactNode;
}) {
  // 60 caracteres por linha: o texto longo fica fácil de ler.
  return <article className="max-w-[60ch]">{children}</article>;
}
