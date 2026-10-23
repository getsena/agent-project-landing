import { operaFaqs } from "../data/faqs";
import { Container, Dot, Eyebrow, SectionTitle } from "./shared";

// <details> nativo: las respuestas están en el HTML del servidor y se abren sin JavaScript.
export const Faq = () => (
  <section id="faq" aria-labelledby="faq-titulo">
    {/* Ancla de la versión anterior de la landing. */}
    <span id="preguntas-frecuentes" aria-hidden="true" />
    <Container className="py-20 md:py-[104px] flex flex-wrap gap-x-[72px] gap-y-10">
      <div className="flex-[1_1_340px] min-w-0 flex flex-col gap-[18px]">
        <Eyebrow>Lo esencial</Eyebrow>
        <SectionTitle id="faq-titulo">
          Antes de empezar
          <Dot />
        </SectionTitle>
      </div>
      <div className="flex-[1_1_560px] min-w-0 flex flex-col border-t border-border-default">
        {operaFaqs.map((f, i) => (
          <details key={f.q} open={i === 0} className="group border-b border-border-default">
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer py-[22px] flex justify-between items-center gap-4 min-h-11 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <h3 className="m-0 text-lg sm:text-[19px] font-bold">{f.q}</h3>
              <span aria-hidden="true" className="text-2xl font-normal text-brand-primary flex-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="m-0 pr-10 pb-6 text-text-muted max-w-[60ch]">{f.a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);
