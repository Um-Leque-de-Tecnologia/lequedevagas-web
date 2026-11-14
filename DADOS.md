# Onde o dado mora — as decisões

As decisões de dados do Leque de Vagas, registradas antes de escrever o
esquema (desafio 06) e mantidas em dia depois. Se o código e este arquivo
discordarem, um dos dois está errado.

## Duas fontes, uma porta

| fonte | o que tem | quem escreve | quando muda |
| --- | --- | --- | --- |
| `dados/vagas.json` e `dados/empresas.json` | as 12 vagas e as 5 empresas publicadas pelo time | o time, por commit | num push; o site vê em até 1 min (vagas) ou 1 h (empresas) |
| o banco (`prisma/dev.db`, SQLite) | vagas publicadas pelo site, perfis editados, candidaturas | as Server Actions | na hora, e a ação revalida as rotas |

As duas só se encontram em `lib/api.ts`. Página nenhuma sabe que existem duas.

## 1. Quem manda quando o type e a tabela discordam

**O `type` de `lib/tipos.ts` continua escrito à mão, e manda.** O `model` do
Prisma tem os campos do type e mais os que só o banco sabe preencher.

- **Campos que só o banco preenche ficam fora do type:** `criadaEm`,
  `arquivada` (na Vaga) e `editadaEm` (na Empresa). O `lib/api.ts`
  lê com `select` só os campos do type — a página não recebe um `Date` que não
  pediu, e o JSON publicado (que não tem esses campos) continua cabendo no
  mesmo type.
- **Quem precisa de um campo do banco pede por uma função própria:**
  `buscarVagaNoBanco` (arquivada, número de candidaturas).

## 2. A empresa: qual fonte vence

**O banco vence.** Uma empresa só ganha linha no banco quando alguém edita o
perfil dela pelo site; a partir daí, é essa versão que aparece no
site inteiro (`buscarEmpresa` olha o banco primeiro, `listarEmpresas` troca uma
a uma). O `dados/empresas.json` continua sendo a lista de empresas que existem:
não se cria empresa pelo site.

O slug é a chave (`@id`) e não é editável: é o que vai na URL e o que a Vaga
guarda em `empresaSlug`.

## 3. A candidatura

- É uma **relação** com a Vaga: a vaga precisa existir **na tabela**. Por isso
  as vagas do `dados/vagas.json` não recebem candidatura pelo site — a página
  delas diz isso, e a ação recusa com mensagem, não com tela de erro. (A aula
  09 põe todas as vagas no mesmo lugar, e a limitação some.)
- **Nome e e-mail vêm do formulário**, e ficam na linha da candidatura. Na
  aula 07 eles passam a vir da conta de quem está na sessão.
- **As habilidades** vão num texto separado por vírgula. SQLite não tem coluna
  de lista, e só o `lib/api.ts` sabe disso.
- **O e-mail fica gravado.** Se alguém pedir para apagar a candidatura dela, o
  caminho é apagar a linha da `Candidatura` — não
  está implementado, mas a tabela permite sem tocar em mais nada.

## 4. Arquivar não apaga

`arquivada` é um `Boolean` com padrão `false`. Arquivar é um `update`, não um
`delete`: apagar perderia as candidaturas daquela vaga e não teria volta. A
listagem esconde as arquivadas no `where` da consulta, e os números contam com
`count()` — nenhuma linha atravessa a rede para virar `.length`.

## 5. O que não vai para o Git

O `prisma/dev.db` e o `.env` (com o `DATABASE_URL`) ficam fora — cada pessoa
monta o seu banco com `npx prisma migrate dev` e `npx prisma db seed`. A pasta
`prisma/migrations/` vai: é o histórico de como as tabelas chegaram aqui, uma
migration por aula.
