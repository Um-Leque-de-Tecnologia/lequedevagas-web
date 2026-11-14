import type { Candidatura, Empresa, Vaga } from "@/lib/tipos";

/**
 * A CAMADA DE DADOS. O único arquivo do projeto que sabe de onde o dado vem
 * e para onde ele vai.
 *
 * - aula 04: o único com `fetch` e com a URL do JSON publicado;
 * - aula 05: o único que guarda — as ações chamam as funções de escrita, e
 *   fora daqui ninguém sabe que existe um array.
 */

// ─── A FONTE PUBLICADA (aula 04) ────────────────────────────────────────
const FONTE =
  "https://raw.githubusercontent.com/Um-Leque-de-Tecnologia/lequedevagas-web/main/dados";

/* Sessenta segundos: uma vaga nova no JSON só existe depois de um push, e um
   minuto é curto o bastante para quem publicou conferir, e longo o bastante
   para o site não bater no GitHub a cada visita. */
const CACHE_VAGAS = { next: { revalidate: 60, tags: ["vagas"] } };

/* Uma hora para empresa: ela muda muito menos que vaga. */
const CACHE_EMPRESAS = { next: { revalidate: 3600, tags: ["empresas"] } };

// ─── O DEPÓSITO (aula 05) ───────────────────────────────────────────────
// A memória do PROCESSO. Some quando o servidor reinicia, e no site
// publicado cada instância tem a sua. Isso não é gambiarra escondida: é a
// peça que falta, e ela tem data — AULA 06, banco de dados.
//
// O que importa hoje é que ela mora AQUI, atrás das mesmas funções que o
// resto do projeto já chama. Na aula 06, estas linhas viram banco e nenhuma
// ação, nenhum formulário e nenhuma página fica sabendo.
const criadas: Vaga[] = [];
const arquivadas = new Set<string>();
const candidaturas: Candidatura[] = [];
const editadas = new Map<string, Empresa>();

// ─── LEITURA ────────────────────────────────────────────────────────────

/* A função da aula 04 troca de nome e vira privada: ela é só a metade
   "publicada" da lista, e ninguém de fora deveria pedir só ela. */
async function buscarVagasPublicadas(): Promise<Vaga[]> {
  const resposta = await fetch(`${FONTE}/vagas.json`, CACHE_VAGAS);

  /* A LINHA QUE POUPA UMA HORA. Sem ela, um 404 do GitHub vira uma página de
     erro em HTML, e o `.json()` abaixo quebra com "Unexpected token '<'". */
  if (!resposta.ok) throw new Error(`vagas.json respondeu ${resposta.status}`);
  return resposta.json();
}

async function buscarEmpresasPublicadas(): Promise<Empresa[]> {
  const resposta = await fetch(`${FONTE}/empresas.json`, CACHE_EMPRESAS);
  if (!resposta.ok) throw new Error(`empresas.json respondeu ${resposta.status}`);
  return resposta.json();
}

/**
 * O NOME NÃO MUDA. Toda página do projeto chama esta função desde a aula 04
 * — a listagem, o detalhe, o generateStaticParams, os números. Mudar o que
 * ela faz por dentro sem mudar a assinatura é exatamente a compra que o
 * lib/api.ts fez naquela semana, sendo usada agora.
 */
export async function listarVagas(): Promise<Vaga[]> {
  const publicadas = await buscarVagasPublicadas();

  // A regra das arquivadas mora AQUI, e não em cada componente: o
  // NumerosDoCatalogo conta o que recebe, e o número cai sozinho.
  return [...criadas, ...publicadas].filter((vaga) => !arquivadas.has(vaga.id));
}

/**
 * Buscar UMA vaga é buscar todas e achar. As duas chamadas são o MESMO
 * `fetch`, e o Next junta as duas num pedido só dentro do mesmo request.
 */
export async function buscarVaga(id: string): Promise<Vaga | undefined> {
  const vagas = await listarVagas();
  return vagas.find((vaga) => vaga.id === id);
}

/* Mesma ideia do lado das empresas, e a edição depende dela: sem esta linha
   o guardarEmpresa grava num Map que ninguém lê, e a edição "funciona" sem
   nunca aparecer na tela. Escrita sem leitura do outro lado é o bug mais
   silencioso da semana. */
export async function listarEmpresas(): Promise<Empresa[]> {
  const publicadas = await buscarEmpresasPublicadas();
  return publicadas.map((empresa) => editadas.get(empresa.slug) ?? empresa);
}

export async function buscarEmpresa(slug: string): Promise<Empresa | undefined> {
  const empresas = await listarEmpresas();
  return empresas.find((empresa) => empresa.slug === slug);
}

// ─── ESCRITA ────────────────────────────────────────────────────────────
// Nenhuma delas é `async`, porque escrever em memória não espera nada. Pôr
// `async` agora "para já ficar parecido com banco" é adivinhar o futuro; na
// aula 06 o TypeScript aponta cada chamada que passa a precisar de await.

export function guardarVaga(vaga: Vaga) {
  criadas.unshift(vaga); // no começo: a mais nova aparece primeiro
}

/** Arquivar não apaga: marca. A vaga só some da listagem. */
export function arquivarVaga(id: string) {
  arquivadas.add(id);
}

export function guardarCandidatura(candidatura: Candidatura) {
  candidaturas.push(candidatura);
}

export function guardarEmpresa(empresa: Empresa) {
  editadas.set(empresa.slug, empresa);
}
