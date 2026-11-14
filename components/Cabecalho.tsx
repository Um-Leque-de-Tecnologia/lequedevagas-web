// Repare: este arquivo NÃO tem "use client" — e também NÃO é async.
//
// Aula 07, LAB 3: com um "Olá, Ana" aqui (lendo a sessão), as 16 rotas do
// site viraram ƒ no build, até o /termos — o cabeçalho está no layout da
// raiz, que envolve todas as páginas. Por isso ele tem um link fixo, "Minha
// área", e quem precisa saber quem entrou é a página de quem entrou.
import MenuLink from "./MenuLink";

export default function Cabecalho() {
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-borda p-4">
      <strong>Leque de Vagas</strong>
      {/* aria-label dá nome à região: o leitor de tela lista "navegação
          Principal", e quem navega por regiões pula direto para ela. */}
      <nav aria-label="Principal" className="flex flex-wrap gap-x-4 gap-y-1">
        <MenuLink href="/">Início</MenuLink>
        <MenuLink href="/vagas">Vagas</MenuLink>
        <MenuLink href="/empresas">Empresas</MenuLink>
        <MenuLink href="/sobre">Sobre</MenuLink>
        <MenuLink href="/painel">Minha área</MenuLink>
      </nav>
    </header>
  );
}
