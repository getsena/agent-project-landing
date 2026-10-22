import { Accent, ArrowUpRight, Check, Container, PillLink, UnderlineLink } from "./shared";

const gestiones = [
  { estado: "hecho", titulo: "Contacto realizado", detalle: "con tesorería", dia: "Lun" },
  { estado: "hecho", titulo: "Fecha de pago acordada", detalle: "para el martes 20", dia: "Mié" },
  { estado: "proximo", titulo: "Recordatorio programado", detalle: "un día antes", dia: "Próx." },
] as const;

// Tarjeta de ejemplo: datos ficticios, rotulados como tales.
const CarteraEjemplo = () => (
  <div className="flex-[1_1_440px] min-w-0 rounded-[20px] bg-surface-blue-soft p-5 sm:p-7 flex flex-col gap-[18px]">
    <div className="flex justify-between gap-3 text-[11px] tracking-[.12em] uppercase text-text-muted">
      <span>Así se ve una cartera con Ópera</span>
      <span>Ejemplo ilustrativo</span>
    </div>
    <div className="rounded-[14px] bg-white p-[22px] shadow-[0_10px_30px_rgba(30,44,80,.08)] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-[10px] bg-surface-secondary border border-border-default flex items-center justify-center font-bold text-sm"
        >
          LA
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Los Aromos SpA</span>
          <span className="text-[13px] text-text-secondary">Factura 10482 · CLP</span>
        </div>
      </div>
      <div className="flex justify-between items-baseline gap-3 border-b border-border-default pb-3.5">
        <span className="text-sm text-text-secondary">Saldo por cobrar</span>
        <span className="font-canaro text-[26px] sm:text-[30px] tabular-nums">$4.160.000</span>
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-3 text-[15px]">
        {gestiones.map((g) => (
          <li key={g.titulo} className="flex gap-3 items-center">
            <span
              aria-hidden="true"
              className={
                g.estado === "hecho"
                  ? "w-[22px] h-[22px] rounded-full bg-success-soft text-success-strong flex items-center justify-center flex-none"
                  : "w-[22px] h-[22px] rounded-full bg-surface-blue-soft text-brand-primary flex items-center justify-center flex-none"
              }
            >
              {g.estado === "hecho" ? (
                <Check size={11} />
              ) : (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="6" r="3.5" />
                </svg>
              )}
            </span>
            <span className="flex-1">
              <strong>{g.titulo}</strong> {g.detalle}
            </span>
            <span className="text-xs text-text-secondary">{g.dia}</span>
          </li>
        ))}
      </ul>
    </div>
    <span className="text-[13px] text-text-muted">Gestión ejecutada por Sena Ópera. Tú ves el avance.</span>
  </div>
);

export const Hero = () => (
  <section id="inicio" aria-labelledby="hero-titulo" className="bg-surface-secondary">
    <Container className="pt-14 pb-14 md:pt-[88px] md:pb-16 flex flex-wrap gap-14 items-center">
      <div className="flex-[1_1_480px] min-w-0 flex flex-col gap-[26px]">
        <p className="m-0 flex items-center gap-2.5 text-[13px] font-bold tracking-[.14em] uppercase">
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-brand-secondary" />
          Tu equipo de cobranza externo
        </p>
        <h1
          id="hero-titulo"
          className="m-0 font-canaro font-bold text-[44px] sm:text-[58px] lg:text-[72px] leading-[1.04] tracking-[-.02em] text-balance"
        >
          Cobrar es nuestro trabajo. Crecer es el <Accent className="text-brand-primary">tuyo</Accent>
          <Accent className="text-brand-secondary">.</Accent>
        </h1>
        <p className="m-0 text-lg sm:text-[19px] leading-[1.6] text-text-body max-w-[54ch]">
          Sena Ópera gestiona la cobranza de tus facturas por correo, SMS, WhatsApp y llamadas. IA para lo
          temprano, especialistas humanos para lo difícil. Tú ves cada gestión.
        </p>
        <div className="flex flex-wrap gap-x-[22px] gap-y-3.5 items-center">
          <PillLink href="#caso">
            Cuéntanos tu caso
            <ArrowUpRight />
          </PillLink>
          <UnderlineLink href="#precio">Cuánto cuesta</UnderlineLink>
        </div>
      </div>
      <CarteraEjemplo />
    </Container>
  </section>
);
