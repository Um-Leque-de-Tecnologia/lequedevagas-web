import { buscarEmpresa } from "@/lib/api";

// No Next 16 os params chegam como Promise: precisa de await, igual à página.
export async function GET(
  _pedido: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const empresa = await buscarEmpresa(slug);

  if (!empresa) return new Response("Empresa não encontrada", { status: 404 });
  return Response.json(empresa);
}
