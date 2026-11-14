# Quem pode o quê

A tabela do desafio 07. Cada linha é uma função em `lib/permissoes.ts`, chamada
**pela tela** (para decidir o que desenhar — conveniência) e **pela ação**
(para decidir se faz — a tranca). Se esta tabela e o arquivo discordarem, um
dos dois está errado.

| verbo | quem pode | depende de | função | onde a ação pergunta |
| --- | --- | --- | --- | --- |
| publicar vaga | quem fala por uma empresa | papel | `podePublicar(quem)` | `app/vagas/nova/acoes.ts` |
| editar o perfil da empresa | quem fala por **aquela** empresa | papel + qual | `podeEditarEmpresa(quem, slug)` | `app/empresas/[slug]/editar/acoes.ts` |
| candidatar-se | quem é candidata | papel | `podeCandidatar(quem)` | `app/vagas/[id]/acoes.ts` |
| arquivar vaga | quem publicou **aquela** vaga | dono | `podeArquivar(quem, vaga)` | `app/vagas/acoes.ts` |
| criar conta | qualquer pessoa — sempre como candidata | — | (o papel é fixo na ação) | `app/cadastro/acoes.ts` |

## As regras que saem da tabela

- **Quem é vem da sessão, nunca do formulário.** O dono da vaga, a empresa que
  publica, o nome e o e-mail da candidata e o papel de quem se cadastra. Um
  campo `empresaSlug`, `papel` ou `nome` enfiado pelo DevTools é ignorado:
  ele nem está no esquema do Zod.
- **Vaga sem dono ninguém arquiva.** As do `dados/vagas.json` e as que o
  formulário criou antes da aula 07 têm `autorId` nulo, e o `podeArquivar`
  compara `autorId === quem.id` — dá `false` para todo mundo, sem um `if` a
  mais.
- **Arquivar recusado não mostra mensagem.** A tela nunca ofereceria o botão
  para aquela vaga; quem chegou ali montou o pedido à mão.
- **O `proxy.ts` é atalho, não tranca.** Ele devolve para `/entrar` quem nem
  entrou, nas três páginas de uma pessoa só (`/painel`, `/vagas/nova`,
  `/empresas/[slug]/editar`). Quem decide é a ação, a cada envio.
- **Ler a sessão só onde a página já é de uma pessoa.** Mural, vaga e empresa
  são iguais para todo mundo e continuam pré-gerados (○ e ●). Por isso o botão
  Arquivar e o link "editar perfil" moram no `/painel`, e a candidatura
  descobre quem é dentro da ação.

## As pessoas de laboratório

O `prisma/seed.mjs` cria três contas, todas com a senha `leque1234`:

| pessoa | e-mail | papel | fala por |
| --- | --- | --- | --- |
| Ana Souza | `ana@exemplo.com` | empresa | Aurora Tech (`aurora-tech`) |
| Bruno Lima | `bruno@exemplo.com` | empresa | Nuvem Rosa (`nuvem-rosa`) |
| Carla Dias | `carla@exemplo.com` | candidata | — |

Senha conhecida: essas contas nunca podem ir para um banco publicado.
