import { operaFaqs } from "@/ui/opera/data/faqs";
import { OperaPage } from "@/ui/opera/OperaPage";
import type { Metadata } from "next";

const SITE = "https://agente.somossena.com";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// JSON-LD: el servicio con sus precios publicados y la misma FAQ que se ve en la página.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Sena Ópera",
      description:
        "Sena Ópera es el equipo de cobranza B2B externo de tu empresa: gestiona la cobranza de tus facturas por correo, SMS, WhatsApp y llamadas, con IA para lo temprano y especialistas humanos para lo difícil. Tú ves cada gestión.",
      url: SITE,
      serviceType: "Cobranza B2B externalizada",
      provider: { "@type": "Organization", name: "Sena", url: "https://www.somossena.com" },
      areaServed: ["CL", "PE"],
      inLanguage: "es",
      offers: [
        {
          "@type": "Offer",
          name: "Carteras de menos de 10 clientes activos",
          price: "50",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "50",
            priceCurrency: "USD",
            unitCode: "MON",
          },
        },
        {
          "@type": "Offer",
          name: "Carteras de más de 50 clientes activos",
          price: "300",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "300",
            priceCurrency: "USD",
            unitCode: "MON",
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: operaFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <OperaPage />
    </>
  );
}
