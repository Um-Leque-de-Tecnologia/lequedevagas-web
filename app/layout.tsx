import type { Metadata } from "next";
import Cabecalho from "@/components/Cabecalho";
import MenuLink from "@/components/MenuLink";
import "./globals.css";

// Vira <title> e <meta name="description"> sozinho.
export const metadata: Metadata = {
  title: "Leque de Vagas",
  description: "Vagas de tecnologia para quem está migrando de carreira",
};

/* A moldura do site inteiro. Repare no que ela NÃO faz: ler sessão ou
   cookie. Tudo que está aqui aparece em toda página, e uma leitura de cookie
   aqui tornaria TODAS as rotas dinâmicas (aula 07, LAB 3). O tema também não
   mora num cookie: quem escolhe é o sistema da pessoa (aula 08). */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="pt-BR" importa: o leitor de tela usa para escolher a voz
    <html lang="pt-BR">
      <body className="min-h-screen bg-fundo text-principal antialiased">
        <Cabecalho />
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-borda p-4 text-suave">
          <span>Leque de Vagas · 2026</span>
          {/* O rodapé ganhou links, então virou outro <nav>, com outro nome:
              o leitor de tela lista "navegação Principal" e "navegação
              Institucional", e não duas regiões sem nome. */}
          <nav aria-label="Institucional" className="flex flex-wrap gap-x-4 gap-y-1">
            <MenuLink href="/termos">Termos</MenuLink>
            <MenuLink href="/privacidade">Privacidade</MenuLink>
          </nav>
        </footer>
      </body>
    </html>
  );
}
