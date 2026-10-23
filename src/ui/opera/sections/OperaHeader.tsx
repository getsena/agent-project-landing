import logoBlack from "@/public/images/logo_black.png";
import Image from "next/image";
import Link from "next/link";
import { Accent, ArrowUpRight, PillLink } from "./shared";

// Enlaces con «/» delante: el header también se usa en /term y /privacy.
const enlaces = [
  { label: "Cómo funciona", href: "/#como" },
  { label: "Precio", href: "/#precio" },
  { label: "Preguntas", href: "/#faq" },
];

export const OperaHeader = () => (
  <header className="border-b border-border-default bg-white">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-[18px] flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <Link href="/" aria-label="Sena Ópera, inicio" className="flex items-center gap-2 sm:gap-3 no-underline">
        <Image src={logoBlack} alt="" priority className="h-8 sm:h-10 w-auto" />
        <Accent className="text-xl sm:text-2xl text-brand-primary">Ópera</Accent>
      </Link>
      <nav
        aria-label="Principal"
        className="order-last w-full md:order-none md:w-auto flex flex-wrap gap-x-[26px] gap-y-1.5 text-[15px]"
      >
        {enlaces.map((e) => (
          <a
            key={e.href}
            href={e.href}
            className="text-brand-primary-dark no-underline hover:text-brand-primary py-1"
          >
            {e.label}
          </a>
        ))}
      </nav>
      <PillLink href="/#caso" size="sm" className="max-sm:px-4">
        Cuéntanos tu caso
        <ArrowUpRight />
      </PillLink>
    </div>
  </header>
);
