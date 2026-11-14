// Mesma altura dos cartões de verdade, para a página não pular quando eles
// chegarem. O pulso só anima para quem não pediu menos movimento.
export default function ListaEsqueleto() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
      <div className="h-19 rounded-xl bg-superficie motion-safe:animate-pulse" />
      <div className="h-19 rounded-xl bg-superficie motion-safe:animate-pulse" />
      <div className="h-19 rounded-xl bg-superficie motion-safe:animate-pulse" />
    </div>
  );
}
