// app/(institucional)/privacidade/page.tsx  →  /privacidade
export default function Privacidade() {
  return (
    <>
      <h1>Política de privacidade</h1>
      <p>Texto de exemplo do projeto da disciplina.</p>
      <p>
        Desde a aula 06, o que você escreve no site fica guardado num banco de
        dados: a sua conta (nome, e-mail e a senha cifrada — nunca a senha em
        si), as candidaturas que você envia e as vagas que você publica.
      </p>
      <p>
        O login usa um cookie cifrado, que o JavaScript da página não consegue
        ler. Ele guarda só quem você é; o resto é consultado no banco a cada
        pedido. Nenhum dado é vendido nem enviado para outro lugar.
      </p>
    </>
  );
}
