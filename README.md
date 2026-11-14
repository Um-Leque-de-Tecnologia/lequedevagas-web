# Leque de Vagas

Projeto de referência do curso **Introdução ao Next.js** (NickDev). Um mural de
vagas de tecnologia para quem está migrando de carreira.

Este repositório está **no estado esperado depois dos desafios das aulas 01 a
07**. Ele existe para você comparar com o seu: abrir um arquivo, ver como ficou
aqui e entender por quê. Não é para clonar e entregar — o que vale nota é o
seu, com os seus dados e as suas decisões.

## Rodar

Precisa de Node 20 ou mais novo (conferido com o 24).

```bash
npm ci                     # instala, e o postinstall roda o prisma generate
cp .env.example .env       # deixe só a linha do DATABASE_URL
npx prisma migrate dev     # monta o prisma/dev.db a partir das migrations
npx prisma db seed         # 3 pessoas de laboratório, senha "leque1234"
```

Crie o `.env.local` com um `AUTH_SECRET` novo — ele é o que cifra o cookie de
login, e quem o tem fabrica o login de qualquer pessoa:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# .env.local
AUTH_SECRET="o texto que o comando acima imprimiu"
AUTH_TRUST_HOST=true       # só para o npm start na sua máquina
```

```bash
npm run dev
```

Abre em <http://localhost:3000>. Entre como `ana@exemplo.com` (publica pela
Aurora Tech), `bruno@exemplo.com` (Nuvem Rosa) ou `carla@exemplo.com`
(candidata) — veja a tabela em [`PERMISSOES.md`](PERMISSOES.md).

O `dev.db`, o `.env` e o `.env.local` **não vão para o Git**. O `npm run build` e o
`npm run dev` também **buscam dados pela rede**, do próprio repositório no
GitHub (veja `lib/api.ts`): sem internet, o build não passa.

**No Windows, pare o `npm run dev` antes de qualquer comando do Prisma.** Com o
servidor aberto, o `prisma generate` falha com `EPERM: operation not permitted,
rename … query_engine-windows.dll.node`: a migration é aplicada e o cliente,
não. Pare o dev, rode `npx prisma generate` e suba de novo.

## Onde os dados vivem

Em dois lugares, e só o `lib/api.ts` sabe disso — as regras estão no
[`DADOS.md`](DADOS.md):

- **O que o time publica** mora em `dados/vagas.json` e `dados/empresas.json`,
  buscados do GitHub. Uma vaga nova ali aparece no site **no pior caso pouco
  mais de um minuto depois do push** (`revalidate: 60`); uma empresa, em até
  uma hora (`revalidate: 3600`).
- **O que se escreve pelo site** — vagas publicadas, perfis editados,
  candidaturas e contas — mora num banco SQLite, o `prisma/dev.db`. Ele **sobrevive ao
  restart** do servidor (na aula 05 era um array em memória, e sumia). Mas ele
  existe **só na sua máquina**: o site publicado na Vercel não tem esse
  arquivo. Colocar o backend no ar é a aula 09.

## O que tem aqui, aula por aula

**Aula 01 — fundamentos.** O componente como peça reutilizável, JSX, rota por
pasta e CSS comum. `app/layout.tsx`, `components/Cabecalho.tsx`,
`app/page.tsx`, `app/sobre/page.tsx`, `app/globals.css`.

**Aula 02 — roteamento com App Router.** Rota dinâmica com `[id]` e `params`
que chega como Promise. Os arquivos cujo nome já é a instrução: `layout`
aninhado em `app/vagas/`, `loading`, `error` e `not-found` — e o `not-found` da
raiz, que é outro. Route group `(institucional)`, que dá layout a `/termos` e
`/privacidade` sem entrar na URL. Navegação com `Link`, e `usePathname` no
`MenuLink` para o item ativo.

**Aula 03 — a página que responde.** A fronteira entre servidor e navegador, e
`useState`. As páginas continuam de servidor; só os pedaços que precisam de
memória levam `"use client"`:

| Arquivo | Que forma de estado ensina |
| --- | --- |
| `components/DescricaoDaVaga.tsx` | booleano, com estado derivado do texto |
| `components/BotaoCopiarLink.tsx` | estado + API que só existe no navegador |
| `components/AbasDaEmpresa.tsx` | estado que é **texto**, não booleano |
| `components/FormularioDeCandidatura.tsx` | campo controlado, lista e conta de "pode enviar" |
| `components/MuralDeVagas.tsx` | estado no pai comum, filtro derivado |
| `components/Filtros.tsx` | **nenhum** — recebe e avisa |

Conte de novo: `app/vagas/page.tsx`, `app/vagas/[id]/page.tsx` e
`app/empresas/[slug]/page.tsx`, e nenhuma delas leva `"use client"`.

**Aula 04 — o dado sai de dentro do projeto.** Os arrays de `data/*.ts`
viraram `dados/*.json` buscados por rede, e os tipos ficaram sozinhos em
`lib/tipos.ts`. O que isso trouxe:

| Onde | O que ensina |
| --- | --- |
| `lib/api.ts` | o único arquivo com `fetch` e com a URL; `revalidate`, `tags` e a conferência de `resposta.ok` |
| `app/vagas/[id]/page.tsx` | `generateStaticParams` — uma página por vaga, gerada no build |
| `app/empresas/[slug]/page.tsx` | `generateMetadata` por empresa, e `Promise.all` para não esperar duas vezes |
| `app/empresas/page.tsx` | `export const metadata` fixo, porque rota sem `[param]` não precisa de função |
| `app/vagas/page.tsx` | **deixou de ser `async`**: quem busca são os filhos, cada um no seu `<Suspense>` |
| `components/NumerosDoCatalogo.tsx` | o `await` mora no componente que espera, não na página |
| `app/vagas/[id]/loading.tsx` | esqueleto do tamanho do conteúdo real |
| `app/vagas/[id]/error.tsx` | rede que caiu — em português, com botão de tentar de novo |

A aula 03 fica inteira de pé: todos os componentes de cliente continuam iguais,
com o mesmo `useState`. O que mudou é de onde vem a lista que eles recebem.

**Aula 05 — cada frente ganha um verbo (Server Actions).**

| Onde | O que ensina |
| --- | --- |
| `app/**/acoes.ts` | `"use server"` na primeira linha; `safeParse` antes de tudo; revalidar antes de sair; `redirect` fora de `try` |
| `lib/esquemas.ts` | os esquemas do Zod juntos, com mensagens em português — e o checkbox com `.optional().transform()` |
| `lib/formulario.ts` | `porCampo` (um erro por campo) e `valoresDe` (o formulário volta preenchido) |
| `lib/tipos.ts` | o tipo `Estado`, que toda ação devolve, e o `ESTADO_INICIAL` |
| `lib/api.ts` | as funções de escrita, e o depósito em memória que **só ele** conhece |
| `components/BotaoDeEnviar.tsx` | `useFormStatus` — num componente **filho** do `<form>`, senão mente |
| `app/vagas/nova/` | a vaga nasce de uma tela, com o id gerado no servidor |
| `app/empresas/[slug]/editar/` | `useActionState`, estado de sucesso sem redirect, e o slug preso com `.bind` |
| `components/FormularioDeCandidatura.tsx` | de `onSubmit` para `action` — funciona sem JavaScript; a lista com `getAll` |
| `components/CardDeVaga.tsx` | o Arquivar: um `<form>` por cartão, e `revalidatePath` (não `revalidateTag`) |

**Aula 06 — o dado para de sumir (banco).**

| Onde | O que ensina |
| --- | --- |
| `prisma/schema.prisma` | Vaga, Empresa e Candidatura — a primeira relação do projeto |
| `prisma/migrations/` | o histórico versionado, uma migration por aula |
| `lib/prisma.ts` | o cliente único, que sobrevive ao hot reload |
| `lib/api.ts` | o array virou banco **e nenhuma página mudou**; `count()` em vez de `.length`; arquivar é `update` |
| `app/api/vagas/route.ts`, `app/api/empresas/[slug]/route.ts` | Route Handlers: um endereço para quem **não** é a sua tela |
| `DADOS.md` | as decisões de dados, por escrito, antes do esquema |

**Aula 07 — cada coisa tem dono (autenticação e autorização).**

| Onde | O que ensina |
| --- | --- |
| `auth.ts`, `app/api/auth/[...nextauth]/` | Auth.js 5 com Credentials e bcrypt; o crachá guarda só o id |
| `proxy.ts` | o atalho: quem nem entrou volta para `/entrar` — não é a tranca |
| `lib/sessao.ts` | `usuarioAtual()`: o cookie diz o id, o banco diz o resto, com `cache` do React |
| `lib/permissoes.ts` | as regras, puras, chamadas pela tela **e** pela ação ([`PERMISSOES.md`](PERMISSOES.md)) |
| `app/**/acoes.ts` | a primeira pergunta de toda ação que escreve: **quem está chamando?** |
| `app/entrar/`, `app/cadastro/` | o login com uma frase só para e-mail e senha errados; o cadastro com papel fixo |
| `app/painel/` | a única página que lê a sessão para desenhar: suas vagas (com o Arquivar) ou suas candidaturas |
| `prisma/seed.mjs` | as pessoas de laboratório, com a senha passada pelo bcrypt |

## O que o build mostra

```
┌ ○ /                                1m      1y
├ ○ /_not-found
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/empresas/[slug]
├ ƒ /api/vagas
├ ○ /cadastro
├ ○ /empresas                        1m      1y
├   /empresas/[slug]                 ● cinco empresas
├ ƒ /empresas/[slug]/editar
├ ○ /entrar
├ ƒ /painel
├ ○ /privacidade
├ ○ /sobre
├ ○ /termos
├ ○ /vagas                           1m      1y
├   /vagas/[id]                      ● uma por vaga
└ ƒ /vagas/nova
ƒ Proxy (Middleware)
```

**Só três páginas são `ƒ`, e as três já eram de uma pessoa só:** o painel, o
publicar e o editar da empresa. Mural, vaga e empresa são iguais para todo
mundo e continuam pré-gerados. Se a sua tabela tiver mais `ƒ`, alguém está
lendo a sessão ou um cookie onde não precisava — no layout, por exemplo.

## O que NÃO tem, de propósito

Se você achar que está faltando, provavelmente está — mas na aula seguinte.

- **Tailwind.** CSS comum até a aula 08.
- **O backend no ar.** O banco é um arquivo na sua máquina; o site publicado
  não o enxerga. Aula 09.
- **Editar e apagar vaga**, com carregamento e erro em todo formulário. Aula 10.
- **Validação no cliente.** Quem valida é só o servidor — e ele é quem vale.

## Detalhes que costumam pegar

**Instale com a versão escrita.** `npm i prisma` hoje traz uma versão
candidata de outra geração. `npm i next-auth` traz o 4, com outra API. Aqui:
`prisma@6.19.3`, `@prisma/client@6.19.3`, `next-auth@5.0.0-beta.32`,
`bcryptjs@3.0.3` e `zod@4.6.7` — todas com `-E`.

**`"use server"` é a primeira linha do arquivo.** Depois de um `import` ela não
vale, e o erro fala de "Functions cannot be passed directly to Client
Components", sem mencionar a diretiva.

**A ação do `useActionState` recebe dois parâmetros**: `(estadoAnterior,
dados)`. Com um só, ela recebe o estado no lugar do `FormData`, e todo campo
vira `undefined` sem erro nenhum.

**O `redirect` lança.** Por isso ele é a última linha da ação, fora de
qualquer `try`: um `catch` em volta engole o redirecionamento em silêncio. E
por isso o `catch` da ação `entrar` termina em `throw erro`: o login que deu
certo sai por ali.

**A tela não é a tranca.** A página `/vagas/nova` confere o papel quando é
desenhada; a ação roda depois, com o cookie que chegar. A regra está nos dois
lugares, escrita uma vez só em `lib/permissoes.ts`.

**Vaga arquivada ou que não existe responde 200, não 404.** A tela é a do
`not-found.tsx`, com `<meta name="robots" content="noindex">`. É porque
`/vagas/[id]` tem `loading.tsx`: a resposta começa a ser transmitida antes de o
`notFound()` rodar, e o status já foi enviado. Está na documentação do Next 16
(`loading.md`, "Status codes").

**`revalidateTag("vagas")` não tira a arquivada da tela.** Ele busca o
`vagas.json` de novo — e o JSON volta igual, porque quem guardou a arquivada
foi o array. O que precisa ser refeito é a renderização: `revalidatePath`. Na
aula 06 continua igual: quem mudou foi o banco, e o banco não avisa o cache.
Toda ação que escreve chama `revalidatePath` para **cada** rota que mostra
aquele dado.

**As vagas do `dados/vagas.json` não recebem candidatura pelo site.** A
candidatura é uma relação com a tabela `Vaga`, e essas vagas não estão nela —
nem se arquivam pelo site: saem do JSON por commit, como entraram. A página
delas avisa, e a ação recusa com mensagem. Mais em [`DADOS.md`](DADOS.md).

**Só a última habilidade chega?** `Object.fromEntries` guarda um valor por
chave, e são cinco checkboxes com o mesmo `name`. Use `dados.getAll()`.

**`error.tsx` recebe `retry`, não `reset`.** O nome mudou no Next 16 e o antigo
não existe mais — tutorial (ou material de aula) que mostra `reset` é de outra
versão. Conferido em `node_modules/next/dist/docs`, que é a documentação da
versão instalada aqui. Está em `app/vagas/[id]/error.tsx`.

**`notFound()` e `error.tsx` não são a mesma coisa.** `notFound()` é para o que
**não existe** — o endereço está errado e recarregar não ajuda. O `error.tsx` é
para o que **falhou** — a rede caiu, e tentar de novo pode funcionar. Trocar um
pelo outro é dizer à pessoa a coisa errada sobre o que ela deve fazer agora.

**`id` é texto.** O que vem da URL é sempre texto, então `"id": "1"` e não
`"id": 1`. Comparar `"1" === 1` dá falso, e o `find` não acha nada.

**Os dois JSON combinam na mão.** Todo `empresaSlug` de `dados/vagas.json` tem
que existir como `slug` em `dados/empresas.json`, escrito igual. Quando
desencontram, a listagem mostra a empresa e a página dela dá 404 — e o erro
aparece longe de onde foi criado.

**JSON não perdoa o que o TypeScript perdoava.** Chave sem aspas, vírgula
sobrando no último item, comentário: nada disso passa. Se o editor não pintar o
erro, valide o arquivo antes do push — o erro que aparece depois, no terminal
de quem clonou, é bem menos claro.

## Estrutura

```
app/
├── layout.tsx                     moldura do site + cabeçalho
├── page.tsx                       /
├── not-found.tsx                  404 do site inteiro
├── globals.css
├── sobre/page.tsx                 /sobre
├── (institucional)/               route group — não entra na URL
│   ├── layout.tsx
│   ├── termos/page.tsx            /termos
│   └── privacidade/page.tsx       /privacidade
├── entrar/                        página, formulário e ação de login
├── cadastro/                      página, formulário e ação de criar conta
├── painel/                        ƒ — a área de quem entrou, e o sair
├── api/
│   ├── auth/[...nextauth]/        o Auth.js
│   ├── vagas/                     GET /api/vagas
│   └── empresas/[slug]/           GET /api/empresas/aurora-tech
├── vagas/
│   ├── layout.tsx                 moldura da área de vagas
│   ├── loading.tsx                espera da listagem
│   ├── page.tsx                   /vagas — não é async; dois <Suspense>
│   ├── acoes.ts                   arquivar
│   ├── nova/                      publicar (página, formulário, ação)
│   └── [id]/
│       ├── page.tsx               /vagas/1 — generateStaticParams
│       ├── acoes.ts               a candidatura
│       ├── loading.tsx            esqueleto do detalhe
│       ├── error.tsx              a rede caiu
│       └── not-found.tsx          a vaga não existe
└── empresas/
    ├── page.tsx                   /empresas
    └── [slug]/
        ├── page.tsx               /empresas/aurora-tech
        └── editar/                editar o perfil
components/                        as peças; só as com memória são de cliente
dados/                             vagas.json e empresas.json — a fonte
lib/
├── tipos.ts                       os tipos, o Estado e o ESTADO_INICIAL
├── api.ts                         a única porta para o JSON e para o banco
├── prisma.ts                      o cliente único
├── esquemas.ts                    os esquemas do Zod
├── formulario.ts                  porCampo e valoresDe
├── sessao.ts                      usuarioAtual()
└── permissoes.ts                  quem pode o quê
prisma/
├── schema.prisma                  o banco inteiro
├── migrations/                    uma por aula — vai para o Git
└── seed.mjs                       as pessoas de laboratório
auth.ts                            o Auth.js
proxy.ts                           o atalho para /entrar
DADOS.md · PERMISSOES.md           as decisões de equipe, por escrito
```

## Licença

Material didático do NickDev. Use para estudar, cite quando reaproveitar.
