// Sem <html> e sem <body>: só o layout da RAIZ tem essas duas tags.
// Layout aninhado devolve só um pedaço de tela.
export default function LayoutVagas({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Era a .secao: #a1a1aa fixo, 2,56 : 1 sobre o branco do tema claro.
          Com text-suave, o mesmo cinza do escuro — e um mais escuro no claro. */}
      <p className="mt-0 text-xs font-medium tracking-wider text-suave uppercase">
        Vagas abertas
      </p>
      {children}
    </section>
  );
}
