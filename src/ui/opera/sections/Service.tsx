import { Container, Dot, Eyebrow, SectionTitle } from "./shared";

const encargos = [
  {
    titulo: "De cada factura, al siguiente paso.",
    texto: "Contactamos a las personas correctas, resolvemos consultas y acordamos fechas de pago.",
  },
  {
    titulo: "Negociación dentro de tus reglas.",
    texto:
      "Tu empresa define los límites. Negociamos acuerdos y repactaciones dentro de ellos y te derivamos las excepciones.",
  },
  { titulo: "Tu tono.", texto: "Cobramos como lo haría alguien de tu empresa." },
  { titulo: "Todo queda registrado.", texto: "Cada gestión es auditable y la ves en tu panel." },
  {
    titulo: "Operando en 2 semanas desde que firmamos.",
    texto: "El análisis inicial de tu cartera es gratis.",
  },
];

export const Service = () => (
  <section id="servicio" aria-labelledby="problema-titulo">
    <Container className="py-20 md:py-[104px] flex flex-wrap gap-x-[72px] gap-y-12">
      <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-[22px]">
        <Eyebrow>El problema</Eyebrow>
        <SectionTitle id="problema-titulo">
          ¿Cuántas horas de tu día se van en cobrar
          <Dot mark="?" />
        </SectionTitle>
        <p className="m-0 text-text-body max-w-[46ch]">
          Enviar recordatorios. Hacer seguimiento. Preguntarte quién pagó, quién prometió y quién no
          contesta. La cobranza es crítica para tu flujo de caja, y también es lo que más te saca del foco.
        </p>
        <p className="m-0 font-bold text-[19px]">Necesitas firmeza sin desgastar la relación con tu cliente.</p>
      </div>
      <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-3.5">
        <h3 className="m-0 font-canaro font-bold text-[26px] sm:text-[30px]">
          Nosotros nos encargamos
          <Dot />
        </h3>
        <ul className="m-0 p-0 list-none flex flex-col border-t border-border-default">
          {encargos.map((e) => (
            <li key={e.titulo} className="py-5 border-b border-border-default flex flex-col gap-1">
              <strong className="text-[19px]">{e.titulo}</strong>
              <span className="text-text-muted">{e.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);
