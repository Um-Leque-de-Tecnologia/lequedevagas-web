/* Aparece enquanto a rota de vagas está sendo preparada. Quatro caixas da
   altura de um cartão (72px), pulsando só para quem não pediu menos
   movimento. aria-hidden: é desenho, e o leitor de tela não precisa ouvir
   "lista, quatro itens" vazios. */
export default function Loading() {
  return (
    <ul className="grid gap-3" aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <li key={n} className="h-18 rounded-xl bg-superficie motion-safe:animate-pulse" />
      ))}
    </ul>
  );
}
