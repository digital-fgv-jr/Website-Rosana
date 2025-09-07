import { useEffect, useState } from "react";
import { Search, Instagram, ShoppingCart } from "lucide-react";
import logo from "../../assets/logo-clara.svg";
import s from "./HeaderCompact.module.css";

export default function HeaderCompact() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("header-sentinel");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${s.root} ${show ? s.show : s.hide}`} aria-hidden={!show} role="banner">
      <div className={s.wrap}>
        {/* Linha 1: logo | busca | ações (insta + carrinho) */}
        <div className={s.row1}>
          <a href="/" className={s.logoLink} aria-label="Página inicial">
            <img src={logo} alt="Ro Jewellery" className={s.logo} />
          </a>

          <div className={s.searchBox}>
            <input
              type="text"
              placeholder="Encontre a sua joia"
              className={s.searchInput}
              aria-label="Buscar joias"
            />
            <Search className={s.searchIcon} aria-hidden />
          </div>

          {/* Ações à direita: Instagram (só ícone) + Carrinho */}
          <div className={s.actions}>
            <a
              href="https://instagram.com/roalves_jewellery"
              target="_blank"
              rel="noreferrer"
              className={s.instaBtn}
              aria-label="Instagram roalves_jewellery"
            >
              <Instagram />
            </a>

            <a
              href="/carrinho"
              className={s.iconBtn}
              aria-label="Abrir carrinho"
            >
              <ShoppingCart />
            </a>
          </div>
        </div>

        {/* Linha 2: navegação compacta */}
        <nav className={s.nav} aria-label="Navegação principal">
          <a href="/joias">Joias</a>
          <a href="/criadas-para-voce">Criadas para Você</a>
          <a href="/eventos">Eventos</a>
          <a href="/sobre-nos">Sobre Nós</a>
        </nav>
      </div>
    </div>
  );
}
