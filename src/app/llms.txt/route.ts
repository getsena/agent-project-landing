import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Sena Ópera

> Sena Ópera es el equipo de cobranza B2B externo de Sena. Gestiona la cobranza de las facturas de tu
> empresa por correo, SMS, WhatsApp y llamadas: IA para lo temprano, especialistas humanos para lo
> difícil. Tú ves cada gestión. Chile, Perú y Colombia.

## Precio

- Desde USD 50 al mes para carteras de menos de 10 clientes activos.
- USD 300 al mes para carteras de más de 50 clientes activos.
- Entre 10 y 50 clientes activos, se cotiza en el análisis inicial de la cartera, que es gratis.
- Operando en 2 semanas desde la firma del acuerdo.

## Páginas

- [Sena](https://www.somossena.com): cobranza B2B en Chile, Perú y Colombia, con sus tres modalidades
- [Sena Ópera](https://agente.somossena.com): el equipo de cobranza externo, con precio y preguntas frecuentes
- [Recupera](https://recupera.somossena.com): recuperación de facturas vencidas, 15% de lo recuperado
- [Plataforma Sena](https://www.somossena.com): la plataforma para que tu propio equipo cobre

## Contacto

hola@somossena.com
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
