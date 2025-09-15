import { ChevronUp } from "lucide-react";
import s from "./PreFooter.module.css";

export default function PreFooter() {
  // === COLUNAS (4 x 3 itens) ===
  const explorar = [
    { label: "Joias", href: "/joias" },
    { label: "Personalizados", href: "/criadas-para-voce" },
    { label: "Eventos", href: "/eventos" },
  ];

  const descobrir = [
    { label: "Descubra joias exclusivas", href: "/criadas-para-voce#contato" },
    { label: "Como funciona o personalizado", href: "/criadas-para-voce#como-funciona" },
    { label: "Fale Conosco", href: "/contato" },
  ];

  const sobreNos = [
    { label: "Sobre Nós", href: "/sobre-nos" },
    { label: "Nossa Missão", href: "/sobre-nos#missao" },
    { label: "Nossa História", href: "/sobre-nos#historia" },
  ];

  const politicasRedes = [
    { label: "Política de Privacidade", href: "/privacidade" }, // único novo necessário
    { label: "Instagram", href: "https://instagram.com/roalves_jewellery", external: true },
    { label: "WhatsApp", href: "https://wa.me/5521984744189", external: true },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const LinkList = ({ title, items }) => (
    <div className={s.col}>
      <h3 className={s.colTitle}>{title}</h3>
      <ul className={s.colList}>
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className={s.root} aria-labelledby="prefooter-title">
      {/* Barra superior com linha + voltar ao topo */}
      <div className={s.topBar}>
        <button className={s.toTopBtn} onClick={scrollToTop}>
          <span className={s.toTopIcon}><ChevronUp /></span>
          <span className={s.toTopText}>VOLTAR AO TOPO</span>
        </button>
      </div>

      {/* Grid 4 colunas equilibradas */}
      <div className={s.wrap}>
        <div className={s.grid}>
          <LinkList title="Explorar" items={explorar} />
          <LinkList title="Descobrir" items={descobrir} />
          <LinkList title="Conheça a Marca" items={sobreNos} />
          <LinkList title="Políticas & Redes" items={politicasRedes} />
        </div>
      </div>
    </section>
  );
}
