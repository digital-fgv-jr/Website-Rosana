import { ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const LinkList = ({ title, items }: { title: string; items: LinkItem[] }) => (
  <div>
    <h3 className="font-BodoniMT text-lg mb-2 text-petroleo">{title}</h3>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label}>
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-petroleo/85 text-sm hover:opacity-80 transition-opacity"
            >
              {item.label}
            </a>
          ) : (
            <Link to={item.href} className="text-petroleo/85 text-sm hover:opacity-80 transition-opacity">
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default function PreFooter() {
  const explorar: LinkItem[] = [
    { label: "Joias", href: "/joias" },
    { label: "Personalizados", href: "/para-voce" },
    { label: "Eventos", href: "/eventos" },
  ];

  const descobrir: LinkItem[] = [
    { label: "Descubra joias exclusivas", href: "/para-voce#contato" },
    { label: "Como funciona o personalizado", href: "/para-voce#como-funciona" },
    { label: "Fale Conosco", href: "/contato" },
  ];

  const sobreNos: LinkItem[] = [
    { label: "Sobre Nós", href: "/sobre-nos" },
    { label: "Nossa Missão", href: "/sobre-nos#missao" },
    { label: "Nossa História", href: "/sobre-nos#historia" },
  ];

  const politicasRedes: LinkItem[] = [
    { label: "Política de Privacidade", href: "/politica-de-privacidade" },
    { label: "Instagram", href: "https://instagram.com/roalves_jewellery", external: true },
    { label: "WhatsApp", href: "https://wa.me/5521984744189", external: true },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="bg-brancoPerola text-petroleo w-full font-MontserratRegular" aria-labelledby="prefooter-title">
      {/* Barra superior com linha + voltar ao topo */}
      <div className="relative container mx-auto px-4">
        {/* Linha divisória */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-petroleo/60 -z-0" />
        
        <div className="relative text-center -top-3">
          <button className="inline-flex flex-col items-center gap-1.5 bg-brancoPerola px-4" onClick={scrollToTop}>
            <span className="grid place-items-center w-7 h-7 bg-douradoFosco rounded-full">
              <ChevronUp className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs tracking-wider text-douradoFosco font-bold">
              VOLTAR AO TOPO
            </span>
          </button>
        </div>
      </div>

      {/* Grid 4 colunas */}
      <div className="container mx-auto px-4 pb-6 pt-2">
        <div className="grid grid-cols-1 gap-y-6 text-center 
                        sm:grid-cols-2 sm:gap-x-5 sm:text-left
                        lg:grid-cols-4 lg:gap-x-8">
          <LinkList title="Explorar" items={explorar} />
          <LinkList title="Descobrir" items={descobrir} />
          <LinkList title="Conheça a Marca" items={sobreNos} />
          <LinkList title="Políticas & Redes" items={politicasRedes} />
        </div>
      </div>
    </section>
  );
}