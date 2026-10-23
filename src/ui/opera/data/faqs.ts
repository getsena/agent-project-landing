// Preguntas frecuentes de la landing. La misma lista alimenta la sección visible y el JSON-LD FAQPage.
export type Faq = { q: string; a: string };

export const operaFaqs: Faq[] = [
  {
    q: "¿Sena Ópera es un software o un servicio?",
    a: "Un servicio. Somos tu equipo externo de cobranza: plataforma, agentes de IA y especialistas humanos. Si prefieres que tu equipo opere, existe Plataforma Sena.",
  },
  {
    q: "¿Es como tener un equipo de cobranza propio?",
    a: "Sí, sin los costos fijos: un equipo que conoce tu cartera, gestiona tus cuentas y te muestra cada gestión. Sin contratar ni capacitar.",
  },
  {
    q: "¿Van a dañar la relación con mis clientes?",
    a: "No. El motor limita la frecuencia de contacto por cliente, cada gestión queda registrada y los casos que necesitan criterio los toma una persona del equipo con todo el historial.",
  },
  {
    q: "¿Cuánto tarda en partir?",
    a: "Ópera queda operando en 2 semanas desde la firma del acuerdo.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Desde US$50 al mes para carteras de menos de 10 clientes activos y US$300 al mes desde 50. Entre 10 y 50, te lo cotizamos en el análisis inicial, que es gratis.",
  },
  {
    q: "¿También trabajan con carteras B2C?",
    a: "Nuestro foco es la cobranza B2B, y hoy también evaluamos carteras B2C y mixtas. Cuéntanos la tuya y te decimos cómo podemos ayudarte.",
  },
];
