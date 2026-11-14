/**
 * Os tipos do projeto — e uma constante, o ESTADO_INICIAL, que é o "tipo
 * em forma de valor" de todo formulário.
 *
 * Este arquivo não sabe de onde a vaga vem — e é por isso que ele continua
 * valendo quando a fonte troca. Foi o que os arrays de `data/*.ts` viraram
 * na aula 04, e o que sobreviveu à entrada do banco na aula 06: os types
 * daqui continuam escritos à mão, e o banco se adapta a eles (DADOS.md).
 */

export type Vaga = {
  /** Texto, não número: o que vem da URL é sempre texto. */
  id: string;
  titulo: string;
  empresa: string;
  /** Tem que existir como `slug` de uma empresa, escrito igualzinho. */
  empresaSlug: string;
  /** Front-end · Back-end · Dados · Mobile · QA · Design */
  area: string;
  /** Estágio · Júnior · Pleno */
  senioridade: string;
  /** Remoto · Híbrido · Presencial, com a cidade quando não é remoto. */
  local: string;
  aceitaIniciante: boolean;
  /** O "ver mais" precisa ter o que esconder: as do JSON passam de 300. */
  descricao: string;
};

export type Empresa = {
  /** É o que vai na URL: `/empresas/aurora-tech`. */
  slug: string;
  nome: string;
  /** O texto da aba "Sobre" — um parágrafo de verdade, não uma linha. */
  sobre: string;
  site: string;
};

/**
 * Aula 05, frente 3. Ele não existia porque, até a aula 05, a candidatura
 * nunca saía do navegador de quem preencheu.
 */
export type Candidatura = {
  id: string;
  vagaId: string;
  nome: string;
  email: string;
  habilidades: string[];
  enviadaEm: string;
};

/**
 * O formato que TODA Server Action com formulário devolve (aula 05).
 * Combinar isto antes de qualquer código é o que evita quatro formulários
 * que se comportam de quatro jeitos diferentes na tela.
 */
export type Estado = {
  ok: boolean;
  erros: Record<string, string>; // campo → mensagem. UMA por campo.
  valores: Record<string, string>; // o que a pessoa digitou, para devolver preenchido
  mensagem?: string; // recado geral: sucesso, ou falha que não é de campo
};

/* O estado antes de qualquer envio. Uma constante só, exportada, porque um
   objeto literal criado dentro do componente muda de identidade a cada
   render sem precisar. */
export const ESTADO_INICIAL: Estado = { ok: false, erros: {}, valores: {} };
