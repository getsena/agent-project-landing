import logoBlanco from "@/public/images/logo_blanco.png";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./shared";

const SENA = "https://www.somossena.com";

type Columna = { titulo: string; enlaces: { label: string; href: string }[] };

const columnas: Columna[] = [
  {
    titulo: "Modalidades",
    enlaces: [
      { label: "Plataforma Sena", href: `${SENA}/plataforma` },
      { label: "Ópera", href: "/" },
      { label: "Recupera", href: "https://recupera.somossena.com" },
    ],
  },
  // «Por país» vuelve cuando existan las dos landings por país (rutas por definir):
  // {
  //   titulo: "Por país",
  //   enlaces: [
  //     { label: "Cobranza externalizada para pymes en Chile", href: "" },
  //     { label: "Cobranza B2B tercerizada en Perú", href: "" },
  //   ],
  // },
  {
    titulo: "Recursos",
    enlaces: [
      { label: "Blog", href: `${SENA}/blog` },
      { label: "Preguntas frecuentes", href: "/#faq" },
    ],
  },
  {
    titulo: "Empresa",
    enlaces: [
      { label: "Nosotros", href: `${SENA}/nosotros` },
      { label: "Términos y condiciones", href: "/term" },
      { label: "Privacidad", href: "/privacy" },
    ],
  },
];

export const OperaFooter = () => (
  <footer className="bg-brand-primary-dark text-text-on-dark border-t border-white/15">
    <Container className="pt-12 pb-8 flex flex-col gap-9 text-sm">
      <div className="flex flex-wrap gap-x-14 gap-y-8">
        <div className="flex-[1_1_220px] min-w-0 flex flex-col gap-3.5">
          <Image src={logoBlanco} alt="Sena" sizes="120px" className="h-[34px] w-auto self-start" />
          <span>El arte de cobrar bien.</span>
        </div>
        <nav
          aria-label="Pie de página"
          className="flex-[3_1_640px] min-w-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-8 gap-y-7"
        >
          {columnas.map((col) => (
            <div key={col.titulo} className="flex flex-col gap-2.5">
              <p className="m-0 text-xs font-bold tracking-[.12em] uppercase text-white">{col.titulo}</p>
              {col.enlaces.map((e) => (
                <Link key={e.href} href={e.href} className="text-text-on-dark no-underline hover:text-white">
                  {e.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15 pt-5 flex flex-wrap justify-between gap-x-6 gap-y-2">
        <span>© 2026 Sena</span>
        <a href="mailto:hola@somossena.com" className="text-text-on-dark no-underline hover:text-white">
          hola@somossena.com
        </a>
      </div>
    </Container>
  </footer>
);
