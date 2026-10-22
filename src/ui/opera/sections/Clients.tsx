import aomLogo from "@/public/images/aom_logo.png";
import cientificaLogo from "@/public/images/cientifica_logo.png";
import lorealLogo from "@/public/images/loreal_logo.png";
import maruzLogo from "@/public/images/maruz_logo.png";
import recsaLogo from "@/public/images/recsa_logo.png";
import Image, { type StaticImageData } from "next/image";
import { Container } from "./shared";

// Alto de cada logo para que pesen parecido en el muro (las proporciones de los archivos difieren).
const clientes: { name: string; logo: StaticImageData; height: string }[] = [
  { name: "L'Oréal", logo: lorealLogo, height: "h-[22px]" },
  { name: "Científica Andina", logo: cientificaLogo, height: "h-[34px]" },
  { name: "Inversora Maruz", logo: maruzLogo, height: "h-[52px]" },
  { name: "AOM", logo: aomLogo, height: "h-[26px]" },
  { name: "Recsa", logo: recsaLogo, height: "h-[34px]" },
];

export const Clients = () => (
  <section aria-labelledby="logos-titulo" className="border-b border-border-default">
    <Container className="py-9 flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
      <h2 id="logos-titulo" className="m-0 text-[15px] font-bold">
        Empresas que ya cobran con Sena
      </h2>
      <div className="flex flex-wrap items-center gap-x-11 gap-y-6 flex-[1_1_560px] justify-start md:justify-end">
        {clientes.map((c) => (
          <Image
            key={c.name}
            src={c.logo}
            alt={c.name}
            sizes="200px"
            className={`${c.height} w-auto grayscale opacity-75`}
          />
        ))}
      </div>
    </Container>
  </section>
);
