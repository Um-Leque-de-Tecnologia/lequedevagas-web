import type { Papel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Candidatura, Empresa, Vaga } from "@/lib/tipos";

/**
 * A CAMADA DE DADOS. O único arquivo do projeto que sabe de onde o dado vem
 * e para onde ele vai.
 *
 * - aula 04: o único com `fetch` e com a URL do JSON publicado;
 * - aula 05: o único que guarda — as ações chamam as funções de escrita;
 * - aula 06: o único que fala com o banco. O array em memória da aula 05
 *   virou Prisma aqui dentro, e NENHUMA página mudou de linha por isso;
 * - aula 07: as escritas ganharam dono — um argumento, nunca um campo do
 *   formulário.
 *
 * Duas fontes convivem, e a regra de cada uma está no DADOS.md: o JSON é
 * o que o time publica no repositório; o banco é o que se escreve pelo site.
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

/* Os campos do type, e só eles. O banco tem mais (criadaEm, arquivada,
   autorId) — e eles ficam aqui dentro: a página não precisa saber que
   existem, e um Date a mais viajando para o cliente é peso à toa. */
const CAMPOS_DA_VAGA = {
  id: true,
  titulo: true,
  empresa: true,
  empresaSlug: true,
  area: true,
  senioridade: true,
  local: true,
  aceitaIniciante: true,
  descricao: true,
} as const;

const CAMPOS_DA_EMPRESA = { slug: true, nome: true, sobre: true, site: true } as const;

// ─── LEITURA ────────────────────────────────────────────────────────────

/**
 * O NOME NÃO MUDA desde a aula 04. A listagem, o detalhe, o
 * generateStaticParams e as empresas chamam esta função — e nenhuma delas
 * soube quando o "por dentro" virou banco + JSON.
 */
export async function listarVagas(): Promise<Vaga[]> {
  const [criadas, publicadas] = await Promise.all([
    prisma.vaga.findMany({
      // Arquivada some pelo FILTRO DA CONSULTA, e não num .filter() depois:
      // o banco não manda pela rede a linha que ninguém vai mostrar.
      where: { arquivada: false },
      orderBy: { criadaEm: "desc" }, // a mais nova aparece primeiro
      select: CAMPOS_DA_VAGA,
    }),
    buscarVagasPublicadas(),
  ]);

  return [...criadas, ...publicadas];
}

/**
 * Buscar UMA vaga é buscar todas e achar. As duas chamadas são o MESMO
 * `fetch`, e o Next junta as duas num pedido só dentro do mesmo request.
 */
export async function buscarVaga(id: string): Promise<Vaga | undefined> {
  const vagas = await listarVagas();
  return vagas.find((vaga) => vaga.id === id);
}

/**
 * Os números do catálogo (aula 06, frente 4). O banco CONTA e devolve um
 * número — nenhuma linha atravessa a rede para virar `.length`. As do JSON
 * já vieram inteiras (e do cache), então ali a conta é no JavaScript.
 */
export async function contarVagas(): Promise<{ total: number; iniciantes: number }> {
  const [doBanco, iniciantesDoBanco, publicadas] = await Promise.all([
    prisma.vaga.count({ where: { arquivada: false } }),
    prisma.vaga.count({ where: { arquivada: false, aceitaIniciante: true } }),
    buscarVagasPublicadas(),
  ]);

  return {
    total: doBanco + publicadas.length,
    iniciantes: iniciantesDoBanco + publicadas.filter((v) => v.aceitaIniciante).length,
  };
}

/**
 * A vaga como o BANCO a conhece: o dono, a empresa e quantas candidaturas
 * ela tem. Vaga do dados/vagas.json não está na tabela — volta null. É o
 * que a candidatura e o arquivar precisam para decidir, e o que a página
 * da vaga usa para mostrar o número.
 */
export async function buscarVagaNoBanco(id: string) {
  return prisma.vaga.findUnique({
    where: { id },
    select: {
      id: true,
      autorId: true,
      empresaSlug: true,
      arquivada: true,
      // `_count` pede ao banco só o NÚMERO, sem trazer as linhas.
      _count: { select: { candidaturas: true } },
    },
  });
}

/**
 * Empresa editada pelo site vence a publicada pelo time (DADOS.md). A
 * listagem troca, uma a uma, as que têm versão no banco.
 */
export async function listarEmpresas(): Promise<Empresa[]> {
  const [publicadas, editadas] = await Promise.all([
    buscarEmpresasPublicadas(),
    prisma.empresa.findMany({ select: CAMPOS_DA_EMPRESA }),
  ]);

  const editadaPorSlug = new Map(editadas.map((empresa) => [empresa.slug, empresa]));
  return publicadas.map((empresa) => editadaPorSlug.get(empresa.slug) ?? empresa);
}

export async function buscarEmpresa(slug: string): Promise<Empresa | undefined> {
  // 1. o que foi editado pelo site tem prioridade
  const editada = await prisma.empresa.findUnique({
    where: { slug },
    select: CAMPOS_DA_EMPRESA,
  });
  if (editada) return editada;

  // 2. senão, vale a publicada pelo time
  const publicadas = await buscarEmpresasPublicadas();
  return publicadas.find((empresa) => empresa.slug === slug);
}

/** As vagas de UMA pessoa, para o /painel, com o número de candidaturas. */
export async function listarVagasDoAutor(autorId: string) {
  return prisma.vaga.findMany({
    where: { autorId, arquivada: false },
    orderBy: { criadaEm: "desc" },
    select: { id: true, titulo: true, _count: { select: { candidaturas: true } } },
  });
}

/** As candidaturas de UMA pessoa, com o título da vaga. */
export async function listarCandidaturasDe(pessoaId: string) {
  return prisma.candidatura.findMany({
    where: { pessoaId },
    orderBy: { criadaEm: "desc" },
    select: {
      id: true,
      criadaEm: true,
      vaga: { select: { id: true, titulo: true, empresa: true } },
    },
  });
}

/** Só para a mensagem do cadastro: a tranca de verdade é o @unique. */
export async function emailJaTemConta(email: string) {
  const achada = await prisma.pessoa.findUnique({ where: { email }, select: { id: true } });
  return achada !== null;
}

// ─── ESCRITA ────────────────────────────────────────────────────────────
// Na aula 05 nenhuma era async: escreviam num array. Na aula 06 viraram
// banco, e só aí ganharam o `async`. Na aula 07, o dono virou argumento.

/** A vaga nasce com dono — e o dono é argumento, não campo do formulário. */
export async function guardarVaga(vaga: Vaga, autorId: string) {
  await prisma.vaga.create({ data: { ...vaga, autorId } });
}

/** Arquivar não apaga: marca. Apagar perderia as candidaturas e o histórico. */
export async function arquivarVaga(id: string) {
  await prisma.vaga.update({ where: { id }, data: { arquivada: true } });
}

/** A candidatura tem dona — mais um argumento que não vem do formulário. */
export async function guardarCandidatura(candidatura: Candidatura, pessoaId: string) {
  await prisma.candidatura.create({
    data: {
      id: candidatura.id,
      vagaId: candidatura.vagaId,
      nome: candidatura.nome,
      email: candidatura.email,
      // SQLite não guarda lista: vira texto aqui, e só aqui.
      habilidades: candidatura.habilidades.join(", "),
      criadaEm: new Date(candidatura.enviadaEm),
      pessoaId,
    },
  });
}

/**
 * upsert: cria se não existe, atualiza se existe. É a regra "o banco vence"
 * virando uma chamada só — a primeira edição copia a empresa do JSON para o
 * banco, e dali em diante é a do banco que aparece.
 */
export async function guardarEmpresa(empresa: Empresa) {
  await prisma.empresa.upsert({
    where: { slug: empresa.slug },
    update: empresa,
    create: empresa,
  });
}

/** O papel é argumento — quem escolhe é a ação, nunca o formulário. */
export async function guardarPessoa(pessoa: {
  nome: string;
  email: string;
  senhaHash: string;
  papel: Papel;
}) {
  await prisma.pessoa.create({ data: pessoa });
}
