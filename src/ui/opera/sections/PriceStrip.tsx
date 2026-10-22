import { Container } from "./shared";

const items = [
  { dato: "US$50", texto: "al mes, desde — carteras de menos de 10 clientes activos" },
  { dato: "A medida", texto: "Diseñamos la estrategia sobre tu industria y tu cartera" },
  { dato: "2 semanas", texto: "Operando, desde que firmamos" },
];

export const PriceStrip = () => (
  <section aria-label="Lo esencial" className="border-b border-border-default">
    <Container className="py-9 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10 gap-y-6">
      {items.map((i) => (
        <p key={i.dato} className="m-0 flex flex-col gap-1">
          <span className="font-canaro font-bold text-[34px] sm:text-[40px] leading-none">{i.dato}</span>
          <span className="text-text-muted">{i.texto}</span>
        </p>
      ))}
    </Container>
  </section>
);
