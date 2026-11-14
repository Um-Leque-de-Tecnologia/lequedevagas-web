import Link from "next/link";

// Aparece quando o notFound() é chamado nesta pasta. O cabeçalho e o layout
// de vagas continuam na tela — é a diferença entre este e o 404 da raiz.
// h1, e não h2: este aviso É a página (o axe acusa page-has-heading-one).
export default function VagaNaoEncontrada() {
  return (
    <div className="rounded-xl border border-dashed border-borda-campo p-6">
      <h1>Vaga não encontrada</h1>
      <p>Ela pode ter sido preenchida ou arquivada.</p>
      <Link href="/vagas">Ver todas as vagas</Link>
    </div>
  );
}
