"use client"

import clsx from "clsx"
import { useRef, useState, type KeyboardEvent } from "react"
import { Container, Dot, Eyebrow, SectionTitle } from "./shared"

type Etapa = {
  id: string
  label: string
  canal: string
  msgSena: string
  msgCliente: string
  titulo: string
  campos: { k: string; v: string }[]
  proximo: string
}

// Demostración con datos ficticios. Las tres etapas se renderizan en el servidor; la pestaña solo
// decide cuál se ve.
const etapas: Etapa[] = [
  {
    id: "contacto",
    label: "Contacto",
    canal: "Correo",
    msgSena:
      "Hola, equipo de tesorería. ¿Nos ayudan a confirmar la fecha de pago de la factura 10482 por $4.160.000?",
    msgCliente: "Hola, ¿nos pueden enviar una copia de la factura?",
    titulo: "El contacto correcto, con el contexto completo.",
    campos: [
      { k: "Estado", v: "En conversación" },
      { k: "Responsable", v: "Sena Ópera" },
      { k: "Contacto", v: "Tesorería" },
      { k: "Canal", v: "Correo" },
    ],
    proximo: "Resolver la consulta y solicitar una fecha de pago.",
  },
  {
    id: "acuerdo",
    label: "Acuerdo",
    canal: "Correo",
    msgSena: "Les compartimos el documento. ¿Podemos confirmar una fecha para el pago?",
    msgCliente: "Gracias. Podemos pagar el martes 20 de octubre.",
    titulo: "Un compromiso. Un próximo paso claro.",
    campos: [
      { k: "Estado", v: "Compromiso registrado" },
      { k: "Fecha de pago", v: "20 de octubre" },
      { k: "Monto", v: "CLP $4.160.000" },
      { k: "Responsable", v: "Sena Ópera" },
    ],
    proximo: "Dar seguimiento al compromiso de pago según la política acordada.",
  },
  {
    id: "seguimiento",
    label: "Seguimiento",
    canal: "Correo",
    msgSena: "Hola, equipo. Damos seguimiento al pago acordado para ayer. ¿Nos confirman su estado?",
    msgCliente: "Necesitamos dividir el pago. ¿Podemos revisar alternativas?",
    titulo: "El criterio humano, justo donde hace falta.",
    campos: [
      { k: "Estado", v: "Requiere revisión" },
      { k: "Solicitud", v: "Dividir el pago" },
      { k: "Política", v: "Fuera del acuerdo" },
      { k: "Responsable", v: "Equipo de cobranza" },
    ],
    proximo: "Revisar la solicitud con el historial y el compromiso anterior disponibles.",
  },
]

const Panel = ({ etapa, activa }: { etapa: Etapa; activa: boolean }) => (
  <div
    role="tabpanel"
    id={`demo-panel-${etapa.id}`}
    aria-labelledby={`demo-tab-${etapa.id}`}
    hidden={!activa}
    tabIndex={0}
    className="flex flex-wrap bg-white border border-border-default rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
  >
    <div className="flex-[1_1_460px] min-w-0 bg-surface-secondary p-5 sm:p-7">
      <div className="bg-white border border-border-default rounded-xl flex flex-col min-h-[300px]">
        <div className="flex items-center gap-3 px-[18px] py-4 border-b border-border-default">
          <span
            aria-hidden="true"
            className="w-[34px] h-[34px] rounded-full bg-brand-primary text-white flex items-center justify-center font-bold"
          >
            S
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-[15px]">Sena ↔ Tesorería</span>
            <span className="text-[13px] text-text-secondary">{etapa.canal} · Los Aromos SpA</span>
          </div>
        </div>
        <div className="px-[18px] py-5 flex flex-col gap-3.5 flex-1">
          <div className="self-start max-w-[82%] bg-surface-blue-soft rounded-xl px-3.5 py-3 flex flex-col gap-1">
            <span className="text-[11px] tracking-[.1em] uppercase text-text-muted">Sena</span>
            <span className="text-[15px]">{etapa.msgSena}</span>
          </div>
          <div className="self-end max-w-[82%] bg-surface-secondary border border-border-default rounded-xl px-3.5 py-3 flex flex-col gap-1">
            <span className="text-[11px] tracking-[.1em] uppercase text-text-muted">Tesorería</span>
            <span className="text-[15px]">{etapa.msgCliente}</span>
          </div>
        </div>
        <div className="px-[18px] py-3 border-t border-border-default text-[13px] text-text-muted flex items-center gap-2">
          <span aria-hidden="true" className="w-[7px] h-[7px] rounded-full bg-success" />
          Gestión ejecutada por Sena Ópera
        </div>
      </div>
    </div>
    <div className="flex-[1_1_420px] min-w-0 p-6 sm:p-8 flex flex-col gap-5">
      <span className="text-xs tracking-[.12em] uppercase text-text-secondary">
        Tu vista · Los Aromos SpA · Factura 10482
      </span>
      <h3 className="m-0 font-canaro font-bold text-[26px] sm:text-[30px] leading-[1.15]">{etapa.titulo}</h3>
      <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4">
        {etapa.campos.map((c) => (
          <div key={c.k}>
            <dt className="text-[13px] text-text-secondary">{c.k}</dt>
            <dd className="mt-0.5 ml-0 font-bold">{c.v}</dd>
          </div>
        ))}
      </dl>
      <div className="border-l-[3px] border-brand-primary py-1 pl-4 flex flex-col gap-1">
        <span className="text-xs tracking-[.12em] uppercase text-brand-primary">Próximo paso</span>
        <span>{etapa.proximo}</span>
      </div>
      <p className="mt-auto mb-0 text-sm text-text-muted">
        ¿La negociación supera tus reglas? Tu equipo recibe el caso con su historial.
      </p>
    </div>
  </div>
)

export const ServiceDemo = () => {
  const [activa, setActiva] = useState(etapas[0].id)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  // Flechas, Inicio y Fin mueven el foco entre pestañas (patrón de pestañas de WAI-ARIA).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = etapas.findIndex((et) => et.id === activa)
    const destino =
      e.key === "ArrowRight"
        ? (i + 1) % etapas.length
        : e.key === "ArrowLeft"
          ? (i - 1 + etapas.length) % etapas.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? etapas.length - 1
              : -1
    if (destino < 0) return
    e.preventDefault()
    setActiva(etapas[destino].id)
    tabs.current[destino]?.focus()
  }

  return (
    <section id="como" aria-labelledby="demo-titulo" className="bg-surface-secondary">
      {/* Anclas de la versión anterior de la landing (enlaces y anuncios existentes). */}
      <span id="como-funciona" aria-hidden="true" />
      <span id="como-trabajamos" aria-hidden="true" />
      <Container className="py-20 md:py-[104px] flex flex-col gap-9">
        <div className="flex flex-wrap justify-between items-end gap-5">
          <div className="flex flex-col gap-[18px] min-w-0 flex-[1_1_520px]">
            <Eyebrow>Cómo funciona</Eyebrow>
            <SectionTitle id="demo-titulo">
              Nosotros gestionamos. Tú ves el avance
              <Dot />
            </SectionTitle>
          </div>
          <p className="m-0 text-sm text-text-secondary">Demostración con datos ficticios.</p>
        </div>
        <div
          role="tablist"
          aria-label="Etapas de la gestión"
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-x-7 gap-y-1 border-b border-border-default"
        >
          {etapas.map((et, i) => {
            const on = et.id === activa
            return (
              <button
                key={et.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`demo-tab-${et.id}`}
                aria-selected={on}
                aria-controls={`demo-panel-${et.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActiva(et.id)}
                className={clsx(
                  "bg-transparent border-0 border-b-[3px] py-3 -mb-px text-[17px] min-h-11 cursor-pointer",
                  on
                    ? "border-brand-primary text-brand-primary-dark font-bold"
                    : "border-transparent text-text-secondary"
                )}
              >
                {et.label}
              </button>
            )
          })}
        </div>
        {etapas.map((et) => (
          <Panel key={et.id} etapa={et} activa={et.id === activa} />
        ))}
      </Container>
    </section>
  )
}
