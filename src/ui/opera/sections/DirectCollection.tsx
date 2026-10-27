import { Check, Container, Dot, SectionTitle } from "./shared";

export const DirectCollection = () => (
  <section id="recaudacion" aria-labelledby="recaudacion-titulo">
    <Container className="py-20 md:py-[104px] flex flex-wrap gap-x-[72px] gap-y-12 items-center">
      <div className="flex-[1_1_460px] min-w-0 rounded-[18px] bg-surface-blue-soft p-6 sm:p-8 flex flex-col gap-5">
        <span className="text-xs tracking-[.14em] uppercase text-text-body">Recaudación directa</span>
        <div className="flex flex-col gap-1.5">
          <span className="text-[15px] text-text-muted">Una cuenta asignada a tu cliente.</span>
          <span className="font-canaro font-bold text-[28px] sm:text-[34px] leading-[1.1]">
            Un pago que sabes de quién es.
          </span>
        </div>
        <div className="rounded-xl bg-white px-5 py-[18px] shadow-[0_10px_30px_rgba(30,44,80,.08)] flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="w-[34px] h-[34px] rounded-full bg-success-soft text-success-strong flex items-center justify-center flex-none"
          >
            <Check size={14} />
          </span>
          <div className="flex-1 min-w-0 flex flex-col">
            <span className="font-bold">Transferencia identificada</span>
            <span className="text-[13px] text-text-secondary">Los Aromos SpA · ejemplo ilustrativo</span>
          </div>
          <span className="font-bold tabular-nums">$4.160.000</span>
        </div>
      </div>
      <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-5">
        <SectionTitle id="recaudacion-titulo" className="lg:text-[48px]">
          Cada pago, identificado. Menos comisiones
          <Dot />
        </SectionTitle>
        <p className="m-0 text-text-body text-lg sm:text-[19px]">
          Una cuenta de recaudación por contraparte facilita identificar los pagos y conciliarlos.
        </p>
        <p className="m-0 text-lg sm:text-[19px] font-bold">
          Las transferencias directas a esa cuenta pueden evitar las comisiones de una pasarela de pago.
        </p>
        <p className="m-0 text-sm text-text-secondary max-w-[54ch]">
          El ahorro depende de los pagos que migren desde una pasarela y de las tarifas actuales. Otros medios de
          pago y costos bancarios conservan sus condiciones.
        </p>
      </div>
    </Container>
  </section>
);
