import { contarVagas } from "@/lib/api";

/**
 * A REGRA QUE ECONOMIZA UMA HORA (aula 04): quem espera é este componente, e
 * o `await` mora AQUI DENTRO. Se a página fizesse o await e passasse o
 * número por prop, o `<Suspense>` em volta não teria mais nada a cobrir.
 *
 * Aula 06: ele não traz mais a lista inteira para medir o tamanho — o banco
 * conta. E quando alguém arquiva, o número cai sozinho: a ação revalida a
 * rota, este componente roda de novo, e a conta já vem sem a arquivada.
 */
export default async function NumerosDoCatalogo() {
  const { total, iniciantes } = await contarVagas();

  return (
    <p className="text-sm text-suave">
      <strong>{total}</strong> vagas · <strong>{iniciantes}</strong> aceitam quem está
      começando
    </p>
  );
}
