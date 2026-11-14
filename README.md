# Leque de Vagas

Projeto de referência do curso **Introdução ao Next.js** (NickDev). Um mural de
vagas de tecnologia para quem está migrando de carreira.

Este repositório está **no estado esperado depois dos desafios das aulas 01 a
05**. Ele existe para você comparar com o seu: abrir um arquivo, ver como ficou
aqui e entender por quê. Não é para clonar e entregar — o que vale nota é o
seu, com os seus dados e as suas decisões.

## Rodar

```bash
npm install
npm run dev
```

Abre em <http://localhost:3000>. Precisa de Node 20 ou mais novo.

O `npm run build` e o `npm run dev` **buscam os dados pela rede**, do próprio
repositório no GitHub (veja `lib/api.ts`). Sem internet, o build não passa — e
isso é sobre o projeto, não sobre a sua máquina.

## Quanto tempo uma vaga nova leva para aparecer

**No pior caso, pouco mais de um minuto depois do push.** O `revalidate` das
vagas é de 60 segundos, então a página serve a cópia guardada por até um minuto
antes de buscar de novo. Some a isso o tempo que o `raw.githubusercontent.com`
leva para servir o arquivo novo. As empresas usam `revalidate: 3600` — uma hora
—, porque empresa muda muito menos que vaga.

**O que se publica pelo site aparece na hora** — mas só até o servidor
reiniciar. Na aula 05 as vagas criadas, as arquivadas, as candidaturas e os
perfis editados moram num array em memória dentro do `lib/api.ts`: um
`npm run dev` de novo e tudo some. É a peça que falta, e ela tem data: aula 06.

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

## O que NÃO tem, de propósito

Se você achar que está faltando, provavelmente está — mas na aula seguinte.

- **Tailwind.** CSS comum até a aula 08.
- **Banco de dados.** O que se escreve pelo site some quando o servidor
  reinicia. Aula 06 — e só o `lib/api.ts` vai mudar.
- **Saber quem é quem.** Hoje qualquer pessoa publica por qualquer empresa,
  edita qualquer perfil e arquiva qualquer vaga. Aula 07.
- **Validação no cliente.** Quem valida é só o servidor — e ele é quem vale.

## Detalhes que costumam pegar

**`"use server"` é a primeira linha do arquivo.** Depois de um `import` ela não
vale, e o erro fala de "Functions cannot be passed directly to Client
Components", sem mencionar a diretiva.

**A ação do `useActionState` recebe dois parâmetros**: `(estadoAnterior,
dados)`. Com um só, ela recebe o estado no lugar do `FormData`, e todo campo
vira `undefined` sem erro nenhum.

**O `redirect` lança.** Por isso ele é a última linha da ação, fora de
qualquer `try`: um `catch` em volta engole o redirecionamento em silêncio.

**`revalidateTag("vagas")` não tira a arquivada da tela.** Ele busca o
`vagas.json` de novo — e o JSON volta igual, porque quem guardou a arquivada
foi o array. O que precisa ser refeito é a renderização: `revalidatePath`.

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
├── api.ts                         o único que lê e o único que guarda
├── esquemas.ts                    os esquemas do Zod
└── formulario.ts                  porCampo e valoresDe
```

## Licença

Material didático do NickDev. Use para estudar, cite quando reaproveitar.
