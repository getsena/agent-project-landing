import { Accent, Container, Dot, Eyebrow, SectionTitle } from "../shared";
import { CaseForm } from "./CaseForm";

export const CaseSection = () => (
  <section id="caso" aria-labelledby="caso-titulo" className="bg-brand-primary-dark text-white">
    {/* Ancla de la versión anterior de la landing (enlaces y anuncios con #contacto). */}
    <span id="contacto" aria-hidden="true" />
    <Container className="py-20 md:py-[104px] flex flex-wrap gap-x-[72px] gap-y-12 items-start">
      <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-[22px]">
        <Eyebrow className="text-text-on-dark">Empecemos por tu cartera</Eyebrow>
        <SectionTitle id="caso-titulo" className="lg:text-[58px] leading-[1.04]">
          ¿Cuánto tienes por <Accent className="text-text-on-dark-accent">cobrar</Accent>
          <Dot mark="?" />
        </SectionTitle>
        <p className="m-0 text-lg sm:text-[19px] text-text-on-dark-soft max-w-[42ch]">
          Cuéntanos tu caso. Te respondemos en 24 horas.
        </p>
      </div>
      <CaseForm />
    </Container>
  </section>
);
