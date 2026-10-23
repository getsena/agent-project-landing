import { LegacySectionScroll } from "./LegacySectionScroll";
import { CaseSection } from "./sections/CaseForm/CaseSection";
import { Clients } from "./sections/Clients";
import { DirectCollection } from "./sections/DirectCollection";
import { Faq } from "./sections/Faq";
import { Hero } from "./sections/Hero";
import { OperaFooter } from "./sections/OperaFooter";
import { OperaHeader } from "./sections/OperaHeader";
import { PriceStrip } from "./sections/PriceStrip";
import { Pricing } from "./sections/Pricing";
import { Service } from "./sections/Service";
import { ServiceDemo } from "./sections/ServiceDemo";

// Todo el contenido se renderiza en el servidor; solo la demo y el formulario son componentes de cliente.
export const OperaPage = () => (
  <div className="min-h-screen flex flex-col text-brand-primary-dark text-[17px] leading-[1.55]">
    <OperaHeader />
    <main className="grow">
      <Hero />
      <PriceStrip />
      <Clients />
      <Service />
      <ServiceDemo />
      <DirectCollection />
      <Pricing />
      <Faq />
      <CaseSection />
    </main>
    <OperaFooter />
    <LegacySectionScroll />
  </div>
);
