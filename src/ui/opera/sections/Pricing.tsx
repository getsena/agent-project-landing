import { Container, Dot, Eyebrow, PillLink, SectionTitle } from "./shared";

const filas = [
  { cartera: "Menos de 10 clientes activos", precio: "US$50", destacado: true },
  { cartera: "De 10 a 50 clientes activos", precio: "Se cotiza en el análisis inicial", destacado: false },
  { cartera: "Más de 50 clientes activos", precio: "US$300", destacado: true },
];

export const Pricing = () => (
  <section id="precio" aria-labelledby="precio-titulo" className="bg-surface-secondary">
    <Container className="py-20 md:py-[104px] flex flex-wrap gap-x-[72px] gap-y-12 items-start">
      <div className="flex-[1_1_400px] min-w-0 flex flex-col gap-[18px]">
        <Eyebrow>Precio</Eyebrow>
        <SectionTitle id="precio-titulo">
          Cuánto cuesta
          <Dot />
        </SectionTitle>
        <p className="m-0 text-text-body text-lg sm:text-[19px] max-w-[40ch]">
          Según cuántos clientes activos tiene tu cartera. El análisis inicial es gratis.
        </p>
      </div>
      <div className="flex-[1_1_520px] min-w-0 rounded-2xl border-2 border-brand-primary bg-white p-5 sm:p-7 flex flex-col gap-[18px]">
        <table className="w-full border-collapse text-[17px] tabular-nums">
          <caption className="sr-only">Precio al mes de Sena Ópera según el tamaño de la cartera</caption>
          <thead>
            <tr>
              <th scope="col" className="text-left font-normal text-text-secondary pb-2 text-[13px]">
                Cartera
              </th>
              <th scope="col" className="text-right font-normal text-text-secondary pb-2 text-[13px]">
                Precio al mes
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.cartera}>
                <td className="py-3.5 pr-4 border-t border-border-default">{f.cartera}</td>
                <td className="py-3.5 border-t border-border-default text-right">
                  {f.destacado ? <strong>{f.precio}</strong> : f.precio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PillLink href="#caso" className="w-full">
          Cuéntanos tu caso
        </PillLink>
        <p className="m-0 text-[15px] text-text-muted">
          ¿Ya tienes facturas vencidas? Empieza con{" "}
          <a href="https://recupera.somossena.com" className="text-brand-primary underline hover:text-brand-primary-dark">
            Recupera
          </a>
          : 15% de lo recuperado.
        </p>
      </div>
    </Container>
  </section>
);
