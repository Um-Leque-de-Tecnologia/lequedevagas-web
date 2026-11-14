import { z } from "zod";

/**
 * Os esquemas do projeto, num arquivo só (aula 05).
 *
 * Moram juntos, e não cada um perto da sua ação, porque na aula 10 eles vão
 * ser usados duas vezes: no servidor, dentro da ação, e no cliente, para
 * avisar antes de enviar. Se um dia os dois lados discordarem, quem vale é
 * o servidor — sempre.
 *
 * Zod 4: as mensagens vão no primeiro argumento (`z.string("…")`, a de
 * quando o campo nem chega) e no segundo de cada regra.
 */

// ─── FRENTE 1 · vaga ────────────────────────────────────────────────────
export const EsquemaDaVaga = z.object({
  titulo: z.string("Dê um título à vaga.").trim().min(5, "O título precisa de pelo menos 5 letras."),
  // (aula 07) O empresaSlug saiu daqui: por qual empresa se publica vem da
  // SESSÃO. Campo fora do esquema é ignorado — mandar um no POST não adianta.
  area: z.string("Diga a área.").trim().min(1, "Diga a área: Front-end, Dados, QA…"),
  senioridade: z.string("Diga a senioridade.").trim().min(1, "Diga a senioridade: Estágio, Júnior ou Pleno."),
  local: z.string("Diga onde é.").trim().min(1, "Diga onde é: remoto, híbrido ou a cidade."),
  descricao: z
    .string("Descreva a vaga.")
    .trim()
    .min(80, "Descreva a vaga em pelo menos 80 caracteres.")
    .max(2000, "Passou de 2000 caracteres."),

  // O CHECKBOX. Desmarcado, a chave NÃO CHEGA — não vem `false`, não vem
  // string vazia: não vem nada. Marcado, vale o texto "on". Por isso o par
  // .optional() + .transform(), e não z.boolean().
  aceitaIniciante: z
    .literal("on")
    .optional()
    .transform((v) => v === "on"),
});

// ─── FRENTE 2 · empresa ─────────────────────────────────────────────────
// Repare no que NÃO está aqui: o slug. Ele é a chave que liga vaga e
// empresa; campo que não pode mudar não entra no esquema — se alguém mandar
// um slug no POST, ele é simplesmente ignorado.
export const EsquemaDaEmpresa = z.object({
  nome: z.string("O nome não pode ficar em branco.").trim().min(2, "O nome não pode ficar em branco."),
  sobre: z
    .string("Conte um pouco sobre a empresa.")
    .trim()
    .min(40, "Conte um pouco mais: pelo menos 40 caracteres.")
    .max(600, "Passou de 600 caracteres."),
  // Só http e https. Um z.url() sozinho aceita "javascript:alert(1)" — e
  // este texto vira o href de um link na página da empresa.
  site: z.url({
    protocol: /^https?$/,
    error: "Precisa ser um endereço completo, com https://.",
  }),
});

// ─── FRENTE 3 · candidatura ─────────────────────────────────────────────
export const EsquemaDaCandidatura = z.object({
  vagaId: z.string("Vaga não informada.").min(1, "Vaga não informada."),
  // (aula 07) nome e e-mail saíram: quem se candidata é quem está na sessão.
  // A lista chega pelo dados.getAll("habilidades") — veja a ação.
  habilidades: z.array(z.string()).min(1, "Escolha ao menos uma habilidade."),
});

// ─── FRENTE 4 · arquivar ────────────────────────────────────────────────
// Uma ação que recebe UM campo também valida. Um id vazio ou inventado
// chega igual pelo POST, e é o mesmo caminho de qualquer outro dado.
export const EsquemaDeArquivar = z.object({
  id: z.string("Vaga não informada.").min(1, "Vaga não informada."),
});

// ─── AULA 07 · entrar e criar conta ─────────────────────────────────────
export const EsquemaDoLogin = z.object({
  email: z.email("Esse e-mail não parece válido."),
  senha: z.string("Digite a senha.").min(1, "Digite a senha."),
});

// Repare no que NÃO está aqui: o papel. Quem se cadastra pelo site é
// candidata, e quem decide isso é a ação.
export const EsquemaDoCadastro = z.object({
  nome: z.string("Diga o seu nome completo.").trim().min(3, "Diga o seu nome completo."),
  email: z.email("Esse e-mail não parece válido."),
  senha: z
    .string("A senha precisa de pelo menos 8 caracteres.")
    .min(8, "A senha precisa de pelo menos 8 caracteres."),
});
