// Sem "use client": quem importa este arquivo já é de cliente.
// A linha marca a porta, não cada móvel da casa.

export default function Filtros({
  busca,
  aoMudarBusca,
  area,
  aoMudarArea,
  areas,
}: {
  busca: string;
  // o tipo de uma função: recebe texto, não devolve nada
  aoMudarBusca: (valor: string) => void;
  area: string;
  aoMudarArea: (valor: string) => void;
  areas: string[];
}) {
  // Nenhum useState aqui. Este componente não lembra de nada: ele mostra o
  // que recebe e avisa quando alguém mexe.
  return (
    <div className="my-4 grid gap-3">
      {/* O rótulo continua, escondido: o sr-only agora é do Tailwind. */}
      <label className="sr-only" htmlFor="busca">
        Buscar vaga
      </label>
      <input
        id="busca"
        type="search"
        placeholder="Buscar por título ou empresa"
        value={busca}
        // sem este onChange o campo não deixa digitar
        onChange={(e) => aoMudarBusca(e.target.value)}
        className="rounded-lg border border-borda-campo bg-superficie px-3 py-2.5"
      />

      {/* role="group" com nome: o leitor de tela diz "Filtrar por área,
          grupo" ao chegar nos chips — e não sete botões soltos. */}
      <div role="group" aria-label="Filtrar por área" className="flex flex-wrap gap-2">
        {areas.map((nome) => (
          <button
            key={nome}
            type="button"
            // Botão que liga e desliga é aria-pressed. O leitor de tela diz
            // "pressionado" no ligado — e o estilo sai do MESMO atributo.
            aria-pressed={nome === area}
            onClick={() => aoMudarArea(nome)}
            className="rounded-full border border-borda px-3 py-1.5 text-suave aria-pressed:border-principal aria-pressed:font-semibold aria-pressed:text-principal"
          >
            {nome}
          </button>
        ))}
      </div>
    </div>
  );
}
