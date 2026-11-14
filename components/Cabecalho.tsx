// Repare: este arquivo NÃO tem "use client" — e também NÃO é async.
//
// Aula 07, LAB 3: com um "Olá, Ana" aqui (lendo a sessão), as rotas do site
// viraram ƒ no build, até o /termos — o cabeçalho está no layout da raiz,
// que envolve todas as páginas. Por isso ele tem um link fixo, "Minha área",
// e quem precisa saber quem entrou é a página de quem entrou.
import MenuLink from "./MenuLink";

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <strong>Leque de Vagas</strong>
      <nav>
        <MenuLink href="/">Início</MenuLink>
        <MenuLink href="/vagas">Vagas</MenuLink>
        <MenuLink href="/empresas">Empresas</MenuLink>
        <MenuLink href="/sobre">Sobre</MenuLink>
        <MenuLink href="/termos">Termos</MenuLink>
        <MenuLink href="/painel">Minha área</MenuLink>
      </nav>
    </header>
  );
}
