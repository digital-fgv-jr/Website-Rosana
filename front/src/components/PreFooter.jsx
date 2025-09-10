import { ChevronUp, Instagram } from "lucide-react";
import s from "./PreFooter.module.css";

export default function PreFooter() {
  const sobreNos = [
    { label: "Nossa História", href: "/sobre-nos#historia" },
    { label: "Inspiração", href: "/sobre-nos#inspiracao" },
    { label: "Propósito", href: "/sobre-nos#proposito" },
    { label: "A Proposta", href: "/sobre-nos#proposta" },
    { label: "Materiais e Qualidade", href: "/sobre-nos#materiais" },
  ];

  const atendimento = [
    { label: "Perguntas Frequentes", href: "/ajuda#faq" },
    { label: "Acompanhe o seu Pedido", href: "/pedido/rastreio" },
    { label: "Central de Ajuda", href: "/ajuda" },
    { label: "Horário de Atendimento", href: "/ajuda#horarios" },
    { label: "WhatsApp", href: "https://wa.me/55SEUNUMERO", external: true },
  ];

  const informacoes = [
    { label: "Prazos e Formas de Envio", href: "/envio" },
    { label: "Consertos e Transformações", href: "/consertos" },
    { label: "Garantia e Trocas", href: "/garantia" },
    { label: "Política de Devolução", href: "/devolucao" },
    { label: "Política de Privacidade", href: "/privacidade" },
  ];

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

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
          <span className={s.toTopIcon}>
            <ChevronUp />
          </span>
          <span className={s.toTopText}>VOLTAR AO TOPO</span>
        </button>
      </div>

      {/* Grid de colunas + instagram à direita */}
      <div className={s.wrap}>
        <div className={s.grid}>
          <LinkList title="Sobre Nós" items={sobreNos} />
          <LinkList title="Atendimento" items={atendimento} />
          <LinkList title="Informações" items={informacoes} />

          <a
            className={s.insta}
            href="https://instagram.com/roalves_jewellery"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram roalves_jewellery"
          >
            <span className={s.instaIcon}>
              <Instagram />
            </span>
            <span className={s.instaHandle}>roalves_jewellery</span>
          </a>
        </div>
      </div>
    </section>
  );
}
