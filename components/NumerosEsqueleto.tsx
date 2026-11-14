// O fallback dos números. Mesma altura da linha real — o text-sm tem 20px de
// linha, o h-5 também —, para a linha de baixo não se mexer quando o número
// chega. E o pulso só anima para quem não pediu menos movimento ao sistema.
export default function NumerosEsqueleto() {
  return (
    <p
      className="h-5 max-w-80 rounded-md bg-superficie motion-safe:animate-pulse"
      aria-hidden="true"
    />
  );
}
