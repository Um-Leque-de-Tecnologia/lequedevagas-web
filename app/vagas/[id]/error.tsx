"use client"; // obrigatório: este arquivo tem onClick, e o React precisa dele
              // no navegador para conseguir se recuperar do erro.

import Botao from "@/components/ui/Botao";

/**
 * A prop de recomeçar chama `retry` no Next 16. Era `reset` até o Next 15, e
 * o nome antigo não existe mais. Conferido em `node_modules/next/dist/docs`.
 *
 * E a diferença que cai na prova: `notFound()` é para o que NÃO EXISTE —
 * recarregar não vai ajudar. Este arquivo é para o que FALHOU — a rede caiu,
 * o banco não respondeu, e tentar de novo pode funcionar.
 */
export default function ErroDaVaga({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-borda-campo p-6">
      <h1>Não conseguimos carregar esta vaga</h1>

      {/* Português de gente. NÃO mostre error.message para quem usa o site:
          "fetch failed" não ajuda ninguém e ainda assusta. O digest é um
          identificador que você cruza com o log do servidor. */}
      <p>A conexão com a nossa fonte de dados falhou. Isso costuma ser momentâneo.</p>
      {/* Era a .tecnico, #71717a: 4,12 : 1 no escuro, e reprovava desde a
          aula 04 sem ninguém ver — o erro quase nunca aparece. */}
      {error.digest && <p className="font-mono text-xs text-suave">id do erro: {error.digest}</p>}

      <Botao variante="secundario" onClick={() => retry()}>
        Tentar de novo
      </Botao>
    </div>
  );
}
