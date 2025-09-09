import { useState } from "react";
import { MapPin, Search, Instagram, ShoppingCart } from "lucide-react";
import logo from "../../assets/logo-clara.svg";
import styles from "./Header.module.css";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className={styles.root}>
      <div className={styles.wrap}>
        {/* ===== Barra superior ===== */}
        <div className={styles.topBar}>
          {/* botão CEP (lado esquerdo) */}
          <a className={styles.leftBtn}>
            <MapPin className="h-4 w-4" />
            Informar meu CEP
          </a>

          {/* logo central */}
          <a href="/" className={styles.logoLink} aria-label="Página inicial">
            <img src={logo} alt="Ro Jewellery" className={styles.logo} />
          </a>

          {/* Buscar + Carrinho (lado direito) */}
          <div className={styles.rightCol}>
            {searchOpen ? (
              <input
                type="text"
                placeholder="Buscar joias..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            ) : (
              <button
                className={styles.rightBtn}
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
            )}

            {/* Carrinho */}
            <a
              href="/carrinho"
              className={styles.iconBtn}
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className={styles.iconSvg} />
            </a>
          </div>
        </div>

        {/* ===== NAVBAR ===== */}
        <nav className={styles.nav}>
          <a href="/joias">Joias</a>
          <a href="/criadas-para-voce">Criadas para Você</a>
          <a href="/eventos">Eventos</a>
          <a href="/sobre-nos">Sobre Nós</a>
          <a
            href="https://instagram.com/roalves_jewellery"
            target="_blank"
            rel="noreferrer"
            className={styles.navInsta}
            aria-label="Instagram roalves_jewellery"
          >
            <span className={styles.navInstaIcon}>
              <Instagram className="h-4 w-4" />
            </span>
            <span className={styles.navInstaName}>roalves</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
