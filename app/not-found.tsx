import Link from "next/link";

// O 404 do site inteiro: vale para qualquer endereço que não existe.
// h1, e não h2: este aviso É a página, e toda página tem um título principal.
export default function NaoEncontrado() {
  return (
    <div className="rounded-xl border border-dashed border-borda-campo p-6">
      <h1>404 — página não encontrada</h1>
      <p>Esse endereço não existe no Leque de Vagas.</p>
      <Link href="/">Voltar para o início</Link>
    </div>
  );
}
