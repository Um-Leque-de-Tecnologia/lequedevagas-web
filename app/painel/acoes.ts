"use server";

import { signOut } from "@/auth";

// Sair também é uma ação: apaga o cookie da sessão, e isso só se faz no servidor.
export async function sair() {
  await signOut({ redirectTo: "/" });
}
