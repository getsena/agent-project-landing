import clsx from "clsx";
import type { ReactNode } from "react";

// Piezas repetidas de la landing: contenedor, etiqueta de sección, título con punto en Caslon y flechas.

export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={clsx("max-w-[1200px] mx-auto px-4 sm:px-6", className)}>{children}</div>
);

export const Eyebrow = ({ className, children }: { className?: string; children: ReactNode }) => (
  <span className={clsx("text-[13px] font-bold tracking-[.14em] uppercase text-text-secondary", className)}>
    {children}
  </span>
);

// Caslon recta solo como acento: la puntuación final del título y alguna palabra destacada.
export const Accent = ({ className, children }: { className?: string; children: ReactNode }) => (
  <span className={clsx("font-caslon font-normal", className)}>{children}</span>
);

export const Dot = ({
  className = "text-brand-secondary",
  mark = ".",
}: {
  className?: string;
  mark?: string;
}) => <Accent className={className}>{mark}</Accent>;

export const SectionTitle = ({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) => (
  <h2
    id={id}
    className={clsx(
      "m-0 font-canaro font-bold text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.06] tracking-[-.015em] text-balance",
      className
    )}
  >
    {children}
  </h2>
);

export const ArrowUpRight = ({ size = 14 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M3 11L11 3M5 3h6v6" />
  </svg>
);

export const Check = ({ size = 12 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 6.5l2.5 2.5L10 3.5" />
  </svg>
);

// CTA principal en píldora, como enlace a una sección.
export const PillLink = ({
  href,
  size = "md",
  className,
  children,
}: {
  href: string;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    className={clsx(
      "inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-primary font-bold text-white no-underline transition-colors hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
      size === "md" ? "min-h-12 px-[26px] py-[15px]" : "min-h-11 px-5 py-[11px] text-[15px]",
      className
    )}
  >
    {children}
  </a>
);

export const UnderlineLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    className={clsx(
      "inline-flex items-center gap-2 border-b-2 border-brand-primary-dark py-1.5 font-bold text-brand-primary-dark no-underline hover:border-brand-primary hover:text-brand-primary",
      className
    )}
  >
    {children}
  </a>
);
