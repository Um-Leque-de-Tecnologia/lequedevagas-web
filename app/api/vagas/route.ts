import { listarVagas } from "@/lib/api";

/**
 * Um endereço para quem NÃO é a sua tela (aula 06): um app de celular, um
 * parceiro que republica as vagas, um script de relatório. O próprio site
 * nunca chama isto — um fetch("/api/vagas") de dentro do projeto é uma volta
 * a mais pela rede para fazer o que o lib/api.ts já faz direto.
 *
 * O nome da função É o método HTTP.
 */
export async function GET() {
  const vagas = await listarVagas();
  return Response.json(vagas);
}
