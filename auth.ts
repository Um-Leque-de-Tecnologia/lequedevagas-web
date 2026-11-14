import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EsquemaDoLogin } from "@/lib/esquemas";

/**
 * O Auth.js 5 (aula 07, LAB 2). Ele cuida do crachá: um cookie cifrado com o
 * AUTH_SECRET, que o navegador devolve a cada pedido e que ninguém consegue
 * inventar. O AUTH_SECRET mora no .env.local, e nunca vai para o Git.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // A tela de login é a NOSSA, e não a que o Auth.js desenharia sozinho.
  pages: { signIn: "/entrar" },

  providers: [
    Credentials({
      credentials: { email: {}, senha: {} },

      // A ÚNICA função que decide se a pessoa é quem diz ser. null = não conferiu.
      async authorize(credenciais) {
        const analise = EsquemaDoLogin.safeParse(credenciais);
        if (!analise.success) return null;

        const pessoa = await prisma.pessoa.findUnique({
          where: { email: analise.data.email },
        });
        if (!pessoa) return null;

        // compare, e nunca ===: o banco guarda o hash, não a senha.
        const confere = await bcrypt.compare(analise.data.senha, pessoa.senhaHash);
        if (!confere) return null;

        return { id: pessoa.id };
      },
    }),
  ],

  callbacks: {
    // O crachá diz QUEM é: o id, e só. O que a pessoa PODE mora no banco —
    // um papel gravado aqui valeria até o crachá vencer, trinta dias depois.
    jwt({ token, user }) {
      if (user) return { sub: user.id }; // `user` só existe no momento do login
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
