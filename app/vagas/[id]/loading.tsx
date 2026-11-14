/* A REGRA continua a da aula 04: o esqueleto tem MAIS OU MENOS a altura do
   conteúdo real — um "Carregando..." de uma linha no lugar de um bloco de
   300px faz a página pular quando o dado chega. O que mudou na aula 08 é o
   pulso: motion-safe: só anima para quem não pediu ao sistema menos movimento. */
const BARRA = "rounded-md bg-superficie motion-safe:animate-pulse";

export default function Carregando() {
  // Uma altura por elemento: a BARRA não tem altura, e cada barra diz a sua.
  return (
    <div className="grid gap-2.5" aria-busy="true">
      <div className={`${BARRA} h-7.5 max-w-[60%]`} />
      <div className={`${BARRA} h-4`} />
      <div className={`${BARRA} h-4`} />
      <div className={`${BARRA} h-4 max-w-[35%]`} />
    </div>
  );
}
